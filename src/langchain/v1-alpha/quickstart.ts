import { createReactAgent, tool } from 'langchain';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import z from 'zod';

const WeatherInfo = z.object({
    conditions: z.string(),
    location: z.string(),
});

const getWeather = tool((city: string) => `It's always cloudy in ${city}!`, {
    name: 'get_weather',
    description: 'Get the weather for a given city',
});

const agent = createReactAgent({
    llm: new ChatGoogleGenerativeAI({
        temperature: 0,
        model: 'gemini-2.5-flash',
    }),
    tools: [getWeather],
    responseFormat: WeatherInfo,
});

const { structuredResponse } = await agent.invoke({
    messages: [{ role: 'user', content: "What's the weather in Tokyo?" }],
});

console.log(structuredResponse);
// {
//     conditions: "cloudy",
//     location: "Tokyo"
// }
