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

    if (!message || task === undefined || creativity === undefined || responseFormat === undefined) {
        return NextResponse.json({ message: '요청 데이터가 잘못되었습니다.' }, { status: 400 });
    }

    const learningMessage = generateLearningContent(task, creativity, responseFormat);

    isProcessing = true;

    try {
        // `system` 메시지 배열을 동적으로 생성
        const chatMessages = [
            ...(goal && goal.trim() !== "" ? [{ role: 'system', content: `목표: ${goal || '알 수 없음'}}` }] : []),
            ...(learningMessage ? [{ role: 'system', content: learningMessage }] : []),
            ...messages,
            { role: 'user', content: message },
        ];

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: chatMessages,
            max_tokens: responseFormat === 0 ? 2500 : responseFormat === 1 ? 5000 : 1000,
            temperature: creativity === 0 ? 0.5 : creativity === 1 ? 1 : 0,
        });

        const assistantResponse = response.choices[0].message.content;

        console.log('Request Data:', { message, goal, task, creativity, responseFormat, messages });
        console.log(learningMessage);
        console.log('Assistant Response:', assistantResponse);

        return NextResponse.json({ response: assistantResponse }, { status: 200 });
    } catch (error) {
        console.error('OpenAI API Error:', error);
        return NextResponse.json({ message: '서버 오류가 발생했습니다.', error: error.message }, { status: 500 });
    } finally {
        isProcessing = false;
    }
}

function generateLearningContent(task, creativity, responseFormat) {
    let learningContent = "";

    // 작업에 대한 설명
    if (task == 1) {
        learningContent += "사용자가 요청한 작업은 '코딩'입니다. ";
        if (creativity == 1) {
            learningContent += "창의적이고 새로운 방식으로 코드를 작성하며, ";
        } else if (creativity == 2) {
            learningContent += "정확하고 명확한 코딩을 수행하며, ";
        }
    } else if (task == 2) {
        learningContent += "사용자가 요청한 작업은 '보고서 작성'입니다. ";
        if (creativity == 1) {
            learningContent += "창의적인 아이디어와 방식을 사용하여 보고서를 작성하며, ";
        } else if (creativity == 2) {
            learningContent += "정확한 정보와 데이터를 바탕으로 보고서를 작성하며, ";
        }
    } else if (task == 3) {
        learningContent += "사용자가 요청한 작업은 '회화 연습'입니다. ";
        if (creativity == 1) {
            learningContent += "창의적이고 유연한 대화를 통해 회화 연습을 진행하며, ";
        } else if (creativity == 2) {
            learningContent += "정확한 문법과 표현을 사용하여 회화 연습을 진행하고, ";
        }
    }

    // 답변 형식에 대한 설명
    if (responseFormat == 1) {
        learningContent += "자세한 설명을 제공하여 깊이 있는 이해를 돕습니다.";
    } else if (responseFormat == 2) {
        learningContent += "간략하고 핵심적인 내용만을 전달합니다.";
    }

    if (task == 3) {
        // 회화 연습 내용 추가
        learningContent += "\n\n추가로 아래의 예시 처럼 사용자의 말에 대한 피드백을 주세요"
        + "\n사용자: How are you?"
        + "\nI'm doing great, thank you! How about you?"
        + "\n\n피드백: 아주 좋은 질문이에요! 'How are you?'는 일상적인 인사로 매우 적합합니다. 'How about you?'처럼 상대방에게도 질문을 덧붙이면 더 자연스러운 대화가 됩니다."
        + "\n\n사용자: Hi~"
        + "\nHello~! How’s it going?"
        + "\n\n피드백: 'Hi~'는 아주 좋은 인사입니다! 조금 더 자연스러운 표현을 원하시면 'Hello!' 또는 'Hey!'로 시작할 수도 있어요."
        + "\n\n사용자: Thank you!"
        + "\nYou're welcome!"
        + "\n\n피드백: 'You're welcome!' 외에도 'Anytime!' 또는 'No problem!'과 같은 표현을 사용해보세요."
        + "\n\n사용자: I'm fine."
        + "\nThat's interesting!"
        + "\n\n피드백: 문법적으로 정확하지만, 좀 더 자연스러운 회화 표현을 사용해보세요!"
        + "\n\n사용자: How do you do?"
        + "\nI'm doing well, thank you for asking!"
        + "\n피드백: 'How do you do?'는 처음 만났을 때 자주 사용되는 인사입니다. 상황에 맞게 'How are you?'로 대체할 수도 있습니다."
        + "\n\n사용자: What's up?"
        + "\nNot much, how about you?"
        + "\n\n피드백: 'What's up?'은 친구들 사이에서 자주 사용되는 친근한 인사입니다. 상대방에게 질문을 덧붙여 대화를 이어갈 수 있어요."
    }

    return learningContent;
}