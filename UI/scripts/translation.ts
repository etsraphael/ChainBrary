import { parseStringPromise, Builder } from 'xml2js';
import { readFileSync, writeFileSync } from 'fs';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'] // This is the default and can be omitted
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
        { role: 'user', content: `Translate this English text to ${targetLanguage}: ${text}` }
      ]
    });
    return response.choices[0].message.content as string;
  } catch (error) {
    throw new Error('Failed to translate text. Please check the console for more details.');
  }
};

const updateTranslations = async () => {
  const originalContent = readFileSync('src/locale/messages.xlf', 'utf8');
  const translationContent = readFileSync('src/locale/messages.fr.xlf', 'utf8');

  const originalXml = await parseStringPromise(originalContent);
  const translationXml = await parseStringPromise(translationContent);
  const targetLanguage: string = languageList.find((l: KeyAndValue) => l.key === 'fr')?.value as string;

  for (const unit of originalXml.xliff.file[0].body[0]['trans-unit']) {
    const id = unit.$.id;
    const sourceText = unit.source[0];

    const translationUnit = translationXml.xliff.file[0].body[0]['trans-unit'].find(
      (u: { $: { id: string } }) => u.$.id === id
    );

    // If it's just a string
    if (typeof sourceText === 'string') {
      if (translationUnit && translationUnit.target === undefined) {
        try {
          const translatedText = await translateText(sourceText, targetLanguage);
          translationUnit.target = [translatedText];
        } catch (error) {
          throw new Error(`id: ${id}. Failed to translate text.`);
        }
      }
    }

    // // If it's an object
    //   if (unit.source[0].x) {
    //     console.log('unit.source[0].x', unit.source[0].x);
    //     console.log('-----------------')
    //   }
  }

  const builder = new Builder();
  const updatedXml = builder.buildObject(translationXml);
  writeFileSync('src/locale/messages.fr.xlf', updatedXml);
};

updateTranslations();

interface KeyAndValue {
  key: string;
  value: string;
}
