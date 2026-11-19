import Link from "next/link";
import type { Topic } from "@/lib/topics";
import { TopicFollow } from "@/components/topics/TopicFollow";

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

/** The follow signup of the first topic that has one; placed after an article's body. */
export function TopicFollowFor({ topics }: { topics: Topic[] }) {
  const followed = topics.find((topic) => topic.follow);
  return followed?.follow ? <TopicFollow follow={followed.follow} ctaLocation={`topic_follow_${followed.slug}`} /> : null;
}
