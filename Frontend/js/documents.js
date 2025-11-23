// 文档页面功能
class DocumentsManager {
    constructor() {
        this.folders = [];
        this.currentFolder = null;
        this.currentDocument = null;
        this.init();
        this._initNotificationSystem();
    }
    
    // 初始化通知系统
    _initNotificationSystem() {
        // 创建通知容器
        let notificationContainer = document.getElementById('notification-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'notification-container';
            document.body.appendChild(notificationContainer);
            
            // 添加通知样式
            const style = document.createElement('style');
            style.textContent = `
                #notification-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    max-width: 300px;
                }
                .notification {
                    padding: 12px 16px;
                    margin-bottom: 8px;
                    border-radius: 8px;
                    color: white;
                    font-size: 14px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    animation: slideIn 0.3s ease-out;
                }
                .notification.success {
                    background: var(--success-color);
                }
                .notification.error {
                    background: var(--danger-color);
                }
                .notification.info {
                    background: var(--primary-color);
                }
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // 显示通知
    showNotification(message, type = 'info', duration = 3000) {
        const notificationContainer = document.getElementById('notification-container');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notificationContainer.appendChild(notification);
        
        // 自动移除通知
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            notification.style.transition = 'opacity 0.3s, transform 0.3s';
            
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);
    }

    async init() {
        await this.loadFolders();
        this.renderFolders();
        this.bindEvents();
        this.updateStats();
    }

    // 加载文件夹结构
    async loadFolders() {
        try {
            // 优先从本地存储加载
            const storedFolders = localStorage.getItem('rainyWindowsFolders');
            if (storedFolders) {
                this.folders = JSON.parse(storedFolders);
                console.log('从本地存储加载了文件夹结构');
            } else {
                // 如果本地存储中没有，使用模拟数据
                this.folders = this.getMockData();
                // 同时保存到本地存储
                this._syncFoldersToLocalStorage();
            }
        } catch (error) {
            console.error('加载文件夹失败:', error);
            // 使用模拟数据作为备选
            this.folders = this.getMockData();
            this._syncFoldersToLocalStorage();
        }
    }

    // 获取已知的markdown文件
    async getMarkdownFiles(folderName) {
        const fileMap = {
            'ai': ['machine-learning-basics.md'],
            'art': ['design-principles.md'],
            'computer': ['web-development.md']
        };

        const files = [];
        
        for (const fileName of fileMap[folderName] || []) {
            try {
                const response = await fetch(`markdown/${folderName}/${fileName}`);
                if (response.ok) {
                    const content = await response.text();
                    const docInfo = this.parseMarkdownInfo(content, fileName);
                    files.push({
                        name: fileName,
                        title: docInfo.title || fileName.replace('.md', ''),
                        description: docInfo.description || '暂无描述',
                        date: docInfo.date || '2024-01-01',
                        content: content
                    });
                }
            } catch (error) {
                console.warn(`无法读取文件 ${fileName}:`, error);
            }
        }
        
        return files;
    }

    // 解析markdown文件信息
    parseMarkdownInfo(content, fileName) {
        const info = {
            title: fileName.replace('.md', ''),
            description: '暂无描述',
            date: '2024-01-01'
        };

        // 从内容中提取标题（第一个#标记）
        const titleMatch = content.match(/^#\s+(.+)$/m);
        if (titleMatch) {
            info.title = titleMatch[1].trim();
        }

        // 从内容中提取描述（标题后的第一段）
        const lines = content.split('\n');
        let inDescription = false;
        let descriptionLines = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (line.startsWith('#') && !inDescription) {
                inDescription = true;
                continue;
            }
            
            if (inDescription && line && !line.startsWith('#') && !line.startsWith('```')) {
                descriptionLines.push(line);
                if (descriptionLines.length >= 2) break; // 取前两行作为描述
            }
        }
        
        if (descriptionLines.length > 0) {
            info.description = descriptionLines.join(' ').substring(0, 100) + '...';
        }

