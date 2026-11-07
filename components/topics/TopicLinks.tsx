import Link from "next/link";
import type { Topic } from "@/lib/topics";

export function TopicLinks({ topics }: { topics: Topic[] }) {
  if (!topics.length) return null;
  return (
    <p className="topic-part-of">
      <span>Part of the WCB topic:</span>
      {topics.map((topic) => (
        <Link key={topic.slug} href={`/topics/${topic.slug}`}>{topic.title}</Link>
      ))}
    </p>
  );
}
