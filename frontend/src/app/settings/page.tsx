"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [userId, setUserId] = useState("123");
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedUserId = window.localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
    setBaseUrl(process.env.NEXT_PUBLIC_BASE_URL ?? "");
  }, []);

  const save = () => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("userId", userId);
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
      <Button onClick={save}>Save</Button>
    </div>
  );
}
