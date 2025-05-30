import json

# 定义类别和对应的问题模板
categories = {
    "科技": ["什么是{}？", "如何用{}解决问题？", "{}的未来趋势？", "{}的工作原理是什么？", "{}有哪些应用场景？", "{}的优缺点是什么？", "{}和{}有什么区别？", "如何学习{}？"],
    "历史": ["{}事件的影响？", "谁领导了{}？", "{}时期的转折点？", "{}发生的原因是什么？", "{}有哪些鲜为人知的故事？", "{}对现代社会有什么启示？", "{}前后有什么重大变化？"],
    "健康": ["如何预防{}？", "{}的好处有哪些？", "怎样治疗{}？", "{}的症状有哪些？", "{}的饮食注意事项有哪些？", "{}的运动建议有哪些？", "{}和{}有关系吗？"],
    "美食": ["如何制作{}？", "{}的起源是哪里？", "{}有什么独特的做法？", "{}的营养价值如何？", "{}搭配什么食材更美味？", "{}有哪些变种？", "如何改良{}？"],
    "旅游": ["{}有什么景点？", "去{}旅游需要注意什么？", "什么时候去{}最合适？", "{}有哪些特色美食？", "{}的最佳旅游路线是什么？", "{}周边有什么值得去的地方？", "去{}旅游预算大概多少？"],
    "教育": ["如何学好{}？", "{}的教学方法有哪些？", "{}的重要性是什么？", "学习{}有什么技巧？", "{}的发展趋势如何？", "{}适合自学吗？", "学习{}需要哪些资源？"],
    "艺术": ["{}的风格特点是什么？", "谁是著名的{}艺术家？", "{}的创作过程是怎样的？", "{}有哪些经典作品？", "如何欣赏{}？", "{}对艺术史有什么贡献？", "{}的现代发展如何？"],
    "金融": ["{}的投资策略是什么？", "{}的风险有哪些？", "如何理解{}？", "{}的市场前景如何？", "{}的影响因素有哪些？", "{}和{}哪个更适合投资？", "投资{}需要注意什么？"],
    "体育": ["如何训练{}技能？", "{}的比赛规则是什么？", "{}有哪些著名运动员？", "{}的历史起源是什么？", "参加{}比赛需要准备什么？", "{}的未来发展趋势如何？"],
    "环保": ["如何减少{}的污染？", "{}对环境有什么影响？", "有哪些可持续的{}方法？", "{}的环保替代品有哪些？", "如何推广{}的环保理念？"],
    "心理学": ["什么是{}？", "{}的理论基础是什么？", "如何应用{}？", "{}的典型案例有哪些？", "{}的研究方法有哪些？", "{}与其他心理学流派的关系？"],
    "商业": ["如何创办{}业务？", "{}的市场分析怎么做？", "{}的盈利模式有哪些？", "如何推广{}业务？", "{}的竞争对手分析？", "{}的未来发展趋势？"],
    "科技趋势": ["{}将如何改变未来？", "{}的最新发展是什么？", "{}面临哪些挑战？", "如何投资{}领域？", "{}的伦理问题有哪些？", "{}与可持续发展的关系？"],
    "生活技巧": ["如何高效完成{}？", "{}的小窍门有哪些？", "{}的最佳实践是什么？", "如何改进{}方法？", "{}的常见误区有哪些？", "{}的专业建议？"],
    "名人": ["{}的生平事迹？", "{}的主要成就是什么？", "{}对社会的贡献？", "{}有哪些名言？", "{}的成长经历？", "{}的趣闻轶事？", "{}对后世的影响？"],
    "军事": ["{}的战略意义？", "{}的战术特点？", "{}在战争中的作用？", "{}的发展历程？", "{}的武器装备？", "{}的著名战役？"],
    "法律": ["{}的法律规定？", "如何遵守{}法规？", "{}的法律案例？", "{}的法律责任？", "{}的司法解释？", "{}的立法背景？"],
    "医学": ["{}的诊断方法？", "{}的治疗方案？", "{}的预防措施？", "{}的病理机制？", "{}的临床表现？", "{}的研究进展？"],
    "农业": ["{}的种植技术？", "{}的养殖方法？", "{}的市场前景？", "{}的病虫害防治？", "{}的品种改良？", "{}的机械化生产？"]
}

