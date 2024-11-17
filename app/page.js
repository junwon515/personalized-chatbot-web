"use client";

import { useState, useRef, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useCustomSetting } from './data/client-data';
import styles from "./page.module.css";

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

    setInput("");
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
              {msg.content}
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