import { readFileSync, writeFileSync } from 'fs';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY']
});

const languageList: KeyAndValue[] = [
  {
    key: 'fr',
    value: 'French'
  }
];

const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a translation model for a blockchain app.' },
        {
          role: 'user',
          content: `Translate this English text to ${targetLanguage}. Preserve and include any XML tags or placeholders exactly as they are in the translated text without any additional phrases or introductions: ${text}`
        }
      ]
    });
    return response.choices[0].message.content as string;
  } catch (error) {
    throw new Error('Failed to translate text. Please check the console for more details.');
  }
};

const updateTranslations = async () => {
  const originalContent = readFileSync('src/locale/messages.fr.xlf', 'utf8');

  // Match all the translation units that need to be translated
  const matches = [
    ...originalContent.matchAll(
      /<trans-unit[^>]*>[\s\S]*?<source>(.*?)<\/source>[\s\S]*?<target[^>]*state="new"[^>]*>[\s\S]*?<\/target>[\s\S]*?<\/trans-unit>/g
    )
  ];

  // Translate all matches concurrently
  const translations = await Promise.all(
    matches.map(async ([match, originalText]) => {
      const newtranslation = await translateText(originalText, 'fr');
      return match.replace(`<target state="new"/>`, `<target>${newtranslation}</target>`);
    })
  );

  // Reconstruct the updated XML content
  let updatedXml = originalContent;
  matches.forEach((match, index) => {
    updatedXml = updatedXml.replace(match[0], translations[index]);
  });

  writeFileSync('src/locale/messages.fr.xlf', updatedXml);
};

updateTranslations();

interface KeyAndValue {
  key: string;
  value: string;
}
