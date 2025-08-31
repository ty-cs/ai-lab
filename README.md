# AI Lab

This repository is a personal lab for experimenting with and learning about AI, LLMs, and related technologies. It serves as a collection of code snippets, experiments, and small projects, primarily focused on [LangChain.js](https://js.langchain.com/docs/get_started/introduction).

## Structure

The repository is organized into the following sections:

- `src/langchain/how-tos/key-features/`: Demonstrations of core LangChain features.
- `src/langchain/how-tos/LCEL/`: Examples of the LangChain Expression Language (LCEL).
- `src/langchain/v1-alpha/`: Quick-start guides and examples for the alpha version of LangChain.

## Getting Started

To install dependencies, you need to have [Bun](https.bun.sh) installed. Then, run:

```bash
bun install
```

## Running Examples

You can run any of the TypeScript files directly using `bun run`. For example:

```bash
bun run src/langchain/how-tos/key-features/chains.ts
```

### Available Examples

#### Key Features

- `bun run src/langchain/how-tos/key-features/chains.ts`
- `bun run src/langchain/how-tos/key-features/streaming.ts`
- `bun run src/langchain/how-tos/key-features/structured-output.ts`
- `bun run src/langchain/how-tos/key-features/tool-calling.ts`

#### LCEL (LangChain Expression Language)

- `bun run src/langchain/how-tos/LCEL/cheatsheet.ts`
- `bun run src/langchain/how-tos/LCEL/sequence.ts`

#### v1-alpha

- `bun run src/langchain/v1-alpha/quickstart.ts`
- `bun run src/langchain/v1-alpha/quickstart-full.ts`

## Useful Resources

- [LangGraph.js](https://github.com/langchain-ai/langgraphjs): A framework for building resilient language agents as graphs. It is the JavaScript/TypeScript version of the original Python LangGraph.
