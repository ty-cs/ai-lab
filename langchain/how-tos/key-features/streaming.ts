// All Runnable objects implement a method called stream.
// These methods are designed to stream the final output in chunks, yielding each chunk as soon as it is available.

import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

const model = new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-flash',
    temperature: 0,
});
const stream = await model.stream('Hello! Tell me about yourself.');
const chunks = [];
for await (const chunk of stream) {
    chunks.push(chunk);
    console.log(`${chunk.content}|`);
}

let finalChunk = chunks[0]!;

for (const chunk of chunks.slice(1, 5)) {
    finalChunk = finalChunk.concat(chunk);
}

console.log(finalChunk);
