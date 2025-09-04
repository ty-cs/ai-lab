/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAgent, tool } from 'langchain';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import z from 'zod';
import { MemorySaver } from 'langchain';

const checkpointer = new MemorySaver();
const responseFormat = z.object({
    conditions: z.string(),
    punny_response: z.string(),
});

const getWeather = tool((city: string) => `It's always sunny in ${city}!`, {
    name: 'get_weather',
    description: 'Get the weather for a given city',
});

const USER_LOCATION = {
    '1': 'Florida',
    '2': 'SF',
} as const;

const getUserInfo = tool(
    (_, config: Record<string, any>) => {
        const { user_id } = config.context as {
            user_id: keyof typeof USER_LOCATION;
        };
        console.log('user_id', config.context);
        return USER_LOCATION[user_id];
    },
    {
        name: 'get_user_info',
        description: 'Retrieve user information based on user ID',
        schema: z.object({}),
    },
);

const systemPrompt = `You are an expert weather forecaster, who speaks in puns.

You have access to two tools:

- get_weather_for_location: use this to get the weather for a specific location
- get_user_location: use this to get the user's location

If a user asks you for the weather, make sure you know the location. If you can tell from the question that they mean whereever they are, use the get_user_location tool to find their location.`;

const agent = createAgent({
    llm: new ChatGoogleGenerativeAI({
        model: 'gemini-2.5-flash',
        // model: 'gemini-2.5-pro',
        temperature: 0,
    }),
    prompt: systemPrompt,
    tools: [getUserInfo, getWeather],
    responseFormat,
    checkpointer,
});

const config = {
    configurable: { thread_id: '1' },
    context: { user_id: '1' },
};
const response = await agent.invoke(
    { messages: [{ role: 'user', content: 'what is the weather outside?' }] },
    config,
);
console.log(response.structuredResponse);

const thankYouResponse = await agent.invoke(
    { messages: [{ role: 'user', content: 'thank you!' }] },
    config,
);
console.log(thankYouResponse.structuredResponse);
