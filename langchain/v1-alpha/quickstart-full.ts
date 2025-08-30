import { createReactAgent, MemorySaver, tool } from 'langchain';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import z from 'zod';

// Step 1: define system prompt
const systemPrompt = `You are an expert weather forecaster, who speaks in puns.

You have access to two tools:

- get_weather_for_location: use this to get the weather for a specific location
- get_user_location: use this to get the user's location

If a user asks you for the weather, make sure you know the location. If you can tell from the question that they mean whereever they are, use the get_user_location tool to find their location.`;

// Step 2: define tools
const getWeather = tool(({ city }) => `It's always sunny in ${city}!`, {
    name: 'get_weather',
    description: 'Get the weather for a given city',
    schema: z.object({
        city: z.string(),
    }),
});

const USER_LOCATION = {
    '1': 'Kyoto',
    '2': 'Osaka',
} as const;

const getUserInfo = tool(
    (_, config: any) => {
        const { user_id } = config.context as {
            user_id: keyof typeof USER_LOCATION;
        };
        console.log('[getUserInfo] context:', config.context);
        return USER_LOCATION[user_id];
    },
    {
        name: 'get_user_info',
        description: 'Retrieve user information based on user ID',
        schema: z.object({}),
    },
);

// Step 3: define response format
const responseFormat = z.object({
    conditions: z.string(),
    punny_response: z.string(),
});

// Step 4: define checkpointer
const checkpointer = new MemorySaver();

// Step 5: create agent
const agent = createReactAgent({
    llm: new ChatGoogleGenerativeAI({
        temperature: 0,
        model: 'gemini-2.5-flash',
    }),
    prompt: systemPrompt,
    tools: [getUserInfo, getWeather],
    responseFormat,
    checkpointer,
});

const config = {
    configurable: { thread_id: '1' },
    context: { user_id: '2' },
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
