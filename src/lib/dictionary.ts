// Dictionary API Integration for Word Book using api.dictionaryapi.dev

type DictionaryDefinition = {
  definition: string;
  example?: string;
  synonyms?: string[];
};

type DictionaryMeaning = {
  partOfSpeech: string;
  definitions: DictionaryDefinition[];
  synonyms?: string[];
};

type DictionaryResponse = {
  word: string;
  meanings: DictionaryMeaning[];
};

const HTTP_NOT_FOUND = 404;
const MAX_SYNONYMS = 2;

function extractSynonyms(
  meaning: DictionaryMeaning,
  definition: DictionaryDefinition
): string[] {
  const allSynonyms = [
    ...(meaning.synonyms || []),
    ...(definition.synonyms || []),
  ];

  return [...new Set(allSynonyms)].slice(0, MAX_SYNONYMS);
}

function formatMeaning(
  meaning: DictionaryMeaning,
  definition: DictionaryDefinition
): string {
  const synonyms = extractSynonyms(meaning, definition);

  let formatted = `(${meaning.partOfSpeech})`;

  if (synonyms.length > 0) {
    formatted += ` (${synonyms.join(", ")})`;
  }

  formatted += ` ${definition.definition}`;

  return formatted;
}

function processWordMeanings(meanings: DictionaryMeaning[]): string[] {
  const result: Record<string, string> = {};

  for (const meaning of meanings) {
    if (meaning?.definitions?.length === 0) {
      continue;
    }

    const definition = meaning.definitions[0];

    if (!definition?.definition) {
      continue;
    }

    result[meaning.partOfSpeech] = formatMeaning(meaning, definition);
  }

  return Object.values(result);
}

export async function searchWordMeaning(word: string): Promise<string> {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.trim().toLowerCase())}`
    );

    if (!response.ok) {
      if (response.status === HTTP_NOT_FOUND) {
        throw new Error("Word not found in dictionary");
      }
      throw new Error("Failed to fetch word definition");
    }

    const data: DictionaryResponse[] = await response.json();

    if (!data || data.length === 0) {
      throw new Error("No definition found for this word");
    }

    const meanings = processWordMeanings(data[0].meanings);

    if (meanings.length === 0) {
      throw new Error("No definition available for this word");
    }

    return meanings.join("\n\n");
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to search word meaning");
  }
}
