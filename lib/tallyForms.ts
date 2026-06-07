export const TALLY_FORMS = {
  contact: {
    id: "MeV8L8",
    url: "https://tally.so/r/MeV8L8"
  },
  expo: {
    id: "lbzVN6",
    url: "https://tally.so/r/lbzVN6"
  },
  reports: {
    id: "ZjeGvz",
    url: "https://tally.so/r/ZjeGvz"
  },
  sourcing: {
    id: "1ARG4M",
    url: "https://tally.so/r/1ARG4M"
  }
} as const;

export type TallyFormKey = keyof typeof TALLY_FORMS;
