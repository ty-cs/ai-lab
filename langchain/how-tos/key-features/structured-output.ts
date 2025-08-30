import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { z } from 'zod';

const model = new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-flash',
    temperature: 0,
});

const joke = z.object({
    setup: z.string().describe('The setup of the joke'),
    punchline: z.string().describe('The punchline to the joke'),
    rating: z
        .number()
        .optional()
        .describe('How funny the joke is, from 1 to 10'),
});

const structuredLlm = model.withStructuredOutput(joke);

const res = await structuredLlm.invoke('Tell me a joke about cats');
console.log(res);
