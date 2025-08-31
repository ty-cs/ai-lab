import { ChatPromptTemplate } from '@langchain/core/prompts';
import { RunnableLambda, RunnableSequence } from '@langchain/core/runnables';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { StringOutputParser } from '@langchain/core/output_parsers';

const model = new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-flash',
    temperature: 0,
});
const analysisPrompt = ChatPromptTemplate.fromTemplate(
    'is this a funny joke? {joke}',
);

const prompt = ChatPromptTemplate.fromTemplate('tell me a joke about {topic}');

const chain = prompt.pipe(model).pipe(new StringOutputParser());
const composedChainWithLambda = RunnableSequence.from([
    chain,
    (input) => {
        console.log(
            '%c|test|',
            'background:#009688;color:#fff;font-weight:bold',
            'input',
            input,
        );
        return { joke: input };
    },
    analysisPrompt,
    model,
    new StringOutputParser(),
]);

console.log(await composedChainWithLambda.invoke({ topic: 'beets' }));
