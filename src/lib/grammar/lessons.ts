export type Localized = Readonly<{ he: string; en: string }>;

export type Example = Readonly<{ es: string; he: string; en: string }>;

export type Lesson = Readonly<{
  id: string;
  title: Localized;
  summary: Localized;
  rules: readonly Localized[];
  examples: readonly Example[];
}>;

export const GRAMMAR_LESSONS: readonly Lesson[] = [
  {
    id: "voseo-present",
    title: { he: "Voseo: vos בהווה", en: "Voseo: vos in the present" },
    summary: { he: "איך אומרים 'אתה' ביומיום בבואנוס איירס", en: "How everyday 'you' works in Buenos Aires" },
    rules: [
      {
        he: "במקום tú משתמשים ב-vos, וההטעמה נופלת על ההברה האחרונה.",
        en: "Instead of tú, use vos, and the stress falls on the last syllable.",
      },
      {
        he: "פעלים שנגמרים ב-ar: cantar ← vos cantás. ב-er: comer ← vos comés. ב-ir: vivir ← vos vivís.",
        en: "-ar verbs: cantar → vos cantás. -er verbs: comer → vos comés. -ir verbs: vivir → vos vivís.",
      },
      {
        he: "חריגים: tener ← vos tenés, querer ← vos querés, poder ← vos podés, hacer ← vos hacés, ir ← vos vas, ser ← vos sos.",
        en: "Irregulars: tener → vos tenés, querer → vos querés, poder → vos podés, hacer → vos hacés, ir → vos vas, ser → vos sos.",
      },
    ],
    examples: [
      { es: "Vos tenés razón.", he: "לך יש צדק.", en: "You're right." },
      { es: "¿Vos querés un mate?", he: "אתה רוצה מאטה?", en: "Do you want a mate?" },
      { es: "¿Qué hacés el sábado?", he: "מה אתה עושה ביום שבת?", en: "What are you doing on Saturday?" },
    ],
  },
  {
    id: "voseo-commands",
    title: { he: "Voseo: ציווי", en: "Voseo: commands" },
    summary: { he: "איך נותנים הוראות ל-vos", en: "How to give instructions to vos" },
    rules: [
      {
        he: "בציווי של vos מורידים את ה-d שבסוף הציווי של tú, ומעבירים את ההטעמה לסוף המילה.",
        en: "For vos commands, drop the final d of the tú command and move the stress to the end of the word.",
      },
      {
        he: "di → decí, ven → vení, pon → poné, sal → salí, haz → hacé, ten → tené.",
        en: "di → decí, ven → vení, pon → poné, sal → salí, haz → hacé, ten → tené.",
      },
      {
        he: "כשמילת מושא מצטרפת לציווי, כותבים אותן כמילה אחת: decime, esperame.",
        en: "When an object pronoun attaches to a command, write them as one word: decime, esperame.",
      },
    ],
    examples: [
      { es: "Decime la verdad.", he: "תגיד לי את האמת.", en: "Tell me the truth." },
      { es: "Vení acá.", he: "בוא לכאן.", en: "Come here." },
      { es: "Esperame un ratito.", he: "חכה לי רגע.", en: "Wait for me a moment." },
    ],
  },
  {
    id: "ustedes",
    title: { he: "ustedes במקום vosotros", en: "ustedes instead of vosotros" },
    summary: { he: "ברבים לא משתמשים ב-vosotros", en: "Vosotros is not used in Argentina" },
    rules: [
      {
        he: "בבואנוס איירס לא משתמשים ב-vosotros בכלל. לפנייה לכמה אנשים אומרים ustedes, גם בלי פורמליות.",
        en: "Buenos Aires does not use vosotros at all. For a group, say ustedes, even informally.",
      },
      {
        he: "ustedes מתנהג כמו 'הם': ustedes hablan, ustedes comen, ustedes viven.",
        en: "ustedes conjugates like 'they': ustedes hablan, ustedes comen, ustedes viven.",
      },
    ],
    examples: [
      { es: "¿Ustedes son de Buenos Aires?", he: "אתם מבואנוס איירס?", en: "Are you from Buenos Aires?" },
      { es: "Ustedes hablan muy rápido.", he: "אתם מדברים מהר מאוד.", en: "You all speak very fast." },
    ],
  },
  {
    id: "past-tense",
    title: { he: "עבר: indefinido נפוץ", en: "Past: the simple past is common" },
    summary: { he: "לדבר על היום ועל אתמול", en: "Talking about today and yesterday" },
    rules: [
      {
        he: "בדיבור יומיומי בארגנטינה משתמשים ב-indefinido (comí) גם לדברים שקרו היום. הצורה he comido נפוצה יותר בספרד.",
        en: "In everyday Argentine speech, the indefinido (comí) is used even for things that happened today. He comido is more common in Spain.",
      },
      {
        he: "hablar ← hablé, comer ← comí, vivir ← viví. עם vos: hablaste, comiste, viviste.",
        en: "hablar → hablé, comer → comí, vivir → viví. With vos: hablaste, comiste, viviste.",
      },
    ],
    examples: [
      { es: "Hoy comí en casa.", he: "היום אכלתי בבית.", en: "Today I ate at home." },
      { es: "Ayer fui al cine con Ana.", he: "אתמול הלכתי לקולנוע עם אנה.", en: "Yesterday I went to the movies with Ana." },
    ],
  },
  {
    id: "diminutives",
    title: { he: "הקטנה: -ito / -ita", en: "Diminutives: -ito / -ita" },
    summary: { he: "איך מקטינים ומרככים בדיבור", en: "How to soften and shrink words" },
    rules: [
      {
        he: "מוסיפים -ito / -ita, או -cito / -cita אחרי עיצור: un ratito, un cafecito, una casita.",
        en: "Add -ito / -ita, or -cito / -cita after a consonant: un ratito, un cafecito, una casita.",
      },
      {
        he: "בארגנטינה ההקטנה משמשת גם כדי לרכך בקשה או הצעה.",
        en: "In Argentina, diminutives also soften a request or an offer.",
      },
    ],
    examples: [
      { es: "¿Me esperás un ratito?", he: "תחכה לי רגע?", en: "Can you wait for me a little while?" },
      { es: "¿Querés un cafecito?", he: "רוצה קפה קטן?", en: "Want a little coffee?" },
    ],
  },
];