        return info;
    }

    // 获取默认文件（当无法读取实际文件时使用）
    async getDefaultFiles(folderName) {
        const defaultContent = {
            'ai': {
                title: '机器学习基础',
                description: '机器学习的基本概念和算法介绍',
                content: '# 机器学习基础\n\n## 什么是机器学习\n\n机器学习是人工智能的一个分支，它使计算机能够在没有明确编程的情况下学习。'
            },
            'art': {
                title: '设计原则',
                description: 'UI/UX设计的基本原则和方法',
                content: '# 设计原则\n\n## 对比原则\n\n通过对比突出重要元素。'
            },
            'computer': {
                title: 'Web开发指南',
                description: '现代Web开发技术栈',
                content: '# Web开发指南\n\n## 前端技术\n\n- HTML5\n- CSS3\n- JavaScript'
            }
        };

        const defaultDoc = defaultContent[folderName] || {
            title: '示例文档',
            description: '这是一个示例文档',
            content: '# 示例文档\n\n这是文档内容。'
        };

        return [{
            name: 'example.md',
            title: defaultDoc.title,
            description: defaultDoc.description,
            date: '2024-01-01',
            content: defaultDoc.content
        }];
    }

    // 模拟数据（备选方案）
    getMockData() {
        return [
            {
                name: 'ai',
                displayName: '人工智能',
                description: 'AI相关技术文档和学习笔记',
                type: 'tech',
                typeName: '技术文档',
                icon: '🤖',
                documents: [
                    {
                        name: 'machine-learning-basics.md',
                        title: '机器学习基础',
                        description: '机器学习的基本概念和算法介绍',
                        date: '2024-01-15',
                        content: '# 机器学习基础\n\n## 什么是机器学习\n\n机器学习是人工智能的一个分支，它使计算机能够在没有明确编程的情况下学习和改进。\n\n### 机器学习的主要类型\n\n1. **监督学习**\n   - 分类问题\n   - 回归问题\n\n2. **无监督学习**\n   - 聚类分析\n   - 降维技术\n\n3. **强化学习**\n   - 智能体与环境交互\n   - 通过奖励机制学习\n\n## 常用算法\n\n### 线性回归\n线性回归用于预测连续值，通过拟合数据点到一条直线。\n\n```python\nimport numpy as np\nfrom sklearn.linear_model import LinearRegression\n\n# 创建模型\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\n\n# 预测\npredictions = model.predict(X_test)\n```\n\n### 决策树\n决策树通过树状结构进行决策，易于理解和解释。\n\n```python\nfrom sklearn.tree import DecisionTreeClassifier\n\n# 创建决策树分类器\nclf = DecisionTreeClassifier()\nclf.fit(X_train, y_train)\n```\n\n## 评估指标\n\n### 分类问题\n- 准确率 (Accuracy)\n- 精确率 (Precision)\n- 召回率 (Recall)\n- F1分数 (F1-Score)\n\n### 回归问题\n- 均方误差 (MSE)\n- 平均绝对误差 (MAE)\n- R²分数 (R-Squared)\n\n## 实践建议\n\n1. **数据预处理**\n   - 处理缺失值\n   - 特征缩放\n   - 编码分类变量\n\n2. **模型选择**\n   - 根据问题类型选择算法\n   - 考虑计算复杂度\n   - 评估模型可解释性\n\n3. **超参数调优**\n   - 网格搜索\n   - 随机搜索\n   - 贝叶斯优化\n\n## 学习资源\n\n- 《机器学习》- 周志华\n- 《统计学习方法》- 李航\n- Coursera: Machine Learning by Andrew Ng'
                    }
                ]
            },
            {
                name: 'art',
                displayName: '艺术设计',
                description: '设计理论和创意作品',
                type: 'art',
                typeName: '艺术设计',
                icon: '🎨',
                documents: [
                    {
                        name: 'design-principles.md',
                        title: '设计原则',
                        description: 'UI/UX设计的基本原则和方法',
                        date: '2024-01-10',
                        content: '# 设计原则\n\n## 设计基础概念\n\n设计是一种有目的的创造性活动，旨在解决问题并满足用户需求。\n\n## 视觉设计原则\n\n### 对比原则\n通过对比突出重要元素，增强视觉层次感。\n\n### 对齐原则\n保持元素的对齐和一致性，创造整洁的视觉效果。\n\n### 重复原则\n重复使用设计元素，建立视觉统一性。\n\n### 亲密性原则\n相关元素应该靠近，不相关元素应该分离。\n\n## 交互设计原则\n\n### 反馈原则\n系统应该及时响应用户操作。\n\n### 一致性原则\n保持界面元素和行为的一致性。\n\n### 错误预防原则\n设计应该防止用户犯错。\n\n## 色彩理论\n\n### 色彩心理学\n不同颜色传达不同的情感和意义。\n\n### 配色方案\n- 单色方案\n- 类比色方案\n- 互补色方案\n- 分裂互补色方案\n\n## 排版设计\n\n### 字体选择\n选择合适的字体家族和大小。\n\n### 行高和间距\n确保良好的可读性。\n\n### 层次结构\n建立清晰的视觉层次。\n\n## 响应式设计\n\n### 移动优先\n从移动设备开始设计。\n\n### 弹性布局\n使用相对单位而非绝对单位。\n\n### 媒体查询\n```css\n@media (max-width: 768px) {\n  .container {\n    width: 100%;\n  }\n}\n```\n\n## 设计工具推荐\n\n- **UI设计**: Figma, Sketch, Adobe XD\n- **原型设计**: InVision, Proto.io\n- **图形设计**: Photoshop, Illustrator\n- **动效设计**: After Effects, Principle\n\n## 设计流程\n\n1. **研究阶段**\n   - 用户研究\n   - 竞品分析\n   - 需求分析\n\n2. **设计阶段**\n   - 信息架构\n   - 线框图\n   - 视觉设计\n\n3. **测试阶段**\n   - 可用性测试\n   - A/B测试\n   - 用户反馈\n\n4. **迭代阶段**\n   - 数据分析\n   - 优化改进\n   - 持续迭代'
                    }
                ]
            },
            {
                name: 'computer',
                displayName: '计算机科学',
                description: '编程技术和计算机理论',
                type: 'tech',
                typeName: '技术文档',
                icon: '💻',
                documents: [
                    {
                        name: 'web-development.md',
                        title: 'Web开发指南',
                        description: '现代Web开发技术栈',
                        date: '2024-01-30',
                        content: '# Web开发指南\n\n## Web开发技术栈\n\n### 前端技术\n\n#### HTML5\n现代网页标记语言，支持语义化标签。\n\n```html\n<!DOCTYPE html>\n<html lang=\"zh-CN\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>页面标题</title>\n</head>\n<body>\n    <header>\n        <h1>网站标题</h1>\n    </header>\n</body>\n</html>\n```\n\n#### CSS3\n样式表语言，支持动画和响应式设计。\n\n```css\n.container {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    min-height: 100vh;\n}\n\n@media (max-width: 768px) {\n    .container {\n        flex-direction: column;\n    }\n}\n```\n\n#### JavaScript\n客户端脚本语言，实现交互功能。\n\n```javascript\n// 示例：事件监听\ndocument.addEventListener(\'DOMContentLoaded\', function() {\n    const button = document.getElementById(\'myButton\');\n    button.addEventListener(\'click\', function() {\n        alert(\'按钮被点击了！\');\n    });\n});\n```\n\n### 前端框架\n\n#### React\nFacebook开发的UI库，基于组件化思想。\n\n```jsx\nimport React, { useState } from \'react\';\n\nfunction Counter() {\n    const [count, setCount] = useState(0);\n    \n    return (\n        <div>\n            <p>计数: {count}</p>\n            <button onClick={() => setCount(count + 1)}>\n                增加\n            </button>\n        </div>\n    );\n}\n```\n\n#### Vue\n渐进式JavaScript框架，易于学习和使用。\n\n```vue\n<template>\n    <div>\n        <h1>{{ message }}</h1>\n        <button @click=\"reverseMessage\">反转消息</button>\n    </div>\n</template>\n\n<script>\nexport default {\n    data() {\n        return {\n            message: \'Hello Vue!\'\n        };\n    },\n    methods: {\n        reverseMessage() {\n            this.message = this.message.split(\'\').reverse().join(\'\');\n        }\n    }\n};\n</script>\n```\n\n#### Angular\nGoogle开发的全功能框架，适合大型应用。\n\n```typescript\nimport { Component } from \'@angular/core\';\n\n@Component({\n    selector: \'app-root\',\n    template: `\n        <h1>{{title}}</h1>\n        <button (click)=\"onClick()\">点击我</button>\n    `\n})\nexport class AppComponent {\n    title = \'我的应用\';\n    \n    onClick() {\n        console.log(\'按钮被点击\');\n    }\n}\n```\n\n### 后端技术\n\n#### Node.js\n基于Chrome V8引擎的JavaScript运行时。\n\n```javascript\nconst express = require(\'express\');\nconst app = express();\n\napp.get(\'/\', (req, res) => {\n    res.send(\'Hello World!\');\n});\n\napp.listen(3000, () => {\n    console.log(\'服务器运行在端口3000\');\n});\n```\n\n#### Python (Django/Flask)\n简洁优雅的编程语言，适合Web开发。\n\n```python\nfrom flask import Flask\n\napp = Flask(__name__)\n\n@app.route(\'/\')\ndef hello():\n    return \'Hello, World!\'\n\nif __name__ == \'__main__\':\n    app.run(debug=True)\n```\n\n#### Java (Spring Boot)\n企业级应用开发的首选。\n\n```java\n@RestController\npublic class HelloController {\n    \n    @GetMapping(\'/\')\n    public String hello() {\n        return \'Hello, World!\';\n    }\n}\n```\n\n## 数据库技术\n\n### 关系型数据库\n- MySQL\n- PostgreSQL\n- SQLite\n\n### NoSQL数据库\n- MongoDB\n- Redis\n- Cassandra\n\n## 开发工具和流程\n\n### 版本控制\n- Git\n- GitHub/GitLab\n\n### 包管理\n- npm (Node.js)\n- pip (Python)\n- Maven (Java)\n\n### 构建工具\n- Webpack\n- Vite\n- Gulp\n\n## 部署和运维\n\n### 云服务\n- AWS\n- Azure\n- Google Cloud\n\n### 容器化\n- Docker\n- Kubernetes\n\n### CI/CD\n- Jenkins\n- GitHub Actions\n- GitLab CI\n\n## 性能优化\n\n### 前端优化\n- 代码分割\n- 懒加载\n- 缓存策略\n\n### 后端优化\n- 数据库索引\n- 查询优化\n- 缓存机制\n\n## 安全最佳实践\n\n### 常见安全威胁\n- XSS攻击\n- CSRF攻击\n- SQL注入\n\n### 防护措施\n- 输入验证\n- 输出编码\n- HTTPS加密\n\n## 测试策略\n\n### 单元测试\n测试单个函数或模块的功能。\n\n### 集成测试\n测试多个模块的协作。\n\n### 端到端测试\n模拟用户操作测试完整流程。\n\n## 持续学习\n\n### 学习资源\n- MDN Web Docs\n- freeCodeCamp\n- Stack Overflow\n\n### 社区参与\n- GitHub开源项目\n- 技术博客\n- 技术会议\n\n## 总结\n\nWeb开发是一个不断发展的领域，需要持续学习新技术和最佳实践。掌握基础知识后，可以根据项目需求选择合适的工具和技术栈。'
                    }
                ]
            }
        ];
    }

    // 渲染文件夹列表
    renderFolders() {
        const foldersList = document.getElementById('folders-list');
        foldersList.innerHTML = '';

        this.folders.forEach(folder => {
            const folderElement = document.createElement('div');
            folderElement.className = 'folder-item';
            folderElement.dataset.folderType = folder.type || 'other';
            folderElement.innerHTML = `
                <span class="folder-icon">${folder.icon}</span>
                <div class="folder-info">
                    <div class="folder-name">${folder.displayName}</div>
                    <div class="folder-meta">
                        <span class="folder-type">${folder.typeName || '未分类'}</span>
                        <span class="folder-count">${folder.documents.length} 篇文档</span>
                    </div>
                </div>
                <button class="delete-folder-btn" data-folder-name="${folder.name}">
                    <span class="delete-icon">🗑️</span>
                </button>
            `;
            
            folderElement.addEventListener('click', () => {
                this.selectFolder(folder);
            });
            
            foldersList.appendChild(folderElement);
        });
    }

    // 选择文件夹
    selectFolder(folder) {
        // 更新活动状态
        document.querySelectorAll('.folder-item').forEach(item => {
            item.classList.remove('active');
        });
        event.currentTarget.classList.add('active');

        this.currentFolder = folder;
        this.showFolderContent(folder);
        this.updateBreadcrumb(folder.displayName);
    }

    // 显示文件夹内容
    showFolderContent(folder) {
        // 隐藏其他内容
        document.getElementById('welcome-content').style.display = 'none';
        document.getElementById('document-content').style.display = 'none';
        
        // 显示文件夹内容
        const folderContent = document.getElementById('folder-content');
        folderContent.style.display = 'block';
        
        // 更新标题和描述
        document.getElementById('folder-title').textContent = folder.displayName;
        document.getElementById('folder-desc').textContent = folder.description;
        
        // 渲染文档列表
        this.renderDocuments(folder.documents);
    }

    // 渲染文档列表
    renderDocuments(documents) {
        const documentsGrid = document.getElementById('documents-grid');
        documentsGrid.innerHTML = '';

        if (documents.length === 0) {
            documentsGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📄</div>
                    <h3>暂无文档</h3>
                    <p>该分类下还没有文档内容</p>
                </div>
            `;
            return;
        }

        documents.forEach(doc => {
            const docElement = document.createElement('div');
            docElement.className = 'document-card';
            docElement.innerHTML = `
                <div class="document-card-header">
                    <div class="document-icon">📄</div>
                    <button class="delete-doc-btn" data-doc-name="${doc.name}">
                        <span class="delete-icon">🗑️</span>
                    </button>
                </div>
                <h3>${doc.title}</h3>
                <p>${doc.description}</p>
                <div class="document-meta">
                    <span>${doc.date}</span>
                    <span>${this.getFileSize(doc.content)}</span>
                </div>
            `;
            
            // 文档点击事件
            docElement.addEventListener('click', (e) => {
                // 只有当点击的不是删除按钮时才显示文档
                if (!e.target.closest('.delete-doc-btn')) {
                    this.showDocument(doc);
                }
            });
            
            // 删除按钮点击事件
            const deleteBtn = docElement.querySelector('.delete-doc-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止冒泡，避免触发文档点击事件
                this.deleteDocument(doc, this.currentFolder);
            });
            
            documentsGrid.appendChild(docElement);
        });
    }

    // 显示文档内容
    showDocument(doc) {
        this.currentDocument = doc;
        
        // 隐藏其他内容
        document.getElementById('welcome-content').style.display = 'none';
        document.getElementById('folder-content').style.display = 'none';
        
        // 显示文档内容
        const docContent = document.getElementById('document-content');
        docContent.style.display = 'block';
        
        // 更新文档信息
        document.getElementById('document-title').textContent = doc.title;
        document.getElementById('document-folder').textContent = this.currentFolder.displayName;
        document.getElementById('document-date').textContent = doc.date;
        
        // 渲染Markdown内容
        this.renderMarkdown(doc.content);
        
        // 更新面包屑
        this.updateBreadcrumb(this.currentFolder.displayName, doc.title);
    }

    // 删除文档
    deleteDocument(docToDelete, folder) {
        if (confirm(`确定要删除文档"${docToDelete.title}"吗？此操作不可撤销。`)) {
            // 从文件夹中移除文档
            const docIndex = folder.documents.findIndex(doc => doc.name === docToDelete.name);
            if (docIndex !== -1) {
                folder.documents.splice(docIndex, 1);
                
                // 如果删除的是当前正在查看的文档，返回到文件夹视图
                if (this.currentDocument && this.currentDocument.name === docToDelete.name) {
                    this.currentDocument = null;
                    this.showFolderContent(folder);
                } else {
                    // 否则更新文档列表
                    this.renderDocuments(folder.documents);
                }
                
                // 同步到本地存储
                this._syncFoldersToLocalStorage();
                
                // 更新文档统计
                this.updateStats();
                
                // 显示通知
                this.showNotification('文档删除成功！', 'success');
                
                return true;
            }
        }
        return false;
    }

    // 渲染Markdown内容
    renderMarkdown(content) {
        const documentBody = document.getElementById('document-body');
        
        // 使用marked.js渲染Markdown
        if (typeof marked !== 'undefined') {
            documentBody.innerHTML = marked.parse(content);
        } else {
            // 如果没有marked.js，显示原始内容
            documentBody.innerHTML = `<pre>${content}</pre>`;
        }
        
        // 添加代码高亮（如果有的话）
        this.highlightCode();
    }

    // 代码高亮
    highlightCode() {
        // 这里可以集成代码高亮库，如Prism.js
        const codeBlocks = document.querySelectorAll('pre code');
        codeBlocks.forEach(block => {
            block.classList.add('language-markdown');
        });
    }

    // 更新面包屑导航
    updateBreadcrumb(folderName = null, docName = null) {
        const breadcrumb = document.getElementById('breadcrumb');
        let breadcrumbHtml = '<span onclick="documentsManager.showWelcome()">首页</span> / <span onclick="documentsManager.showWelcome()">文档</span>';
        
        if (folderName) {
            breadcrumbHtml += ` / <span onclick="documentsManager.selectFolder(documentsManager.currentFolder)">${folderName}</span>`;
        }
        
        if (docName) {
            breadcrumbHtml += ` / <span>${docName}</span>`;
        }
        
        breadcrumb.innerHTML = breadcrumbHtml;
    }

    // 显示欢迎页面
    showWelcome() {
        this.currentFolder = null;
        this.currentDocument = null;
        
        // 重置活动状态
        document.querySelectorAll('.folder-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // 显示欢迎内容
        document.getElementById('welcome-content').style.display = 'block';
        document.getElementById('folder-content').style.display = 'none';
        document.getElementById('document-content').style.display = 'none';
        
        // 重置面包屑
        this.updateBreadcrumb();
    }

    // 更新统计信息
    updateStats() {
        const totalFolders = this.folders.length;
        const totalDocs = this.folders.reduce((sum, folder) => sum + folder.documents.length, 0);
        
        document.getElementById('total-folders').textContent = totalFolders;
        document.getElementById('total-docs').textContent = totalDocs;
        document.getElementById('doc-count').textContent = totalDocs;
    }

    // 获取文件大小（模拟）
    getFileSize(content) {
        const size = new Blob([content]).size;
        if (size < 1024) {
            return size + ' B';
        } else if (size < 1024 * 1024) {
            return (size / 1024).toFixed(1) + ' KB';
        } else {
            return (size / (1024 * 1024)).toFixed(1) + ' MB';
        }
    }

    // 绑定事件
    bindEvents() {
        // 搜索功能
        const searchInput = document.getElementById('doc-search');
        searchInput.addEventListener('input', (e) => {
            this.searchDocuments(e.target.value);
        });

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.showWelcome();
            }
        });

        // 添加文件夹按钮事件
        const newFolderBtn = document.getElementById('new-folder-btn');
        if (newFolderBtn) {
            newFolderBtn.addEventListener('click', () => {
                this.createNewFolder();
            });
        }

        // 编写文档按钮事件
        const newDocBtn = document.getElementById('new-doc-btn');
        if (newDocBtn) {
            newDocBtn.addEventListener('click', () => {
                this.createNewDocument();
            });
        }
        
        // 文件夹删除按钮事件（使用事件委托）
        const foldersContainer = document.getElementById('folders-container');
        if (foldersContainer) {
            foldersContainer.addEventListener('click', (e) => {
                const deleteBtn = e.target.closest('.delete-folder-btn');
                if (deleteBtn) {
                    e.stopPropagation(); // 阻止冒泡，避免触发文件夹选择
                    const folderName = deleteBtn.dataset.folderName;
                    this.deleteFolder(folderName);
                }
            });
        }
    }

    // 创建新文件夹
    createNewFolder() {
        const folderName = prompt('请输入新文件夹名称：');
        if (folderName && folderName.trim()) {
            const safeName = folderName.trim();
            
            // 检查是否已存在同名文件夹
            if (this.folders.some(f => f.displayName === safeName)) {
                this.showNotification('文件夹名称已存在，请使用其他名称！', 'error');
                return;
            }

            // 文件夹类型选项
            const folderTypes = {
                'tech': '技术文档',
                'art': '艺术设计', 
                'study': '学习笔记',
                'work': '工作文档',
                'other': '其他类型'
            };

            // 构建类型选择提示
            let typeOptions = '';
            let i = 1;
            const typeKeys = Object.keys(folderTypes);
            typeKeys.forEach(key => {
                typeOptions += `${i}. ${folderTypes[key]}\n`;
                i++;
            });

            const typeChoice = prompt(`请选择文件夹类型:\n\n${typeOptions}\n\n输入序号：`);
            const typeIndex = parseInt(typeChoice) - 1;

            let folderType = 'other';
            if (!isNaN(typeIndex) && typeIndex >= 0 && typeIndex < typeKeys.length) {
                folderType = typeKeys[typeIndex];
            }

            // 创建新文件夹对象
            const newFolder = {
                name: safeName.toLowerCase().replace(/\s+/g, '-'),
                displayName: safeName,
                description: '新建文件夹',
                type: folderType,
                typeName: folderTypes[folderType],
                documents: []
            };

            // 添加到文件夹列表
            this.folders.push(newFolder);
            
            // 同步到本地存储
            this._syncFoldersToLocalStorage();
            
            // 更新UI
            this.renderFolders();
            this.showNotification('文件夹创建成功！', 'success');
        }
    }
    
    // 同步文件夹结构到本地存储
    _syncFoldersToLocalStorage() {
        try {
            localStorage.setItem('rainyWindowsFolders', JSON.stringify(this.folders));
            console.log('文件夹结构已同步到本地存储');
        } catch (error) {
            console.error('同步文件夹到本地存储失败:', error);
        }
    }
    
    // 删除文件夹
    deleteFolder(folderName) {
        // 找到要删除的文件夹索引
        const folderIndex = this.folders.findIndex(f => f.name === folderName);
        if (folderIndex === -1) return;
        
        const folder = this.folders[folderIndex];
        
        // 如果文件夹中有文档，提示用户
        let confirmMessage;
        if (folder.documents && folder.documents.length > 0) {
            confirmMessage = `文件夹 "${folder.displayName}" 中包含 ${folder.documents.length} 篇文档，确定要删除吗？`;
        } else {
            confirmMessage = `确定要删除文件夹 "${folder.displayName}" 吗？`;
        }
        
        const confirmDelete = confirm(confirmMessage);
        if (!confirmDelete) return;
        
        // 如果删除的是当前文件夹，重置当前状态
        if (this.currentFolder && this.currentFolder.name === folderName) {
            this.currentFolder = null;
            this.currentDocument = null;
            this.showWelcome();
        }
        
        // 从数组中移除文件夹
        this.folders.splice(folderIndex, 1);
        
        // 同步到本地存储
        this._syncFoldersToLocalStorage();
        
        // 更新UI
        this.renderFolders();
        this.updateStats();
        
        this.showNotification('文件夹删除成功！', 'success');
    }

    // 创建新文档
    createNewDocument() {
        // 如果有当前文件夹，直接在当前文件夹创建
        if (this.currentFolder) {
            this._createDocumentInFolder(this.currentFolder);
        } else {
            // 否则让用户选择文件夹
            if (this.folders.length === 0) {
                alert('请先创建一个文件夹！');
                return;
            }

            let folderOptions = '';
            this.folders.forEach((folder, index) => {
                folderOptions += `${index + 1}. ${folder.displayName}\n`;
            });

            const choice = prompt(`请选择要在哪个文件夹中创建文档:\n\n${folderOptions}\n\n输入文件夹序号：`);
            const folderIndex = parseInt(choice) - 1;

            if (!isNaN(folderIndex) && folderIndex >= 0 && folderIndex < this.folders.length) {
                this._createDocumentInFolder(this.folders[folderIndex]);
            } else {
                alert('无效的文件夹选择！');
            }
        }
    }

    // 在指定文件夹中创建文档
    _createDocumentInFolder(folder) {
        const docTitle = prompt('请输入文档标题：');
        if (docTitle && docTitle.trim()) {
            const safeTitle = docTitle.trim();
            
            // 检查是否已存在同名文档
            if (folder.documents.some(d => d.title === safeTitle)) {
                alert('文档标题已存在，请使用其他标题！');
                return;
            }

            // 创建新文档对象
            const newDoc = {
                name: safeTitle.toLowerCase().replace(/\s+/g, '-'),
                title: safeTitle,
                description: '新建文档',
                content: `# ${safeTitle}\n\n开始编辑你的文档内容...`,
                date: new Date().toLocaleDateString(),
                folderName: folder.displayName
            };

            // 添加到文件夹的文档列表
            folder.documents.push(newDoc);
            
            // 更新UI
            if (this.currentFolder === folder) {
                this.renderDocuments(folder.documents);
            }
            
            // 更新文档总数
            this.updateDocCount();
            
            // 同步到本地存储
            this._syncFoldersToLocalStorage();
            this.showNotification('文档创建成功！', 'success');
        }
    }

    // 搜索文档
    searchDocuments(query) {
        if (!query.trim()) {
            if (this.currentFolder) {
                this.renderDocuments(this.currentFolder.documents);
            } else {
                // 在欢迎页面清空搜索
                const documentsGrid = document.getElementById('documents-grid');
                if (documentsGrid) {
                    documentsGrid.innerHTML = '';
                }
            }
            return;
        }

        const searchResults = [];
        this.folders.forEach(folder => {
            folder.documents.forEach(doc => {
                if (doc.title.toLowerCase().includes(query.toLowerCase()) ||
                    doc.description.toLowerCase().includes(query.toLowerCase()) ||
                    doc.content.toLowerCase().includes(query.toLowerCase())) {
                    searchResults.push({
                        ...doc,
                        folderName: folder.displayName
                    });
                }
            });
        });

        // 无论是否有当前文件夹，都显示搜索结果
        this.renderSearchResults(searchResults);
    }

    // 渲染搜索结果
    renderSearchResults(results) {
        // 确保搜索结果区域可见
        if (!this.currentFolder) {
            // 在欢迎页面显示搜索结果
            document.getElementById('welcome-content').style.display = 'none';
            document.getElementById('folder-content').style.display = 'block';
            document.getElementById('document-content').style.display = 'none';
            
            // 更新标题
            document.getElementById('folder-title').textContent = '搜索结果';
            document.getElementById('folder-desc').textContent = `找到 ${results.length} 个相关文档`;
        }
        
        const documentsGrid = document.getElementById('documents-grid');
        
        if (results.length === 0) {
            documentsGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🔍</div>
                    <h3>未找到相关文档</h3>
                    <p>请尝试其他搜索关键词</p>
                </div>
            `;
            return;
        }

        documentsGrid.innerHTML = '';
        results.forEach(doc => {
            const docElement = document.createElement('div');
            docElement.className = 'document-card';
            docElement.innerHTML = `
                <div class="document-icon">📄</div>
                <h3>${doc.title}</h3>
                <p>${doc.description}</p>
                <div class="document-meta">
                    <span>${doc.folderName}</span>
                    <span>${doc.date}</span>
                </div>
            `;
            
            docElement.addEventListener('click', () => {
                // 找到对应的文件夹
                const folder = this.folders.find(f => f.displayName === doc.folderName);
                if (folder) {
                    this.selectFolder(folder);
                    // 延迟显示文档，确保文件夹内容已加载
                    setTimeout(() => {
                        const targetDoc = folder.documents.find(d => d.name === doc.name);
                        if (targetDoc) {
                            this.showDocument(targetDoc);
                        }
                    }, 100);
                }
            });
            
            documentsGrid.appendChild(docElement);
        });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.documentsManager = new DocumentsManager();
});

// 添加marked.js的CDN链接（如果不存在）
if (typeof marked === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
    document.head.appendChild(script);
}