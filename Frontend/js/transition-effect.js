/**
 * 网站过渡效果JS文件
 * 实现炫酷的入场动画和粒子效果
 */

class TransitionEffect {
    constructor() {
        this.transitionOverlay = null;
        this.mainContainer = null;
        this.transitionDuration = 2000; // 过渡总时长
        this.fadeOutDelay = 1500; // 淡出延迟
    }

    /**
     * 初始化过渡效果
     */
    init() {
        this.createTransitionOverlay();
        this.setupMainContainer();
        this.createParticles();
        this.startTransition();
    }

    /**
     * 创建过渡覆盖层
     */
    createTransitionOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'transition-overlay';
        
        const content = document.createElement('div');
        content.className = 'transition-content';
        
        const logo = document.createElement('div');
        logo.className = 'transition-logo';
        logo.innerHTML = this.createPlanetLogo(); // 使用动态星球图标
        
        const text = document.createElement('div');
        text.className = 'transition-text';
        text.textContent = 'Welcome to RainyWindows';
        
        const loadingBar = document.createElement('div');
        loadingBar.className = 'loading-bar';
        
        const progress = document.createElement('div');
        progress.className = 'loading-progress';
        
        loadingBar.appendChild(progress);
        content.appendChild(logo);
        content.appendChild(text);
        content.appendChild(loadingBar);
        
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        
        overlay.appendChild(particlesContainer);
        overlay.appendChild(content);
        document.body.insertBefore(overlay, document.body.firstChild);
        
        this.transitionOverlay = overlay;
        
