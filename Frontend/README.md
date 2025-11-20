# RainyWindows 博客网站

一个使用原生技术构建的现代化博客网站，融合了简洁设计与丰富功能。

## 项目特点

### 🎨 设计风格
- **简洁优雅** - 采用现代化简洁的博客设计风格
- **响应式布局** - 完美适配桌面和移动设备
- **动态效果** - 丰富的交互动画和视觉效果
- **用户友好** - 注重用户体验和可访问性

### 📱 页面结构
- **首页** (`index.html`) - 博客主页，包含分类导航、文章列表和侧边栏信息
- **个人页** (`person.html`) - 个人介绍、信息展示和联系方式
- **工作室** (`studio.html`) - 创意作品展示和项目集合
- **资料库** (`library.html`) - 资料整理与知识库

### 🚀 技术栈
- **HTML5** - 语义化标签结构
- **CSS3** - 现代化样式、动画效果和响应式设计
- **JavaScript** - 原生JS交互功能和动态效果
- **无框架依赖** - 纯原生技术实现，轻量级高性能

### ✨ 核心功能
- 分类导航系统（创造、收录、体验）
- 个人信息卡片展示和点击跳转
- 动态交互效果和视觉反馈
- 响应式布局适配
- 多媒体内容展示
- 侧边栏信息卡片
- 英雄区域设计

## 快速开始

### 方法一：直接打开
双击 `index.html` 文件即可在浏览器中查看

### 方法二：本地服务器
```bash
# 进入项目目录
cd Frontend

# 启动Python HTTP服务器
python -m http.server 8000

# 访问网站
# http://localhost:8000
```

### 方法三：Live Server（VS Code）
如果使用VS Code，可以安装Live Server插件，右键点击`index.html`选择"Open with Live Server"

## 文件结构

```
Frontend/
├── index.html          # 首页
├── person.html         # 个人页面
├── studio.html         # 工作室页面
├── library.html        # 资料库页面
├── css/                # 样式文件目录
│   ├── limina-loading.css   # 加载动画样式
│   ├── style.css            # 主样式文件
│   └── transition.css       # 过渡效果样式
├── js/                 # JavaScript文件目录
│   ├── article.js           # 文章相关功能
│   ├── audio-bg.js          # 背景音频功能
│   ├── limina-script.js     # Limina脚本
│   ├── main.js              # 主脚本文件
│   ├── masonry.js           # 瀑布流布局
│   ├── message.js           # 消息相关功能
│   ├── pixel-library.js     # 像素库
│   ├── rain.js              # 雨景效果
│   ├── settings.js          # 设置功能
│   ├── snake.js             # 贪吃蛇游戏
│   ├── stars.js             # 星空效果
│   ├── transition-effect.js # 过渡效果
│   └── typing-effect.js     # 打字效果
├── img/                # 图片资源目录
│   ├── gallery/        # 图库图片
│   └── person/         # 个人图片
└── README.md           # 项目说明
```

## 功能说明

### 🏠 首页功能
- 博客标题和简介展示
- 分类导航系统（创造、收录、体验）
- 文章列表展示
- 个人信息卡片（可点击跳转到个人页面）
- 侧边栏信息卡片（可点击跳转到工作室页面）
- 社交图标展示

### 👤 个人页面功能
- 个人信息和头像展示
- 个人简介和技能展示
- 联系方式和社交媒体链接
- 个人经历和项目展示

### 🎨 工作室页面功能
- 创意作品展示
- 项目集合和案例展示
- 设计风格和创作理念介绍
- 作品分类和筛选

### 📚 资料库页面功能
- 学习资料整理和分类
- 知识库内容展示
- 资料搜索和筛选功能
- 学习路径推荐

## 自定义指南

### 修改个人信息
编辑各个HTML文件中的个人信息部分，替换为您自己的内容：
- `person.html` - 个人页面信息
- `index.html` - 首页个人卡片信息

### 修改样式主题
在 `css/style.css` 中修改CSS样式和变量来自定义网站外观。

### 添加新功能
根据需求在相应的JavaScript文件中添加新功能，主要包括：
- `js/main.js` - 主功能和基础交互
- `js/transition-effect.js` - 页面过渡动画
- `js/typing-effect.js` - 打字效果动画

## 浏览器兼容性

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 部署建议

### 静态托管平台
- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages

### 传统服务器
- Apache HTTP Server
- Nginx
- 任何支持静态文件的Web服务器

## 开发笔记

这个博客网站完全使用原生技术开发，没有依赖任何JavaScript框架或CSS框架。主要特点包括：

1. **语义化HTML** - 使用恰当的HTML标签
2. **CSS Grid & Flexbox** - 现代布局技术
3. **原生JavaScript** - 无框架依赖的交互功能
4. **响应式设计** - 移动优先的设计理念
5. **性能优化** - 懒加载、防抖节流等技术

## 许可证

MIT License - 可自由使用和修改

---

**享受简洁博客的魅力！** ✨

