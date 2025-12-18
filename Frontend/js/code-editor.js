// 前端编辑预览应用核心功能
class CodeEditorApp {
    constructor() {
        this.editors = {};
        this.currentLang = 'html';
        this.projectName = '未命名项目';
        this.versionHistory = [];
        this.autoSaveTimer = null;
        this.updateDelay = 500;
        
        this.init();
    }

    init() {
        this.initEditors();
        this.initEventListeners();
        this.updateProjectNameDisplay();
        this.updatePreview();
        this.saveVersion();
    }

    // 初始化代码编辑器
    initEditors() {
        // 编辑器配置选项
        const editorOptions = {
            mode: 'htmlmixed',
            theme: 'monokai',
            lineNumbers: true,
            autoCloseTags: true,
            matchBrackets: true,
            showHint: true,
            // 优化大型文件性能
            lineWrapping: false,
            foldGutter: true,
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
            // 减少不必要的渲染
            readOnly: false,
            tabSize: 2,
            indentUnit: 2,
            extraKeys: {
                'Ctrl-Space': 'autocomplete',
                'Ctrl-S': (cm) => this.saveProject(),
                'Ctrl-F': 'findPersistent',
                'Ctrl-G': 'findNext',
                'Shift-Ctrl-G': 'findPrev',
                'Shift-Ctrl-F': 'replace'
            }
        };

        // HTML编辑器
        editorOptions.mode = 'htmlmixed';
        this.editors.html = CodeMirror.fromTextArea(document.getElementById('html-editor'), editorOptions);

        // CSS编辑器
        editorOptions.mode = 'css';
        this.editors.css = CodeMirror.fromTextArea(document.getElementById('css-editor'), editorOptions);

        // JavaScript编辑器
        editorOptions.mode = 'javascript';
        this.editors.javascript = CodeMirror.fromTextArea(document.getElementById('javascript-editor'), editorOptions);

        // 隐藏其他编辑器
        this.editors.css.getWrapperElement().style.display = 'none';
        this.editors.javascript.getWrapperElement().style.display = 'none';

        // 添加编辑器内容变化监听
        Object.keys(this.editors).forEach(lang => {
            this.editors[lang].on('change', () => {
                this.debounceUpdatePreview();
            });
        });
    }

