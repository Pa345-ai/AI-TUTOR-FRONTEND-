import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl w-full p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Welcome to AI Tutor</h1>
      <p className="text-sm text-muted-foreground">
        Start a conversation with your tutor, generate lessons, or create quizzes.
      </p>
      <div className="grid sm:grid-cols-3 gap-4">
        <Card title="Chat" href="/chat" description="Converse with your AI tutor." />
        <Card title="Lessons" href="/lessons" description="Generate study plans." />
        <Card title="Quizzes" href="/quizzes" description="Create practice questions." />
      </div>
    </div>
  );
}

function Card({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Link href={href} className="block rounded-md border p-4 hover:bg-accent">
      <div className="font-medium mb-1">{title}</div>
      <div className="text-sm text-muted-foreground">{description}</div>
    </Link>
  );
}
