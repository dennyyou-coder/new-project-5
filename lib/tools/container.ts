/**
 * Container loading: how many cartons fit in a 20GP, 40GP and 40HQ container, which limit binds (space or
 * weight), and what the sea freight comes to per unit. Shared by the /tools page and the results email.
 */

export type ContainerKey = "20gp" | "40gp" | "40hq";

export type ContainerSpec = {
  label: string;
  /** Internal length, width and height, cm. */
  length: number;
  width: number;
  height: number;
  /** Maximum cargo weight, kg (the box's rated payload; road limits are often lower). */
  payload: number;
};

/** Typical ISO dry container internal dimensions and payloads. Individual boxes vary by a few centimetres. */
export const CONTAINERS: Record<ContainerKey, ContainerSpec> = {
  "20gp": { label: "20GP", length: 589, width: 235, height: 239, payload: 28200 },
  "40gp": { label: "40GP", length: 1203, width: 235, height: 239, payload: 26700 },
  "40hq": { label: "40HQ", length: 1203, width: 235, height: 269, payload: 26500 }
};

export const CONTAINER_KEYS = Object.keys(CONTAINERS) as ContainerKey[];

/** Space kept free for loading by hand and closing the doors, cm off the length and height. */
export const LOADING_GAP = { length: 10, height: 5 };

export type ContainerInputs = {
  /** Carton outer dimensions, cm. */
  cartonLength: number;
  cartonWidth: number;
  cartonHeight: number;
  /** Gross weight of one packed carton, kg. */
  cartonWeight: number;
  unitsPerCarton: number;
  /** Cartons may be laid on their side (no "this side up" marking). */
  allowTipping: boolean;
  /** Units in the order, to work out how many containers it takes. */
  orderUnits: number;
  /** Sea freight quote per container, USD. */
  freight20: number;
  freight40: number;
  freight40hq: number;
};

export const CONTAINER_DEFAULTS: ContainerInputs = {
  cartonLength: 52,
  cartonWidth: 52,
  cartonHeight: 30,
  cartonWeight: 9,
  unitsPerCarton: 1,
  allowTipping: false,
  orderUnits: 3000,
  freight20: 2200,
  freight40: 3000,
  freight40hq: 3100
};

const LIMITS: Partial<Record<keyof ContainerInputs, [number, number]>> = {
  cartonLength: [5, 580],
  cartonWidth: [5, 230],
  cartonHeight: [5, 260],
  cartonWeight: [0.1, 2000],
  unitsPerCarton: [1, 10000],
  orderUnits: [1, 10000000],
  freight20: [0, 100000],
  freight40: [0, 100000],
  freight40hq: [0, 100000]
};

export function cleanContainerInputs(input: Partial<Record<keyof ContainerInputs, unknown>>): ContainerInputs {
  const out = { ...CONTAINER_DEFAULTS };
  for (const [key, [min, max]] of Object.entries(LIMITS) as [keyof ContainerInputs, [number, number]][]) {
    const value = Number(input[key]);
    if (Number.isFinite(value)) (out as Record<string, unknown>)[key] = Math.min(max, Math.max(min, value));
  }
  out.unitsPerCarton = Math.max(1, Math.round(out.unitsPerCarton));
  out.orderUnits = Math.max(1, Math.round(out.orderUnits));
  out.allowTipping = input.allowTipping === true || input.allowTipping === "true";
  return out;
}

/**
 * Most boxes of size a × b on a floor of L × W. Tries both straight orientations and the two-block
 * layouts that fill the leftover strip with the carton turned 90°, which is how loaders usually stow.
 */
