'use client';

import { useState } from 'react';
import { Form, InputGroup, Dropdown, DropdownButton, Container, Row, Col } from 'react-bootstrap';
import styles from "./custom-setting.module.css";

export default function CustomSetting() {
  const [goal, setGoal] = useState('');
  const [task, setTask] = useState('');

  return (
    <div className={styles.page}>
        <Container>
            <Row>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="inputGroup-sizing-default">
                    목표
                    </InputGroup.Text>
                    <Form.Control
                    aria-label="Default"
                    aria-describedby="inputGroup-sizing-default"
                    />
                </InputGroup>
            </Row>
            <Row>
                <Col>
                    <DropdownButton id="dropdown-basic-button" title="작업">
                        <Dropdown.Item href="">코딩</Dropdown.Item>
                        <Dropdown.Item href="">보고서 작성</Dropdown.Item>
                        <Dropdown.Item href="">회화 연습</Dropdown.Item>
                    </DropdownButton>
                </Col>
                <Col>
                    <DropdownButton id="dropdown-basic-button" title="창의성">
                        <Dropdown.Item href="">기본</Dropdown.Item>
                        <Dropdown.Item href="">창의적</Dropdown.Item>
                        <Dropdown.Item href="">정확히</Dropdown.Item>
                    </DropdownButton>
                </Col>
                <Col>
                    <DropdownButton id="dropdown-basic-button" title="답 형식">
                        <Dropdown.Item href="">기본</Dropdown.Item>
                        <Dropdown.Item href="">자세히</Dropdown.Item>
                        <Dropdown.Item href="">간단히</Dropdown.Item>
                    </DropdownButton>
                </Col>
            </Row>
        </Container>
    </div>
  );
}
