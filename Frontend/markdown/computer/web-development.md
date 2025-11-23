# Web开发指南

## 现代Web开发技术栈

### 前端技术

#### HTML5
现代语义化HTML，提供更好的可访问性和SEO。

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>现代网页</title>
</head>
<body>
    <header>
        <nav>
            <ul>
                <li><a href="#home">首页</a></li>
                <li><a href="#about">关于</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <article>
            <h1>文章标题</h1>
            <p>文章内容...</p>
        </article>
    </main>
    
    <footer>
        <p>&copy; 2024 我的网站</p>
    </footer>
</body>
</html>
```

#### CSS3
现代化样式特性，支持响应式设计和动画效果。

```css
/* CSS变量 */
:root {
    --primary-color: #3498db;
    --secondary-color: #2ecc71;
    --text-color: #333;
    --bg-color: #f8f9fa;
}

/* 响应式网格布局 */
.container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    padding: 20px;
}

/* 动画效果 */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.card {
    animation: fadeIn 0.5s ease-out;
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
}
```

#### JavaScript ES6+
现代JavaScript特性，提供更好的开发体验。

```javascript
// 箭头函数
const add = (a, b) => a + b;

// 解构赋值
const { name, age } = user;

// 模板字符串
const greeting = `Hello, ${name}! You are ${age} years old.`;

// 异步编程
async function fetchData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

// 类语法
class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }
    
    getInfo() {
        return `${this.name} (${this.email})`;
    }
}
```

### 前端框架

#### React
用于构建用户界面的JavaScript库。

```jsx
import React, { useState, useEffect } from 'react';

function App() {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        document.title = `Count: ${count}`;
    }, [count]);
    
    return (
        <div>
            <h1>计数器: {count}</h1>
            <button onClick={() => setCount(count + 1)}>
                增加
            </button>
        </div>
    );
}

export default App;
```

#### Vue.js
渐进式JavaScript框架。

```vue
<template>
    <div>
        <h1>{{ message }}</h1>
        <button @click="increment">计数: {{ count }}</button>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const message = ref('Hello Vue!');
        const count = ref(0);
        
        const increment = () => {
            count.value++;
        };
        
        return {
            message,
            count,
            increment
        };
    }
};
</script>
```

#### Angular
完整的TypeScript框架。

```typescript
import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    template: `
        <h1>{{ title }}</h1>
        <button (click)="increment()">计数: {{ count }}</button>
    `
})
export class AppComponent {
    title = 'Hello Angular!';
    count = 0;
    
    increment() {
        this.count++;
    }
}
```

### 后端技术

#### Node.js
JavaScript运行时环境。

```javascript
const express = require('express');
const app = express();

// 中间件
app.use(express.json());
app.use(express.static('public'));

// 路由
app.get('/api/users', (req, res) => {
    res.json([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
    ]);
});

app.post('/api/users', (req, res) => {
    const user = req.body;
    // 保存用户逻辑
    res.status(201).json(user);
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
});
```

#### Python (Django/Flask)

**Django示例：**
```python
from django.http import JsonResponse
from django.views import View

class UserView(View):
    def get(self, request):
        users = User.objects.all()
        data = [{'id': user.id, 'name': user.name} for user in users]
        return JsonResponse(data, safe=False)
```

**Flask示例：**
```python
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/api/users')
def get_users():
    users = [
        {'id': 1, 'name': 'Alice'},
        {'id': 2, 'name': 'Bob'}
    ]
    return jsonify(users)
```

#### Java (Spring Boot)

```java
@RestController
public class UserController {
    
    @GetMapping("/api/users")
    public List<User> getUsers() {
        return Arrays.asList(
            new User(1, "Alice"),
            new User(2, "Bob")
        );
    }
    
    @PostMapping("/api/users")
    public User createUser(@RequestBody User user) {
        // 保存用户逻辑
        return user;
    }
}
```

## 数据库技术

### SQL数据库

#### MySQL
```sql
-- 创建用户表
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入数据
INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com');

-- 查询数据
SELECT * FROM users WHERE name LIKE 'A%';
```

#### PostgreSQL
```sql
-- 创建带JSON支持的用户表
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    profile JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 使用JSON查询
SELECT * FROM users WHERE profile->>'city' = 'Beijing';
```

### NoSQL数据库

#### MongoDB
```javascript
// 连接数据库
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mydb');

// 定义模式
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number
});

// 创建模型
const User = mongoose.model('User', userSchema);

// 查询数据
const users = await User.find({ age: { $gte: 18 } });
```

#### Redis
```javascript
const redis = require('redis');
const client = redis.createClient();

// 设置缓存
await client.set('user:1', JSON.stringify(user));

// 获取缓存
const userData = await client.get('user:1');
const user = JSON.parse(userData);
```

## 开发工具和流程

### 版本控制 (Git)

```bash
# 初始化仓库
git init

