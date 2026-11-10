/**
 * Export compliance checklist: what a cleaning appliance needs before it can be sold in the US, the EU or
 * the UK. Reviewed as of CHECKLIST_AS_OF; update the dates when a rule takes effect or is postponed.
 */

export const CHECKLIST_AS_OF = "10 November 2026";

export type CertProduct = "robot-vacuum" | "cordless" | "pool-robot" | "robot-mower";
export type CertMarket = "us" | "eu" | "uk";
/** required: the law requires it. retailer: not a legal duty, but major retailers and marketplaces insist on it. check: depends on the product. */
export type CertLevel = "required" | "retailer" | "check";

export const CERT_PRODUCTS: { value: CertProduct; label: string; connectedByDefault: boolean }[] = [
  { value: "robot-vacuum", label: "Robot vacuum or floor robot", connectedByDefault: true },
  { value: "cordless", label: "Cordless or wet-dry vacuum", connectedByDefault: false },
  { value: "pool-robot", label: "Robotic pool cleaner", connectedByDefault: true },
  { value: "robot-mower", label: "Robotic lawn mower", connectedByDefault: true }
];

export const CERT_MARKETS: { value: CertMarket; label: string }[] = [
  { value: "us", label: "United States" },
  { value: "eu", label: "European Union" },
  { value: "uk", label: "United Kingdom" }
];

export type CertContext = { product: CertProduct; connected: boolean };

export type CertRequirement = {
  id: string;
  market: CertMarket | "all";
  name: string;
  level: CertLevel;
  what: string;
  /** Key date, ISO, shown with the item when it is in the future or recent. */
  date?: string;
  dateLabel?: string;
  href?: string;
  applies?: (context: CertContext) => boolean;
};

const isRobot = ({ product }: CertContext) => product === "robot-vacuum" || product === "robot-mower";