# 定义每个类别的主题词
topics = {
    "科技": ["量子计算", "人工智能", "脑机接口", "区块链", "5G技术", "虚拟现实", "增强现实", "物联网", "云计算", "大数据", "3D打印", "自动驾驶", "机器人技术", "基因编辑", "纳米技术"],
    "历史": ["工业革命", "法国大革命", "美国独立战争", "文艺复兴", "大航海时代", "鸦片战争", "明治维新", "第一次世界大战", "第二次世界大战", "冷战", "西安事变", "苏联解体", "古巴导弹危机", "柏林墙倒塌", "诺曼底登陆", 
            "辛亥革命", "五四运动", "抗日战争", "解放战争", "改革开放", "文化大革命", "抗美援朝", "甲午战争", "太平天国运动", "义和团运动", "洋务运动", "戊戌变法"],
    "健康": ["感冒", "高血压", "糖尿病", "肥胖症", "失眠", "抑郁症", "颈椎病", "肠胃炎", "心脏病", "癌症", "痛风", "过敏", "偏头痛", "骨质疏松", "亚健康"],
    "美食": ["披萨", "寿司", "北京烤鸭", "意大利面", "巧克力蛋糕", "川菜", "粤菜", "法国大餐", "日本料理", "韩国烤肉", "泰式咖喱", "西班牙海鲜饭", "印度飞饼", "巴西烤肉", "俄罗斯红菜汤",
            "火锅", "饺子", "包子", "粽子", "月饼", "麻婆豆腐", "宫保鸡丁", "水煮鱼", "糖醋排骨", "红烧肉", "小笼包", "担担面", "兰州拉面", "阳春面", "佛跳墙"],
    "旅游": ["巴黎", "东京", "纽约", "悉尼", "迪拜", "伦敦", "罗马", "曼谷", "新加坡", "巴厘岛", "开罗", "里约热内卢", "威尼斯", "伊斯坦布尔", "温哥华",
            "北京", "上海", "西安", "杭州", "成都", "桂林", "张家界", "九寨沟", "黄山", "丽江", "三亚", "拉萨", "敦煌", "乌镇", "平遥古城"],
    "教育": ["数学", "英语", "物理", "化学", "生物", "历史", "地理", "计算机科学", "心理学", "艺术", "哲学", "经济学", "社会学", "法学", "政治学",
            "语文", "体育", "音乐", "美术", "信息技术", "通用技术", "劳动教育", "安全教育", "心理健康教育"],
    "艺术": ["油画", "雕塑", "摄影", "舞蹈", "音乐", "电影", "戏剧", "书法", "篆刻", "剪纸", "动画", "装置艺术", "行为艺术", "现代舞", "爵士乐",
            "齐白石", "徐悲鸿", "张大千", "吴冠中", "黄宾虹", "傅抱石", "李可染", "潘天寿", "林风眠", "关山月", "吴昌硕", "刘海粟", "范曾", "陈丹青"],
    "金融": ["股票", "基金", "债券", "期货", "外汇", "保险", "房地产投资", "黄金投资", "比特币", "对冲基金", "期权", "信托", "私募股权", "风险投资", "众筹",
            "银行", "证券", "互联网金融", "数字货币", "金融科技", "消费金融", "供应链金融", "绿色金融", "普惠金融"],
    "军事": ["陆军", "海军", "空军", "导弹部队", "特种部队", "信息化战争", "游击战", "阵地战", "闪电战", "持久战"],
    "法律": ["宪法", "刑法", "民法", "行政法", "经济法", "国际法", "知识产权法", "劳动法", "环境保护法", "婚姻法"],
    "医学": ["内科", "外科", "儿科", "妇产科", "眼科", "耳鼻喉科", "皮肤科", "精神科", "急诊科", "中医科"],
    "农业": ["水稻", "小麦", "玉米", "大豆", "棉花", "蔬菜", "水果", "畜牧", "渔业", "林业"],
    "商业": ["电子商务", "社交媒体营销", "创业融资", "品牌管理", "供应链管理", "客户关系管理"],
    "科技趋势": ["元宇宙", "Web3.0", "边缘计算", "数字孪生", "生物识别技术", "量子互联网"],
    "生活技巧": ["时间管理", "高效学习", "压力管理", "沟通技巧", "财务管理", "健康饮食"],
    "名人": ["爱因斯坦", "爱迪生", "居里夫人", "达芬奇", "莎士比亚", "贝多芬", 
            "孔子", "李白", "鲁迅", "钱学森", "袁隆平", "马云", "李嘉诚", "成龙", "姚明",
            "秦始皇", "汉武帝", "唐太宗", "武则天", "成吉思汗", "朱元璋", "康熙", "乾隆",
            "孙中山", "周恩来", "邓小平", "钱钟书", "老舍", "巴金", "茅盾", "郭沫若",
            "李时珍", "张衡", "祖冲之", "华罗庚", "陈景润", "杨振宁", "李政道", "丁肇中"],
                "体育": ["篮球", "足球", "网球", "游泳", "田径", "乒乓球", "羽毛球", "高尔夫", "滑雪", "攀岩", "拳击", "击剑", "体操", "排球", "举重",
            "马拉松", "铁人三项", "滑冰", "花样滑冰", "冰球", "棒球", "橄榄球", "跆拳道", "柔道", "空手道", "武术", "射箭", "射击"],
    "环保": ["塑料污染", "空气污染", "水污染", "土壤污染", "噪音污染", "温室气体排放", "森林砍伐", "垃圾分类", "可再生能源", "生物多样性保护",
            "碳足迹", "生态保护", "可持续发展", "绿色能源", "循环经济", "环保材料", "节能减排", "低碳生活", "生态农业", "湿地保护"],
    "心理学": ["认知行为疗法", "正念冥想", "社会心理学", "发展心理学", "人格心理学", "神经心理学", "临床心理学", "教育心理学", "工业心理学", "咨询心理学",
              "实验心理学", "生理心理学", "比较心理学", "变态心理学", "健康心理学", "运动心理学", "犯罪心理学", "文化心理学", "积极心理学", "进化心理学"]
}

# 初始化问题列表
question_list = []

# 根据模板和主题词生成问题
for category in categories:
    templates = categories[category]
    category_topics = topics[category]
    # 处理需要两个主题词的模板
    for template in templates:
        if template.count('{}') == 2:
            for i in range(len(category_topics)):
                for j in range(i + 1, len(category_topics)):
                    question = template.format(category_topics[i], category_topics[j])
                    question_list.append(question)
        else:
            for topic in category_topics:
                question = template.format(topic)
                question_list.append(question)

# 将问题列表保存到 JSON 文件
import random
random.shuffle(question_list)  # 使用random模块的shuffle方法进行随机排序

with open('questions.json', 'w', encoding='utf-8') as f:
    json.dump(question_list, f, ensure_ascii=False, indent=4)

print("问题已保存到 questions.json 文件中。")
