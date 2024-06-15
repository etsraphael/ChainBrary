import { readFileSync, writeFileSync } from 'fs';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY']
});

const languageList: KeyAndValue[] = [
  {
    key: 'fr',
    value: 'French'
  },
  {
    key: 'es',
    value: 'Spanish'
  }
];

const translateText = async (text: string, targetLanguage: string, desc?: string): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: 'You are a translation model for a blockchain app.' },
        {
          role: 'user',
          content: `Translate this English text to ${targetLanguage}. ${desc}. Preserve and include any XML tags or placeholders exactly as they are in the translated text without any additional phrases or introductions.:${text}`
        }
      ]
    });
    return response.choices[0].message.content as string;
  } catch (error) {
    throw new Error('Failed to translate text. Please check the console for more details.');
  }
};

const updateTranslations = async () => {
  for (const language of languageList) {
    const originalContent = readFileSync(`src/locale/messages.${language.key}.xlf`, 'utf8');

    // Match all the translation units that need to be translated
    const matches = [
      ...originalContent.matchAll(
        /<target\s+(?:state="new")?>(.*?)<\/target>(?:\s*<note\s+priority="1"\s+from="description">(.*?)<\/note>)?/g
      )
    ];

    // Translate all matches concurrently
    const translations = await Promise.all(
      matches.map(async ([match, originalText, desc], index) => {
        console.log(`Translating unit ${index + 1} of ${matches.length} for ${language.value}`);
        const newtranslation = await translateText(originalText, language.value, desc);
        console.log(`Translation complete for unit ${index + 1} of ${matches.length} for ${language.value}`);
        return match.replace(`<target state="new">${originalText}</target>`, `<target>${newtranslation}</target>`);
      })
    );

    // Reconstruct the updated XML content
    let updatedXml = originalContent;
    matches.forEach((match, index) => {
      updatedXml = updatedXml.replace(match[0], translations[index]);
    });

    writeFileSync(`src/locale/messages.${language.key}.xlf`, updatedXml);
  }
};

updateTranslations()
  .then(() => {
    console.log('All translations updated successfully.');
  })
  .catch((error) => {
    console.error('Error updating translations:', error);
  });

interface KeyAndValue {
  key: string;
  value: string;
}
