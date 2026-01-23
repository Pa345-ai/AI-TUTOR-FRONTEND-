"use client";

import { useEffect, useState } from "react";
import { createRoom, listRooms, type StudyRoom } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function StudyRoomsListPage() {
  const [rooms, setRooms] = useState<StudyRoom[]>([]);
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [userId, setUserId] = useState("123");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("userId");
      if (stored) setUserId(stored);
    }
  }, []);

  const load = async () => {
    const res = await listRooms();
    setRooms(res.rooms || []);
  };

  useEffect(() => { void load(); }, []);

  const create = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await createRoom({ name, topic, ownerId: userId });
      setName("");
      setTopic("");
      await load();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Study Rooms</h1>
      <div className="border rounded-md p-3 space-y-2">
        <div className="text-sm font-medium">Create Room</div>
        <div className="flex flex-wrap gap-2">
          <input className="h-9 px-2 border rounded-md text-sm" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="h-9 px-2 border rounded-md text-sm" placeholder="Topic (optional)" value={topic} onChange={(e) => setTopic(e.target.value)} />
          <Button onClick={create} disabled={loading || !name.trim()}>{loading ? "Creating…" : "Create"}</Button>
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-sm font-medium">Available Rooms</div>
        <div className="grid gap-2">
          {rooms.map((r) => (
            <a key={r.id} href={`/study-rooms/${r.id}`} className="border rounded-md p-2 text-sm hover:bg-muted">
              <div className="font-medium">{r.name}</div>
              {r.topic && <div className="text-xs text-muted-foreground">{r.topic}</div>}
            </a>
          ))}
          {rooms.length === 0 && <div className="text-xs text-muted-foreground">No rooms yet.</div>}
        </div>
      </div>
    </div>
  );
}
