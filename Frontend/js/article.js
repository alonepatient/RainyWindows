// 文章详细页面功能
document.addEventListener('DOMContentLoaded', function() {
    // 文章数据
    const articles = {
        1: {
            id: 1,
            title: '现代Web开发技术栈的演进与思考',
            date: '2024年10月26日',
            datetime: '2024-10-26',
            category: '技术',
            tags: ['JavaScript', '前端开发', 'React'],
            content: `
                <p>随着前端技术的快速发展，从jQuery到React、Vue，从Webpack到Vite，整个Web开发生态发生了翻天覆地的变化。本文将分享我对现代Web开发技术栈的一些思考和实践经验。</p>

                <h2>前端框架的演进</h2>
                <p>在过去的十年里，前端框架经历了从jQuery到React、Vue、Angular的转变。每个框架都有其独特的优势和适用场景。</p>

                <h3>React生态系统</h3>
                <p>React以其组件化思想和丰富的生态系统，成为了目前最受欢迎的前端框架之一。它不仅仅是一个UI库，更是一个完整的开发理念。</p>

                <ul>
                    <li><strong>组件化开发</strong>：将UI拆分成独立、可复用的组件</li>
                    <li><strong>虚拟DOM</strong>：提高渲染性能</li>
                    <li><strong>生态系统</strong>：丰富的第三方库和工具</li>
                </ul>

                <h3>Vue的优雅设计</h3>
                <p>Vue以其简洁的API和渐进式的设计理念，吸引了大量开发者。它的模板语法直观易懂，学习曲线平缓。</p>

                <h2>构建工具的变革</h2>
                <p>从Webpack到Vite，构建工具也在不断演进。Vite的快速开发体验让前端开发变得更加高效。</p>

                <pre><code>// Vite配置示例
export default {
  plugins: [vue()],
  server: {
    port: 3000,
    open: true
  }
}</code></pre>

                <h2>现代开发工作流</h2>
                <p>现代前端开发不仅仅是写代码，还包括代码质量、性能优化、用户体验等多个方面。我们需要建立一套完整的工作流来保证项目的质量。</p>

                <h3>开发工具链</h3>
                <p>ESLint、Prettier、TypeScript等工具已经成为了现代前端开发的标配。它们帮助我们提高代码质量和开发效率。</p>

                <h3>性能优化</h3>
                <p>性能优化是现代Web开发的重要话题。从代码分割到懒加载，从CDN到缓存策略，每一个环节都值得深入思考。</p>

                <h2>未来展望</h2>
                <p>前端技术还在快速发展中，新的框架和工具不断涌现。作为开发者，我们需要保持学习的心态，跟上技术的发展步伐。</p>

                <p>同时，我们也要思考技术的本质，不要盲目追求新技术，而是要选择最适合项目需求的技术栈。</p>

                <blockquote>
                    <p>"技术是为了解决问题，而不是为了炫技。"</p>
                </blockquote>

                <h2>总结</h2>
                <p>现代Web开发技术栈的选择需要考虑多个因素：项目规模、团队技能、维护成本等。没有最好的技术，只有最合适的技术。</p>

                <p>希望这篇文章能给大家一些启发，也欢迎大家在评论区分享自己的经验和想法。</p>
            `,
            prevId: null,
            nextId: 2,
            related: [3, 4]
        },
        2: {
            id: 2,
            title: '秋天的第一杯奶茶与程序员的思考',
            date: '2024年10月20日',
            datetime: '2024-10-20',
            category: '生活',
            tags: ['生活感悟', '工作平衡'],
            content: `
                <p>秋天来了，朋友圈又开始刷屏"秋天的第一杯奶茶"。作为一名程序员，我想聊聊关于生活与工作平衡的一些感悟。</p>

                <h2>代码很重要，但生活更珍贵</h2>
                <p>我们每天都在和代码打交道，debug、重构、优化...这些工作占据了我们大部分的时间。但是，生活中的这些小美好同样珍贵。</p>

                <p>一杯奶茶，一次散步，一本好书，这些都是我们生活中不可或缺的部分。它们让我们保持对生活的热爱，也让我们在代码的世界之外，找到属于自己的节奏。</p>

                <h2>工作与生活的平衡</h2>
                <p>作为程序员，我们常常会陷入工作的漩涡中。一个bug、一个需求、一个项目，都可能让我们忘记时间的存在。</p>

                <p>但是，真正优秀的程序员，不仅要有扎实的技术能力，更要有良好的生活品质。只有保持良好的生活状态，我们才能在技术道路上走得更远。</p>

                <h3>如何平衡工作与生活</h3>
                <ul>
                    <li><strong>时间管理</strong>：合理安排工作时间，避免无谓的加班</li>
                    <li><strong>兴趣爱好</strong>：培养工作之外的兴趣爱好</li>
                    <li><strong>社交活动</strong>：保持与朋友和家人的联系</li>
                    <li><strong>身体健康</strong>：坚持锻炼，保持健康的身体</li>
                </ul>

                <h2>享受生活中的小美好</h2>
                <p>秋天的第一杯奶茶，不仅仅是一杯饮品，更是对生活的热爱和向往。让我们在繁忙的工作中，也不要忘记享受生活中的这些美好时刻。</p>

                <blockquote>
                    <p>"生活不只是眼前的代码，还有诗和远方。"</p>
                </blockquote>

                <h2>结语</h2>
                <p>希望每一位程序员朋友，都能在代码的世界里找到成就感，在生活中找到幸福感。让我们用代码改变世界，用生活温暖自己。</p>
            `,
            prevId: 1,
            nextId: 3,
            related: [5, 1]
        },
        3: {
            id: 3,
            title: 'CSS Grid布局的实践应用与技巧分享',
            date: '2024年10月15日',
            datetime: '2024-10-15',
            category: '技术',
            tags: ['CSS', '布局', '前端'],
            content: `
                <p>CSS Grid是现代Web布局的强大工具，它为我们提供了二维布局的完美解决方案。通过实际项目的应用，我总结了一些Grid布局的实用技巧和最佳实践。</p>

                <h2>Grid布局基础</h2>
                <p>CSS Grid是一个二维布局系统，可以同时处理行和列。它比Flexbox更适合处理复杂的布局场景。</p>

                <h3>基本语法</h3>
                <pre><code>.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 1rem;
}</code></pre>

                <h2>实用技巧</h2>
                <h3>1. 响应式布局</h3>
                <p>使用auto-fit和minmax可以实现完美的响应式布局：</p>
                <pre><code>.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}</code></pre>

                <h3>2. 不规则布局</h3>
                <p>Grid可以轻松实现不规则的布局效果：</p>
                <pre><code>.item-1 {
  grid-column: span 2;
  grid-row: span 2;
}</code></pre>

                <h3>3. 对齐方式</h3>
                <p>Grid提供了强大的对齐功能：</p>
                <ul>
                    <li><code>justify-items</code>：控制网格项的水平对齐</li>
                    <li><code>align-items</code>：控制网格项的垂直对齐</li>
                    <li><code>place-items</code>：同时设置水平和垂直对齐</li>
                </ul>

                <h2>最佳实践</h2>
                <p>在实际项目中，我总结了以下最佳实践：</p>
                <ol>
                    <li>合理使用grid-template-areas，让布局更清晰</li>
                    <li>使用gap替代margin，避免额外的计算</li>
                    <li>结合媒体查询实现响应式设计</li>
                    <li>注意浏览器兼容性，适当使用fallback方案</li>
                </ol>

                <h2>常见问题解决</h2>
                <h3>内容溢出问题</h3>
                <p>当内容超出网格单元格时，可以使用minmax来设置最小和最大尺寸：</p>
                <pre><code>.container {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}</code></pre>

                <h2>总结</h2>
                <p>CSS Grid是一个强大的布局工具，掌握它可以让我们的布局工作变得更加高效。希望这些技巧能帮助到大家。</p>
            `,
            prevId: 2,
            nextId: 4,
            related: [1, 4]
        },
        4: {
            id: 4,
            title: 'Node.js性能优化的几个关键点',
            date: '2024年10月10日',
            datetime: '2024-10-10',
            category: '技术',
            tags: ['Node.js', '性能优化', '后端'],
            content: `
                <p>在开发高并发的Node.js应用时，性能优化是一个不可忽视的话题。本文将从内存管理、异步处理、数据库优化等几个维度，分享一些实用的性能优化技巧。</p>

                <h2>内存管理</h2>
                <p>Node.js基于V8引擎，内存管理是性能优化的关键。合理的内存使用可以避免内存泄漏和GC压力。</p>

                <h3>避免内存泄漏</h3>
                <ul>
                    <li>及时清理定时器和事件监听器</li>
                    <li>避免闭包导致的变量无法释放</li>
                    <li>使用流处理大文件，避免一次性加载到内存</li>
                </ul>

                <h3>内存监控</h3>
                <pre><code>// 使用heapdump分析内存
const heapdump = require('heapdump');
heapdump.writeSnapshot((err, filename) => {
  console.log('Heap snapshot written to', filename);
});</code></pre>

                <h2>异步处理优化</h2>
                <p>Node.js的核心优势是异步I/O，合理使用异步操作可以显著提升性能。</p>

                <h3>使用Promise.all并行处理</h3>
                <pre><code>// 并行处理多个异步操作
const results = await Promise.all([
  fetchData1(),
  fetchData2(),
  fetchData3()
]);</code></pre>

                <h3>避免回调地狱</h3>
                <p>使用async/await让代码更清晰，同时保持异步性能：</p>
                <pre><code>async function processData() {
  try {
    const data1 = await fetchData1();
    const data2 = await processData1(data1);
    return await saveData(data2);
  } catch (error) {
    console.error(error);
  }
}</code></pre>

                <h2>数据库优化</h2>
                <h3>连接池管理</h3>
                <p>合理配置数据库连接池，避免连接过多或过少：</p>
                <pre><code>const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mydb'
});</code></pre>

                <h3>查询优化</h3>
                <ul>
                    <li>使用索引加速查询</li>
                    <li>避免N+1查询问题</li>
                    <li>使用分页限制返回数据量</li>
                </ul>

                <h2>缓存策略</h2>
                <p>合理使用缓存可以显著减少数据库压力和响应时间。</p>
                <ul>
                    <li>使用Redis缓存热点数据</li>
                    <li>实现HTTP缓存策略</li>
                    <li>使用内存缓存减少重复计算</li>
                </ul>

                <h2>总结</h2>
                <p>性能优化是一个持续的过程，需要根据实际场景不断调整。希望这些技巧能帮助大家构建更高性能的Node.js应用。</p>
            `,
            prevId: 3,
            nextId: 5,
            related: [1, 3]
        },
        5: {
            id: 5,
            title: '国庆假期的读书清单与思考',
            date: '2024年10月5日',
            datetime: '2024-10-05',
            category: '生活',
            tags: ['读书', '思考', '假期'],
            content: `
                <p>国庆七天假期，除了外出游玩，我也抽时间读了几本好书。《代码整洁之道》让我重新思考代码质量，《人月神话》让我理解项目管理的复杂性。分享一些读书心得。</p>

                <h2>《代码整洁之道》</h2>
                <p>这本书让我重新审视了代码质量的重要性。整洁的代码不仅仅是可读性，更是一种职业素养。</p>

                <h3>核心观点</h3>
                <ul>
                    <li><strong>有意义的命名</strong>：变量和函数名应该清晰表达其意图</li>
                    <li><strong>函数应该短小</strong>：一个函数只做一件事</li>
                    <li><strong>注释的艺术</strong>：好的代码不需要太多注释，但关键逻辑需要解释</li>
                </ul>

                <blockquote>
                    <p>"代码是写给人看的，只是偶尔在机器上运行。"</p>
                </blockquote>

                <h2>《人月神话》</h2>
                <p>这本经典之作让我理解了软件项目管理的复杂性和挑战。</p>

                <h3>主要启示</h3>
                <ul>
                    <li><strong>人月神话</strong>：增加人手并不能线性缩短项目时间</li>
                    <li><strong>概念完整性</strong>：系统设计需要统一的架构理念</li>
                    <li><strong>文档的重要性</strong>：好的文档是项目成功的关键</li>
                </ul>

                <h2>《重构：改善既有代码的设计》</h2>
                <p>重构是保持代码质量的重要手段，这本书提供了很多实用的重构技巧。</p>

                <h3>重构原则</h3>
                <ol>
                    <li>小步前进，频繁测试</li>
                    <li>保持功能不变</li>
                    <li>逐步改善代码结构</li>
                </ol>

                <h2>读书的收获</h2>
                <p>通过阅读这些经典书籍，我不仅学到了技术知识，更重要的是学会了思考的方法。每一本书都是一种思维方式，它们帮助我在技术道路上走得更远。</p>

                <h2>推荐的阅读方法</h2>
                <ul>
                    <li>做笔记，记录重要观点</li>
                    <li>实践书中的理念</li>
                    <li>与同事分享读书心得</li>
                    <li>定期回顾，加深理解</li>
                </ul>

                <h2>结语</h2>
                <p>阅读是程序员成长的重要途径。希望每一位程序员都能保持阅读的习惯，在技术的道路上不断进步。</p>
            `,
            prevId: 4,
            nextId: null,
            related: [2, 3]
        }
    };

    // 获取URL参数
    function getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // 加载文章内容
    function loadArticle(articleId) {
        const article = articles[articleId];
        if (!article) {
            // 文章不存在，跳转到首页
            window.location.href = 'index.html';
            return;
        }

        // 更新页面标题
        document.title = `${article.title} - Zyyo的博客`;

        // 更新文章信息
        document.getElementById('articleDate').textContent = article.date;
        document.getElementById('articleDate').setAttribute('datetime', article.datetime);
        document.getElementById('articleCategory').textContent = article.category;
        document.getElementById('articleTitle').textContent = article.title;

        // 更新标签
        const tagsContainer = document.getElementById('articleTags');
        tagsContainer.innerHTML = '';
        article.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'tag';
            tagElement.textContent = tag;
            tagsContainer.appendChild(tagElement);
        });

        // 更新文章内容
        document.getElementById('articleBody').innerHTML = article.content;

        // 更新导航链接
        if (article.prevId) {
            const prevArticle = articles[article.prevId];
            const prevLink = document.getElementById('prevArticle');
            prevLink.href = `article.html?id=${article.prevId}`;
            prevLink.querySelector('.nav-title').textContent = prevArticle.title;
        } else {
            document.getElementById('prevArticle').style.display = 'none';
        }

        if (article.nextId) {
            const nextArticle = articles[article.nextId];
            const nextLink = document.getElementById('nextArticle');
            nextLink.href = `article.html?id=${article.nextId}`;
            nextLink.querySelector('.nav-title').textContent = nextArticle.title;
        } else {
            document.getElementById('nextArticle').style.display = 'none';
        }

        // 更新相关文章
        updateRelatedArticles(article.related);

        // 生成目录
        generateTOC();
    }

    // 更新相关文章
    function updateRelatedArticles(relatedIds) {
        const relatedList = document.querySelector('.related-list');
        if (!relatedList) return;
        
        relatedList.innerHTML = '';

        relatedIds.forEach(id => {
            const article = articles[id];
            if (article) {
                // 提取纯文本内容（去除HTML标签）
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = article.content;
                const textContent = tempDiv.textContent || tempDiv.innerText || '';
                const excerpt = textContent.substring(0, 80) + '...';
                
                const card = document.createElement('article');
                card.className = 'related-card';
                card.innerHTML = `
                    <a href="article.html?id=${article.id}">
                        <h3>${article.title}</h3>
                        <p>${excerpt}</p>
                        <div class="related-meta">
                            <time>${article.date}</time>
                            <span class="related-tag">${article.tags[0] || article.category}</span>
                        </div>
                    </a>
                `;
                relatedList.appendChild(card);
            }
        });
    }

    // 生成文章目录
    function generateTOC() {
        const headings = document.querySelectorAll('.article-body h2, .article-body h3');
        const tocList = document.querySelector('.toc-list');
        if (!tocList || headings.length === 0) return;

        tocList.innerHTML = '';

        headings.forEach((heading, index) => {
            const id = `section-${index + 1}`;
            heading.id = id;

            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${id}`;
            a.textContent = heading.textContent;
            a.addEventListener('click', function(e) {
                e.preventDefault();
                heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });

            li.appendChild(a);
            tocList.appendChild(li);
        });

        // 高亮当前章节
        updateActiveTOCItem();
    }

    // 更新激活的目录项
    function updateActiveTOCItem() {
        const headings = document.querySelectorAll('.article-body h2, .article-body h3');
        const tocLinks = document.querySelectorAll('.toc-list a');

        window.addEventListener('scroll', () => {
            let current = '';

            headings.forEach(heading => {
                const rect = heading.getBoundingClientRect();
                if (rect.top <= 100) {
                    current = heading.id;
                }
            });

            tocLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    // 点赞功能
    const likeBtn = document.getElementById('likeBtn');
    let likeCount = parseInt(localStorage.getItem(`like-${getUrlParameter('id')}`) || '0');
    likeBtn.querySelector('.like-count').textContent = likeCount;

    likeBtn.addEventListener('click', function() {
        likeCount++;
        this.querySelector('.like-count').textContent = likeCount;
        localStorage.setItem(`like-${getUrlParameter('id')}`, likeCount);
        this.classList.toggle('liked');
    });

    // 收藏功能
    const bookmarkBtn = document.getElementById('bookmarkBtn');
    const bookmarked = localStorage.getItem(`bookmark-${getUrlParameter('id')}`) === 'true';
    if (bookmarked) {
        bookmarkBtn.classList.add('bookmarked');
    }

    bookmarkBtn.addEventListener('click', function() {
        const isBookmarked = this.classList.contains('bookmarked');
        if (isBookmarked) {
            this.classList.remove('bookmarked');
            localStorage.removeItem(`bookmark-${getUrlParameter('id')}`);
        } else {
            this.classList.add('bookmarked');
            localStorage.setItem(`bookmark-${getUrlParameter('id')}`, 'true');
        }
    });

    // 分享功能
    document.getElementById('shareBtn').addEventListener('click', function() {
        if (navigator.share) {
            navigator.share({
                title: document.getElementById('articleTitle').textContent,
                text: '分享一篇文章',
                url: window.location.href
            });
        } else {
            // 复制链接到剪贴板
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('链接已复制到剪贴板！');
            });
        }
    });

    // 初始化
    const articleId = getUrlParameter('id');
    if (articleId) {
        loadArticle(parseInt(articleId));
    } else {
        // 没有ID，跳转到首页
        window.location.href = 'index.html';
    }
});
