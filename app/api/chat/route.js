import { NextResponse } from 'next/server';
import OpenAI from 'openai';

import GenerateLearningContent from './generate-learning-content';
import TTS from './tts';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
    const { OPENAI_API_KEY } = process.env;

    // OpenAI API 키가 없으면 오류 응답
    if (!OPENAI_API_KEY) {
        return NextResponse.json({ message: 'OpenAI API 키가 설정되지 않았습니다.' }, { status: 500 });
    }

    const { message, goal, task, creativity, responseFormat, messages } = await req.json();

    // 요청 데이터 검증
    if (!message || task === undefined || creativity === undefined || responseFormat === undefined) {
        return NextResponse.json({ message: '요청 데이터가 잘못되었습니다.' }, { status: 400 });
    }

    // learningMessage 생성
    const learningMessage = GenerateLearningContent(task, creativity, responseFormat);

    try {
        // ChatGPT 메시지 생성
        const chatMessages = [
            ...(goal ? [{ role: 'system', content: `목표: ${goal}` }] : []),
            ...(learningMessage ? [{ role: 'system', content: learningMessage }] : []),
            ...messages,
            { role: 'user', content: message },
        ];

        // OpenAI API 호출
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: chatMessages,
            max_tokens: responseFormat === 0 ? 2500 : responseFormat === 1 ? 5000 : 1000,
            temperature: creativity === 0 ? 0.5 : creativity === 1 ? 1 : 0,
        });

        const assistantResponse = response.choices[0].message.content;

        // task가 3일 경우에만 TTS 호출
        const ttsResponse = (task === 3)
            ? await TTS(assistantResponse.split(/피드백:/)[0] || assistantResponse)
            : null;

        return NextResponse.json({ response: assistantResponse, audioBase64: ttsResponse }, { status: 200 });

    } catch (error) {
        console.error('OpenAI API Error:', error);
        return NextResponse.json({ message: '서버 오류가 발생했습니다.', error: error.message }, { status: 500 });
    }
}