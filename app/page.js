"use client";

import { useState, useRef, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import styles from "./page.module.css";

export default function Home() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "안녕하세요! 무엇을 도와드릴까요?" },
  ]);
  const [input, setInput] = useState("");

  const messagesEndRef = useRef(null);

  // 스크롤을 항상 아래로 유지
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // 간단한 봇 응답 추가
    const botResponse = { sender: "bot", text: "네, 알겠습니다!" };
    setMessages((prevMessages) => [...prevMessages, botResponse]);

    setInput("");
  };

  return (
    <Container
      fluid
      className={styles.container}
    >
      {/* 채팅 메시지 영역 */}
      <div className={styles.chatMessages}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.message} ${
              msg.sender === "user" ? styles.userMessage : styles.botMessage
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력창 (아래 고정) */}
      <Row className={styles.inputRow}>
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
          <Button onClick={handleSendMessage} variant="primary">
            보내기
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
