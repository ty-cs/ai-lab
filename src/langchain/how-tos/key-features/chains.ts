import {
    JsonOutputParser,
    StringOutputParser,
} from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

// const prompt = ChatPromptTemplate.fromTemplate('Tell me a joke about {topic}');

// const parser = new StringOutputParser();

const model = new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-flash',
    temperature: 0,
});

// // 1. Chains
// const chain = prompt.pipe(model).pipe(parser);
//
// const stream = await chain.stream({
//     topic: 'parrot',
// });
//
// for await (const chunk of stream) {
//     console.log(`${chunk}|`);
// }

// 2. Input streams

// const chain = model.pipe(new JsonOutputParser());
// const stream = await chain.stream(
//     `Output a list of the countries france, spain and japan and their populations in JSON format. Use a dict with an outer key of "countries" which contains a list of countries. Each country should have the key "name" and "population"`,
// );
//
// for await (const chunk of stream) {
//     console.log(chunk);
//     console.log('---');
// }

// 3. A function that operates on finalized inputs
// rather than on an input_stream

// A function that does not operates on input streams and breaks streaming.
const extractCountryNames = (inputs: Record<string, any>) => {
    if (!Array.isArray(inputs.countries)) {
        return '';
    }
    return JSON.stringify(inputs.countries.map((country) => country.name));
};

const chain = model.pipe(new JsonOutputParser()).pipe(extractCountryNames);

const stream = await chain.stream(
    `output a list of the countries france, spain and japan and their populations in JSON format. Use a dict with an outer key of "countries" which contains a list of countries. Each country should have the key "name" and "population"`,
);

for await (const chunk of stream) {
    console.log(chunk);
}
