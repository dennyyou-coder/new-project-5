/**
 * Lithium-ion battery shipping check: watt-hours, the UN number, and what air (IATA DGR) and sea (IMDG)
 * shipping need for a cordless appliance or tool battery. Rules as of BATTERY_RULES_AS_OF, IATA DGR 67th
 * edition (2026). Review each January when the new DGR edition takes effect.
 */

export const BATTERY_RULES_AS_OF = "November 2026 (IATA DGR 67th edition, IMDG Code)";

export type BatteryPacking = "alone" | "with" | "in";

export const BATTERY_PACKINGS: Record<BatteryPacking, { label: string; un: string; name: string; instruction: string }> = {
  alone: { label: "Batteries on their own (spares, replacement packs)", un: "UN3480", name: "Lithium ion batteries", instruction: "PI 965" },
  with: { label: "Packed with the product, not fitted (separate in the box)", un: "UN3481", name: "Lithium ion batteries packed with equipment", instruction: "PI 966" },
  in: { label: "Fitted inside the product", un: "UN3481", name: "Lithium ion batteries contained in equipment", instruction: "PI 967" }
};

export type BatteryInputs = {
  packing: BatteryPacking;
  /** Battery pack nominal voltage, V. */
  voltage: number;
  /** Battery pack rated capacity, mAh. */
  capacity: number;
  /** Cell nominal voltage, V. */
  cellVoltage: number;
  /** Cell rated capacity, mAh. */
  cellCapacity: number;
  /** Batteries in one shipping carton. */
  batteriesPerPackage: number;
  /** Weight of one battery pack, kg. */
  batteryWeight: number;
};

export const BATTERY_DEFAULTS: BatteryInputs = {
  packing: "in",
  voltage: 25.2,
  capacity: 2500,
  cellVoltage: 3.6,
  cellCapacity: 2500,
  batteriesPerPackage: 1,
  batteryWeight: 0.35
};

const LIMITS: Record<Exclude<keyof BatteryInputs, "packing">, [number, number]> = {
  voltage: [1, 1000],
  capacity: [10, 1000000],
  cellVoltage: [1, 5],
  cellCapacity: [10, 500000],
  batteriesPerPackage: [1, 10000],
  batteryWeight: [0.01, 500]
};

export function cleanBatteryInputs(input: Partial<Record<keyof BatteryInputs, unknown>>): BatteryInputs {
  const out = { ...BATTERY_DEFAULTS };
  if (typeof input.packing === "string" && input.packing in BATTERY_PACKINGS) out.packing = input.packing as BatteryPacking;
  for (const [key, [min, max]] of Object.entries(LIMITS) as [keyof typeof LIMITS, [number, number]][]) {
    const value = Number(input[key]);
    if (Number.isFinite(value)) out[key] = Math.min(max, Math.max(min, value));
  }
  out.batteriesPerPackage = Math.max(1, Math.round(out.batteriesPerPackage));
  return out;
}

export type ShippingVerdict = "ok" | "restricted" | "forbidden";

export type BatteryMode = {
  title: string;
  verdict: ShippingVerdict;
  /** One line: can it go, and how. */
  headline: string;
  points: string[];
};

export type BatteryResult = {
  wh: number;
  cellWh: number;
  un: string;
  properName: string;
  instruction: string;
  /** Small battery: cell ≤ 20 Wh and battery ≤ 100 Wh. */
  small: boolean;
  /** Net battery weight in one package, kg. */
  packageBatteryKg: number;
  passengerAir: BatteryMode;
  cargoAir: BatteryMode;
  sea: BatteryMode;
  documents: string[];
  /** Notes for passengers carrying a sample in their luggage. */
  handCarry: string;
};

const round1 = (value: number) => Math.round(value * 10) / 10;

