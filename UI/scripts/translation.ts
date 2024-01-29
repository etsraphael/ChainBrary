import { parseStringPromise, Builder } from 'xml2js';
import { readFileSync, writeFileSync } from 'fs';
// import { Configuration, OpenAIApi } from 'openai';
// import OpenAI from 'openai';

// const configuration = new Configuration({
//   apiKey: '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',
// });

// const openai = new OpenAIApi(configuration);

// const translateText = async (text: string, targetLanguage: string): string => {

const translateText = (text: string, targetLanguage: string): string => {
  console.log('text', text);
  console.log('targetLanguage', targetLanguage);
  console.log('--------------------------------');
  return 'boum';
  // console.log('targetLanguage', targetLanguage);
  // try {
  //     const response = await openai.createTranslation({
  //         model: "translation-model", // Replace with the specific translation model you intend to use
  //         input: text,
  //         source_language: "en", // Set the source language
  //         target_language: targetLanguage,
  //     });
  //     return response.data.data[0].text;
  // } catch (error) {
  //     console.error("Error in translation:", error);
  //     return null;
  // }
};

const updateTranslations = async () => {
  const originalContent = readFileSync('src/locale/messages.xlf', 'utf8');
  const translationContent = readFileSync('src/locale/messages.fr.xlf', 'utf8');

  const originalXml = await parseStringPromise(originalContent);
  const translationXml = await parseStringPromise(translationContent);

  for (const unit of originalXml.xliff.file[0].body[0]['trans-unit']) {
    const id = unit.$.id;
    const sourceText = unit.source[0];

    const translationUnit = translationXml.xliff.file[0].body[0]['trans-unit'].find(
      (u: { $: { id: string } }) => u.$.id === id
    );

    if (typeof sourceText === 'string') {
      if (translationUnit && translationUnit.target === undefined) {
        translationUnit.target = [await translateText(sourceText, 'fr')];
      }
    }
  }

  const builder = new Builder();
  const updatedXml = builder.buildObject(translationXml);
  writeFileSync('src/locale/messages.fr.xlf', updatedXml);
};

updateTranslations();

// if object includes a x tag
// if (unit.source[0].x) {
//   console.log('unit.source[0].x', unit.source[0].x);
//   console.log('-----------------')
// }

// if (!translationUnit || translationUnit.source[0] !== sourceText) {
// const translatedText = await translateText(sourceText, 'fr');
// if (translatedText) {
//     if (translationUnit) {
//         translationUnit.target[0] = translatedText;
//     } else {
//         // Handle the addition of new translation units
//     }
// }
// }

// writeFileSync('path/to/messages.fr.xlf', updatedXml);
