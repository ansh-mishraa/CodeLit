// Define types for known language IDs and names
type LanguageId = 74 | 63 | 71 | 62;
type LanguageName = "TypeScript" | "JavaScript" | "Python" | "Java";

// Reverse mapping
const LANGUAGE_NAMES: Record<LanguageId, LanguageName> = {
  74: "TypeScript",
  63: "JavaScript",
  71: "Python",
  62: "Java",
};

export function getLanguageName(languageId: number): string {
  return LANGUAGE_NAMES[languageId as LanguageId] || "Unknown";
}

export function getLanguageId(language: string): number | undefined {
  const languageMap: Record<string, LanguageId> = {
    PYTHON: 71,
    JAVASCRIPT: 63,
    JAVA: 62,
    TYPESCRIPT: 74,
  };

  return languageMap[language.toUpperCase()];
}
