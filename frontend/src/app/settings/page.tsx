"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [userId, setUserId] = useState("123");
  const [baseUrl, setBaseUrl] = useState("");
  const [language, setLanguage] = useState<"en" | "si" | "ta">("en");
  const [mode, setMode] = useState<"socratic" | "exam" | "friendly" | "motivational">("friendly");
  const [level, setLevel] = useState<"eli5" | "normal" | "expert">("normal");
  const [voice, setVoice] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedUserId = window.localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
    setBaseUrl(process.env.NEXT_PUBLIC_BASE_URL ?? "");
    const storedLanguage = window.localStorage.getItem("language");
    if (storedLanguage === "en" || storedLanguage === "si" || storedLanguage === "ta") setLanguage(storedLanguage);
    const storedMode = window.localStorage.getItem("mode");
    if (storedMode === "socratic" || storedMode === "exam" || storedMode === "friendly" || storedMode === "motivational") setMode(storedMode);
    const storedLevel = window.localStorage.getItem("level");
    if (storedLevel === "eli5" || storedLevel === "normal" || storedLevel === "expert") setLevel(storedLevel);
    const storedVoice = window.localStorage.getItem("voiceEnabled");
    if (storedVoice === "true" || storedVoice === "false") setVoice(storedVoice === "true");
  }, []);

  const save = () => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("userId", userId);
    window.localStorage.setItem("language", language);
    window.localStorage.setItem("mode", mode);
    window.localStorage.setItem("level", level);
    window.localStorage.setItem("voiceEnabled", voice ? "true" : "false");
  };

  return (
    <div className="mx-auto max-w-3xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Settings</h1>
      <div className="space-y-2">
        <label className="text-sm font-medium">User ID</label>
        <Input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="Enter user id" />
        <p className="text-xs text-muted-foreground">Used when sending chat messages.</p>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">API Base URL</label>
        <Input value={baseUrl} readOnly />
        <p className="text-xs text-muted-foreground">Configured via NEXT_PUBLIC_BASE_URL.</p>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Language</label>
        <div className="flex gap-3 text-sm">
          {(["en", "si", "ta"] as const).map((l) => (
            <label key={l} className="flex items-center gap-2">
              <input type="radio" name="language" checked={language === l} onChange={() => setLanguage(l)} />
              <span className="uppercase">{l}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Tutor Mode</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
          {(["friendly", "socratic", "exam", "motivational"] as const).map((m) => (
            <label key={m} className="flex items-center gap-2 border rounded-md p-2">
              <input type="radio" name="mode" checked={mode === m} onChange={() => setMode(m)} />
              <span className="capitalize">{m}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Explanation Level</label>
        <div className="flex gap-3 text-sm">
          {(["eli5", "normal", "expert"] as const).map((v) => (
            <label key={v} className="flex items-center gap-2">
              <input type="radio" name="level" checked={level === v} onChange={() => setLevel(v)} />
              <span className="uppercase">{v}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Voice</label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={voice} onChange={(e) => setVoice(e.target.checked)} />
          <span>Enable speech synthesis</span>
        </label>
      </div>
      <Button onClick={save}>Save</Button>
    </div>
  );
}
