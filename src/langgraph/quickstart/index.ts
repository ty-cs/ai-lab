// Step 0: define tools and model
import { tool } from '@langchain/core/tools';
import { z } from 'zod/v4';

const llm = new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-flash',
    temperature: 0,
});
// Define tools
const add = tool(({ a, b }) => a + b, {
    name: 'add',
    description: 'Add two numbers',
    schema: z.object({
        a: z.number().describe('First number'),
        b: z.number().describe('Second number'),
    }),
});

const multiply = tool(({ a, b }) => a * b, {
    name: 'multiply',
    description: 'Multiply two numbers',
    schema: z.object({
        a: z.number().describe('First number'),
        b: z.number().describe('Second number'),
    }),
});

const divide = tool(({ a, b }) => a / b, {
    name: 'divide',
    description: 'Divide two numbers',
    schema: z.object({
        a: z.number().describe('First number'),
        b: z.number().describe('Second number'),
    }),
});

// Augment the LLM with tools
const toolsByName = {
    [add.name]: add,
    [multiply.name]: multiply,
    [divide.name]: divide,
};
const tools = Object.values(toolsByName);
const llmWithTools = llm.bindTools(tools);

// Step 1: Define state
import { StateGraph, START, END } from '@langchain/langgraph';
import { MessagesZodMeta } from '@langchain/langgraph';
import { registry } from '@langchain/langgraph/zod';
import { type BaseMessage } from '@langchain/core/messages';

const MessagesState = z.object({
    messages: z
        .array(z.custom<BaseMessage>())
        .register(registry, MessagesZodMeta),
    llmCalls: z.number().optional(),
});

// Step 2: Define model node
import { SystemMessage } from '@langchain/core/messages';
async function llmCall(state: z.infer<typeof MessagesState>) {
    return {
        messages: await llmWithTools.invoke([
            new SystemMessage(
                'You are a helpful assistant tasked with performing arithmetic on a set of inputs.',
            ),
            ...state.messages,
        ]),
        llmCalls: (state.llmCalls ?? 0) + 1,
    };
}

// Step 3: Define tool node
import { isAIMessage, ToolMessage } from '@langchain/core/messages';
async function toolNode(state: z.infer<typeof MessagesState>) {
    const lastMessage = state.messages.at(-1);

    if (lastMessage == null || !isAIMessage(lastMessage)) {
        return { messages: [] };
    }

    const result: ToolMessage[] = [];
    for (const toolCall of lastMessage.tool_calls ?? []) {
        const tool = toolsByName[toolCall.name];
        const observation = await tool?.invoke(toolCall);
        if (observation) result.push(observation);
    }

    return { messages: result };
}

// Step 4: Define logic to determine whether to end
async function shouldContinue(state: z.infer<typeof MessagesState>) {
    const lastMessage = state.messages.at(-1);
    if (lastMessage == null || !isAIMessage(lastMessage)) return END;

    // If the LLM makes a tool call, then perform an action
    if (lastMessage.tool_calls?.length) {
        return 'Action';
    }

    // Otherwise, we stop (reply to the user)
    return END;
}

// Step 5: Build and compile the agent
const agent = new StateGraph(MessagesState)
    .addNode('llm_call', llmCall)
    .addNode('environment', toolNode)
    .addEdge(START, 'llm_call')
    .addConditionalEdges('llm_call', shouldContinue, {
        Action: 'environment',
        [END]: END,
    })
    .addEdge('environment', END)
    .compile();

// Invoke
import { HumanMessage } from '@langchain/core/messages';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
const result = await agent.invoke({
    messages: [new HumanMessage('Add 3 and 4.')],
});

for (const message of result.messages) {
    console.log(`[${message.getType()}]: ${message.text}`);
}
