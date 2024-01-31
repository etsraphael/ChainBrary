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

const transformJsonToXml = (jsonString: string): string => {
  // Parse the JSON string
  const jsonObj = JSON.parse(jsonString);

  // Check if the expected properties exist
  if (!jsonObj) {
      throw new Error("Invalid JSON structure: 'target' property is missing.");
  }

  // Extract the text and x elements
  const text = jsonObj["_"] || "";
  const xElements = jsonObj.x || [];

  // Construct the XML string
  let xmlString = text;
  xElements.forEach((element: {$: Placeholder }) => {
      if (element && element.$) {
          xmlString += `<x id="${element.$.id || ''}" ctype="${element.$.ctype || ''}" equiv-text="${element.$['equiv-text'] || ''}"/>`;
      }
  });

  return xmlString;
};

const translateTextAndValues = async (source: string, targetLanguage: string): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a translation model for a blockchain app, working with an XLF files.' },
        {
          role: 'user',
          content: `Translate this English text to ${targetLanguage}: ${source}`
        }
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

    const translationUnit = translationXml.xliff.file[0].body[0]['trans-unit'].find(
      (u: { $: { id: string } }) => u.$.id === id
    );

    // If it's just a string
    if (typeof unit.source[0] === 'string') {
      if (translationUnit && translationUnit.target === undefined) {
        try {
          console.log(unit.source[0])
          // const translatedText = await translateText(unit.source[0], targetLanguage);
          // translationUnit.target = [translatedText];
        } catch (error) {
          throw new Error(`id: ${id}. Failed to translate text.`);
        }
      }
    }

    // If it's an object
    if (unit.source[0].x) {
      if (translationUnit && translationUnit.target === undefined) {
        try {
          console.log(unit.source[0])
          // const translatedTextJson: string = await translateTextAndValues(JSON.stringify(unit.source[0]), targetLanguage);
          // const xmlString: string = transformJsonToXml(translatedTextJson);
          // translationUnit.target = [xmlString];
        } catch (error) {
          console.log(error);
          throw new Error(`id: ${id}. Failed to translate text.`);
        }
      }
    }
  }

  const builder = new Builder({
    renderOpts: { 'pretty': true, 'indent': '  ', 'newline': '\n' } // Adjust these options as needed
  });

  let updatedXml = builder.buildObject(translationXml);
  updatedXml = updatedXml.replace(/\n\s*\n/g, '\n'); // Replace multiple newlines with a single one

  writeFileSync('src/locale/messages.fr.xlf', updatedXml);
};

updateTranslations();

interface KeyAndValue {
  key: string;
  value: string;
}

interface Placeholder {
  id: string;
  ctype: string;
  'equiv-text': string;
}
