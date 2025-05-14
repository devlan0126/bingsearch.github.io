import json
import random

# 定义文件路径
file_path = r'd:\develop\code\bingsearch.github.io\questions.json'

# 读取文件内容
with open(file_path, 'r', encoding='utf-8') as file:
    questions = json.load(file)

# 打乱问题顺序
random.shuffle(questions)

# 将打乱后的问题写回文件
with open(file_path, 'w', encoding='utf-8') as file:
    json.dump(questions, file, ensure_ascii=False, indent=2)

print("问题顺序已成功打乱并保存到文件。")