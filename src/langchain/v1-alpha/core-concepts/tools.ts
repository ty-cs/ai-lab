import { z } from 'zod';
import { createAgent, tool, ToolMessage, ToolNode } from 'langchain';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

const model = new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-flash',
    temperature: 0,
});
const searchDatabase = tool(
    ({ query }) => {
        return `Results for: ${query}`;
    },
    {
        name: 'search_database',
        description: 'Search the database.',
        schema: z.object({
            query: z.string().describe('The query to search the database with'),
        }),
    },
);

const sendEmail = tool(
    ({ to, subject, body }) => {
        return `Email sent to ${to}`;
    },
    {
        name: 'send_email',
        description: 'Send an email.',
        schema: z.object({
            to: z.string().describe('The email address to send the email to'),
            subject: z.string().describe('The subject of the email'),
            body: z.string().describe('The body of the email'),
        }),
    },
);

// Configure ToolNode with custom error handling
const toolNode = new ToolNode([searchDatabase, sendEmail], {
    name: 'email_tools',
    handleToolErrors: (error, toolCall) => {
        return new ToolMessage({
            content:
                'I encountered an issue. Please try rephrasing your request.',
            tool_call_id: toolCall.id as string,
        });
    },
});

// Create agent with the configured ToolNode
const agent = createAgent({
    llm: model,
    tools: toolNode, // Pass ToolNode instead of tools list
    prompt: 'You are a helpful email assistant.',
});

// The agent will use your custom ToolNode configuration
const result = await agent.invoke({
    messages: [{ role: 'user', content: 'Search for John and email him' }],
});

console.log('[debug] result', result);
