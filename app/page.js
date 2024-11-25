'use client';

import { useState, useRef, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { AiFillAudio, AiOutlineAudio } from 'react-icons/ai';
import axios from 'axios';

import { useCustomSetting } from './data/client-data';
import styles from "./page.module.css";

export default function Home() {
  const { goal, task, creativity, responseFormat, selectedLanguage } = useCustomSetting();

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);
  
  // 페이지 새로고침 시 경고문 표시
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.returnValue = "변경사항이 저장되지 않을 수 있습니다.";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // 스크롤을 항상 아래로 유지
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 메시지 전송
  const handleSendMessage = async (message) => {
    if (!message.trim() || loading) return;

    const userMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await axios.post("/api/chat", {
        message,
        goal,
        task,
        creativity,
        responseFormat,
        messages,
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);

      if (data.audioBase64) {
        const audioBlob = new Blob(
          [new Uint8Array(Buffer.from(data.audioBase64, "base64"))],
          { type: "audio/mp4" }
        );
        const audio = new Audio(URL.createObjectURL(audioBlob));
        audio.play();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  // 음성 인식 시작
  const startListening = () => {
    const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("음성 인식 기능을 지원하지 않는 브라우저입니다.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = selectedLanguage;
    recognition.interimResults = true;

    let finalTranscript = '';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
      setIsListening(false);
      handleSendMessage(finalTranscript);
    };
    recognition.onresult = (event) => {
      finalTranscript = event.results[0][0].transcript;
      setInput(finalTranscript);
    };
    recognition.onerror = (event) =>
      console.error("음성 인식 오류:", event.error);

    recognition.start();
  };

  // ReactMarkdown에서 코드 블록을 커스터마이징하여 하이라이팅 적용
  const customRenderers = {
    code({ inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter language={match[1]} PreTag="div" {...props}>
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
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
                msg.role === "user"
                  ? styles.userMessage
                  : styles.botMessage
              }`}
            >
              {msg.role === "user" ? (
                msg.content
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={customRenderers}
                  className={styles.reactMarkdown}
                >
                  {msg.content}
                </ReactMarkdown>
              )}
            </div>
          ))}
          <div style={{ flex: "0 0 1px" }} ref={messagesEndRef} />
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
                if (e.key === "Enter") handleSendMessage(input);
              }}
            />
          </Col>
          <Col xs="auto">
            <Button
              variant="secondary"
              onClick={startListening}
              disabled={loading || isListening}
            >
              {isListening ? <AiFillAudio size={24} /> : <AiOutlineAudio size={24} />}
            </Button>
          </Col>
          <Col xs="auto">
            <Button onClick={() => handleSendMessage(input)} variant="primary" disabled={loading}>
              {loading ? "대기 중..." : "보내기"}
            </Button>
          </Col>
        </Row>
      </div>
    </Container>
  );
}