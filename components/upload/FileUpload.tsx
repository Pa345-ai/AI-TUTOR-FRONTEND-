import { useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../auth/AuthProvider'

interface FileUploadProps {
  onUploadComplete?: (fileUrl: string, fileName: string) => void
  acceptedTypes?: string[]
  maxSize?: number // in MB
  purpose?: 'document' | 'image' | 'audio' | 'video'
}

export function FileUpload({ 
  onUploadComplete, 
  acceptedTypes = ['application/pdf', 'text/plain', 'image/jpeg', 'image/png'],
  maxSize = 10,
  purpose = 'document'
}: FileUploadProps) {
  const { user } = useAuth()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file: File) => {
    setError('')
    
    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      setError(`File type not supported. Accepted types: ${acceptedTypes.join(', ')}`)
      return
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File too large. Maximum size: ${maxSize}MB`)
      return
    }

    if (!user) {
      setError('You must be logged in to upload files')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('omnimind-uploads')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('omnimind-uploads')
        .getPublicUrl(fileName)

      // Store file metadata in database
      const { error: dbError } = await supabase
        .from('uploaded_files')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_path: fileName,
          file_url: publicUrl,
          file_size: file.size,
          file_type: file.type,
          purpose: purpose,
          uploaded_at: new Date().toISOString()
        })

      if (dbError) throw dbError

      // Process file based on purpose
      await processFile(publicUrl, file.name, file.type, purpose)

      onUploadComplete?.(publicUrl, file.name)
      setUploadProgress(100)
      
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsUploading(false)
      setTimeout(() => setUploadProgress(0), 2000)
    }
  }

  const processFile = async (fileUrl: string, fileName: string, fileType: string, purpose: string) => {
    try {
      // Call appropriate AI processing function based on file type and purpose
      if (purpose === 'document' && fileType === 'application/pdf') {
        // Process PDF for summarization
        const response = await fetch('/api/ai/summarize_notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user?.id,
            file_url: fileUrl,
            file_name: fileName,
            file_type: fileType
          })
        })
        
        if (!response.ok) {
          throw new Error('Failed to process document')
        }
      } else if (fileType.startsWith('image/')) {
        // Process image for AI analysis
        const response = await fetch('/api/ai/analyze_image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user?.id,
            image_url: fileUrl,
            purpose: purpose
          })
        })
        
        if (!response.ok) {
          throw new Error('Failed to analyze image')
        }
      }
    } catch (error) {
      console.error('Error processing file:', error)
      // Don't throw error here as file upload was successful
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <div className="text-sm text-gray-600">Uploading...</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500">{uploadProgress}% complete</div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                <button
                  type="button"
                  onClick={openFileDialog}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Click to upload
                </button>{' '}
                or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {acceptedTypes.map(type => type.split('/')[1]).join(', ').toUpperCase()} files up to {maxSize}MB
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
          {error}
        </div>
      )}
    </div>
  )
}