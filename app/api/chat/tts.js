import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


export default async function TTS(input) {
    const response = await openai.audio.speech.create({
        model: "tts-1",
        voice: "nova",
        input: input,
    });

    const buffer = Buffer.from(await response.arrayBuffer());    
    const base64Audio = buffer.toString('base64');

    return base64Audio;
}