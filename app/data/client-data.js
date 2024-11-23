'use client';

import { createContext, useContext, useState } from 'react';

// Context 생성
const CustomSettingContext = createContext();

// Context Provider 컴포넌트
export const CustomSettingProvider = ({ children }) => {
  const [goal, setGoal] = useState('');
  const [task, setTask] = useState('0');
  const [creativity, setCreativity] = useState('0');
  const [responseFormat, setResponseFormat] = useState('0');
  const [messages, setMessages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('ko-KR'); // 언어 설정

  return (
    <CustomSettingContext.Provider
      value={{
        goal,
        setGoal,
        task,
        setTask,
        creativity,
        setCreativity,
        responseFormat,
        setResponseFormat,
        messages,
        setMessages,
        selectedLanguage,
        setSelectedLanguage
      }}
    >
      {children}
    </CustomSettingContext.Provider>
  );
};

// Context 값 가져오는 훅
export const useCustomSetting = () => {
  return useContext(CustomSettingContext);
};