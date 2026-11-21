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

/**
 * The follow signup of the first topic that has one. "top" is the one-line version
 * under the article's opening; "end" is the full box after the body.
 */
export function TopicFollowFor({ topics, placement = "end" }: { topics: Topic[]; placement?: "top" | "end" }) {
  const followed = topics.find((topic) => topic.follow);
  if (!followed?.follow) return null;
  return (
    <TopicFollow
      follow={followed.follow}
      topic={followed.slug}
      compact={placement === "top"}
      ctaLocation={`topic_follow_${placement}_${followed.slug}`}
    />
  );
}
