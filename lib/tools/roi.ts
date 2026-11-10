/**
 * Commercial cleaning robot payback: how much manual cleaning time a robot takes over, what that saves
 * each year and how long the robot takes to pay for itself. Shared by the /tools page and the results email.
 */

export type RoiInputs = {
  /** Floor area cleaned each day, m². */
  area: number;
  /** What one cleaner covers per hour by hand, m²/h. */
  manualRate: number;
  /** Cleaning days per year. */
  days: number;
  /** Fully loaded labour cost per hour (wage, taxes, benefits). */
  wage: number;
  /** Share of that manual work the robot takes over, %. */
  coverage: number;
  /** Staff time per day spent on the robot (moving, emptying, checking), hours. */
  supervision: number;
  /** Purchase price including dock and setup. */
  price: number;
  /** Maintenance, consumables, power and software per year. */
  running: number;
  /** Years the robot is expected to work. */
  life: number;
};

export const ROI_DEFAULTS: RoiInputs = {
  area: 2000,
  manualRate: 250,
  days: 312,
  wage: 22,
  coverage: 60,
  supervision: 0.5,
  price: 35000,
  running: 3000,
  life: 5
};

export const ROI_LIMITS: Record<keyof RoiInputs, [number, number]> = {
  area: [50, 500000],
  manualRate: [20, 10000],
  days: [1, 366],
  wage: [0, 1000],
  coverage: [0, 100],
  supervision: [0, 24],
  price: [0, 10000000],
  running: [0, 5000000],
  life: [1, 15]
};

export type RoiResult = {
  manualHoursPerDay: number;
  hoursSavedPerDay: number;
  hoursSavedPerYear: number;
  labourSavedPerYear: number;
  netSavingPerYear: number;
  /** Months to pay back the purchase price; null when the robot never pays back. */
  paybackMonths: number | null;
  /** Net gain over the robot's life, after its price. */
  lifetimeNet: number;
  /** Lifetime net gain as a share of the price, %. */
  lifetimeRoi: number | null;
  /** Full-time cleaners' worth of hours freed (at 2,080 hours a year). */
  fteFreed: number;
};

/** Clamp untrusted numbers (from the form or the API) into the ranges the tool accepts. */
export function cleanRoiInputs(input: Partial<Record<keyof RoiInputs, unknown>>): RoiInputs {
  const out = { ...ROI_DEFAULTS };
  for (const key of Object.keys(ROI_DEFAULTS) as (keyof RoiInputs)[]) {
    const value = Number(input[key]);
    if (Number.isFinite(value)) {
      const [min, max] = ROI_LIMITS[key];
      out[key] = Math.min(max, Math.max(min, value));
    }
  }
  return out;
}

export function calculateRoi(inputs: RoiInputs): RoiResult {
  const manualHoursPerDay = inputs.area / inputs.manualRate;
  const hoursSavedPerDay = Math.max(0, manualHoursPerDay * (inputs.coverage / 100) - inputs.supervision);
  const hoursSavedPerYear = hoursSavedPerDay * inputs.days;
  const labourSavedPerYear = hoursSavedPerYear * inputs.wage;
  const netSavingPerYear = labourSavedPerYear - inputs.running;
  const paybackMonths = netSavingPerYear > 0 ? (inputs.price / netSavingPerYear) * 12 : null;
  const lifetimeNet = netSavingPerYear * inputs.life - inputs.price;
  return {
    manualHoursPerDay,
    hoursSavedPerDay,
    hoursSavedPerYear,
    labourSavedPerYear,
    netSavingPerYear,
    paybackMonths,
    lifetimeNet,
    lifetimeRoi: inputs.price > 0 ? (lifetimeNet / inputs.price) * 100 : null,
    fteFreed: hoursSavedPerYear / 2080
  };
}
