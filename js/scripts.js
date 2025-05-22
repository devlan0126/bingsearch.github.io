let QUESTION_LIBRARY = [];

async function loadQuestions() {
    try {
        const questionFiles = ["questions.json", "questions2.json","questions3.json"];
        const randomFile = questionFiles[Math.floor(Math.random() * questionFiles.length)]; 
        const response = await fetch(randomFile);
        QUESTION_LIBRARY = await response.json();
        // 初始化存储系统
        // initStorage();
        // 渲染问题列表
        renderQuestions();
    } catch (error) {
        console.error("加载问题库失败:", error);
        // 使用默认问题作为后备
        QUESTION_LIBRARY = [
            "什么是量子计算？",
            "什么是人工智能？",
            // ... 其他默认问题 ...
        ];
        // initStorage();
        renderQuestions();
    }
}

// 初始化存储系统
function initStorage() {
    const today = new Date().toISOString().split("T")[0];
    let data = localStorage.getItem("searchData")
        ? JSON.parse(localStorage.getItem("searchData"))
        : {
            date: today,
            dailyQuestions: [],
            searched: [],
            shown: [], // 新增字段存储已展示问题
        };
    // 每日重置逻辑
    if (data.date !== today) {
        // 从总库随机抽取50个问题（去重）
        const pool = [...new Set(QUESTION_LIBRARY)];
        const list = shuffleArray(pool);
        data.dailyQuestions = list.slice(0, 10); // 取前50个问题
        data.searched = [];
        data.shown = [];
        data.date = today;
        localStorage.setItem("searchData", JSON.stringify(data));
        localStorage.setItem("searchHistory", JSON.stringify([]));
    } else {
        // 当日加载，需要剔除已搜索问题
        const pool = [
            ...new Set(
                QUESTION_LIBRARY.filter((q) => !data.dailyQuestions.includes(q))
            ),
        ];
        const list = shuffleArray(pool);
        const cl = list.slice(0, 10);
        const dailyQuestions = data.dailyQuestions.concat(cl);
        localStorage.setItem(
            "searchData",
            JSON.stringify({
                date: today,
                dailyQuestions,
                searched: [],
                shown: [], // 新增字段存储已展示问题
            })
        );
        data.dailyQuestions = cl;
    }
    return data;
}

// 渲染问题列表
function renderQuestions() {
    const { dailyQuestions } = initStorage();
    const ul = document.getElementById("questionList");
    ul.innerHTML = "";
    ul.style.counterReset = "item";

    dailyQuestions.forEach((question, index) => {
        const li = document.createElement("li");
        li.textContent = question;
        li.style.cursor = "pointer";
        li.style.padding = "8px";

        li.addEventListener("click", () => {
            const customInput = document.getElementById("customQuestion");
            const prefixes = [
                "请问 ",
                "",
                "帮我查一下 ",
                "我想了解 ",
                "请教一下 ",
                "关于",
                "详细解释一下 ",
            ];
            const randomPrefix =
                prefixes[Math.floor(Math.random() * prefixes.length)];
            customInput.value = randomPrefix + question;

            // 标记为已展示
            const data = initStorage();
            if (!data.shown.includes(question)) {
                data.shown.push(question);
                localStorage.setItem("searchData", JSON.stringify(data));
            }

            // 直接调用搜索处理函数
            handleSearch();
        });

        ul.appendChild(li);
    });
}

// 搜索处理
function handleSearch() {
    const data = initStorage();
    const customInput = document.getElementById("customQuestion");
    let question = customInput.value.trim();

    // 优先使用下拉框选择
    if (!question) {
        const select = document.getElementById("questionList");
        question = select.options[select.selectedIndex]?.value;
    }

    // 验证输入
    if (!question) {
        alert("请选择或输入问题");
        return;
    }

    // 检查重复
    if (data.searched.includes(question)) {
        alert("该问题今日已搜索");
        return;
    }

    // 记录搜索
    data.searched.push(question);

    // 新增：记录搜索历史
    const searchHistory = JSON.parse(
        localStorage.getItem("searchHistory") || "[]"
    );
    searchHistory.push({
        question,
        time: new Date().toISOString(),
    });
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

    localStorage.setItem("searchData", JSON.stringify(data));

    // 更新今日搜索次数
    const todayCount = searchHistory.length;
    document.getElementById(
        "searchCount"
    ).textContent = `今日搜索次数：${todayCount}`;

    // 记录搜索时间
    const searchTime = new Date().toLocaleString();
    localStorage.setItem("lastSearchTime", searchTime);
    document.getElementById(
        "searchLog"
    ).textContent = `上一次搜索时间：${searchTime}`;

    // 执行搜索
    const encoded = encodeURIComponent(question);
    window.open(
        `https://cn.bing.com/search?q=${encoded}&qs=n&form=QBRE`,
        "_blank"
    );

    // 清除输入并刷新列表
    customInput.value = "";
    renderQuestions();
}

// 实用函数：随机打乱数组
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const randomValues = new Uint32Array(1);
        crypto.getRandomValues(randomValues);
        const j = randomValues[0] % (i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 初始化时尝试显示上次搜索时间
function initLastSearchTime() {
    const lastSearchTime = localStorage.getItem("lastSearchTime");
    const searchHistory = JSON.parse(
        localStorage.getItem("searchHistory") || "[]"
    );
    if (lastSearchTime) {
        document.getElementById(
            "searchLog"
        ).textContent = `上一次搜索时间：${lastSearchTime}`;
    }
    const data = initStorage();
    document.getElementById(
        "searchCount"
    ).textContent = `今日搜索次数：${searchHistory.length}`;
}

// 注册Service Worker
if ('serviceWorker' in navigator) {
    console.log('### ServiceWorker支持 ###'); // Debug informati
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('ServiceWorker注册成功:', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker注册失败:', error);
            });
    });
}

// 初始化渲染
loadQuestions();
initLastSearchTime();