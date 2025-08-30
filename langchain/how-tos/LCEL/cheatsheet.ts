import { RunnableLambda, RunnableSequence } from '@langchain/core/runnables';

const runnable = RunnableLambda.from((x: number) => x.toString());

console.log(await runnable.invoke(5));

console.log(await runnable.batch([7, 8, 9]));

(async () => {
    async function* generatorFn(x: number[]) {
        for (const i of x) {
            yield i.toString();
        }
    }

    const runnable = RunnableLambda.from(generatorFn);

    const stream = await runnable.stream([0, 1, 2, 3, 4]);

    for await (const chunk of stream) {
        console.log(chunk);
        console.log('---');
    }
})();

(async () => {
    const runnable1 = RunnableLambda.from((x: any) => {
        return { foo: x };
    });

    const runnable2 = RunnableLambda.from((x: any) => [x].concat([x]));

    const chain = RunnableSequence.from([runnable1, runnable2]);

    console.log(await chain.invoke(2));
})();
