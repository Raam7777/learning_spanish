# Che Español · ספרדית ארגנטינאית

אתר ללימוד ספרדית של בואנוס איירס. כותבים אות, מילה או משפט בעברית או באנגלית ומקבלים:
כתיב בספרדית ארגנטינאית (vos, ustedes, ll/y כמו ״ש״), פירוק מילה-מילה, הערה כשזה שונה מספרד, והשמעה.
כל תרגום נשמר בהיסטוריה בענן, עם חיפוש, כוכבים, מחיקה ותרגול (כרטיסים או הקלדה).

## טכנולוגיה

- Next.js 16 + TypeScript + Tailwind CSS 4
- Better Auth: שם משתמש + סיסמה, איפוס סיסמה במייל
- Postgres ב-Neon דרך Drizzle ORM
- Google Gemini (Flash-Lite) לתרגום
- Resend למייל איפוס סיסמה
- השמעה: Web Speech API של הדפדפן (מעדיף קול es-AR אם קיים בטלפון)

## הקמה חד-פעמית

1. **מסד נתונים**: פותחים פרויקט חינמי ב-[Neon](https://neon.com) ומעתיקים את ה-connection string.
2. **תרגום**: יוצרים מפתח חינמי ב-[Google AI Studio](https://aistudio.google.com/apikey).
3. **מייל**: פותחים חשבון חינמי ב-[Resend](https://resend.com) ויוצרים API key.
   בלי דומיין מאומת אפשר לשלוח רק לאימייל שאיתו נרשמתם ל-Resend, וזה מספיק לשימוש אישי.
4. מעתיקים את `.env.example` ל-`.env.local` וממלאים את הערכים.
   את `BETTER_AUTH_SECRET` מייצרים עם `openssl rand -base64 32`.
5. יוצרים את הטבלאות:

   ```bash
   npm install
   npm run db:migrate
   ```

6. מריצים מקומית: `npm run dev` ופותחים http://localhost:3000

## עדכון אוטומטי מ-GitHub (Vercel)

1. דוחפים את הקוד לריפו ב-GitHub.
2. ב-[Vercel](https://vercel.com/new) בוחרים Import Git Repository ואת הריפו.
3. ב-Environment Variables מוסיפים את כל המשתנים מ-`.env.example`.
   את `BETTER_AUTH_URL` מגדירים לכתובת האתר ב-Vercel, למשל `https://che-espanol.vercel.app`.
4. Deploy. מעכשיו כל `git push` ל-`main` מעדכן את האתר אוטומטית.

## פקודות

| פקודה | מה עושה |
| --- | --- |
| `npm run dev` | שרת פיתוח |
| `npm run build` | בנייה לפרודקשן |
| `npm run lint` | בדיקת קוד |
| `npm run typecheck` | בדיקת TypeScript |
| `npm run db:generate` | יצירת מיגרציה אחרי שינוי ב-`src/db/schema.ts` |
| `npm run db:migrate` | הרצת מיגרציות על מסד הנתונים |

## עלויות

לשימוש אישי הכול נשאר במסלולים החינמיים: Gemini Flash-Lite (בערך 500 בקשות ביום), Vercel Hobby, Neon Free ו-Resend Free.
כל משתמש מוגבל ל-`DAILY_TRANSLATION_LIMIT` תרגומים ביום (ברירת מחדל 100).
במסלול החינמי של Gemini, גוגל רשאית להשתמש בטקסט שנשלח לשיפור המוצרים שלה.
