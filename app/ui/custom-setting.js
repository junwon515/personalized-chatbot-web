'use client';

import { Form, InputGroup, Container, Row, Col } from 'react-bootstrap';
import { useCustomSetting } from '../data/client-data';
import styles from './custom-setting.module.css';

export default function CustomSetting() {
    const { goal, setGoal, task, setTask, creativity, setCreativity, responseFormat, setResponseFormat } = useCustomSetting();
    
    return (
        <div className={styles.page}>
            <Container className="max-min-width">
                <Row>
                    <Col className="d-flex align-items-center">
                        <InputGroup className={styles.inputGroup}>
                        <InputGroup.Text className={styles["label-goal"]}>
                            목표
                        </InputGroup.Text>
                        <Form.Control
                            aria-label="Default"
                            aria-describedby="inputGroup-sizing-default"
                            className={styles.select}
                            placeholder="목표를 입력하세요"
                            value={goal} // 목표 상태 값을 여기에 반영
                            onChange={(e) => setGoal(e.target.value)} // 값이 변경될 때마다 상태 업데이트
                        />
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col className="d-flex align-items-center">
                        <InputGroup className={styles.inputGroup}>
                        <InputGroup.Text className={styles["label-task"]}>
                            작업
                        </InputGroup.Text>
                        <Form.Select
                            value={task} // 작업 상태 값을 여기에 반영
                            onChange={(e) => setTask(e.target.value)} // 값이 변경될 때마다 상태 업데이트
                        >
                            <option value="0">기본</option>
                            <option value="1">코딩</option>
                            <option value="2">보고서 작성</option>
                            <option value="3">회화 연습</option>
                        </Form.Select>
                        </InputGroup>
                    </Col>
                    <Col className="d-flex align-items-center">
                        <InputGroup className={styles.inputGroup}>
                        <InputGroup.Text className={styles["label-creativity"]}>
                            창의성
                        </InputGroup.Text>
                        <Form.Select
                            value={creativity} // 창의성 상태 값을 여기에 반영
                            onChange={(e) => setCreativity(e.target.value)} // 값이 변경될 때마다 상태 업데이트
                        >
                            <option value="0">기본</option>
                            <option value="1">창의적</option>
                            <option value="2">정확성</option>
                        </Form.Select>
                        </InputGroup>
                    </Col>
                    <Col className="d-flex align-items-center">
                        <InputGroup className={styles.inputGroup}>
                        <InputGroup.Text className={styles["label-response"]}>
                            답 형식
                        </InputGroup.Text>
                        <Form.Select
                            value={responseFormat} // 답 형식 상태 값을 여기에 반영
                            onChange={(e) => setResponseFormat(e.target.value)} // 값이 변경될 때마다 상태 업데이트
                        >
                            <option value="0">기본</option>
                            <option value="1">자세히</option>
                            <option value="2">간략히</option>
                        </Form.Select>
                        </InputGroup>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}