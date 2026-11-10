export type Letter = Readonly<{
  letter: string;
  name: string;
  sound: Readonly<{ he: string; en: string }>;
  example: string;
  meaning: Readonly<{ he: string; en: string }>;
  rioplatense?: boolean;
}>;

export const LETTERS: readonly Letter[] = [
  { letter: "A a", name: "a", sound: { he: "אָ, כמו ב״אבא״", en: "ah, as in “father”" }, example: "agua", meaning: { he: "מים", en: "water" } },
  { letter: "B b", name: "be", sound: { he: "ב׳ רכה, בין ב׳ ל-ו׳", en: "soft b, between b and v" }, example: "bueno", meaning: { he: "טוב", en: "good" } },
  { letter: "C c", name: "ce", sound: { he: "ס׳ לפני e/i, ק׳ בשאר המקרים", en: "s before e/i, k otherwise" }, example: "cena · casa", meaning: { he: "ארוחת ערב · בית", en: "dinner · house" }, rioplatense: true },
  { letter: "D d", name: "de", sound: { he: "ד׳ רכה", en: "soft d" }, example: "día", meaning: { he: "יום", en: "day" } },
  { letter: "E e", name: "e", sound: { he: "אֶ, כמו ב״אמא״", en: "eh, as in “bed”" }, example: "empanada", meaning: { he: "אמפנדה", en: "empanada" } },
  { letter: "F f", name: "efe", sound: { he: "פ׳ רפה", en: "f" }, example: "fútbol", meaning: { he: "כדורגל", en: "football" } },
  { letter: "G g", name: "ge", sound: { he: "ח׳ לפני e/i, ג׳ בשאר המקרים", en: "throaty h before e/i, g otherwise" }, example: "gente · gato", meaning: { he: "אנשים · חתול", en: "people · cat" } },
  { letter: "H h", name: "hache", sound: { he: "שקטה, לא הוגים אותה", en: "silent" }, example: "hola", meaning: { he: "שלום", en: "hello" } },
  { letter: "I i", name: "i", sound: { he: "אִי, כמו ב״אילת״", en: "ee, as in “see”" }, example: "idea", meaning: { he: "רעיון", en: "idea" } },
  { letter: "J j", name: "jota", sound: { he: "ח׳ גרונית", en: "throaty h, like Scottish “loch”" }, example: "jugar", meaning: { he: "לשחק", en: "to play" } },
  { letter: "K k", name: "ka", sound: { he: "ק׳", en: "k" }, example: "kilo", meaning: { he: "קילו", en: "kilo" } },
  { letter: "L l", name: "ele", sound: { he: "ל׳", en: "l" }, example: "luna", meaning: { he: "ירח", en: "moon" } },
  { letter: "M m", name: "eme", sound: { he: "מ׳", en: "m" }, example: "mate", meaning: { he: "מאטה (התה הארגנטינאי)", en: "mate (Argentine tea)" } },
  { letter: "N n", name: "ene", sound: { he: "נ׳", en: "n" }, example: "noche", meaning: { he: "לילה", en: "night" } },
  { letter: "Ñ ñ", name: "eñe", sound: { he: "נְי, כמו ב״קוניאק״", en: "ny, as in “canyon”" }, example: "mañana", meaning: { he: "מחר / בוקר", en: "tomorrow / morning" } },
  { letter: "O o", name: "o", sound: { he: "אוֹ", en: "oh" }, example: "ojo", meaning: { he: "עין", en: "eye" } },
  { letter: "P p", name: "pe", sound: { he: "פּ׳ דגושה", en: "p" }, example: "pan", meaning: { he: "לחם", en: "bread" } },
  { letter: "Q q", name: "cu", sound: { he: "ק׳, תמיד עם u שקטה: que, qui", en: "k, always with a silent u: que, qui" }, example: "queso", meaning: { he: "גבינה", en: "cheese" } },
  { letter: "R r", name: "erre", sound: { he: "ר׳ מתגלגלת קצרה; בתחילת מילה מתגלגלת חזק", en: "short tapped r; strongly rolled at the start of a word" }, example: "pero · rosa", meaning: { he: "אבל · ורד", en: "but · rose" } },
  { letter: "S s", name: "ese", sound: { he: "ס׳. בבואנוס איירס לפעמים נבלעת בסוף הברה", en: "s. In Buenos Aires it's often softened at the end of a syllable" }, example: "sol", meaning: { he: "שמש", en: "sun" }, rioplatense: true },
  { letter: "T t", name: "te", sound: { he: "ט׳ רכה", en: "soft t" }, example: "tango", meaning: { he: "טנגו", en: "tango" } },
  { letter: "U u", name: "u", sound: { he: "אוּ", en: "oo, as in “food”" }, example: "uva", meaning: { he: "ענב", en: "grape" } },
  { letter: "V v", name: "ve corta", sound: { he: "נשמעת כמו b, לא כמו ו׳", en: "sounds like b, not like English v" }, example: "vos", meaning: { he: "אתה / את", en: "you (informal)" }, rioplatense: true },
  { letter: "W w", name: "doble ve", sound: { he: "ו׳ / וּ, בעיקר במילים לועזיות", en: "w, mostly in foreign words" }, example: "wifi", meaning: { he: "וויי-פיי", en: "wifi" } },
  { letter: "X x", name: "equis", sound: { he: "קס", en: "ks" }, example: "examen", meaning: { he: "מבחן", en: "exam" } },
  { letter: "Y y", name: "ye", sound: { he: "בבואנוס איירס: ש׳ (שׁוֹ = yo)", en: "in Buenos Aires: sh (“sho” = yo)" }, example: "yo", meaning: { he: "אני", en: "I" }, rioplatense: true },
  { letter: "Z z", name: "zeta", sound: { he: "ס׳, אף פעם לא כמו th", en: "s, never like th" }, example: "zapato", meaning: { he: "נעל", en: "shoe" }, rioplatense: true },
];

export const DIGRAPHS: readonly Letter[] = [
  { letter: "CH ch", name: "che", sound: { he: "צ׳, כמו ב״צ׳יפס״", en: "ch, as in “cheese”" }, example: "che", meaning: { he: "היי / אחי (מילת הפנייה הארגנטינאית)", en: "hey / buddy (the Argentine call-out)" }, rioplatense: true },
  { letter: "LL ll", name: "doble ele", sound: { he: "בבואנוס איירס: ש׳ (שׁוּביה = lluvia)", en: "in Buenos Aires: sh (“shuvia” = lluvia)" }, example: "lluvia · calle", meaning: { he: "גשם · רחוב", en: "rain · street" }, rioplatense: true },
  { letter: "RR rr", name: "doble erre", sound: { he: "ר׳ מתגלגלת חזקה", en: "strongly rolled r" }, example: "perro", meaning: { he: "כלב", en: "dog" } },
];