    // 初始化事件监听器
    initEventListeners() {
        // 标签切换
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.lang);
            });
        });

        // 工具栏按钮
        document.getElementById('newBtn').addEventListener('click', () => this.newProject());
        document.getElementById('saveBtn').addEventListener('click', () => this.saveProject());
        document.getElementById('openBtn').addEventListener('click', () => this.openProject());
        document.getElementById('deleteBtn').addEventListener('click', () => this.deleteProject());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportProject());
        document.getElementById('versionBtn').addEventListener('click', () => this.toggleVersionPanel());

        // 版本控制面板
        document.getElementById('closeVersionBtn').addEventListener('click', () => this.toggleVersionPanel());

        // 项目名称编辑监听
        const projectNameDisplay = document.getElementById('projectNameDisplay');
        projectNameDisplay.addEventListener('blur', () => {
            this.updateProjectNameFromDisplay();
        });
        projectNameDisplay.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                projectNameDisplay.blur();
            }
        });

        // 模态框事件
        this.initModalEvents();
    }

    // 更新项目名称显示
    updateProjectNameDisplay() {
        const projectNameDisplay = document.getElementById('projectNameDisplay');
        projectNameDisplay.textContent = this.projectName;
    }

    // 从显示中更新项目名称
    updateProjectNameFromDisplay() {
        const projectNameDisplay = document.getElementById('projectNameDisplay');
        const newName = projectNameDisplay.textContent.trim() || '未命名项目';
        
        if (newName !== this.projectName) {
            // 如果是已保存的项目，需要先删除旧名称的项目
            const oldKey = `project_${this.projectName}`;
            if (localStorage.getItem(oldKey)) {
                localStorage.removeItem(oldKey);
            }
            
            this.projectName = newName;
            this.showNotification('项目名称已更新', 'info');
        } else {
            // 确保显示的内容与实际项目名称一致
            projectNameDisplay.textContent = this.projectName;
        }
    }

    // 初始化模态框事件
    initModalEvents() {
        // 新建项目模态框
        const newModal = document.getElementById('newModal');
        document.getElementById('closeNewModal').addEventListener('click', () => {
            newModal.style.display = 'none';
        });
        document.getElementById('cancelNewBtn').addEventListener('click', () => {
            newModal.style.display = 'none';
        });
        document.getElementById('newForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createNewProject();
        });

        // 保存项目模态框
        const saveModal = document.getElementById('saveModal');
        document.getElementById('closeSaveModal').addEventListener('click', () => {
            saveModal.style.display = 'none';
        });
        document.getElementById('cancelSaveBtn').addEventListener('click', () => {
            saveModal.style.display = 'none';
        });
        document.getElementById('saveForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProjectWithName();
        });

        // 点击模态框外部关闭
        window.addEventListener('click', (e) => {
            if (e.target === newModal) {
                newModal.style.display = 'none';
            }
            if (e.target === saveModal) {
                saveModal.style.display = 'none';
            }
        });
    }

    // 切换编辑器标签
    switchTab(lang) {
        if (this.currentLang === lang) return;

        // 隐藏当前编辑器
        this.editors[this.currentLang].getWrapperElement().style.display = 'none';
        document.querySelector(`.tab[data-lang="${this.currentLang}"]`).classList.remove('active');

        // 显示新编辑器
        this.currentLang = lang;
        this.editors[lang].getWrapperElement().style.display = 'block';
        document.querySelector(`.tab[data-lang="${lang}"]`).classList.add('active');

        // 聚焦到新编辑器
        this.editors[lang].focus();
    }

    // 防抖更新预览
    debounceUpdatePreview() {
        if (this.autoSaveTimer) {
            clearTimeout(this.autoSaveTimer);
        }
        this.autoSaveTimer = setTimeout(() => {
            this.updatePreview();
        }, this.updateDelay);
    }

    // 更新预览
    updatePreview() {
        try {
            const html = this.editors.html.getValue();
            const css = this.editors.css.getValue();
            const js = this.editors.javascript.getValue();

            // 构建完整的HTML内容
            let fullHtml = html;
            
            // 替换CSS占位符
            if (fullHtml.includes('/* CSS 将在这里插入 */')) {
                fullHtml = fullHtml.replace('/* CSS 将在这里插入 */', css);
            } else if (!fullHtml.includes('<style>')) {
                // 如果没有style标签，添加到head中
                fullHtml = fullHtml.replace('</head>', `<style>${css}</style></head>`);
            }

            // 替换JavaScript占位符
            if (fullHtml.includes('// JavaScript 将在这里插入')) {
                fullHtml = fullHtml.replace('// JavaScript 将在这里插入', js);
            } else if (!fullHtml.includes('<script>')) {
                // 如果没有script标签，添加到body末尾
                fullHtml = fullHtml.replace('</body>', `<script>${js}</script></body>`);
            }

            // 更新iframe内容
            const iframe = document.getElementById('preview-iframe');
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            
            // 优化iframe更新性能
            iframeDoc.open();
            iframeDoc.write(fullHtml);
            
            // 使用requestAnimationFrame确保渲染流畅
            requestAnimationFrame(() => {
                iframeDoc.close();
            });

            // 更新最后更新时间
            this.updateLastUpdateTime();
        } catch (error) {
            console.error('预览更新失败:', error);
            this.showNotification('预览更新失败，请检查代码语法', 'warning');
        }
    }

    // 更新最后更新时间
    updateLastUpdateTime() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString();
        document.getElementById('update-time').textContent = `最后更新: ${timeStr}`;
    }

    // 新建项目
    newProject() {
        document.getElementById('newModal').style.display = 'block';
    }

    // 创建新项目
    createNewProject() {
        const projectName = document.getElementById('projectName').value.trim();
        if (projectName) {
            this.projectName = projectName;
            this.updateProjectNameDisplay();
            
            // 重置编辑器内容
            this.editors.html.setValue(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName}</title>
    <style>
        /* CSS 将在这里插入 */
    </style>
</head>
<body>
    <h1>${projectName}</h1>
    <p>开始编辑你的代码...</p>
    
    <script>
        // JavaScript 将在这里插入
    </script>
</body>
</html>`);
            
            this.editors.css.setValue('/* 在这里编写你的CSS代码 */');
            this.editors.javascript.setValue('// 在这里编写你的JavaScript代码');
            
            this.updatePreview();
            this.saveVersion();
            document.getElementById('newModal').style.display = 'none';
            document.getElementById('newForm').reset();
        }
    }

    // 保存项目
    saveProject() {
        this.saveVersion();
        
        // 保存到本地存储
        const projectData = {
            name: this.projectName,
            html: this.editors.html.getValue(),
            css: this.editors.css.getValue(),
            javascript: this.editors.javascript.getValue(),
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem(`project_${this.projectName}`, JSON.stringify(projectData));
        
        // 显示保存成功提示
        this.showNotification('项目已保存', 'success');
    }

    // 保存项目（带名称）
    saveProjectWithName() {
        const projectName = document.getElementById('saveName').value.trim();
        if (projectName) {
            this.projectName = projectName;
            this.updateProjectNameDisplay();
            this.saveProject();
            document.getElementById('saveModal').style.display = 'none';
            document.getElementById('saveForm').reset();
        }
    }

    // 打开项目
    openProject() {
        // 从本地存储获取项目列表
        const projects = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('project_')) {
                projects.push(key.replace('project_', ''));
            }
        }

        if (projects.length === 0) {
            this.showNotification('没有找到保存的项目', 'warning');
            return;
        }

        const projectName = prompt('请选择要打开的项目:\n' + projects.join('\n'));
        if (projectName && projects.includes(projectName)) {
            this.loadProject(projectName);
        }
    }

    // 加载项目
    loadProject(projectName) {
        const projectData = JSON.parse(localStorage.getItem(`project_${projectName}`));
        if (projectData) {
            this.projectName = projectData.name;
            this.updateProjectNameDisplay();
            this.editors.html.setValue(projectData.html);
            this.editors.css.setValue(projectData.css);
            this.editors.javascript.setValue(projectData.javascript);
            
            this.updatePreview();
            this.saveVersion();
            this.showNotification('项目已打开', 'success');
        }
    }

    // 删除项目
    deleteProject() {
        // 从本地存储获取项目列表
        const projects = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('project_')) {
                projects.push(key.replace('project_', ''));
            }
        }

        if (projects.length === 0) {
            this.showNotification('没有找到可删除的项目', 'warning');
            return;
        }

        const projectName = prompt('请选择要删除的项目:\n' + projects.join('\n'));
        if (projectName && projects.includes(projectName)) {
            if (confirm(`确定要删除项目 "${projectName}" 吗？此操作不可恢复。`)) {
                // 从本地存储中删除项目
                localStorage.removeItem(`project_${projectName}`);
                
                // 如果当前正在编辑的是被删除的项目，重置编辑器
                if (this.projectName === projectName) {
                    this.projectName = '未命名项目';
                    this.editors.html.setValue(`<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>预览页面</title>\n    <style>\n        /* CSS 将在这里插入 */\n    </style>\n</head>\n<body>\n    <h1>欢迎使用前端编辑预览应用</h1>\n    <p>这是一个实时预览的前端开发工具</p>\n    <button onclick="showMessage()">点击我</button>\n    \n    <script>\n        // JavaScript 将在这里插入\n    </script>\n</body>\n</html>`);
                    this.editors.css.setValue('* {\n    margin: 0;\n    padding: 0;\n    box-sizing: border-box;\n}\n\nbody {\n    font-family: \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif;\n    background-color: #f0f0f0;\n    color: #333;\n    line-height: 1.6;\n    padding: 20px;\n}\n\nh1 {\n    color: #2c3e50;\n    margin-bottom: 20px;\n    text-align: center;\n}\n\np {\n    margin-bottom: 20px;\n    text-align: center;\n}\n\nbutton {\n    display: block;\n    margin: 0 auto;\n    padding: 10px 20px;\n    background-color: #3498db;\n    color: white;\n    border: none;\n    border-radius: 4px;\n    cursor: pointer;\n    font-size: 16px;\n    transition: background-color 0.3s ease;\n}\n\nbutton:hover {\n    background-color: #2980b9;\n}');
                    this.editors.javascript.setValue('function showMessage() {\n    alert(\'Hello, World! 这是一个JavaScript函数\');\n}\n\n// 添加一些动态效果\nwindow.addEventListener(\'DOMContentLoaded\', function() {\n    const h1 = document.querySelector(\'h1\');\n    h1.style.opacity = \'0\';\n    h1.style.transform = \'translateY(-20px)\';\n    \n    setTimeout(() => {\n        h1.style.transition = \'all 0.5s ease\';\n        h1.style.opacity = \'1\';\n        h1.style.transform = \'translateY(0)\';\n    }, 100);\n});');
                    this.updatePreview();
                }
                
                this.showNotification('项目已删除', 'success');
            }
        }
    }

    // 导出项目
    exportProject() {
        const html = this.editors.html.getValue();
        const css = this.editors.css.getValue();
        const js = this.editors.javascript.getValue();

        // 构建完整的HTML文件
        let fullHtml = html;
        
        // 替换CSS占位符
        if (fullHtml.includes('/* CSS 将在这里插入 */')) {
            fullHtml = fullHtml.replace('/* CSS 将在这里插入 */', css);
        } else if (!fullHtml.includes('<style>')) {
            fullHtml = fullHtml.replace('</head>', `<style>${css}</style></head>`);
        }

        // 替换JavaScript占位符
        if (fullHtml.includes('// JavaScript 将在这里插入')) {
            fullHtml = fullHtml.replace('// JavaScript 将在这里插入', js);
        } else if (!fullHtml.includes('<script>')) {
            fullHtml = fullHtml.replace('</body>', `<script>${js}</script></body>`);
        }

        // 创建下载链接
        const blob = new Blob([fullHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.projectName}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('项目已导出', 'success');
    }

    // 保存版本
    saveVersion() {
        // 检查内容是否有变化，避免保存相同版本
        const currentHtml = this.editors.html.getValue();
        const currentCss = this.editors.css.getValue();
        const currentJs = this.editors.javascript.getValue();
        
        const lastVersion = this.versionHistory[0];
        if (lastVersion && 
            lastVersion.html === currentHtml && 
            lastVersion.css === currentCss && 
            lastVersion.javascript === currentJs) {
            return; // 内容未变化，不保存版本
        }
        
        const version = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            html: currentHtml,
            css: currentCss,
            javascript: currentJs
        };

        this.versionHistory.unshift(version);
        
        // 限制版本历史数量，优化内存使用
        if (this.versionHistory.length > 15) {
            this.versionHistory = this.versionHistory.slice(0, 15);
        }

        this.updateVersionList();
    }

    // 更新版本列表
    updateVersionList() {
        const versionList = document.getElementById('versionList');
        versionList.innerHTML = '';

        this.versionHistory.forEach(version => {
            const versionItem = document.createElement('div');
            versionItem.className = 'version-item';
            versionItem.innerHTML = `
                <div><strong>${new Date(version.timestamp).toLocaleString()}</strong></div>
                <div style="font-size: 0.75rem; color: #666;">点击恢复此版本</div>
            `;
            versionItem.addEventListener('click', () => this.restoreVersion(version));
            versionList.appendChild(versionItem);
        });
    }

    // 恢复版本
    restoreVersion(version) {
        if (confirm('确定要恢复到此版本吗？当前未保存的更改将丢失。')) {
            this.editors.html.setValue(version.html);
            this.editors.css.setValue(version.css);
            this.editors.javascript.setValue(version.javascript);
            this.updatePreview();
            this.saveVersion();
            this.showNotification('版本已恢复', 'success');
        }
    }

    // 切换版本控制面板
    toggleVersionPanel() {
        const versionPanel = document.getElementById('versionPanel');
        versionPanel.style.display = versionPanel.style.display === 'flex' ? 'none' : 'flex';
    }

    // 显示通知
    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background-color: ${type === 'success' ? '#28a745' : type === 'warning' ? '#ffc107' : '#17a2b8'};
            color: white;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            font-size: 0.9rem;
            transition: all 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // 3秒后自动移除
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new CodeEditorApp();
});