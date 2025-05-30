import React, { useEffect, useState } from 'react';
import './App.css';

const COOLDOWN_TIME = 10; // 冷却时间（秒）

const App = () => {
  const [questionLibrary, setQuestionLibrary] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [clickedQuestions, setClickedQuestions] = useState(new Set());
  const [canClick, setCanClick] = useState(true);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [lastSearchTime, setLastSearchTime] = useState(null);

  useEffect(() => {
    // 从 localStorage 加载今日数据
    const today = new Date().toLocaleDateString();
    const storedData = localStorage.getItem(`clickedQuestions_${today}`);
    const storedLastSearchTime = localStorage.getItem(`lastSearchTime_${today}`);
    
    if (storedData) {
      setClickedQuestions(new Set(JSON.parse(storedData)));
    }
    
    if (storedLastSearchTime) {
      const lastTime = new Date(storedLastSearchTime);
      const now = new Date();
      const timeDiff = Math.floor((now - lastTime) / 1000); // 转换为秒
      
      if (timeDiff < COOLDOWN_TIME) {
        // 如果距离上次搜索时间小于冷却时间，设置剩余冷却时间
        setCanClick(false);
        setCooldownTime(COOLDOWN_TIME - timeDiff);
        setLastSearchTime(lastTime);
      }
    }
    
    loadQuestions();
  }, []);

  // 处理冷却时间计时器
  useEffect(() => {
    let timer;
    if (cooldownTime > 0) {
      timer = setInterval(() => {
        setCooldownTime(prev => {
          if (prev <= 1) {
            setCanClick(true);
            // setLastSearchTime(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldownTime]);

  const loadQuestions = async () => {
    try {
      const questionFiles = ["questions.json", "questions2.json", "questions3.json"];
      const randomFile = questionFiles[Math.floor(Math.random() * questionFiles.length)];
      const response = await fetch(randomFile);
      const data = await response.json();
      setQuestionLibrary(data);
      // 初始化第一个问题
      initNextQuestion(data);
    } catch (error) {
      console.error("加载问题库失败:", error);
    }
  };

  const initNextQuestion = (library) => {
    const today = new Date().toLocaleDateString();
    // 过滤掉今天已经点击过的问题
    const availableQuestions = library.filter(q => !clickedQuestions.has(q));
    
    if (availableQuestions.length === 0) {
      setCurrentQuestion('今日问题已全部完成！');
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    setCurrentQuestion(availableQuestions[randomIndex]);
  };

  const handleQuestionClick = (question) => {
    if (question === '今日问题已全部完成！' || !canClick) return;
    
    const now = new Date();
    const today = now.toLocaleDateString();
    
    // 开始冷却
    setCanClick(false);
    setCooldownTime(COOLDOWN_TIME);
    setLastSearchTime(now);
    
    // 保存最后搜索时间到 localStorage
    localStorage.setItem(`lastSearchTime_${today}`, now.toISOString());
    
    // 更新已点击问题集合
    const newClickedQuestions = new Set([...clickedQuestions, question]);
    setClickedQuestions(newClickedQuestions);
    
    // 保存到 localStorage
    localStorage.setItem(`clickedQuestions_${today}`, JSON.stringify([...newClickedQuestions]));
    
    // 更新搜索历史
    setSearchHistory([...searchHistory, question]);
    
    // 打开搜索
    const encoded = encodeURIComponent(question);
    window.open(
      `https://cn.bing.com/search?q=${encoded}&qs=n&form=QBRE`,
      "_blank"
    );

    // 加载下一个问题
    initNextQuestion(questionLibrary);
  };

  return (
    <div className="container">
      <h1>Bing Auto Search</h1>
      <div className="question-container">
        <div 
          className={`current-question ${!canClick ? 'disabled' : ''}`}
          onClick={() => handleQuestionClick(currentQuestion)}
        >
          {currentQuestion}
        </div>
        {!canClick && (
          <div className="cooldown-timer">
            请等待 {cooldownTime} 秒后继续
          </div>
        )}
      </div>
      <div className="search-log">
        上一次搜索时间：<strong>{searchHistory.length > 0 ? lastSearchTime.toLocaleString() : '无'}</strong>
      </div>
      <div className="search-count">
        今日搜索次数：<strong>{searchHistory.length}</strong>
      </div>
      <div className="remaining-count">
        剩余问题数：<strong>{questionLibrary.length - clickedQuestions.size}</strong>
      </div>
    </div>
  );
};

export default App;