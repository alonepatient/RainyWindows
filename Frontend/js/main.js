// 博客主要功能脚本
(function() {
    'use strict';

    // DOM元素缓存
    const elements = {
        navLinks: document.querySelectorAll('.nav-link'),
        categoryBtns: document.querySelectorAll('.category-btn'),
        galleryItems: document.querySelectorAll('.gallery-item'),
        lightbox: document.getElementById('lightbox'),
        lightboxImage: document.getElementById('lightbox-image'),
        messageForm: document.getElementById('messageForm'),
        linkApplyForm: document.getElementById('linkApplyForm'),
        emojiButtons: document.querySelectorAll('.emoji-btn'),
        likeButtons: document.querySelectorAll('.like-btn'),
        replyButtons: document.querySelectorAll('.reply-btn'),
        loadMoreBtns: document.querySelectorAll('.load-more-btn')
    };

    // 初始化函数
    function init() {
        setupNavigation();
        setupGallery();
        setupForms();
        setupInteractions();
        setupLazyLoading();
        setupScrollMonitoring();
        setupMouseTracking();
        setupAvatarFlip();
        console.log('🚀 博客功能已加载完成');
    }
    
    // 鼠标跟踪功能 - 让3D角色看向鼠标位置
    function setupMouseTracking() {
        const character3D = document.querySelector('.character-3d');
        if (!character3D) return;
        
        // 获取SVG元素
        const sunDoll = document.querySelector('.sun-doll');
        const robotSphere = document.querySelector('.robot-sphere');
        
        // 获取所有眼睛元素
        const eyeElements = {
            sun: {
                left: sunDoll?.querySelector('circle:nth-of-type(3)'),
                right: sunDoll?.querySelector('circle:nth-of-type(4)')
            },
            robot: {
                pupil: robotSphere?.querySelector('#robot-eye-pupil'),
                highlight: robotSphere?.querySelector('#robot-eye-highlight')
            }
        };
        
        // 获取高光元素
        const highlightElements = {
            sun: {
                left: sunDoll?.querySelector('circle:nth-of-type(5)'),
                right: sunDoll?.querySelector('circle:nth-of-type(6)')
            }
        };
        
        // 眼睛移动的最大距离
        const maxEyeMovement = 5;
        
        // 监听鼠标移动事件
        document.addEventListener('mousemove', (e) => {
            // 只有当3D角色可见时才跟踪
            if (character3D.classList.contains('visible')) {
                // 获取角色元素的位置信息
                const rect = character3D.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                // 计算鼠标相对于角色中心的偏移
                const offsetX = e.clientX - centerX;
                const offsetY = e.clientY - centerY;
                
                // 计算角度和距离比例
                const angle = Math.atan2(offsetY, offsetX);
                const distance = Math.min(Math.sqrt(offsetX * offsetX + offsetY * offsetY), 200);
                const movementRatio = distance / 200;
                
                // 计算眼睛应该移动的距离
                const eyeMoveX = Math.cos(angle) * movementRatio * maxEyeMovement;
                const eyeMoveY = Math.sin(angle) * movementRatio * maxEyeMovement;
                
                // 计算角色旋转角度 (限制旋转范围在-45度到45度之间)
                const rotationAngle = Math.max(-45, Math.min(45, Math.atan2(offsetX, -offsetY) * 180 / Math.PI));
                
                // 确定当前主题模式
                const isDarkMode = document.body.classList.contains('dark-mode');
                
                // 更新对应主题的眼睛位置和角色旋转
                if (isDarkMode && robotSphere) {
                    // 深色模式 - 更新独眼球体机器人
                    robotSphere.style.transform = `rotate(${rotationAngle}deg)`;
                    
                    // 更新红色主眼球位置（轻微跟随鼠标）
                    if (eyeElements.robot.pupil && document.getElementById('robot-eye-main')) {
                        const mainEye = document.getElementById('robot-eye-main');
                        // 主眼球移动的最大距离为2（轻微移动，不完全跟随）
                        const maxMainEyeMovement = 2;
                        const mainEyeMoveX = Math.cos(angle) * movementRatio * maxMainEyeMovement;
                        const mainEyeMoveY = Math.sin(angle) * movementRatio * maxMainEyeMovement;
                        
                        mainEye.setAttribute('cx', 50 + mainEyeMoveX);
                        mainEye.setAttribute('cy', 45 + mainEyeMoveY);
                        
                        // 瞳孔移动的最大距离为4（瞳孔半径）
                        const maxPupilMovement = 4;
                        const pupilMoveX = Math.cos(angle) * movementRatio * maxPupilMovement;
                        const pupilMoveY = Math.sin(angle) * movementRatio * maxPupilMovement;
                        
                        eyeElements.robot.pupil.setAttribute('cx', 50 + pupilMoveX);
                        eyeElements.robot.pupil.setAttribute('cy', 45 + pupilMoveY);
                    }
                    
                    // 同步更新高光位置
                    if (eyeElements.robot.highlight) {
                        // 高光移动距离略大于瞳孔
                        const maxHighlightMovement = 5;
                        const highlightMoveX = Math.cos(angle) * movementRatio * maxHighlightMovement;
                        const highlightMoveY = Math.sin(angle) * movementRatio * maxHighlightMovement;
                        
                        eyeElements.robot.highlight.setAttribute('cx', 52 + highlightMoveX);
                        eyeElements.robot.highlight.setAttribute('cy', 43 + highlightMoveY);
                    }
                } else if (sunDoll) {
                    // 浅色模式 - 更新晴天娃娃
                    sunDoll.style.transform = `rotate(${rotationAngle}deg)`;
                    
                    // 更新眼睛位置 (适配新的晴天娃娃SVG结构)
                    if (eyeElements.sun.left) {
                        eyeElements.sun.left.setAttribute('cx', 43 + eyeMoveX);
                        eyeElements.sun.left.setAttribute('cy', 45 + eyeMoveY);
                    }
                    if (eyeElements.sun.right) {
                        eyeElements.sun.right.setAttribute('cx', 57 + eyeMoveX);
                        eyeElements.sun.right.setAttribute('cy', 45 + eyeMoveY);
                    }
                    
                    // 同步更新高光位置
                    if (highlightElements.sun.left) {
                        highlightElements.sun.left.setAttribute('cx', 44 + eyeMoveX);
                        highlightElements.sun.left.setAttribute('cy', 44 + eyeMoveY);
                    }
                    if (highlightElements.sun.right) {
                        highlightElements.sun.right.setAttribute('cx', 58 + eyeMoveX);
                        highlightElements.sun.right.setAttribute('cy', 44 + eyeMoveY);
                    }
                }
            }
        });
    }
    
    // 滚动监测功能
    function setupScrollMonitoring() {
        const header = document.querySelector('.header');
        const timeWeatherInfo = document.querySelector('.time-weather-info');
        const themeSwitch = document.querySelector('.theme-switch');
        const character3D = document.querySelector('.character-3d');
        
        if (!header) return;
        
        // 初始化时确保元素是可见的
        if (timeWeatherInfo) {
            timeWeatherInfo.style.opacity = '1';
            timeWeatherInfo.style.transform = 'translateY(0)';
            timeWeatherInfo.style.pointerEvents = 'auto';
        }
        
        if (themeSwitch) {
            themeSwitch.style.opacity = '1';
            themeSwitch.style.transform = 'translateY(0)';
            themeSwitch.style.pointerEvents = 'auto';
        }
        
        // 初始化时隐藏3D角色，滚动后才显示
        if (character3D) {
            character3D.classList.remove('visible');
        }
        
        // 创建一个IntersectionObserver来监测header元素是否在视口中
        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            
            if (entry.isIntersecting) {
                // Header在视口中，显示元素
                if (timeWeatherInfo) {
                    timeWeatherInfo.style.opacity = '1';
                    timeWeatherInfo.style.transform = 'translateY(0)';
                    timeWeatherInfo.style.pointerEvents = 'auto';
                }
                if (themeSwitch) {
                    themeSwitch.style.opacity = '1';
                    themeSwitch.style.transform = 'translateY(0)';
                    themeSwitch.style.pointerEvents = 'auto';
                }
                // Header在视口中时隐藏3D角色
            if (character3D) {
                character3D.classList.remove('visible');
            }
            } else {
                // Header不在视口中（已滚动到主内容区域）
                // 隐藏时间和天气信息
                if (timeWeatherInfo) {
                    timeWeatherInfo.style.opacity = '0';
                    timeWeatherInfo.style.transform = 'translateY(-20px)';
                    timeWeatherInfo.style.pointerEvents = 'none';
                }
                if (themeSwitch) {
                    themeSwitch.style.opacity = '0';
                    themeSwitch.style.transform = 'translateY(-20px)';
                    themeSwitch.style.pointerEvents = 'none';
                }
                // 显示3D角色
            if (character3D) {
                character3D.classList.add('visible');
            }
            }
        }, {
            // 使用默认的root (viewport)
            // 当header元素完全不在视口中时才触发
            threshold: 0,

            // 添加边距，让元素在完全滚动出视口前开始消失
            rootMargin: '-50px 0px -50px 0px'
        });
        
        // 开始观察header元素
        observer.observe(header);
        
        // 保存observer实例，以便后续可能的清理
        window.scrollObserver = observer;
    }

    // 导航功能
    function setupNavigation() {
        // 平滑滚动 - 只对页面内锚点链接应用，不影响页面间跳转
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            // 确保这是一个页面内锚点链接，而不是完整URL
            if (anchor.getAttribute('href').length > 1 && !anchor.getAttribute('href').includes('://')) {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            }
        });

        // 活动链接高亮
        elements.navLinks.forEach(link => {
            if (link.href === window.location.href) {
                link.classList.add('active');
            }
        });
    }

    // 相册功能
    function setupGallery() {
        // 分类筛选
        if (elements.categoryBtns.length > 0) {
            elements.categoryBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const category = this.dataset.category;
                    
                    // 更新按钮状态
                    elements.categoryBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    
                    // 筛选图片
                    filterGalleryItems(category);
                });
            });
        }

        // 图片点击查看
        if (elements.galleryItems.length > 0) {
            elements.galleryItems.forEach((item, index) => {
                const img = item.querySelector('img');
                const overlay = item.querySelector('.gallery-overlay');
                
                if (img && overlay) {
                    item.addEventListener('click', function() {
                        openLightbox(img.src, overlay.querySelector('h3').textContent, overlay.querySelector('p').textContent, index);
                    });
                }
            });
        }

        // 灯箱功能
        setupLightbox();
    }

    // 筛选相册项目
    function filterGalleryItems(category) {
        if (!elements.galleryItems.length) return;

        elements.galleryItems.forEach(item => {
            const itemCategory = item.dataset.category;
            if (category === 'all' || itemCategory === category) {
                item.style.display = 'block';
                item.classList.remove('hidden');
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                    item.classList.add('hidden');
                }, 300);
            }
        });
    }

    // 灯箱设置
    function setupLightbox() {
        if (!elements.lightbox) return;

        const lightboxClose = elements.lightbox.querySelector('.lightbox-close');
        const lightboxPrev = elements.lightbox.querySelector('.lightbox-prev');
        const lightboxNext = elements.lightbox.querySelector('.lightbox-next');
        
        let currentImageIndex = 0;
        const images = Array.from(elements.galleryItems).map(item => {
            const img = item.querySelector('img');
            const overlay = item.querySelector('.gallery-overlay');
            return {
                src: img.src,
                title: overlay ? overlay.querySelector('h3').textContent : '',
                description: overlay ? overlay.querySelector('p').textContent : ''
            };
        });

        // 关闭灯箱
        lightboxClose?.addEventListener('click', closeLightbox);
        elements.lightbox.addEventListener('click', function(e) {
            if (e.target === this) {
                closeLightbox();
            }
        });

        // 导航按钮
        lightboxPrev?.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            updateLightboxImage(images[currentImageIndex]);
        });

        lightboxNext?.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            updateLightboxImage(images[currentImageIndex]);
        });

        // 键盘导航
        document.addEventListener('keydown', function(e) {
            if (elements.lightbox.style.display === 'block') {
                switch(e.key) {
                    case 'Escape':
                        closeLightbox();
                        break;
                    case 'ArrowLeft':
                        lightboxPrev?.click();
                        break;
                    case 'ArrowRight':
                        lightboxNext?.click();
                        break;
                }
            }
        });

        function updateLightboxImage(imageData) {
            if (elements.lightboxImage) {
                elements.lightboxImage.src = imageData.src;
                const title = elements.lightbox.querySelector('.lightbox-title');
                const description = elements.lightbox.querySelector('.lightbox-description');
                if (title) title.textContent = imageData.title;
                if (description) description.textContent = imageData.description;
            }
        }
    }

    // 打开灯箱
    function openLightbox(src, title, description, index) {
        if (!elements.lightbox) return;

        elements.lightboxImage.src = src;
        const lightboxTitle = elements.lightbox.querySelector('.lightbox-title');
        const lightboxDescription = elements.lightbox.querySelector('.lightbox-description');
        
        if (lightboxTitle) lightboxTitle.textContent = title;
        if (lightboxDescription) lightboxDescription.textContent = description;
        
        elements.lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // 添加淡入效果
        setTimeout(() => {
            elements.lightbox.style.opacity = '1';
        }, 10);
    }

    // 关闭灯箱
    function closeLightbox() {
        if (!elements.lightbox) return;
        
        elements.lightbox.style.opacity = '0';
        setTimeout(() => {
            elements.lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }

    // 表单功能
    function setupForms() {
        // 留言表单
        if (elements.messageForm) {
            elements.messageForm.addEventListener('submit', handleMessageSubmit);
        }

        // 友链申请表单
        if (elements.linkApplyForm) {
            elements.linkApplyForm.addEventListener('submit', handleLinkApplySubmit);
        }

        // 表情按钮
        if (elements.emojiButtons.length > 0) {
            elements.emojiButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const emoji = this.dataset.emoji;
                    const textarea = document.getElementById('messageContent');
                    if (textarea) {
                        const cursorPos = textarea.selectionStart;
                        const textBefore = textarea.value.substring(0, cursorPos);
                        const textAfter = textarea.value.substring(cursorPos);
                        textarea.value = textBefore + emoji + textAfter;
                        textarea.focus();
                        textarea.setSelectionRange(cursorPos + emoji.length, cursorPos + emoji.length);
                    }
                });
            });
        }
    }

    // 处理留言提交
    function handleMessageSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const messageData = {
            userName: formData.get('userName'),
            userEmail: formData.get('userEmail'),
            userWebsite: formData.get('userWebsite'),
            messageContent: formData.get('messageContent')
        };

        // 验证表单
        if (!validateMessageForm(messageData)) {
            return;
        }

        // 显示加载状态
        const submitBtn = e.target.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '发布中...';
        submitBtn.disabled = true;

        // 模拟提交
        setTimeout(() => {
            showNotification('留言发布成功！审核通过后将显示。', 'success');
            e.target.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1000);
    }

    // 处理友链申请提交
    function handleLinkApplySubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const linkData = {
            siteName: formData.get('siteName'),
            siteUrl: formData.get('siteUrl'),
            siteDescription: formData.get('siteDescription'),
            siteIcon: formData.get('siteIcon'),
            contactEmail: formData.get('contactEmail'),
            additionalInfo: formData.get('additionalInfo')
        };

        // 验证表单
        if (!validateLinkApplyForm(linkData)) {
            return;
        }

        // 显示加载状态
        const submitBtn = e.target.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '提交中...';
        submitBtn.disabled = true;

        // 模拟提交
        setTimeout(() => {
            showNotification('友链申请已提交！我会尽快审核并回复。', 'success');
            e.target.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1000);
    }

    // 验证留言表单
    function validateMessageForm(data) {
        const errors = [];

        if (!data.userName.trim()) {
            errors.push('请输入您的昵称');
        }

        if (!data.userEmail.trim()) {
            errors.push('请输入邮箱地址');
        } else if (!isValidEmail(data.userEmail)) {
            errors.push('请输入有效的邮箱地址');
        }

        if (!data.messageContent.trim()) {
            errors.push('请输入留言内容');
        }

        if (errors.length > 0) {
            showNotification(errors.join('\n'), 'error');
            return false;
        }

        return true;
    }

    // 验证友链申请表单
    function validateLinkApplyForm(data) {
        const errors = [];

        if (!data.siteName.trim()) {
            errors.push('请输入网站名称');
        }

        if (!data.siteUrl.trim()) {
            errors.push('请输入网站地址');
        } else if (!isValidUrl(data.siteUrl)) {
            errors.push('请输入有效的网站地址');
        }

        if (!data.siteDescription.trim()) {
            errors.push('请输入网站描述');
        }

        if (!data.contactEmail.trim()) {
            errors.push('请输入联系邮箱');
        } else if (!isValidEmail(data.contactEmail)) {
            errors.push('请输入有效的邮箱地址');
        }

        if (errors.length > 0) {
            showNotification(errors.join('\n'), 'error');
            return false;
        }

        return true;
    }

    // 交互功能设置
    function setupInteractions() {
        // 点赞功能
        if (elements.likeButtons.length > 0) {
            elements.likeButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const likeCount = this.querySelector('.like-count');
                    const currentCount = parseInt(likeCount.textContent);
                    
                    if (this.classList.contains('liked')) {
                        likeCount.textContent = currentCount - 1;
                        this.classList.remove('liked');
                        this.style.color = '';
                    } else {
                        likeCount.textContent = currentCount + 1;
                        this.classList.add('liked');
                        this.style.color = 'var(--secondary-color)';
                        
                        // 点赞动画
                        this.style.transform = 'scale(1.2)';
                        setTimeout(() => {
                            this.style.transform = 'scale(1)';
                        }, 200);
                    }
                });
            });
        }

        // 回复功能
        if (elements.replyButtons.length > 0) {
            elements.replyButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const replyTo = this.dataset.replyTo;
                    const textarea = document.getElementById('messageContent');
                    if (textarea) {
                        textarea.value = `@${replyTo} `;
                        textarea.focus();
                        textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                });
            });
        }

        // 加载更多功能
        if (elements.loadMoreBtns.length > 0) {
            elements.loadMoreBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const originalText = this.textContent;
                    this.textContent = '加载中...';
                    this.disabled = true;
                    
                    // 模拟加载
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.disabled = false;
                        showNotification('暂无更多内容', 'info');
                    }, 1000);
                });
            });
        }
    }

    // 懒加载设置
    function setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // 工具函数
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    // 通知功能
    function showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
            white-space: pre-line;
        `;

        // 设置颜色
        switch(type) {
            case 'success':
                notification.style.backgroundColor = '#27ae60';
                break;
            case 'error':
                notification.style.backgroundColor = '#e74c3c';
                break;
            case 'info':
            default:
                notification.style.backgroundColor = '#3498db';
                break;
        }

        notification.textContent = message;
        document.body.appendChild(notification);

        // 显示动画
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // 自动隐藏
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);

        // 点击关闭
        notification.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 节流函数
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// 社交链接卡片堆交互功能
const socialCardStack = document.getElementById('socialCardStack');
if (socialCardStack) {
    const socialCards = socialCardStack.querySelectorAll('.social-card');
    let isExpanded = false;
    let expandTimeout;
    
    // 触碰卡堆时展开所有卡片
    socialCardStack.addEventListener('mouseenter', () => {
        clearTimeout(expandTimeout);
        
        if (!isExpanded) {
            socialCardStack.classList.add('expanded');
            isExpanded = true;
        }
    });
    
    // 鼠标离开时延迟收缩卡片堆
    socialCardStack.addEventListener('mouseleave', () => {
        expandTimeout = setTimeout(() => {
            if (isExpanded) {
                socialCardStack.classList.remove('expanded');
                isExpanded = false;
                // 确保所有卡片在收回时恢复正确的旋转角度
                socialCards.forEach((card, index) => {
                    // 计算旋转角度：索引为偶数的卡片使用正角度，奇数的使用负角度
                    const angle = index % 2 === 0 ? index * 5 : -index * 5;
                    card.style.transform = `translateX(calc(var(--index) * -5px)) translateY(0) rotate(${angle}deg)`;
                });
            }
        }, 300); // 300毫秒延迟，给用户一些时间将鼠标移到展开的卡片上
    });
    
    // 为每个卡片添加独立的悬停和点击效果
    socialCards.forEach((card, index) => {
        // 设置索引CSS变量，用于动态计算旋转轴和旋转角度
        card.style.setProperty('--index', index);
        
        // 初始化卡片的初始堆叠状态为正扇形，调整X轴偏移使卡片更集中在中间
        // 计算旋转角度：索引为偶数的卡片使用正角度，奇数的使用负角度
        const angle = index % 2 === 0 ? index * 5 : -index * 5;
        card.style.transform = `translateX(calc(var(--index) * -5px)) translateY(0) rotate(${angle}deg)`;
        // 当鼠标悬停在单个卡片上时，暂时不会触发stack的mouseleave事件的收缩逻辑
        card.addEventListener('mouseenter', () => {
                clearTimeout(expandTimeout);
                // 使用CSS变量控制旋转中心点，不再直接设置style属性
            
            if (isExpanded) {
                card.style.transform = 'scale(1.1) translateX(0) translateY(0)';
            } else {
                // 计算旋转角度：索引为偶数的卡片使用正角度，奇数的使用负角度
                const angle = index % 2 === 0 ? index * 5 : -index * 5;
                card.style.transform = `scale(1.1) translateX(calc(var(--index) * -5px)) translateY(0) rotate(${angle}deg)`;
            }
        });
        
        card.addEventListener('mouseleave', () => {
                // 使用CSS变量控制旋转中心点，不再直接设置style属性
            // 如果卡片堆已展开，恢复卡片的默认展开状态
            if (isExpanded) {
                card.style.transform = 'scale(1) translateX(0) translateY(0)';
            } else {
                // 如果卡片堆未展开，恢复卡片的叠放状态和旋转效果
                // 计算旋转角度：索引为偶数的卡片使用正角度，奇数的使用负角度
                const angle = index % 2 === 0 ? index * 5 : -index * 5;
                card.style.transform = `translateX(calc(var(--index) * -5px)) translateY(0) rotate(${angle}deg)`;
            }
        });
        
        // 点击效果
        card.addEventListener('click', () => {
                // 使用CSS变量控制旋转中心点，不再直接设置style属性
            // 添加点击动画
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                if (isExpanded) {
                    card.style.transform = 'scale(1) translateX(0) translateY(0)';
                } else {
                    // 计算旋转角度：索引为偶数的卡片使用正角度，奇数的使用负角度
                    const angle = index % 2 === 0 ? index * 5 : -index * 5;
                    card.style.transform = `translateX(calc(var(--index) * -5px)) translateY(0) rotate(${angle}deg)`;
                }
            }, 100);
        });
    });
}

// 设置头像翻转效果
function setupAvatarFlip() {
    const avatarContainer = document.querySelector('.avatar-flip-container');
    if (!avatarContainer) return;
    
    // 添加过渡效果增强
    avatarContainer.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
    
    // 添加状态变量来跟踪翻转状态
    let isFlipping = false;
    let isFlipped = false;
    
    // 统一的翻转函数
    function flipAvatar() {
        if (isFlipping) return; // 如果正在翻转中，忽略新的翻转请求
        
        isFlipping = true;
        isFlipped = !isFlipped;
        avatarContainer.style.transform = isFlipped ? 'rotateY(180deg) scale(1.05)' : 'scale(1.05)';
        
        // 过渡完成后重置翻转状态
        setTimeout(() => {
            isFlipping = false;
        }, 600); // 与过渡时间匹配
    }
    
    // 修复CSS hover和JS事件的冲突
    // 移除CSS中的hover效果，完全由JS控制
    avatarContainer.classList.add('js-controlled');
    
    // 添加鼠标进入事件
    avatarContainer.addEventListener('mouseenter', function() {
        // 确保移除任何可能的延迟类
        this.classList.remove('flip-delay');
        
        // 检测设备是否支持触摸
        if (window.matchMedia('(hover: none)').matches) {
            // 触摸设备上，点击才翻转
            this.style.cursor = 'pointer';
        } else {
            // 鼠标设备上，只在未翻转时翻转
            if (!isFlipped && !isFlipping) {
                flipAvatar();
            }
        }
    });
    
    // 添加鼠标离开事件
    avatarContainer.addEventListener('mouseleave', function() {
        // 鼠标离开时翻转回来
        if (isFlipped && !isFlipping) {
            flipAvatar();
        }
    });
    
    // 为触摸设备添加点击翻转支持
    avatarContainer.addEventListener('click', function() {
        if (window.matchMedia('(hover: none)').matches) {
            flipAvatar();
        }
    });
    
    // 监听深色模式变化，调整翻转效果
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    function updateAvatarForTheme() {
        // 可以在这里根据深色模式状态进一步调整头像样式
    }
    
    darkModeMediaQuery.addEventListener('change', updateAvatarForTheme);
}

// 错误处理
    window.addEventListener('error', function(e) {
        console.error('JavaScript错误:', e.error);
    });

    // 页面离开前清理
    window.addEventListener('beforeunload', function() {
        // 清理操作
    });

})();

