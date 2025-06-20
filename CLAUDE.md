# Claude.md

## What is ReactJS.scratch?

This is a simple project attempting to reimplement React from scratch.

The purpose is to understand how React works, as well as its API surface.a

It should have no dependency, and built using TypeScript.

For the initial features, let's start with these key features:

- [`createElement`](https://react.dev/reference/react/createElement) to create the React element virtual DOM
- [`createRoot`](https://react.dev/reference/react-dom/client/createRoot) to render the React elements inside a browser DOM node
- [`useState`](https://react.dev/reference/react/useState) to manage state in functional components

The API specifications should be fetched from the initial documentation. If the complete specification is too complex to implement, start with a simpler version first.

## Your role

Your role is to write code. You do NOT have access to the running app, so you cannot test the code. You MUST rely on me, the user, to test the code.

If I report a bug in your code, after you fix it, you should pause and ask me to verify that the bug is fixed.

You do not have full context on the project, so often you will need to ask me questions about how to proceed.

Don't be shy to ask questions -- I'm here to help you!

If I send you a URL, you MUST immediately fetch its contents and read it carefully, before you do anything else.

## Project Structure

- `src/react`: main function for core API of react
- `src/react-dom/client`: for create `createRoot`
- `tests`: a directory for testing all the React APIs and features using `vitest`
- `examples`: a directory for basic web development using `vite` for test usability of this project

## Environment Setup

### Testing

When running tests, you can use the following command:

```bash
CI=true , npm test
```
