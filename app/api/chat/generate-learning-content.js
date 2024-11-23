export default function GenerateLearningContent(task, creativity, responseFormat) {
    let learningContent = "";

    // 작업에 대한 설명
    if (task == 1) {
        learningContent += "사용자가 요청한 작업은 '코딩'입니다. ";
        if (creativity == 1) {
            learningContent += "창의적이고 새로운 방식으로 코드를 작성하며, 코드의 최적화와 혁신적인 접근 방법을 고려합니다. ";
        } else if (creativity == 2) {
            learningContent += "정확하고 명확한 코딩을 수행하며, 코드의 가독성 및 효율성을 최우선으로 고려합니다. ";
        }
        learningContent += "이 작업에서는 실용적이고 확장 가능한 코드를 작성하는 데 중점을 둡니다. ";
    } else if (task == 2) {
        learningContent += "사용자가 요청한 작업은 '보고서 작성'입니다. ";
        if (creativity == 1) {
            learningContent += "창의적인 아이디어와 방식을 사용하여 보고서를 작성하며, 독창적인 시각을 제공합니다. ";
        } else if (creativity == 2) {
            learningContent += "정확한 정보와 데이터를 바탕으로 보고서를 작성하며, 사실에 기반한 강력한 주장을 전개합니다. ";
        }
        learningContent += "보고서는 명확한 구조를 갖추고, 논리적인 흐름을 유지하면서도 유연성을 발휘해야 합니다. ";
    } else if (task == 3) {
        learningContent += "사용자가 요청한 작업은 '회화 연습'입니다. ";
        if (creativity == 1) {
            learningContent += "창의적이고 유연한 대화를 통해 다양한 상황을 설정하고, 새로운 표현을 시도하며 연습합니다. ";
        } else if (creativity == 2) {
            learningContent += "정확한 문법과 표현을 사용하여 회화 연습을 진행하고, 정교한 언어 구사를 목표로 합니다. ";
        }
        learningContent += "이 작업에서는 다양한 회화 상황을 다루고, 문화적인 차이도 고려하여 대화를 진행할 수 있도록 합니다. ";
    }

    // 답변 형식에 대한 설명
    if (responseFormat == 1) {
        learningContent += "자세한 설명을 제공하여 깊이 있는 이해를 돕습니다. 예시와 함께 세부적인 분석을 통해 학습을 촉진합니다.";
    } else if (responseFormat == 2) {
        learningContent += "간략하고 핵심적인 내용만을 전달하여 빠르게 이해할 수 있도록 합니다.";
    }

    if (task == 3) {
        // 회화 연습 내용 추가
        learningContent += "\n\n추가로 아래의 예시처럼 사용자의 말에 대한 피드백을 주세요:"
        + "\n사용자: How are you?"
        + "\nI'm doing great, thank you! How about you?"
        + "\n\n피드백: 아주 좋은 질문이에요! 'How are you?'는 일상적인 인사로 매우 적합합니다. 'How about you?'처럼 상대방에게도 질문을 덧붙이면 대화가 더욱 자연스러워집니다. 상대방의 상태를 물어보는 것은 친밀감을 높이는 좋은 방법이에요."
        + "\n\n사용자: Hi~"
        + "\nHello~! How's it going?"
        + "\n\n피드백: 'Hi~'는 아주 좋은 인사입니다! 조금 더 자연스러운 표현을 원하시면 'Hello!' 또는 'Hey!'로 시작할 수도 있어요. 상황에 맞는 다양한 인사말을 시도해보세요."
        + "\n\n사용자: Thank you!"
        + "\nYou're welcome!"
        + "\n\n피드백: 'You're welcome!' 외에도 'Anytime!' 또는 'No problem!'과 같은 표현을 사용해보세요. 감사의 표현에 다양한 대답을 준비하는 것도 유용합니다."
        + "\n\n사용자: I'm fine."
        + "\nThat's interesting!"
        + "\n\n피드백: 문법적으로 정확하지만, 좀 더 자연스러운 회화 표현을 사용해보세요. 예를 들어 'I'm good' 또는 'I'm doing well'이 더 자주 사용됩니다."
        + "\n\n사용자: How do you do?"
        + "\nI'm doing well, thank you for asking!"
        + "\n피드백: 'How do you do?'는 처음 만났을 때 자주 사용되는 인사입니다. 좀 더 일반적인 대화에서는 'How are you?'가 더 자연스러울 수 있습니다."
        + "\n\n사용자: What's up?"
        + "\nNot much, how about you?"
        + "\n\n피드백: 'What's up?'은 친구들 사이에서 자주 사용되는 친근한 인사입니다. 상대방에게 질문을 덧붙여 대화를 이어갈 수 있어요. 친구들 사이에서 자주 쓰이는 표현이므로 상황에 맞게 사용하세요.";
    }

    return learningContent;
}