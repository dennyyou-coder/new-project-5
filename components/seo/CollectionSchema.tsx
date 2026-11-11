import { buildCollectionSchemas } from "@/lib/collectionSchema";

export function CollectionSchema(props: Parameters<typeof buildCollectionSchemas>[0]) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildCollectionSchemas(props)).replace(/</g, "\\u003c") }} />;
}