export function calculateBattery(inputs: BatteryInputs): BatteryResult {
  const wh = round1((inputs.voltage * inputs.capacity) / 1000);
  const cellWh = round1((inputs.cellVoltage * inputs.cellCapacity) / 1000);
  const small = cellWh <= 20 && wh <= 100;
  const packing = BATTERY_PACKINGS[inputs.packing];
  const packageBatteryKg = Math.round(inputs.batteriesPerPackage * inputs.batteryWeight * 100) / 100;
  const soc = "Charge at 30% or less (state of charge). Mandatory for batteries shipped alone and, from 1 January 2026, for batteries packed with equipment.";
  const socRecommended = "Charge at 30% or less is recommended by IATA for batteries fitted in equipment; some airlines require it.";

  let passengerAir: BatteryMode;
  let cargoAir: BatteryMode;

  if (inputs.packing === "alone") {
    passengerAir = {
      title: "Passenger aircraft",
      verdict: "forbidden",
      headline: "Not allowed. Batteries shipped on their own fly on cargo aircraft only.",
      points: []
    };
    const limit = small ? 10 : 35;
    cargoAir = {
      title: "Cargo aircraft",
      verdict: packageBatteryKg > limit ? "forbidden" : "restricted",
      headline: `Allowed as fully regulated dangerous goods (${packing.instruction} Section ${small ? "IB" : "IA"}), up to ${limit} kg of batteries per package.`,
      points: [
        soc,
        "Class 9 lithium battery hazard label, Cargo Aircraft Only label and UN3480 marking.",
        "Shipper's Declaration for Dangerous Goods, prepared by trained staff.",
        ...(packageBatteryKg > limit ? [`This carton holds ${packageBatteryKg} kg of batteries, over the ${limit} kg limit: split it into smaller packages.`] : [])
      ]
    };
  } else {
    const contained = inputs.packing === "in";
    const sectionTwoMark = contained
      ? "Lithium battery mark on the package, unless it holds no more than 2 batteries fitted in equipment (or 4 cells)."
      : "Lithium battery mark on the package.";
    if (small) {
      const over = packageBatteryKg > 5;
      const mode: BatteryMode = {
        title: "",
        verdict: over ? "restricted" : "ok",
        headline: over
          ? `Over 5 kg of batteries in one package, so it must go as fully regulated ${packing.instruction} Section I: split the cartons to keep the simpler rules.`
          : `Allowed under ${packing.instruction} Section II: no dangerous goods declaration or Class 9 label.`,
        points: [
          contained ? socRecommended : soc,
          sectionTwoMark,
          contained
            ? "Strong outer packaging, with the product protected from switching on."
            : "Strong outer packaging that survives a 1.2 m drop test, with the batteries protected against short circuits.",
          ...(contained ? [] : ["No more batteries than the product needs, plus two spares."])
        ]
      };
      passengerAir = { ...mode, title: "Passenger aircraft" };
      cargoAir = { ...mode, title: "Cargo aircraft" };
    } else {
      const points = [
        contained ? socRecommended : soc,
        "Class 9 lithium battery hazard label and UN3481 marking.",
        "Shipper's Declaration for Dangerous Goods, prepared by trained staff."
      ];
      passengerAir = {
        title: "Passenger aircraft",
        verdict: packageBatteryKg > 5 ? "forbidden" : "restricted",
        headline: packageBatteryKg > 5
          ? `Over the 5 kg per package limit for passenger aircraft (this carton: ${packageBatteryKg} kg of batteries).`
          : `Allowed as fully regulated dangerous goods (${packing.instruction} Section I), up to 5 kg of batteries per package.`,
        points
      };
      cargoAir = {
        title: "Cargo aircraft",
        verdict: packageBatteryKg > 35 ? "forbidden" : "restricted",
        headline: packageBatteryKg > 35
          ? `Over the 35 kg per package limit for cargo aircraft (this carton: ${packageBatteryKg} kg of batteries).`
          : `Allowed as fully regulated dangerous goods (${packing.instruction} Section I), up to 35 kg of batteries per package.`,
        points: [...points, "Cargo Aircraft Only label when the package is over the passenger aircraft limit."]
      };
    }
  }

  const sea: BatteryMode = small
    ? {
        title: "Sea freight",
        verdict: "ok",
        headline: "Can ship as ordinary cargo under IMDG special provision 188.",
        points: [
          "Lithium battery mark on each package (except products holding no more than 2 fitted batteries or 4 cells).",
          "Packed so the batteries cannot short-circuit or switch the product on.",
          "Most carriers still ask for the UN38.3 test summary and an SDS at booking."
        ]
      }
    : {
        title: "Sea freight",
        verdict: "restricted",
        headline: `Ships as Class 9 dangerous goods (${packing.un}). Routine, but book it as DG.`,
        points: [
          "Dangerous goods declaration and a container packing certificate.",
          "Class 9 lithium battery labels on packages and placards on the container.",
          "Fewer sailings accept DG and the freight costs more: ask the forwarder early."
        ]
      };

  const documents = [
    "UN38.3 test summary for the battery (required in every mode; ask the cell or pack maker).",
    "Safety data sheet (SDS/MSDS): not legally required for articles, but carriers and forwarders ask for it.",
    ...(small && inputs.packing !== "alone" ? [] : ["Shipper's Declaration for Dangerous Goods for air."]),
    "Watt-hour rating marked on the battery case.",
    "Air transport condition report (航空运输条件鉴定书) when shipping by air from China."
  ];

  const handCarry =
    wh <= 100
      ? "Passengers can carry a sample battery of 100 Wh or less in cabin baggage, with the terminals protected. Spare batteries must not go in checked bags."
      : wh <= 160
        ? "Passengers need the airline's approval to carry a battery between 100 and 160 Wh, in cabin baggage only, and at most two spares."
        : "Over 160 Wh, a battery cannot travel in passenger baggage. Send samples as cargo.";

  return {
    wh,
    cellWh,
    un: packing.un,
    properName: packing.name,
    instruction: packing.instruction,
    small,
    packageBatteryKg,
    passengerAir,
    cargoAir,
    sea,
    documents,
    handCarry
  };
}
