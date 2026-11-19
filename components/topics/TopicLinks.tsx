import Link from "next/link";
import type { Topic } from "@/lib/topics";
import { TopicFollow } from "@/components/topics/TopicFollow";

export function TopicLinks({ topics }: { topics: Topic[] }) {
  if (!topics.length) return null;
  const followed = topics.find((topic) => topic.follow);
  return (
    <>
      <p className="topic-part-of">
        <span>Part of the WCB topic:</span>
        {topics.map((topic) => (
          <Link key={topic.slug} href={`/topics/${topic.slug}`}>{topic.title}</Link>
        ))}
      </p>
      {followed?.follow ? <TopicFollow follow={followed.follow} ctaLocation={`topic_follow_${followed.slug}`} /> : null}
    </>
  );
}
