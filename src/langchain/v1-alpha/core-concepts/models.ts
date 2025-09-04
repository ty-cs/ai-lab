import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { initChatModel, tool } from 'langchain';

const model = new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-flash',
    temperature: 0,
});
// const model = await initChatModel('gemini-2.5-flash', {
//     temperature: 0,
//     modelProvider: 'google-genai',
// });
//
// const response = await model.invoke('Tell me a joke about cats');
// console.log(response);

import { HumanMessage, AIMessage, SystemMessage } from 'langchain';

const conversation = [
    new SystemMessage(
        'You are a helpful assistant that translates English to French.',
    ),
    new HumanMessage('Translate: I love programming.'),
    new AIMessage("J'adore la programmation."),
    new HumanMessage('Translate: I love building applications.'),
];
//
// const response = await model.invoke(conversation);
// console.log(response); // AIMessage("J'adore créer des applications.")

// const stream = await model.stream('Why do parrots have colorful feathers?');
// for await (const chunk of stream) {
//     console.log(chunk.text);
// }

// const responses = await model.batch([
//     'Why do parrots have colorful feathers?',
//     'How do airplanes fly?',
//     'What is quantum computing?',
//     'Why do parrots have colorful feathers?',
//     'How do airplanes fly?',
//     'What is quantum computing?',
// ]);
// for (const response of responses) {
//     console.log(response);
// }

// ## Tool calling
import { z } from 'zod';

const getWeather = tool(
    (input) => {
        return `It's sunny in ${input.location}.`;
    },
    {
        name: 'get_weather',
        description: 'Get the weather at a location.',
        schema: z.object({
            location: z
                .string()
                .describe('The location to get the weather for'),
        }),
    },
);

// const modelWithTools = model.bindTools([getWeather]);

// const response = await modelWithTools.invoke(
//     "What's the weather like in Boston?",
// );
// const toolCalls = response.tool_calls || [];
// for (const tool_call of toolCalls) {
//     View tool calls made by the model
// console.log(`Tool: ${tool_call.name}`);
// console.log(`Args: ${JSON.stringify(tool_call.args, null, 2)}`);
// }

// When binding user-defined tools, the model’s response includes a request to execute a tool.
// **It is up to you** to perform the requested action and return the result back to the model for use in subsequent reasoning.
//
// // Step 1: Model generates tool calls
// const messages = [{ role: 'user', content: "What's the weather in Boston?" }];
// const response = await modelWithTools.invoke(messages);
// messages.push(response);
//
// // Step 2: Execute tools and collect results
// for (const tool_call of response.tool_calls || []) {
//     // Execute the tool with the generated arguments
//     const tool_result = await getWeather.invoke(tool_call);
//     messages.push(tool_result);
// }
//
// // Step 3: Pass results back to model for final response
// const final_response = await modelWithTools.invoke(messages);
// console.log(final_response.text);
// // "The current weather in Boston is 72°F and sunny."
//
// const response = await modelWithTools.invoke(
//     "What's the weather in Boston and Tokyo?",
// );
//
// // The model may generate multiple tool calls
// console.log(response.tool_calls);
// // [
// //   { name: 'get_weather', args: { location: 'Boston' }, id: 'call_1' },
// //   { name: 'get_time', args: { location: 'Tokyo' }, id: 'call_2' }
// // ]
//
// // Execute all tools (can be done in parallel with async)
// const results = [];
// for (const tool_call of response.tool_calls || []) {
//     if (tool_call.name === 'get_weather') {
//         const result = await getWeather.invoke(tool_call);
//         results.push(result);
//     }
// }

const Movie = z.object({
    title: z.string().describe('The title of the movie'),
    year: z.number().describe('The year the movie was released'),
    director: z.string().describe('The director of the movie'),
    rating: z.number().describe("The movie's rating out of 10"),
});

const modelWithStructure = model.withStructuredOutput(Movie, {
    includeRaw: true,
});

const response = await modelWithStructure.invoke(
    'Provide details about the movie Inception',
);
console.log(response);
// {
//     title: "Inception",
//     year: 2010,
//     director: "Christopher Nolan",
//     rating: 8.8,
// }
