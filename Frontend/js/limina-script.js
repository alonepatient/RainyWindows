// limina.top 克隆版 - 极简风格加载动画

// 使用 requestAnimationFrame 进行性能优化
const raf = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
             window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

// 初始化变量
let startTime = null;
let isLoadingComplete = false;
let loadingComplete = false;

// 模拟加载时间（2-4秒）- 更简洁的加载体验
const minLoadingTime = 2000;
const maxLoadingTime = 4000;
const targetLoadingTime = Math.random() * (maxLoadingTime - minLoadingTime) + minLoadingTime;

// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const loadingContainer = document.querySelector('.loading-container');
    const loadingText = document.querySelector('.loading-text');
    const loadingDots = document.querySelectorAll('.loading-dots span');
    const progressIndicator = document.querySelector('.progress-indicator');
    const progressBar = document.querySelector('.progress-bar');
    
    // 加载动画函数 - 极简主义风格
    function loadingAnimation(timestamp) {
        if (!startTime) startTime = timestamp;
        const runtime = timestamp - startTime;
        
        // 计算进度百分比
        const progress = Math.min((runtime / targetLoadingTime) * 100, 100);
        
        // 更新进度条（如果存在）
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        // 微妙的文字动画效果 - 极小的透明度变化
        if (Math.random() > 0.99 && !isLoadingComplete && loadingText) {
            loadingText.style.opacity = '0.97';
            setTimeout(() => {
                if (loadingText) loadingText.style.opacity = '1';
            }, 200);
        }
        
        // 继续动画或完成加载
        if (runtime < targetLoadingTime) {
            raf(loadingAnimation);
        } else if (!isLoadingComplete) {
            completeLoading();
        }
    }
    
    // 完成加载过程 - 使用向上滑动效果
    const completeLoading = () => {
        if (isLoadingComplete) return;
        isLoadingComplete = true;
        
        // 确保进度条达到100%（如果存在）
        if (progressBar) {
            progressBar.style.width = '100%';
        }
        
        // 简短延迟后触发滑动动画
        setTimeout(() => {
            if (loadingContainer) {
                loadingContainer.classList.add('fade-out');
                loadingContainer.style.transition = 'all 1.2s cubic-bezier(0.25, 1, 0.5, 1)';
                loadingContainer.style.opacity = '0';
                loadingContainer.style.transform = 'translateY(-20px)';
            }
            
            // 滑动动画完成后，移除限制并触发事件
            setTimeout(() => {
                if (loadingContainer) {
                    loadingContainer.style.visibility = 'hidden';
                    loadingContainer.style.height = '0';
                    loadingContainer.style.overflow = 'hidden';
                }
                
                // 移除body的overflow限制
                document.body.style.overflow = 'auto';
                
                // 通知加载完成
                showMainContent();
            }, 1200);
        }, 300);
    };
    
    // 显示主内容并触发事件
    const showMainContent = () => {
        // 触发加载完成事件
        const loadingCompleteEvent = new CustomEvent('limina:loadingComplete');
        window.dispatchEvent(loadingCompleteEvent);
        
        // 记录加载完成
        loadingComplete = true;
    };
    
    // 处理跳过加载的函数
    function handleSkipLoading() {
        if (!isLoadingComplete && startTime && (Date.now() - startTime > 800)) {
            completeLoading();
        }
    }
    
    // 设置跳过加载选项
    function setupSkipLoading() {
        if (loadingContainer) {
            loadingContainer.addEventListener('click', handleSkipLoading);
            
            // 键盘跳过
            document.addEventListener('keydown', (e) => {
                if ((e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') && 
                    !isLoadingComplete && 
                    startTime && 
                    (Date.now() - startTime > 800)) {
                    handleSkipLoading();
                }
            });
        }
    }
    
    // 为触摸设备优化的轻量级交互
    function setupTouchOptimization() {
        if ('ontouchstart' in window) {
            // 防止触摸时的默认行为干扰
            document.addEventListener('touchstart', (e) => {
                if (!isLoadingComplete && startTime && (Date.now() - startTime > 800)) {
                    e.preventDefault();
                    handleSkipLoading();
                }
            }, { passive: false });
            
            // 减少触摸设备上的动画强度
            const style = document.createElement('style');
            style.textContent = `
                @media (hover: none) and (pointer: coarse) {
                    .loading-dots span {
                        animation-duration: 2s;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // 处理页面可见性变化 - 优化资源使用
    function setupVisibilityHandler() {
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden' && !isLoadingComplete) {
                // 如果页面不可见，稍微加速加载完成
                const remainingTime = targetLoadingTime - (Date.now() - startTime);
                if (remainingTime > 1000) {
                    // 保持至少1秒的可见加载时间
                    setTimeout(() => {
                        if (!isLoadingComplete) {
                            completeLoading();
                        }
                    }, 1000);
                }
            }
        });
    }
    
    // 初始化函数
    function initLoadingAnimation() {
        // 开始加载动画
        raf(loadingAnimation);
        
        // 设置跳过加载选项
        setupSkipLoading();
        
        // 设置触摸设备优化
        setupTouchOptimization();
        
        // 设置页面可见性处理
        setupVisibilityHandler();
    }
    
    // 启动加载动画
    initLoadingAnimation();
});

// 提供简洁的加载状态API
window.limina = window.limina || {};
window.limina.isLoadingComplete = () => loadingComplete;
window.limina.forceComplete = () => {
    if (typeof completeLoading === 'function') {
        completeLoading();
    }
};

// 滚动监听功能 - 为后续页面交互做准备
function setupScrollMonitoring() {
    // 这个函数会在主页面加载完成后被调用
    // 用于监控滚动位置，实现导航栏样式变化等效果
}

// 暴露滚动监听函数供主页面使用
window.setupScrollMonitoring = setupScrollMonitoring;

// 支持模块化加载
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        isLoadingComplete: () => loadingComplete,
        forceComplete: () => {
            if (typeof completeLoading === 'function') {
                completeLoading();
            }
        },
        setupScrollMonitoring
    };
}