# 添加文件
git add .

# 提交更改
git commit -m "Initial commit"

# 推送到远程仓库
git push origin main

# 创建分支
git checkout -b feature/new-feature

# 合并分支
git merge feature/new-feature
```

### 包管理

**npm (Node.js)**
```json
{
    "name": "my-project",
    "version": "1.0.0",
    "dependencies": {
        "express": "^4.18.0",
        "mongoose": "^6.0.0"
    },
    "devDependencies": {
        "nodemon": "^2.0.0",
        "eslint": "^8.0.0"
    }
}
```

**pip (Python)**
```bash
# 安装包
pip install django flask

# 生成requirements.txt
pip freeze > requirements.txt
```

### 构建工具

#### Webpack
```javascript
module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
};
```

#### Vite
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000
    }
})
```

## 部署和运维

### 容器化 (Docker)

**Dockerfile示例：**
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

**docker-compose.yml：**
```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
  
  database:
    image: postgres:13
    environment:
      - POSTGRES_DB=mydb
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
```

### 云平台部署

#### Vercel (前端)
```json
{
    "version": 2,
    "builds": [
        {
            "src": "package.json",
            "use": "@vercel/static-build"
        }
    ],
    "routes": [
        {
            "src": "/(.*)",
            "dest": "/index.html"
        }
    ]
}
```

#### Heroku (后端)
```bash
# 创建Procfile
echo "web: npm start" > Procfile

# 部署
git push heroku main
```

## 性能优化

### 前端优化

1. **代码分割**
```javascript
// 动态导入
const LazyComponent = lazy(() => import('./LazyComponent'));
```

2. **图片优化**
```html
<picture>
    <source srcset="image.webp" type="image/webp">
    <source srcset="image.jpg" type="image/jpeg">
    <img src="image.jpg" alt="描述">
</picture>
```

3. **缓存策略**
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 后端优化

1. **数据库索引**
```sql
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_created ON users(created_at);
```

2. **查询优化**
```sql
-- 避免SELECT *
SELECT id, name FROM users WHERE active = true;

-- 使用分页
SELECT * FROM users ORDER BY created_at DESC LIMIT 10 OFFSET 0;
```

3. **缓存策略**
```javascript
// Redis缓存示例
async function getCachedUser(userId) {
    const cached = await redis.get(`user:${userId}`);
    if (cached) return JSON.parse(cached);
    
    const user = await User.findById(userId);
    await redis.setex(`user:${userId}`, 3600, JSON.stringify(user));
    return user;
}
```

## 安全最佳实践

### 前端安全

1. **XSS防护**
```javascript
// 转义用户输入
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
```

2. **CSP头设置**
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline';">
```

### 后端安全

1. **输入验证**
```javascript
// Express验证中间件
app.use(express.json({ limit: '10kb' }));

// Joi验证示例
const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
});
```

2. **SQL注入防护**
```javascript
// 使用参数化查询
const user = await User.findOne({
    where: {
        email: req.body.email
    }
});
```

3. **认证和授权**
```javascript
// JWT认证
const jwt = require('jsonwebtoken');

function generateToken(user) {
    return jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
}
```

## 测试策略

### 单元测试
```javascript
// Jest测试示例
describe('User Service', () => {
    it('should create a user', async () => {
        const user = await userService.create({
            name: 'Test User',
            email: 'test@example.com'
        });
        
        expect(user.name).toBe('Test User');
        expect(user.email).toBe('test@example.com');
    });
});
```

### 集成测试
```javascript
// Supertest示例
const request = require('supertest');

describe('User API', () => {
    it('should return user list', async () => {
        const response = await request(app)
            .get('/api/users')
            .expect(200);
        
        expect(response.body).toBeInstanceOf(Array);
    });
});
```

### E2E测试
```javascript
// Cypress示例
describe('User Registration', () => {
    it('should register a new user', () => {
        cy.visit('/register');
        cy.get('#name').type('Test User');
        cy.get('#email').type('test@example.com');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/dashboard');
    });
});
```

## 持续学习资源

### 在线课程
- freeCodeCamp
- MDN Web Docs
- Coursera
- Udemy

### 技术博客
- CSS-Tricks
- Smashing Magazine
- DEV Community
- Medium

### 社区和论坛
- Stack Overflow
- GitHub
- Reddit (r/webdev)
- Discord技术社区

### 书籍推荐
- 《JavaScript高级程序设计》
- 《CSS揭秘》
- 《深入理解ES6》
- 《Web性能权威指南》

## 总结

Web开发是一个快速发展的领域，需要持续学习新技术和最佳实践。保持好奇心，积极参与开源项目，建立个人作品集，这些都是提升技能的重要途径。