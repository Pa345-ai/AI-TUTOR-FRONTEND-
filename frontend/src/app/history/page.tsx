"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getConversations, deleteConversation, loadConversation, setActiveConversationId } from "@/lib/storage";
import type { ConversationIndexItem } from "@/lib/storage";
import { Button } from "@/components/ui/button";

export default function HistoryPage() {
  const [items, setItems] = useState<ConversationIndexItem[]>([]);

  useEffect(() => {
    setItems(getConversations());
  }, []);

  const remove = (id: string) => {
    deleteConversation(id);
    setItems(getConversations());
  };

  return (
    <div className="mx-auto max-w-3xl w-full p-4">
      <h1 className="text-xl font-semibold mb-4">Conversation History</h1>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No conversations yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((i) => (
            <li key={i.id} className="flex items-center justify-between border rounded-md p-3">
              <div className="min-w-0">
                <div className="font-medium truncate max-w-[50ch]">{i.title}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(i.updatedAt).toLocaleString()} • {i.messageCount} messages
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/chat"
                  onClick={() => {
                    setActiveConversationId(i.id);
                    loadConversation(i.id);
                  }}
                  className="text-sm underline"
                >
                  Open
                </Link>
                <Button variant="outline" size="sm" onClick={() => remove(i.id)}>Delete</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
