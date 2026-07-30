import Image from "next/image";
import type {
  BrandLeadershipPerson,
  BrandLeadershipPortrait
} from "@/lib/brands";

type FeaturedLeader = BrandLeadershipPerson & {
  portrait: BrandLeadershipPortrait;
};

export function BrandFounderCard({ leader }: { leader: FeaturedLeader }) {
  return (
    <figure className="brand-founder-card">
      <div className="brand-founder-portrait">
        <Image
          src={leader.portrait.src}
          alt={leader.portrait.alt}
          width={720}
          height={840}
          sizes="(max-width: 640px) 100vw, 180px"
          style={{
            objectPosition: leader.portrait.objectPosition || "center center"
          }}
        />
      </div>
      <figcaption className="brand-founder-details">
        <p className="brand-founder-label">Founder profile</p>
        <h4>{leader.name}</h4>
        <p className="brand-founder-role">{leader.role}</p>
        <p className="brand-founder-context">
          {leader.context || "Role identified in the reviewed sources."}
        </p>
        <p className="brand-founder-credit">
          Photo:{" "}
          <a
            href={leader.portrait.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {leader.portrait.credit}
          </a>
        </p>
      </figcaption>
    </figure>
  );
}
