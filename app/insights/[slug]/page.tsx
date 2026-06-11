import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function InsightDetailRedirectPage({ params }: Props) {
  const { slug } = await params;
  redirect(`/blog/${slug}`);
}
