"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Code, 
  Copy, 
  Play, 
  Download, 
  Settings, 
  ChevronDown,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface CodeBlock {
  id: string;
  language: string;
  code: string;
  title?: string;
  description?: string;
  isExecutable?: boolean;
  output?: string;
  error?: string;
  lineNumbers?: boolean;
  theme?: 'light' | 'dark';
}

interface Language {
  name: string;
  extension: string;
  keywords: string[];
  operators: string[];
  functions: string[];
  comments: string[];
}

export function CodeSyntaxHighlighter() {
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<CodeBlock | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newLanguage, setNewLanguage] = useState('javascript');
  const [newTitle, setNewTitle] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    lineNumbers: true,
    theme: 'light' as 'light' | 'dark',
    fontSize: 14,
    tabSize: 2
  });

  const languages: Language[] = [
    {
      name: 'javascript',
      extension: 'js',
      keywords: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export'],
      operators: ['+', '-', '*', '/', '=', '==', '===', '!=', '!==', '<', '>', '<=', '>=', '&&', '||', '!'],
      functions: ['console.log', 'parseInt', 'parseFloat', 'toString', 'length', 'push', 'pop', 'map', 'filter', 'reduce'],
      comments: ['//', '/*', '*/']
    },
    {
      name: 'python',
      extension: 'py',
      keywords: ['def', 'class', 'if', 'elif', 'else', 'for', 'while', 'import', 'from', 'return', 'try', 'except', 'finally'],
      operators: ['+', '-', '*', '/', '=', '==', '!=', '<', '>', '<=', '>=', 'and', 'or', 'not', 'in', 'is'],
      functions: ['print', 'len', 'str', 'int', 'float', 'list', 'dict', 'tuple', 'set', 'range', 'enumerate'],
      comments: ['#', '"""', "'''"]
    },
    {
      name: 'java',
      extension: 'java',
      keywords: ['public', 'private', 'protected', 'static', 'void', 'class', 'interface', 'extends', 'implements', 'if', 'else', 'for', 'while', 'return'],
      operators: ['+', '-', '*', '/', '=', '==', '!=', '<', '>', '<=', '>=', '&&', '||', '!', '++', '--'],
      functions: ['System.out.println', 'Math.max', 'Math.min', 'String.valueOf', 'Integer.parseInt'],
      comments: ['//', '/*', '*/']
    },
    {
      name: 'cpp',
      extension: 'cpp',
      keywords: ['#include', 'using', 'namespace', 'int', 'float', 'double', 'char', 'bool', 'if', 'else', 'for', 'while', 'return', 'class', 'public', 'private'],
      operators: ['+', '-', '*', '/', '=', '==', '!=', '<', '>', '<=', '>=', '&&', '||', '!', '++', '--', '->', '::'],
      functions: ['cout', 'cin', 'endl', 'printf', 'scanf', 'strlen', 'strcpy', 'malloc', 'free'],
      comments: ['//', '/*', '*/']
    },
    {
      name: 'html',
      extension: 'html',
      keywords: ['html', 'head', 'body', 'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'img', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th'],
      operators: ['<', '>', '=', '"', "'", '/', '!'],
      functions: ['document.getElementById', 'document.querySelector', 'addEventListener', 'setAttribute', 'getAttribute'],
      comments: ['<!--', '-->']
    },
    {
      name: 'css',
      extension: 'css',
      keywords: ['color', 'background', 'margin', 'padding', 'border', 'width', 'height', 'font', 'text', 'display', 'position', 'float', 'clear'],
      operators: [':', ';', '{', '}', '(', ')', ',', '.', '#', '@'],
      functions: ['url()', 'rgb()', 'rgba()', 'hsl()', 'hsla()', 'calc()', 'var()'],
      comments: ['/*', '*/']
    }
  ];

  // Sample code blocks
  useEffect(() => {
    const sampleBlocks: CodeBlock[] = [
      {
        id: '1',
        language: 'javascript',
        title: 'Array Methods Example',
        code: `// Array manipulation examples
const numbers = [1, 2, 3, 4, 5];

// Map - transform each element
const doubled = numbers.map(n => n * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// Filter - keep only even numbers
const evens = numbers.filter(n => n % 2 === 0);
console.log(evens); // [2, 4]

// Reduce - sum all numbers
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log(sum); // 15

// Find - get first number > 3
const found = numbers.find(n => n > 3);
console.log(found); // 4`,
        description: 'Demonstrates common JavaScript array methods',
        isExecutable: true,
        lineNumbers: true
      },
      {
        id: '2',
        language: 'python',
        title: 'Fibonacci Sequence',
        code: `def fibonacci(n):
    """Generate Fibonacci sequence up to n terms"""
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    elif n == 2:
        return [0, 1]
    
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i-1] + fib[i-2])
    
    return fib

# Example usage
result = fibonacci(10)
print(f"First 10 Fibonacci numbers: {result}")

# Calculate sum
total = sum(result)
print(f"Sum: {total}")`,
        description: 'Python function to generate Fibonacci sequence',
        isExecutable: true,
        lineNumbers: true
      },
      {
        id: '3',
        language: 'html',
        title: 'Interactive Form',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Form</title>
    <style>
        .form-container {
            max-width: 500px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input, textarea {
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        button {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="form-container">
        <h2>Contact Us</h2>
        <form id="contactForm">
            <div class="form-group">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required>
            </div>
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="message">Message:</label>
                <textarea id="message" name="message" rows="4" required></textarea>
            </div>
            <button type="submit">Send Message</button>
        </form>
    </div>
</body>
</html>`,
        description: 'HTML contact form with CSS styling',
        isExecutable: false,
        lineNumbers: true
      }
    ];

    setCodeBlocks(sampleBlocks);
    if (sampleBlocks.length > 0) {
      setSelectedBlock(sampleBlocks[0]);
    }
  }, []);

  // Syntax highlighting
  const highlightCode = (code: string, language: string): string => {
    const lang = languages.find(l => l.name === language);
    if (!lang) return code;

    let highlighted = code;

    // Highlight keywords
    lang.keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlighted = highlighted.replace(regex, `<span class="keyword">${keyword}</span>`);
    });

    // Highlight operators
    lang.operators.forEach(operator => {
      const escaped = operator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'g');
      highlighted = highlighted.replace(regex, `<span class="operator">${operator}</span>`);
    });

    // Highlight functions
    lang.functions.forEach(func => {
      const regex = new RegExp(`\\b${func}\\b`, 'g');
      highlighted = highlighted.replace(regex, `<span class="function">${func}</span>`);
    });

    // Highlight comments
    lang.comments.forEach(comment => {
      if (comment === '//' || comment === '#') {
        const regex = new RegExp(`^${comment}.*$`, 'gm');
        highlighted = highlighted.replace(regex, `<span class="comment">$&</span>`);
      } else if (comment === '/*' || comment === '<!--') {
        const endComment = comment === '/*' ? '*/' : '-->';
        const regex = new RegExp(`${comment}[\\s\\S]*?${endComment}`, 'g');
        highlighted = highlighted.replace(regex, `<span class="comment">$&</span>`);
      }
    });

    // Highlight strings
    highlighted = highlighted.replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="string">$&</span>');

    // Highlight numbers
    highlighted = highlighted.replace(/\b\d+\.?\d*\b/g, '<span class="number">$&</span>');

    return highlighted;
  };

  // Create new code block
  const createCodeBlock = () => {
    if (!newCode.trim()) return;

    const newBlock: CodeBlock = {
      id: Date.now().toString(),
      language: newLanguage,
      code: newCode,
      title: newTitle || `${newLanguage} Code`,
      description: '',
      isExecutable: ['javascript', 'python'].includes(newLanguage),
      lineNumbers: settings.lineNumbers,
      theme: settings.theme
    };

    setCodeBlocks(prev => [...prev, newBlock]);
    setSelectedBlock(newBlock);
    setNewCode('');
    setNewTitle('');
    setIsCreating(false);
  };

  // Execute code
  const executeCode = async (block: CodeBlock) => {
    if (!block.isExecutable) return;

    setIsExecuting(true);
    
    try {
      // Simulate code execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock execution results
      let output = '';
      let error = '';

      if (block.language === 'javascript') {
        if (block.code.includes('console.log')) {
          output = '2, 4, 6, 8, 10\n2, 4\n15\n4';
        } else {
          output = 'Code executed successfully';
        }
      } else if (block.language === 'python') {
        if (block.code.includes('fibonacci')) {
          output = 'First 10 Fibonacci numbers: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]\nSum: 88';
        } else {
          output = 'Code executed successfully';
        }
      }

      setCodeBlocks(prev => prev.map(b => 
        b.id === block.id ? { ...b, output, error } : b
      ));
    } catch (err) {
      setCodeBlocks(prev => prev.map(b => 
        b.id === block.id ? { ...b, error: 'Execution failed', output: '' } : b
      ));
    } finally {
      setIsExecuting(false);
    }
  };

  // Copy code to clipboard
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  // Download code
  const downloadCode = (block: CodeBlock) => {
    const blob = new Blob([block.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${block.title || 'code'}.${languages.find(l => l.name === block.language)?.extension || 'txt'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="code-syntax-highlighter h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <h2 className="text-xl font-semibold">Code Syntax Highlighter</h2>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2"
          >
            <Code className="h-4 w-4" />
            New Code Block
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 border-r p-4">
          <h3 className="font-semibold mb-4">Code Blocks</h3>
          <div className="space-y-2">
            {codeBlocks.map(block => (
              <div
                key={block.id}
                className={`p-3 rounded-lg cursor-pointer border ${
                  selectedBlock?.id === block.id 
                    ? 'bg-blue-100 border-blue-300' 
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedBlock(block)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm">{block.title}</h4>
                    <p className="text-xs text-gray-500 capitalize">{block.language}</p>
                  </div>
                  {block.isExecutable && (
                    <div className="flex items-center gap-1">
                      {block.output && <CheckCircle className="h-3 w-3 text-green-500" />}
                      {block.error && <XCircle className="h-3 w-3 text-red-500" />}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {selectedBlock ? (
            <>
              {/* Code block header */}
              <div className="p-4 bg-gray-50 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedBlock.title}</h3>
                    <p className="text-sm text-gray-600 capitalize">{selectedBlock.language}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedBlock.isExecutable && (
                      <Button
                        onClick={() => executeCode(selectedBlock)}
                        disabled={isExecuting}
                        className="flex items-center gap-2"
                      >
                        <Play className="h-4 w-4" />
                        {isExecuting ? 'Executing...' : 'Run'}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => copyCode(selectedBlock.code)}
                      className="flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => downloadCode(selectedBlock)}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>

              {/* Code display */}
              <div className="flex-1 p-4">
                <div className={`border rounded-lg overflow-hidden ${settings.theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
                  <div className="bg-gray-100 px-4 py-2 border-b flex items-center justify-between">
                    <span className="text-sm font-medium">{selectedBlock.language}</span>
                    {selectedBlock.lineNumbers && (
                      <span className="text-xs text-gray-500">Line numbers enabled</span>
                    )}
                  </div>
                  <div className="relative">
                    {selectedBlock.lineNumbers && (
                      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-50 border-r text-xs text-gray-500 flex flex-col">
                        {selectedBlock.code.split('\n').map((_, index) => (
                          <div key={index} className="px-2 py-1 text-right">
                            {index + 1}
                          </div>
                        ))}
                      </div>
                    )}
                    <pre 
                      className={`p-4 overflow-x-auto ${settings.theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}
                      style={{ 
                        marginLeft: selectedBlock.lineNumbers ? '48px' : '0',
                        fontSize: `${settings.fontSize}px`,
                        fontFamily: 'Monaco, Consolas, "Courier New", monospace'
                      }}
                    >
                      <code 
                        dangerouslySetInnerHTML={{ 
                          __html: highlightCode(selectedBlock.code, selectedBlock.language) 
                        }}
                      />
                    </pre>
                  </div>
                </div>

                {/* Output/Error display */}
                {(selectedBlock.output || selectedBlock.error) && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Output:</h4>
                    <div className={`p-4 rounded-lg border ${
                      selectedBlock.error 
                        ? 'bg-red-50 border-red-200 text-red-800' 
                        : 'bg-green-50 border-green-200 text-green-800'
                    }`}>
                      <pre className="whitespace-pre-wrap font-mono text-sm">
                        {selectedBlock.error || selectedBlock.output}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <Code className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Select a code block to view or create a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create code block modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Create New Code Block</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Language</label>
                <select
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  {languages.map(lang => (
                    <option key={lang.name} value={lang.name}>
                      {lang.name.charAt(0).toUpperCase() + lang.name.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Code</label>
                <Textarea
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="Enter your code..."
                  className="w-full font-mono"
                  rows={10}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={createCodeBlock}
                disabled={!newCode.trim()}
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Settings panel */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Theme</label>
                <select
                  value={settings.theme}
                  onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value as 'light' | 'dark' }))}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Font Size</label>
                <input
                  type="range"
                  min="10"
                  max="20"
                  value={settings.fontSize}
                  onChange={(e) => setSettings(prev => ({ ...prev, fontSize: Number(e.target.value) }))}
                  className="w-full"
                />
                <span className="text-sm text-gray-500">{settings.fontSize}px</span>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.lineNumbers}
                    onChange={(e) => setSettings(prev => ({ ...prev, lineNumbers: e.target.checked }))}
                  />
                  <span className="text-sm font-medium">Show line numbers</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowSettings(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .keyword { color: #0000ff; font-weight: bold; }
        .operator { color: #ff0000; }
        .function { color: #008000; font-weight: bold; }
        .comment { color: #808080; font-style: italic; }
        .string { color: #800000; }
        .number { color: #ff8c00; }
      `}</style>
    </div>
  );
}