export const CERT_REQUIREMENTS: CertRequirement[] = [
  // United States
  {
    id: "us-fcc",
    market: "us",
    name: "FCC equipment authorization (Part 15)",
    level: "required",
    what: "Products with Wi-Fi, Bluetooth or other radios need FCC Certification and an FCC ID from a Telecommunication Certification Body. Products without a radio but with digital electronics use the Supplier's Declaration of Conformity."
  },
  {
    id: "us-fcc-covered",
    market: "us",
    name: "FCC Covered List: foreign-produced advanced robots",
    level: "required",
    what: "Since 28 July 2026, new robots made outside the US that navigate on their own, carry sensors and connect to a network cannot get FCC authorization without Conditional Approval. Models authorized before that date can still be sold.",
    date: "2026-07-28",
    dateLabel: "In force since",
    href: "/topics/us-fcc-robot-restrictions",
    applies: isRobot
  },
  {
    id: "us-fcc-covered-pool",
    market: "us",
    name: "FCC Covered List: check whether it applies",
    level: "check",
    what: "The new rule on foreign-produced advanced robots excludes uncrewed underwater vehicles. Whether a connected pool robot falls inside or outside it depends on how the product is described; check before filing for a new FCC ID.",
    href: "/topics/us-fcc-robot-restrictions",
    applies: ({ product, connected }) => product === "pool-robot" && connected
  },
  {
    id: "us-nrtl",
    market: "us",
    name: "Safety listing by a recognized lab (UL, ETL or CSA)",
    level: "retailer",
    what: "No federal law requires it for household appliances, but Amazon, big-box retailers and commercial buyers expect a listing from an OSHA-recognized lab, such as UL 1017 for vacuum cleaners. Commercial products used in workplaces generally need one."
  },
  {
    id: "us-doe-charger",
    market: "us",
    name: "DOE and California battery charger efficiency",
    level: "required",
    what: "Battery chargers sold with consumer products must meet the federal DOE efficiency standard. To sell in California, the battery charger system must also be certified in the California Energy Commission's appliance database."
  },
  {
    id: "us-prop65",
    market: "us",
    name: "California Proposition 65 warning",
    level: "check",
    what: "If the product contains a listed chemical above the safe-harbour level (for example lead in brass parts or phthalates in cables), it needs a clear warning on the product, packaging or online listing."
  },
  {
    id: "us-origin",
    market: "us",
    name: "Country-of-origin marking",
    level: "required",
    what: "The product and its retail packaging must be marked legibly and permanently with the country of origin, for example \"Made in China\" (19 CFR Part 134)."
  },
  // European Union
  {
    id: "eu-ce-red",
    market: "eu",
    name: "CE marking under the Radio Equipment Directive",
    level: "required",
    what: "Connected products are assessed under the Radio Equipment Directive (2014/53/EU), which covers electrical safety (EN 60335 series), EMC and radio use. Keep a technical file and sign an EU Declaration of Conformity.",
    applies: ({ connected }) => connected
  },
  {
    id: "eu-ce-lvd",
    market: "eu",
    name: "CE marking under the Low Voltage and EMC Directives",
    level: "required",
    what: "Products without a radio are assessed under the Low Voltage Directive (2014/35/EU) and the EMC Directive (2014/30/EU), with safety tested to the EN 60335 series. Keep a technical file and sign an EU Declaration of Conformity.",
    applies: ({ connected, product }) => !connected && product !== "robot-mower"
  },
  {
    id: "eu-red-cyber",
    market: "eu",
    name: "RED cybersecurity requirements (EN 18031)",
    level: "required",
    what: "Internet-connected radio products must meet the cybersecurity requirements of Delegated Regulation (EU) 2022/30, usually shown through the EN 18031 standards: secure passwords, protected data and secure updates.",
    date: "2025-08-01",
    dateLabel: "In force since",
    applies: ({ connected }) => connected
  },
  {
    id: "eu-machinery",
    market: "eu",
    name: "Machinery rules for robotic mowers",
    level: "required",
    what: "Robotic mowers are machinery, tested to EN 50636-2-107. The Machinery Regulation (EU) 2023/1230 replaces the Machinery Directive for products placed on the market from 20 January 2027, with new rules on autonomous machines and safety software.",
    date: "2027-01-20",
    dateLabel: "Machinery Regulation applies from",
    applies: ({ product }) => product === "robot-mower"
  },
  {
    id: "eu-cra",
    market: "eu",
    name: "Cyber Resilience Act",
    level: "required",
    what: "Manufacturers of products with digital elements must report actively exploited vulnerabilities from 11 September 2026. The full security requirements and CE marking under the Act apply from 11 December 2027.",
    date: "2027-12-11",
    dateLabel: "Full requirements from",
    applies: ({ connected }) => connected
  },
  {
    id: "eu-rohs-reach",
    market: "eu",
    name: "RoHS and REACH",
    level: "required",
    what: "Restricted substances (lead, mercury, cadmium, certain flame retardants and phthalates) must stay under RoHS limits. Under REACH, tell customers if any part contains more than 0.1% of a substance of very high concern."
  },
  {
    id: "eu-weee",
    market: "eu",
    name: "WEEE producer registration",
    level: "required",
    what: "Register as a producer of electrical equipment in each EU country where you sell, directly or through an authorised representative, finance collection and recycling, and mark the product with the crossed-out wheelie bin."
  },
  {
    id: "eu-batteries",
    market: "eu",
    name: "EU Batteries Regulation",
    level: "required",
    what: "Register as a battery producer in each country (required since August 2025) and label batteries under the new rules (from August 2026). From 18 February 2027, portable batteries in appliances must be removable and replaceable by the end user, with limited exemptions.",
    date: "2027-02-18",
    dateLabel: "Replaceable batteries from"
  },
  {
    id: "eu-gpsr",
    market: "eu",
    name: "General Product Safety Regulation",
    level: "required",
    what: "Since 13 December 2024 every product needs a responsible economic operator in the EU, whose name and contact details appear on the product or packaging and in online listings, alongside the manufacturer's details and safety information."
  },
  {
    id: "eu-ecodesign",
    market: "eu",
    name: "Ecodesign: standby and external power supplies",
    level: "required",
    what: "Standby and networked-standby power limits (Regulation (EU) 2023/826) and efficiency rules for external power supplies (Regulation (EU) 2019/1782) apply to most household appliances and their chargers."
  },
  {
    id: "eu-packaging",
    market: "eu",
    name: "Packaging and Packaging Waste Regulation",
    level: "required",
    what: "The new regulation applies from 12 August 2026, with rules on packaging design, labelling and empty space phasing in. Packaging producer registration is required in each country where you sell.",
    date: "2026-08-12",
    dateLabel: "Applies from"
  },
  {
    id: "eu-antidumping",
    market: "eu",
    name: "Anti-dumping case on Chinese robotic mowers",
    level: "check",
    what: "Imports of robotic mowers from China have been registered since January 2026, and definitive duties, if any, must be decided by 19 January 2027. Factor a possible duty into 2027 pricing.",
    date: "2027-01-19",
    dateLabel: "Decision due by",
    href: "/topics/eu-robotic-mower-anti-dumping",
    applies: ({ product }) => product === "robot-mower"
  },
  // United Kingdom
  {
    id: "uk-ukca",
    market: "uk",
    name: "UKCA or CE marking",
    level: "required",
    what: "Great Britain accepts either UKCA or CE marking for most of these products. The rules mirror the EU ones: Radio Equipment Regulations 2017 for connected products, Electrical Equipment (Safety) and EMC Regulations otherwise, and the Supply of Machinery (Safety) Regulations for robotic mowers. Northern Ireland follows EU rules."
  },
  {
    id: "uk-psti",
    market: "uk",
    name: "Product security (PSTI) regime",
    level: "required",
    what: "Since 29 April 2024, connectable consumer products must not use universal default passwords, must publish how to report security issues, and must state how long they will receive security updates, with a statement of compliance.",
    applies: ({ connected }) => connected
  },
  {
    id: "uk-environment",
    market: "uk",
    name: "UK RoHS, WEEE, batteries and packaging",
    level: "required",
    what: "UK RoHS limits apply, and producers register for WEEE, waste batteries and packaging extended producer responsibility, usually through a compliance scheme."
  },
  {
    id: "uk-importer",
    market: "uk",
    name: "Importer details on the product",
    level: "required",
    what: "Goods placed on the GB market must carry the name and address of the manufacturer and, where the manufacturer is outside the UK, of the UK importer."
  },
  // All markets
  {
    id: "un383",
    market: "all",
    name: "UN 38.3 lithium battery transport test",
    level: "required",
    what: "Lithium batteries, including those packed in equipment, must pass UN 38.3 testing, with a test summary available, before they can be shipped by sea or air to any market. Most retailers also ask for IEC 62133-2 cell safety reports."
  }
];

/** Requirements for one product in one market, in a stable order. */
export function checklistFor(market: CertMarket, context: CertContext) {
  return CERT_REQUIREMENTS.filter((item) => (item.market === market || item.market === "all") && (!item.applies || item.applies(context)));
}

export const LEVEL_LABELS: Record<CertLevel, string> = {
  required: "Required by law",
  retailer: "Expected by retailers",
  check: "Check for your product"
};

/** "18 Feb 2027" */
export function formatCertDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][month - 1]} ${year}`;
}
