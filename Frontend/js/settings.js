// 设置面板功能
(function() {
    'use strict';
    
    let settingsPanel = null;
    let isOpen = false;
    
    // 默认设置
    const defaultSettings = {
        themeColor: '#667eea',
        titleColor: '#a0c4ff',
        backgroundBrightness: 85,
        blurAmount: 20,
        wallpaper: 1
    };
    
    // 从localStorage加载设置
    function loadSettings() {
        const saved = localStorage.getItem('siteSettings');
        if (saved) {
            return JSON.parse(saved);
        }
        return defaultSettings;
    }
    
    // 保存设置到localStorage
    function saveSettings(settings) {
        localStorage.setItem('siteSettings', JSON.stringify(settings));
    }
    
    // 应用设置
    function applySettings(settings) {
        // 应用主题颜色
        document.documentElement.style.setProperty('--theme-color', settings.themeColor);
        document.documentElement.style.setProperty('--secondary-color', settings.themeColor);
        
        // 应用标题颜色
        const profileName = document.querySelector('.profile-name');
        if (profileName) {
            profileName.style.color = settings.titleColor;
        }
        
        // 应用背景亮度
        const brightness = settings.backgroundBrightness / 100;
        document.body.style.filter = `brightness(${brightness})`;
        
        // 应用模糊度
        const blurValue = settings.blurAmount;
        const cards = document.querySelectorAll('.header, .article-card, .feature-card');
        cards.forEach(card => {
            card.style.backdropFilter = `blur(${blurValue}px) saturate(180%)`;
            card.style.webkitBackdropFilter = `blur(${blurValue}px) saturate(180%)`;
        });
        
        // 应用壁纸
        applyWallpaper(settings.wallpaper);
    }
    
    // 应用壁纸
    function applyWallpaper(wallpaperNum) {
        const wallpapers = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
            'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
            'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
            'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)'
        ];
        
        if (wallpaperNum >= 1 && wallpaperNum <= 10) {
            document.body.style.background = wallpapers[wallpaperNum - 1];
        }
    }
    
    // 创建设置面板
    function createSettingsPanel() {
        const settings = loadSettings();
        
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.id = 'settings-overlay';
        overlay.className = 'settings-overlay';
        overlay.addEventListener('click', toggleSettings);
        
        settingsPanel = document.createElement('div');
        settingsPanel.id = 'settings-panel';
        settingsPanel.className = 'settings-panel';
        settingsPanel.innerHTML = `
            <div class="settings-header">
                <h3>🎨 背景设置</h3>
                <button class="settings-close" id="settings-close">×</button>
            </div>
            <div class="settings-content">
                <div class="settings-section">
                    <label>主题颜色</label>
                    <input type="color" id="theme-color" value="${settings.themeColor}">
                </div>
                
                <div class="settings-section">
                    <label>标题颜色</label>
                    <input type="color" id="title-color" value="${settings.titleColor}">
                </div>
                
                <div class="settings-section">
                    <label>背景亮度 <span id="brightness-value">${settings.backgroundBrightness}</span>%</label>
                    <input type="range" id="background-brightness" min="0" max="100" value="${settings.backgroundBrightness}">
                </div>
                
                <div class="settings-section">
                    <label>模糊度 <span id="blur-value">${settings.blurAmount}</span></label>
                    <input type="range" id="blur-amount" min="0" max="50" value="${settings.blurAmount}">
                </div>
                
                <div class="settings-section">
                    <label>静态壁纸</label>
                    <div class="wallpaper-grid" id="wallpaper-grid">
                        ${Array.from({length: 10}, (_, i) => 
                            `<div class="wallpaper-item ${i + 1 === settings.wallpaper ? 'active' : ''}" data-wallpaper="${i + 1}">壁纸${i + 1}</div>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="settings-actions">
                    <button class="settings-btn" id="settings-reset">恢复默认</button>
                    <button class="settings-btn settings-btn-primary" id="settings-save">确认</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        document.body.appendChild(settingsPanel);
        
        // 绑定事件
        bindSettingsEvents();
        
        // 应用当前设置
        applySettings(settings);
    }
    
    // 绑定设置事件
    function bindSettingsEvents() {
        // 关闭按钮
        document.getElementById('settings-close').addEventListener('click', toggleSettings);
        
        // 主题颜色
        document.getElementById('theme-color').addEventListener('input', function(e) {
            const settings = loadSettings();
            settings.themeColor = e.target.value;
            applySettings(settings);
        });
        
        // 标题颜色
        document.getElementById('title-color').addEventListener('input', function(e) {
            const settings = loadSettings();
            settings.titleColor = e.target.value;
            applySettings(settings);
        });
        
        // 背景亮度
        const brightnessSlider = document.getElementById('background-brightness');
        brightnessSlider.addEventListener('input', function(e) {
            const value = e.target.value;
            document.getElementById('brightness-value').textContent = value;
            const settings = loadSettings();
            settings.backgroundBrightness = parseInt(value);
            applySettings(settings);
        });
        
        // 模糊度
        const blurSlider = document.getElementById('blur-amount');
        blurSlider.addEventListener('input', function(e) {
            const value = e.target.value;
            document.getElementById('blur-value').textContent = value;
            const settings = loadSettings();
            settings.blurAmount = parseInt(value);
            applySettings(settings);
        });
        
        // 壁纸选择
        document.querySelectorAll('.wallpaper-item').forEach(item => {
            item.addEventListener('click', function() {
                document.querySelectorAll('.wallpaper-item').forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                const settings = loadSettings();
                settings.wallpaper = parseInt(this.dataset.wallpaper);
                applySettings(settings);
            });
        });
        
        // 恢复默认
        document.getElementById('settings-reset').addEventListener('click', function() {
            if (confirm('确定要恢复默认设置吗？')) {
                saveSettings(defaultSettings);
                applySettings(defaultSettings);
                location.reload();
            }
        });
        
        // 保存
        document.getElementById('settings-save').addEventListener('click', function() {
            const settings = loadSettings();
            saveSettings(settings);
            toggleSettings();
        });
    }
    
    // 切换设置面板
    function toggleSettings() {
        if (!settingsPanel) {
            createSettingsPanel();
        }
        
        isOpen = !isOpen;
        const overlay = document.getElementById('settings-overlay');
        if (isOpen) {
            settingsPanel.classList.add('open');
            if (overlay) overlay.classList.add('open');
        } else {
            settingsPanel.classList.remove('open');
            if (overlay) overlay.classList.remove('open');
        }
    }
    
    // 添加设置按钮到头部
    function addSettingsButton() {
        const profileLinks = document.querySelector('.profile-links');
        if (profileLinks) {
            const settingsBtn = document.createElement('a');
            settingsBtn.href = '#';
            settingsBtn.className = 'profile-link';
            settingsBtn.textContent = '背景设置';
            settingsBtn.addEventListener('click', function(e) {
                e.preventDefault();
                toggleSettings();
            });
            profileLinks.appendChild(settingsBtn);
        }
    }
    
    // 初始化
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                addSettingsButton();
                const settings = loadSettings();
                applySettings(settings);
            });
        } else {
            addSettingsButton();
            const settings = loadSettings();
            applySettings(settings);
        }
    }
    
    init();
})();

