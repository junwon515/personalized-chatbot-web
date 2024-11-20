"use client";

import { useState, useRef, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useCustomSetting } from './data/client-data';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // GitHub Flavored Markdown (GFM)
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { light  } from 'react-syntax-highlighter/dist/esm/styles/prism'; // 하이라이팅 스타일
import styles from "./page.module.css"; // 외부 스타일

export default function Home() {
  const { goal, task, creativity, responseFormat, messages, setMessages } = useCustomSetting();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // 스크롤을 항상 아래로 유지
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return; // 요청 중에는 메시지 전송을 막음

    const userMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    setLoading(true); // 요청 시작 시 로딩 상태로 변경

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          goal: goal,
          task: task,
          creativity: creativity,
          responseFormat: responseFormat,
          messages: messages, // 기존 메시지들도 함께 보내기
        }),
      });

      const data = await response.json();
      const assistantResponse = { role: "assistant", content: data.response };
      setMessages((prevMessages) => [...prevMessages, assistantResponse]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false); // 응답을 받았으면 로딩 상태 종료
    }
  };

  // ReactMarkdown에서 코드 블록을 커스터마이징하여 하이라이팅 적용
  const customRenderers = {
    // ReactMarkdown에서 `pre`와 `code`에 대한 스타일 및 구문 강조 적용
    code: ({ node, inline, className, children }) => {
      const language = className?.replace("language-", "") || "";
      if (inline) {
        return <code className={styles.inlineCode}>{children}</code>;
      }
      return (
        <SyntaxHighlighter
          language={language}
          style={light} // 하이라이팅 스타일
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      );
    },
    pre: ({ children }) => <pre className={styles.codeBlock}>{children}</pre>,
  };

  return (
    <Container fluid className={styles.container}>
      {/* 채팅 메시지 영역 */}
      <div className={styles.chatBackground}>
        <div className={`${styles.chatMessages} max-min-width`}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`${styles.message} ${
                msg.role === "user" ? styles.userMessage : styles.botMessage
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={customRenderers}
                className={styles.reactMarkdown}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 입력창 (아래 고정) */}
      <div className={styles.input}>
        <Row className="max-min-width">
          <Col>
            <Form.Control
              type="text"
              placeholder="메시지를 입력하세요..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
            />
          </Col>
          <Col xs="auto">
            <Button onClick={handleSendMessage} variant="primary" disabled={loading}>
              {loading ? "대기 중..." : "보내기"} {/* 로딩 중 메시지 변경 */}
            </Button>
          </Col>
        </Row>
      </div>
    </Container>
  );
}