        // 添加星球动画样式
        this.addPlanetAnimationStyles();
    }
    
    /**
     * 创建简约科技风格的星球SVG图标
     */
    createPlanetLogo() {
        return `
            <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                <!-- 科技光环 -->
                <circle cx="60" cy="60" r="55" fill="none" stroke="#00e5ff" stroke-width="1" opacity="0.3" class="tech-ring"/>
                <circle cx="60" cy="60" r="50" fill="none" stroke="#00e5ff" stroke-width="1" opacity="0.5" class="tech-ring"/>
                
                <!-- 主要轨道 -->
                <ellipse cx="60" cy="60" rx="48" ry="32" fill="none" stroke="#40c4ff" stroke-width="0.5" opacity="0.3" class="orbit major"/>
                <ellipse cx="60" cy="60" rx="32" ry="48" fill="none" stroke="#40c4ff" stroke-width="0.5" opacity="0.3" class="orbit minor"/>
                
                <!-- 星球主体 - 简约几何风格 -->
                <circle cx="60" cy="60" r="25" fill="url(#planetGradient)" class="planet-core"/>
                
                <!-- 科技网格线 -->
                <path d="M60,20 L60,100" fill="none" stroke="#80deea" stroke-width="0.5" opacity="0.4" class="grid-line vertical"/>
                <path d="M20,60 L100,60" fill="none" stroke="#80deea" stroke-width="0.5" opacity="0.4" class="grid-line horizontal"/>
                <circle cx="60" cy="60" r="15" fill="none" stroke="#80deea" stroke-width="0.5" opacity="0.6" class="grid-circle inner"/>
                <circle cx="60" cy="60" r="20" fill="none" stroke="#80deea" stroke-width="0.5" opacity="0.5" class="grid-circle middle"/>
                
                <!-- 科技点和连接线 -->
                <circle cx="75" cy="45" r="1.5" fill="#ffffff" class="tech-dot dot1"/>
                <circle cx="45" cy="75" r="1.5" fill="#ffffff" class="tech-dot dot2"/>
                <circle cx="75" cy="75" r="1.5" fill="#ffffff" class="tech-dot dot3"/>
                <circle cx="45" cy="45" r="1.5" fill="#ffffff" class="tech-dot dot4"/>
                
                <!-- 连接线 -->
                <line x1="45" y1="45" x2="75" y2="75" stroke="#00e5ff" stroke-width="0.5" opacity="0.6" class="connection-line line1"/>
                <line x1="75" y1="45" x2="45" y2="75" stroke="#00e5ff" stroke-width="0.5" opacity="0.6" class="connection-line line2"/>
                
                <!-- 中心发光核心 -->
                <circle cx="60" cy="60" r="5" fill="#00e5ff" opacity="0.8" class="core-glow"/>
                <circle cx="60" cy="60" r="3" fill="#ffffff" class="core-center"/>
                
                <!-- 渐变色定义 - 更现代的科技蓝色调 -->
                <defs>
                    <linearGradient id="planetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#01579b"/>
                        <stop offset="50%" stop-color="#0277bd"/>
                        <stop offset="100%" stop-color="#03a9f4"/>
                    </linearGradient>
                </defs>
            </svg>
        `;
    }
    
    /**
     * 添加简约科技风格的动画样式
     */
    addPlanetAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* 科技星球动画 */
            .tech-ring {
                animation: pulseRing 3s ease-in-out infinite;
                stroke-dasharray: 345; /* 圆周长 */
                stroke-dashoffset: 345;
            }
            
            .orbit {
                animation: rotateOrbit 15s linear infinite;
                transform-origin: center;
            }
            
            .orbit.minor {
                animation-duration: 20s;
                animation-direction: reverse;
            }
            
            .planet-core {
                animation: rotateCore 25s linear infinite;
                transform-origin: center;
            }
            
            .grid-line,
            .grid-circle {
                animation: fadeIn 1s ease-out forwards;
            }
            
            .tech-dot {
                animation: pulseDot 2s ease-in-out infinite;
                filter: drop-shadow(0 0 3px #00e5ff);
            }
            
            .dot1 { animation-delay: 0.2s; }
            .dot2 { animation-delay: 0.4s; }
            .dot3 { animation-delay: 0.6s; }
            .dot4 { animation-delay: 0.8s; }
            
            .connection-line {
                animation: fadeIn 1.5s ease-out forwards;
                stroke-dasharray: 42;
                stroke-dashoffset: 42;
            }
            
            .line1 { animation-delay: 1s; }
            .line2 { animation-delay: 1.5s; }
            
            .core-glow {
                animation: glowPulse 2s ease-in-out infinite;
                filter: blur(2px);
            }
            
            .core-center {
                animation: blink 3s ease-in-out infinite;
            }
            
            @keyframes pulseRing {
                0% {
                    stroke-dashoffset: 345;
                    opacity: 0.3;
                }
                50% {
                    stroke-dashoffset: 0;
                    opacity: 0.8;
                }
                100% {
                    stroke-dashoffset: -345;
                    opacity: 0.3;
                }
            }
            
            @keyframes rotateOrbit {
                from {
                    transform: rotate(0deg);
                }
                to {
                    transform: rotate(360deg);
                }
            }
            
            @keyframes rotateCore {
                from {
                    transform: rotate(0deg);
                }
                to {
                    transform: rotate(360deg);
                }
            }
            
            @keyframes fadeIn {
                0% {
                    opacity: 0;
                    stroke-dashoffset: 100;
                }
                100% {
                    opacity: 0.5;
                    stroke-dashoffset: 0;
                }
            }
            
            @keyframes pulseDot {
                0%, 100% {
                    opacity: 0.6;
                    transform: scale(1);
                }
                50% {
                    opacity: 1;
                    transform: scale(1.3);
                    filter: drop-shadow(0 0 6px #00e5ff);
                }
            }
            
            @keyframes glowPulse {
                0%, 100% {
                    opacity: 0.6;
                    transform: scale(1);
                }
                50% {
                    opacity: 1;
                    transform: scale(1.2);
                }
            }
            
            @keyframes blink {
                0%, 100% {
                    opacity: 0.8;
                }
                50% {
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 设置主容器
     */
    setupMainContainer() {
        this.mainContainer = document.querySelector('.container');
        if (this.mainContainer) {
            // 确保主容器初始为隐藏状态
            this.mainContainer.classList.remove('visible');
        }
    }

    /**
     * 创建简约科技风格的星空效果
     */
    createParticles() {
        const particlesContainer = document.querySelector('.particles-container');
        if (!particlesContainer) return;
        
        // 清空容器，重新创建效果
        particlesContainer.innerHTML = '';
        
        // 创建网格背景
        this.createGridBackground(particlesContainer);
        
        // 创建星星
        const particleCount = 150; // 调整星星数量
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            
            // 科技风格星星样式
            const size = Math.random() * 2 + 1; // 1-3px
            const opacity = Math.random() * 0.7 + 0.3; // 0.3-1.0，增加可见度
            const color = this.getStarColor();
            const x = Math.random() * 100; // 0-100%
            const y = Math.random() * 100; // 0-100%
            const delay = Math.random() * 3; // 0-3s
            const twinkleSpeed = Math.random() * 2 + 1; // 1-3s
            
            // 随机星星类型
            const starType = Math.random();
            let shapeClass = 'star-round';
            
            if (starType > 0.7) { // 30%的星星是点状
                shapeClass = 'star-pulse';
            } else if (starType > 0.4) { // 30%的星星是线条状
                shapeClass = 'star-line';
            }
            
            particle.className = shapeClass;
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                opacity: ${opacity};
                left: ${x}%;
                top: ${y}%;
                pointer-events: none;
                animation: starTwinkle ${twinkleSpeed}s ease-in-out ${delay}s infinite;
                z-index: 1;
            `;
            
            // 线条状星星的特殊样式
            if (shapeClass === 'star-line') {
                const angle = Math.random() * 360;
                particle.style.width = `${size * 3}px`;
                particle.style.height = '1px';
                particle.style.transform = `rotate(${angle}deg)`;
                particle.style.transformOrigin = 'center';
            }
            
            particlesContainer.appendChild(particle);
        }
        
        // 添加光线效果
        this.createLightRays(particlesContainer);
        
        // 添加星空动画样式
        const style = document.createElement('style');
        style.textContent = `
            /* 星星基础样式 */
            .star-round {
                border-radius: 50%;
                box-shadow: 0 0 3px 1px currentColor;
            }
            
            .star-pulse {
                border-radius: 50%;
                box-shadow: 0 0 6px 2px currentColor;
            }
            
            .star-line {
                background: currentColor;
                box-shadow: 0 0 4px 1px currentColor;
            }
            
            /* 动画 */
            @keyframes starTwinkle {
                0%, 100% {
                    opacity: 0.4;
                    transform: scale(1);
                    box-shadow: 0 0 3px 1px currentColor;
                }
                50% {
                    opacity: 1;
                    transform: scale(1.3);
                    box-shadow: 0 0 8px 2px currentColor;
                }
            }
            
            /* 光线动画 */
            @keyframes rayPulse {
                0%, 100% {
                    opacity: 0.1;
                    transform: scale(1);
                }
                50% {
                    opacity: 0.4;
                    transform: scale(1.1);
                }
            }
            
            /* 网格动画 */
            @keyframes gridFade {
                0%, 100% {
                    opacity: 0.1;
                }
                50% {
                    opacity: 0.2;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * 创建网格背景
     */
    createGridBackground(container) {
        const grid = document.createElement('div');
        grid.className = 'tech-grid';
        grid.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
                linear-gradient(to right, rgba(0, 229, 255, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0, 229, 255, 0.1) 1px, transparent 1px);
            background-size: 50px 50px;
            z-index: 0;
            animation: gridFade 5s ease-in-out infinite;
        `;
        container.appendChild(grid);
    }
    
    /**
     * 创建光线效果
     */
    createLightRays(container) {
        const rayCount = 8;
        
        for (let i = 0; i < rayCount; i++) {
            const ray = document.createElement('div');
            const angle = (i * 360) / rayCount;
            const delay = i * 0.3;
            
            ray.style.cssText = `
                position: absolute;
                width: 100%;
                height: 2px;
                background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.3), transparent);
                top: 50%;
                left: 0;
                transform-origin: center;
                transform: rotate(${angle}deg) translateY(-50%);
                opacity: 0.1;
                animation: rayPulse 4s ease-in-out ${delay}s infinite;
                z-index: 0;
            `;
            
            container.appendChild(ray);
        }
    }

    /**
     * 获取科技风格星星的随机颜色
     */
    getStarColor() {
        // 科技风格的星星颜色 - 更亮更科技化
        const colors = [
            '#ffffff', '#b2ebf2', '#80deea', '#4dd0e1', 
            '#26c6da', '#00bcd4', '#00acc1', '#0097a7',
            '#00e5ff', '#84ffff', '#b2ff59', '#ccff90'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    /**
     * 开始过渡动画
     */
    startTransition() {
        // 等待一段时间后开始淡出过渡层
        setTimeout(() => {
            if (this.transitionOverlay) {
                this.transitionOverlay.classList.add('hidden');
                
                // 过渡完成后显示主内容
                    setTimeout(() => {
                        if (this.mainContainer) {
                            this.mainContainer.classList.add('visible');
                        }
                        
                        // 触发过渡结束事件
                        const transitionEndEvent = new CustomEvent('transitionEnd', {
                          detail: { completed: true }
                        });
                        document.dispatchEvent(transitionEndEvent);
                        
                        // 完全移除过渡层
                        setTimeout(() => {
                            if (this.transitionOverlay && this.transitionOverlay.parentNode) {
                                document.body.removeChild(this.transitionOverlay);
                            }
                        }, 1000);
                    }, 1000);
            }
        }, this.fadeOutDelay);
    }
}

// 页面加载完成后初始化过渡效果
document.addEventListener('DOMContentLoaded', function() {
    const transition = new TransitionEffect();
    transition.init();
});