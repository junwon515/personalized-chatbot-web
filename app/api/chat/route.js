import { NextResponse } from 'next/server';
import OpenAI from 'openai'; // OpenAI 패키지 기본 내보내기 사용

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

let isProcessing = false;

export async function POST(req) {
    if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json({ message: 'OpenAI API 키가 설정되지 않았습니다.' }, { status: 500 });
    }

    if (isProcessing) {
        return NextResponse.json({ message: '요청을 처리 중입니다. 잠시 후 다시 시도해주세요.' }, { status: 429 });
    }

    const { message, goal, task, creativity, responseFormat, messages } = await req.json();

    if (!message || !goal || !task || !creativity || !responseFormat || !messages) {
        return NextResponse.json({ message: '요청 데이터가 잘못되었습니다.' }, { status: 400 });
    }

    isProcessing = true;

    try {
        const chatMessages = [
            { role: 'system', content: `목표: ${goal}` },
            // { role: 'system', content: `작업: ${task}` },
            // { role: 'system', content: `창의성: ${creativity}` },
            // { role: 'system', content: `답 형식: ${responseFormat}` },
            ...messages,
            { role: 'user', content: message },
        ];
        
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: chatMessages,
            max_tokens: responseFormat === 0 ? 1000 : responseFormat === 1 ? 5000 : 500,
            temperature: creativity === 0 ? 0.5 : creativity === 1 ? 1 : 0,
        });
        
        const assistantResponse = response.choices[0].message.content;
        
        console.log('Request Data:', { message, goal, task, creativity, responseFormat, messages });
        console.log('Assistant Response:', assistantResponse);
        
        return NextResponse.json({ response: assistantResponse }, { status: 200 });
    } catch (error) {
        console.error('OpenAI API Error:', error);
        return NextResponse.json({ message: '서버 오류가 발생했습니다.', error: error.message }, { status: 500 });
    } finally {
        isProcessing = false;
    }
}