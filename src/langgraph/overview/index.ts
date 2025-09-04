import {
    MessagesAnnotation,
    StateGraph,
    START,
    END,
} from '@langchain/langgraph';

const mockLlm = (state: typeof MessagesAnnotation.State) => {
    return { messages: [{ role: 'ai', content: 'hello world' }] };
};

const graph = new StateGraph(MessagesAnnotation)
    .addNode('mock_llm', mockLlm)
    .addEdge(START, 'mock_llm')
    .addEdge('mock_llm', END)
    .compile();

const res = await graph.invoke({
    messages: [{ role: 'user', content: 'hi!' }],
});
console.log('[debug] res', res);
