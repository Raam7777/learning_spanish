import type { Lang } from "@/lib/i18n/dictionary";
import type { Topic } from "@/lib/topics";

export type StarterCard = Readonly<{
  id: string;
  topic: Topic;
  es: string;
  he: string;
  en: string;
  note: Readonly<{ he: string; en: string }> | null;
}>;

export const STARTER_DECK: readonly StarterCard[] = [
  {
    id: "mate-1",
    topic: "food",
    es: "¿Vos querés un mate?",
    he: "אתה רוצה מאטה?",
    en: "Do you want a mate?",
    note: { he: "vos querés במקום tú quieres.", en: "vos querés instead of tú quieres." },
  },
  {
    id: "mate-2",
    topic: "food",
    es: "Pasame el mate.",
    he: "תעביר לי את המאטה.",
    en: "Pass me the mate.",
    note: { he: "כינוי המושא נדבק לציווי: pasame.", en: "The object pronoun sticks to the command: pasame." },
  },
  {
    id: "mate-3",
    topic: "food",
    es: "El agua está muy caliente.",
    he: "המים חמים מדי.",
    en: "The water is too hot.",
    note: null,
  },
  {
    id: "kiosk-1",
    topic: "food",
    es: "¿Me das un alfajor?",
    he: "אפשר אלפחור?",
    en: "Can I have an alfajor?",
    note: null,
  },
  {
    id: "kiosk-2",
    topic: "food",
    es: "Una coca y una medialuna, por favor.",
    he: "קולה וקרואסון, בבקשה.",
    en: "A coke and a croissant, please.",
    note: null,
  },
  {
    id: "kiosk-3",
    topic: "food",
    es: "¿Cuánto sale?",
    he: "כמה זה עולה?",
    en: "How much is it?",
    note: { he: "בארגנטינה אומרים sale, לא cuesta.", en: "In Argentina people say sale, not cuesta." },
  },
  {
    id: "chat-1",
    topic: "chat",
    es: "¿Qué hacés?",
    he: "מה קורה?",
    en: "What's up?",
    note: { he: "hacés עם הטעמה על הסוף, לא haces.", en: "hacés, stressed at the end, not haces." },
  },
  {
    id: "chat-2",
    topic: "chat",
    es: "Dale, nos vemos.",
    he: "יאללה, נתראה.",
    en: "Alright, see you.",
    note: { he: "dale הוא אישור יומיומי: בסדר, קדימה.", en: "dale is an everyday yes: alright, let's go." },
  },
  {
    id: "chat-3",
    topic: "chat",
    es: "Estoy en el bondi.",
    he: "אני באוטובוס.",
    en: "I'm on the bus.",
    note: { he: "bondi הוא אוטובוס בדיבור בבואנוס איירס.", en: "bondi is the Buenos Aires word for a bus." },
  },
  {
    id: "chat-4",
    topic: "chat",
    es: "Mandame un mensaje.",
    he: "תשלח לי הודעה.",
    en: "Send me a message.",
    note: null,
  },
  {
    id: "chat-5",
    topic: "chat",
    es: "Che, ¿venís?",
    he: "צ'ה, אתה בא?",
    en: "Che, are you coming?",
    note: null,
  },
  {
    id: "taxi-1",
    topic: "travel",
    es: "Al centro, por favor.",
    he: "למרכז, בבקשה.",
    en: "To the center, please.",
    note: null,
  },
  {
    id: "taxi-2",
    topic: "travel",
    es: "¿Me dejás en la esquina?",
    he: "תוריד אותי בפינה?",
    en: "Can you drop me at the corner?",
    note: { he: "dejás עם הטעמה, צורת vos.", en: "dejás is stressed, the vos form." },
  },
  {
    id: "taxi-3",
    topic: "travel",
    es: "Pará acá, por favor.",
    he: "עצור כאן, בבקשה.",
    en: "Stop here, please.",
    note: { he: "ציווי ל-vos: pará, לא para.", en: "A vos command: pará, not para." },
  },
  {
    id: "taxi-4",
    topic: "travel",
    es: "¿Falta mucho?",
    he: "עוד הרבה?",
    en: "Is it much further?",
    note: null,
  },
];

export const starterById = (id: string): StarterCard | null => STARTER_DECK.find((card) => card.id === id) ?? null;

export const starterPrompt = (card: StarterCard, lang: Lang): string => (lang === "he" ? card.he : card.en);

export const starterNote = (card: StarterCard, lang: Lang): string | null => (card.note ? card.note[lang] : null);