export function bestFloor(L: number, W: number, a: number, b: number) {
  const grid = (x: number, y: number) => (x > 0 && y > 0 ? Math.floor(x / a) * Math.floor(y / b) : 0);
  const gridTurned = (x: number, y: number) => (x > 0 && y > 0 ? Math.floor(x / b) * Math.floor(y / a) : 0);
  let best = Math.max(grid(L, W), gridTurned(L, W));
  // Split along the length: the first part one way round, the rest turned.
  for (let n = 1; n * a <= L; n++) best = Math.max(best, grid(n * a, W) + gridTurned(L - n * a, W));
  for (let n = 1; n * b <= L; n++) best = Math.max(best, gridTurned(n * b, W) + grid(L - n * b, W));
  // Split across the width.
  for (let n = 1; n * b <= W; n++) best = Math.max(best, grid(L, n * b) + gridTurned(L, W - n * b));
  for (let n = 1; n * a <= W; n++) best = Math.max(best, gridTurned(L, n * a) + grid(L, W - n * a));
  return best;
}

export type ContainerFit = {
  key: ContainerKey;
  label: string;
  /** Cartons that fit by space alone. */
  bySpace: number;
  /** Cartons allowed by the payload. */
  byWeight: number;
  cartons: number;
  units: number;
  limit: "space" | "weight";
  /** Carton volume as a share of the container's internal volume, %. */
  volumeUsed: number;
  cargoWeight: number;
  freight: number;
  freightPerUnit: number | null;
  /** Containers of this type the order needs. */
  containersForOrder: number;
  freightForOrder: number;
};

export type ContainerResult = {
  cartonCbm: number;
  orderCartons: number;
  orderCbm: number;
  orderWeight: number;
  fits: ContainerFit[];
  /** The cheapest way to ship the whole order in one container type, when freight quotes are given. */
  cheapest: ContainerFit | null;
};

function cartonsBySpace(spec: ContainerSpec, inputs: ContainerInputs) {
  const L = spec.length - LOADING_GAP.length;
  const W = spec.width;
  const H = spec.height - LOADING_GAP.height;
  const { cartonLength: l, cartonWidth: w, cartonHeight: h } = inputs;
  // Upright only: the carton's height stays vertical. Tipping lets any side face down.
  const stands: [number, number, number][] = inputs.allowTipping ? [[l, w, h], [l, h, w], [w, h, l]] : [[l, w, h]];
  return Math.max(...stands.map(([a, b, up]) => (up <= H ? bestFloor(L, W, a, b) * Math.floor(H / up) : 0)));
}

export function calculateContainer(inputs: ContainerInputs): ContainerResult {
  const cartonCbm = (inputs.cartonLength * inputs.cartonWidth * inputs.cartonHeight) / 1e6;
  const orderCartons = Math.ceil(inputs.orderUnits / inputs.unitsPerCarton);
  const freightFor: Record<ContainerKey, number> = { "20gp": inputs.freight20, "40gp": inputs.freight40, "40hq": inputs.freight40hq };
  const fits = CONTAINER_KEYS.map((key): ContainerFit => {
    const spec = CONTAINERS[key];
    const bySpace = cartonsBySpace(spec, inputs);
    const byWeight = Math.floor(spec.payload / inputs.cartonWeight);
    const cartons = Math.min(bySpace, byWeight);
    const units = cartons * inputs.unitsPerCarton;
    const freight = freightFor[key];
    const containersForOrder = cartons > 0 ? Math.ceil(orderCartons / cartons) : 0;
    return {
      key,
      label: spec.label,
      bySpace,
      byWeight,
      cartons,
      units,
      limit: byWeight < bySpace ? "weight" : "space",
      volumeUsed: ((cartons * cartonCbm) / ((spec.length * spec.width * spec.height) / 1e6)) * 100,
      cargoWeight: cartons * inputs.cartonWeight,
      freight,
      freightPerUnit: units > 0 && freight > 0 ? freight / units : null,
      containersForOrder,
      freightForOrder: containersForOrder * freight
    };
  });
  const priced = fits.filter((fit) => fit.cartons > 0 && fit.freight > 0);
  const cheapest = priced.length ? priced.reduce((best, fit) => (fit.freightForOrder < best.freightForOrder ? fit : best)) : null;
  return {
    cartonCbm,
    orderCartons,
    orderCbm: orderCartons * cartonCbm,
    orderWeight: orderCartons * inputs.cartonWeight,
    fits,
    cheapest
  };
}

/** Below this volume a full container usually costs more than sharing one (LCL). */
export const LCL_THRESHOLD_CBM = 15;
