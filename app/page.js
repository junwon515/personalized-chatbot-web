"use client";

import { useState, useRef, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
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
  const [audioUrl, setAudioUrl] = useState(null);
  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);
  
  // 페이지 새로고침 시 경고문 표시
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const confirmationMessage = "변경사항이 저장되지 않을 수 있습니다.";
      event.returnValue = confirmationMessage;
      return confirmationMessage;
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
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    setLoading(true);

    try {
      const response = await axios.post("/api/chat", {
        message: message,
        goal: goal,
        task: task,
        creativity: creativity,
        responseFormat: responseFormat,
        messages: messages,
      });

      const data = response.data;
      const assistantResponse = { role: "assistant", content: data.response };
      setMessages((prevMessages) => [...prevMessages, assistantResponse]);

      if (data.audioBase64) {
        const audioBlob = new Blob([new Uint8Array(Buffer.from(data.audioBase64, 'base64'))], { type: 'audio/mp4' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        const audio = new Audio(audioUrl);
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
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("음성 인식 기능을 지원하지 않는 브라우저입니다.");
      return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = selectedLanguage;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    let finalTranscript = '';

    recognition.start();

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
      handleSendMessage(finalTranscript);
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      finalTranscript = transcript;
      setInput(transcript);
    };

    recognition.onerror = (event) => {
      console.error("음성 인식 오류:", event.error);
    };
  };

  // ReactMarkdown에서 코드 블록을 커스터마이징하여 하이라이팅 적용
  const customRenderers = {
    code: ({ node, inline, className, children }) => {
      const language = className?.replace("language-", "") || "";
      if (inline) {
        return <code className={styles.inlineCode}>{children}</code>;
      }
      return (
        <SyntaxHighlighter
          language={language}
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
              className={`${styles.message} ${msg.role === "user" ? styles.userMessage : styles.botMessage}`}
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