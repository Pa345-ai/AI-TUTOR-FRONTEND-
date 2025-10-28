"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export type Language = "js" | "python";

export function CodeRunner() {
  const [language, setLanguage] = useState<Language>("js");
  const [code, setCode] = useState<string>("console.log('Hello from JS');\n");
  const [output, setOutput] = useState<string>("");
  const workerRef = useRef<Worker | null>(null);
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef<any>(null);

  useEffect(() => {
    if (language !== "python" || pyodideRef.current) return;
    let cancelled = false;
    (async () => {
      try {
        // Load pyodide from CDN lazily
        // @ts-expect-error global load
        const mod = await import("https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.mjs");
        if (cancelled) return;
        const pyodide: unknown = await (mod as unknown as { loadPyodide: () => Promise<unknown> }).loadPyodide();
        pyodideRef.current = pyodide;
        setPyodideReady(true);
      } catch {
        setOutput((prev) => prev + "\n[python] Failed to load pyodide");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [language]);

  useEffect(() => {
    if (language !== "js") return;
    // Prewarm worker
    if (!workerRef.current) {
      const blob = new Blob([
        `self.console = {\n  logs: [],\n  log: (...a) => self.postMessage({ type: 'log', text: a.map(x => typeof x === 'object' ? JSON.stringify(x) : String(x)).join(' ') }),\n  error: (...a) => self.postMessage({ type: 'err', text: a.map(x => typeof x === 'object' ? JSON.stringify(x) : String(x)).join(' ') })\n};\nself.onmessage = (e) => {\n  const src = e.data?.code || '';\n  try {\n    const fn = new Function(src);\n    const ret = fn();\n    if (ret !== undefined) self.postMessage({ type: 'log', text: String(ret) });\n  } catch (err) {\n    self.postMessage({ type: 'err', text: (err && err.stack) ? String(err.stack) : String(err) });\n  }\n};`,
      ], { type: "text/javascript" });
      const url = URL.createObjectURL(blob);
      workerRef.current = new Worker(url);
      workerRef.current.onmessage = (e) => {
        const { type, text } = e.data || {};
        if (type === "log") setOutput((prev) => prev + (prev ? "\n" : "") + text);
        if (type === "err") setOutput((prev) => prev + (prev ? "\n" : "") + "Error: " + text);
      };
    }
    return () => {
      // Do not terminate to keep warm; page unmount will release
    };
  }, [language]);

  const run = useCallback(async () => {
    setOutput("");
    if (language === "js") {
      workerRef.current?.postMessage({ code });
      return;
    }
    if (language === "python") {
      if (!pyodideRef.current) {
        setOutput("[python] Loading runtime…");
        return;
      }
      try {
        const wrapped = `\nimport sys, io\nfrom contextlib import redirect_stdout, redirect_stderr\nbuf = io.StringIO()\nerr = io.StringIO()\ncode = r'''\n${code.replace(/`/g, "\\`")}\n'''\nwith redirect_stdout(buf):\n    with redirect_stderr(err):\n        exec(code, {})\nprint(buf.getvalue(), end='')\nprint(err.getvalue(), end='')\n`;
        const result = await pyodideRef.current.runPythonAsync(wrapped);
        setOutput(String(result ?? ""));
      } catch (e) {
        const errMsg = e instanceof Error ? e.message : String(e);
        setOutput(String(errMsg || "Python error"));
      }
    }
  }, [language, code]);

  const examples = useMemo(() => ({
    js: `// JS example\nfunction add(a, b) { return a + b; }\nconsole.log('2+3=', add(2,3));\n`,
    python: `# Python example\nprint('2+3=', 2+3)\n`,
  }), []);

  return (
    <div className="border rounded-md p-2 space-y-2">
      <div className="flex items-center gap-2 text-sm">
        <label className="flex items-center gap-1"><input type="radio" name="lang" checked={language==='js'} onChange={()=>{setLanguage('js'); setCode(examples.js);}} /> JavaScript</label>
        <label className="flex items-center gap-1"><input type="radio" name="lang" checked={language==='python'} onChange={()=>{setLanguage('python'); setCode(examples.python);}} /> Python</label>
        <Button size="sm" onClick={() => void run()}>Run</Button>
        {language==='python' && (<span className="text-xs text-muted-foreground">{pyodideReady ? 'pyodide ready' : 'loading…'}</span>)}
      </div>
      <textarea className="w-full h-40 border rounded-md p-2 text-sm font-mono" value={code} onChange={(e)=>setCode(e.target.value)} spellCheck={false} />
      <div className="text-xs font-mono whitespace-pre-wrap bg-muted rounded-md p-2 min-h-16">{output || 'Output will appear here…'}</div>
    </div>
  );
}
