import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [questionLibrary, setQuestionLibrary] = useState([]);
  const [dailyQuestions, setDailyQuestions] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [customQuestion, setCustomQuestion] = useState('');

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const questionFiles = ["questions.json", "questions2.json", "questions3.json"];
      const randomFile = questionFiles[Math.floor(Math.random() * questionFiles.length)];
      const response = await fetch(randomFile);
      const data = await response.json();
      setQuestionLibrary(data);
      // 初始化每日问题
      initDailyQuestions(data);
    } catch (error) {
      console.error("加载问题库失败:", error);
    }
  };

  const initDailyQuestions = (library) => {
    const pool = [...new Set(library)];
    const shuffled = shuffleArray(pool);
    setDailyQuestions(shuffled.slice(0, 10));
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const randomValues = new Uint32Array(1);
      crypto.getRandomValues(randomValues);
      const j = randomValues[0] % (i + 1);
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleSearch = question => {
    if (searchHistory.includes(question)) {
      alert("该问题今日已搜索");
      return;
    }
    setSearchHistory([...searchHistory, question]);
    const encoded = encodeURIComponent(question);
    window.open(
      `https://cn.bing.com/search?q=${encoded}&qs=n&form=QBRE`,
      "_blank"
    );
    setCustomQuestion('');
  };

  return (
    <div className="container">
      <h1>Bing Auto Search</h1>
      <ul id="questionList">
        {dailyQuestions.map((question, index) => (
          <li
            key={index}
            onClick={() => handleSearch(question)}
          >
            {question}
          </li>
        ))}
      </ul>
      <div className="search-log">
        上一次搜索时间：{searchHistory.length > 0 ? new Date().toLocaleString() : '无'}
      </div>
      <div className="search-count">
        今日搜索次数：{searchHistory.length}
      </div>
    </div>
  );
};

export default App;