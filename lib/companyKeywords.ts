type CompanyArticle = {
  title: string;
  tags: readonly string[];
};

export type CompanyKeyword = {
  label: string;
  value: string;
  aliases: readonly string[];
};

const keyword = (
  label: string,
  value: string,
  aliases: readonly string[]
): CompanyKeyword => ({ label, value, aliases });

export const ANALYSIS_COMPANY_KEYWORDS = [
  keyword("Aiper", "aiper", ["aiper"]),
  keyword("ALDI", "aldi", ["aldi"]),
  keyword("Amazon", "amazon", ["amazon"]),
  keyword("Anker / Eufy", "anker-eufy", ["anker", "eufy"]),
  keyword("Beatbot", "beatbot", ["beatbot"]),
  keyword("Benewake", "benewake", ["benewake"]),
  keyword("BISSELL", "bissell", ["bissell"]),
  keyword("Bosch", "bosch", ["bosch"]),
  keyword("Chervon", "chervon", ["chervon"]),
  keyword("Chyson", "chyson", ["chyson"]),
  keyword("De’Longhi", "delonghi", ["de’longhi", "de'longhi", "delonghi"]),
  keyword("Deerma", "deerma", ["deerma"]),
  keyword("DEWALT", "dewalt", ["dewalt"]),
  keyword("DJI / ROMO", "dji-romo", ["dji", "romo"]),
  keyword("Dreame", "dreame", ["dreame"]),
  keyword("Dyson", "dyson", ["dyson"]),
  keyword("EAI", "eai", ["eai"]),
  keyword("Ecovacs", "ecovacs", ["ecovacs"]),
  keyword("EGO", "ego", ["ego"]),
  keyword("Fluidra", "fluidra", ["fluidra"]),
  keyword("Freudenberg / Vileda", "freudenberg-vileda", ["freudenberg", "vileda", "vileda professional"]),
  keyword("Godfreys", "godfreys", ["godfreys"]),
  keyword("Groupe SEB / Rowenta", "groupe-seb-rowenta", ["groupe seb", "rowenta"]),
  keyword("Hamilton Beach", "hamilton-beach", ["hamilton beach"]),
  keyword("Hoover", "hoover", ["hoover"]),
  keyword("Husqvarna", "husqvarna", ["husqvarna"]),
  keyword("Insta360", "insta360", ["insta360"]),
  keyword("iRobot / Roomba", "irobot-roomba", ["irobot", "roomba"]),
  keyword("Kärcher", "karcher", ["kärcher", "karcher"]),
  keyword("Kingclean", "kingclean", ["kingclean"]),
  keyword("Kress", "kress", ["kress"]),
  keyword("Laifen", "laifen", ["laifen"]),
  keyword("Lymow", "lymow", ["lymow"]),
  keyword("Makita", "makita", ["makita"]),
  keyword("Mammotion", "mammotion", ["mammotion"]),
  keyword("Maston", "maston", ["maston"]),
  keyword("Maytronics / Dolphin", "maytronics-dolphin", ["maytronics", "dolphin"]),
  keyword("Midea", "midea", ["midea", "midea group"]),
  keyword("Miele", "miele", ["miele"]),
  keyword("MOVA", "mova", ["mova"]),
  keyword("Narwal", "narwal", ["narwal"]),
  keyword("Navimow / Segway", "navimow-segway", ["navimow", "segway"]),
  keyword("Nilfisk", "nilfisk", ["nilfisk"]),
  keyword("Philips Domestic Appliances", "philips-domestic-appliances", ["philips domestic appliances"]),
  keyword("Picea Robotics", "picea-robotics", ["picea", "picea robotics"]),
  keyword("Pudu Robotics", "pudu-robotics", ["pudu", "pudu robotics"]),
  keyword("Roborock", "roborock", ["roborock"]),
  keyword("Ryobi", "ryobi", ["ryobi"]),
  keyword("SharkNinja / Shark / Ninja", "sharkninja", ["sharkninja", "shark", "ninja"]),
  keyword("Silver Star", "silver-star", ["silver star"]),
  keyword("Stanley Black & Decker / BLACK+DECKER", "stanley-black-decker", ["stanley black & decker", "stanley black and decker", "black & decker", "black+decker"]),
  keyword("STIHL", "stihl", ["stihl"]),
  keyword("Sunseeker", "sunseeker", ["sunseeker"]),
  keyword("TerraMow", "terramow", ["terramow"]),
  keyword("Tineco", "tineco", ["tineco"]),
  keyword("TTI / Milwaukee", "tti-milwaukee", ["tti", "techtronic industries", "milwaukee"]),
  keyword("Uwant", "uwant", ["uwant"]),
  keyword("Vermop", "vermop", ["vermop"]),
  keyword("Vorwerk", "vorwerk", ["vorwerk"]),
  keyword("Worx", "worx", ["worx"]),
  keyword("WYBOT", "wybot", ["wybot"]),
  keyword("Xiaomi / Mijia", "xiaomi-mijia", ["xiaomi", "mijia"]),
  keyword("Xinbao / Guangdong Xinbao", "xinbao", ["xinbao", "guangdong xinbao"]),
  keyword("Yarbo", "yarbo", ["yarbo"])
] as const satisfies readonly CompanyKeyword[];

const PRIMARY_ANALYSIS_COMPANY_VALUES = new Set([
  "aiper",
  "anker-eufy",
  "beatbot",
  "bissell",
  "dji-romo",
  "dreame",
  "dyson",
  "ecovacs",
  "hoover",
  "husqvarna",
  "irobot-roomba",
  "karcher",
  "kingclean",
  "kress",
  "mammotion",
  "maytronics-dolphin",
  "midea",
  "miele",
  "mova",
  "narwal",
  "navimow-segway",
  "nilfisk",
  "pudu-robotics",
  "roborock",
  "sharkninja",
  "stihl",
  "sunseeker",
  "tineco",
  "tti-milwaukee",
  "vorwerk",
  "wybot",
  "xiaomi-mijia"
]);

function normalize(value: string) {
  return value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("en")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9+&]+/g, " ")
    .trim();
}

function articleMatchesKeyword(
  article: CompanyArticle,
  companyKeyword: CompanyKeyword
) {
  const fields = [article.title, ...article.tags].map(normalize);
  return companyKeyword.aliases
    .map(normalize)
    .some((alias) =>
      fields.some((field) => ` ${field} `.includes(` ${alias} `))
    );
}

export function getAvailableCompanyKeywords<T extends CompanyArticle>(
  articles: readonly T[]
) {
  return ANALYSIS_COMPANY_KEYWORDS
    .filter((companyKeyword) =>
      PRIMARY_ANALYSIS_COMPANY_VALUES.has(companyKeyword.value)
    )
    .filter((companyKeyword) =>
      articles.some((article) => articleMatchesKeyword(article, companyKeyword))
    )
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function getCompanyKeyword(
  value: string | undefined,
  available: readonly CompanyKeyword[]
) {
  return available.find((companyKeyword) => companyKeyword.value === value);
}

export function filterArticlesByCompany<T extends CompanyArticle>(
  articles: readonly T[],
  companyKeyword: CompanyKeyword
) {
  return articles.filter((article) =>
    articleMatchesKeyword(article, companyKeyword)
  );
}
