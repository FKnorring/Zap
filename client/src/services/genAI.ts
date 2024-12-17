// import the Genkit and Google AI plugin libraries
import { gemini15Flash, googleAI } from '@genkit-ai/googleai';
import { Genkit } from 'genkit';

// configure a Genkit instance
const ai = new Genkit({
  plugins: [googleAI()],
  model: gemini15Flash, // set default model
});

const helloFlow = ai.defineFlow('helloFlow', async (name) => {
  // make a generation request
  const { text } = await ai.generate(`Hello Gemini, my name is ${name}`);
  console.log(text);
});

export { helloFlow };