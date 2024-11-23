'use client';

import { Form, InputGroup, Container, Row, Col, Dropdown } from 'react-bootstrap';
import { useCustomSetting } from '../data/client-data';
import styles from './custom-setting.module.css';

export default function CustomSetting() {
    const { goal, setGoal, task, setTask, creativity, setCreativity, responseFormat, setResponseFormat, selectedLanguage, setSelectedLanguage } = useCustomSetting();
    const supportedLanguages = [
        { code: "af-ZA", label: "Afrikaans (South Africa)" },
        { code: "sq-AL", label: "Shqip (Shqipëri)" },
        { code: "ar-SA", label: "العربية (المملكة العربية السعودية)" },
        { code: "bn-IN", label: "বাংলা (ভারত)" },
        { code: "ca-ES", label: "Català (Espanya)" },
        { code: "hr-HR", label: "Hrvatski (Hrvatska)" },
        { code: "cs-CZ", label: "Čeština (Česká republika)" },
        { code: "da-DK", label: "Dansk (Danmark)" },
        { code: "nl-NL", label: "Nederlands (Nederland)" },
        { code: "en-US", label: "English (United States)" },
        { code: "en-GB", label: "English (United Kingdom)" },
        { code: "fr-FR", label: "Français (France)" },
        { code: "de-DE", label: "Deutsch (Deutschland)" },
        { code: "el-GR", label: "Ελληνικά (Ελλάδα)" },
        { code: "hi-IN", label: "हिन्दी (भारत)" },
        { code: "it-IT", label: "Italiano (Italia)" },
        { code: "ja-JP", label: "日本語 (日本)" },
        { code: "ko-KR", label: "한국어 (대한민국)" },
        { code: "pl-PL", label: "Polski (Polska)" },
        { code: "pt-PT", label: "Português (Portugal)" },
        { code: "ru-RU", label: "Русский (Россия)" },
        { code: "es-ES", label: "Español (España)" },
        { code: "tr-TR", label: "Türkçe (Türkiye)" },
        { code: "zh-CN", label: "中文 (简体)" },
        { code: "zh-TW", label: "中文 (繁體)" },
    ];

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
                    <Col className="d-flex align-items-center" xs="auto">
                        {/* 언어 선택 드롭다운 */}
                        <Dropdown onSelect={(lang) => setSelectedLanguage(lang)}>
                        <Dropdown.Toggle variant="secondary">
                            {supportedLanguages.find((lang) => lang.code === selectedLanguage)?.label || "언어 선택"}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {supportedLanguages.map((language) => (
                            <Dropdown.Item key={language.code} eventKey={language.code}>
                                {language.label}
                            </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                        </Dropdown>
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