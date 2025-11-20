// 星空效果脚本 - 参考AwesomeWeb实现，支持深色模式切换
(function() {
    'use strict';
    
    let canvas, ctx;
    let stars = [];
    let shootingStars = [];
    let animationId;
    let isPaused = false;
    let isDarkMode = false;
    
    // 设置Canvas尺寸
    function resizeCanvas() {
        if (!canvas) return;
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // 创建Canvas画布
    function createCanvas() {
        // 如果已存在，先移除
        const existingCanvas = document.getElementById('stars-canvas');
        if (existingCanvas) {
            existingCanvas.remove();
        }
        
        canvas = document.createElement('canvas');
        canvas.id = 'stars-canvas';
        canvas.className = 'stars-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0px';
        canvas.style.left = '0px';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '1'; // 在雨点下方
        
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        
        resizeCanvas();
    }
    
    // 星星类
    function Star(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.radius = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.8 + 0.2;
        this.twinkleSpeed = Math.random() * 0.02 + 0.01;
        this.twinkleOffset = Math.random() * Math.PI * 2;
    }
    
    // 更新星星闪烁
    Star.prototype.update = function() {
        this.twinkleOffset += this.twinkleSpeed;
        this.opacity = 0.2 + Math.sin(this.twinkleOffset) * 0.6;
    };
    
    // 绘制星星
    Star.prototype.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, ' + this.opacity + ')';
        ctx.fill();
        
        // 添加光晕效果
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3);
        gradient.addColorStop(0, 'rgba(255, 255, 255, ' + this.opacity * 0.5 + ')');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
    };
    
    // 流星类
    function ShootingStar(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = -50;
        this.speed = Math.random() * 3 + 2;
        this.length = Math.random() * 80 + 50;
        this.opacity = 1;
        this.angle = Math.random() * 0.5 + 0.3; // 倾斜角度
        this.trail = [];
    }
    
    // 更新流星位置
    ShootingStar.prototype.update = function() {
        this.y += this.speed;
        this.x += this.angle * this.speed;
        
        // 添加拖尾点
        this.trail.push({ x: this.x, y: this.y, opacity: this.opacity });
        if (this.trail.length > 20) {
            this.trail.shift();
        }
        
        // 如果流星掉出屏幕，重新开始
        if (this.y > canvas.height + 100 || this.x > canvas.width + 100) {
            this.y = -50;
            this.x = Math.random() * canvas.width;
            this.trail = [];
            this.opacity = 1;
        }
    };
    
    // 绘制流星
    ShootingStar.prototype.draw = function() {
        // 绘制拖尾
        for (let i = 0; i < this.trail.length; i++) {
            const point = this.trail[i];
            const trailOpacity = (i / this.trail.length) * this.opacity;
            
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(point.x - this.angle * 10, point.y - 10);
            ctx.strokeStyle = 'rgba(255, 255, 255, ' + trailOpacity + ')';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // 绘制流星头部
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, ' + this.opacity + ')';
        ctx.fill();
    };
    
    // 初始化星星数组
    function initStars() {
        if (!canvas) return;
        
        stars = [];
        // 仅在深色模式下生成星星
        if (isDarkMode) {
            const isMobile = window.innerWidth < 768;
            const count = isMobile ? 80 : 150; // 星星数量（减少以提高性能）
            
            for (let i = 0; i < count; i++) {
                stars.push(new Star(canvas.width, canvas.height));
            }
        }
    }
    
    // 初始化流星
    function initShootingStars() {
        if (!canvas) return;
        
        shootingStars = [];
        // 仅在深色模式下生成流星
        if (isDarkMode) {
            const isMobile = window.innerWidth < 768;
            const count = isMobile ? 1 : 2; // 流星数量
            
            for (let i = 0; i < count; i++) {
                shootingStars.push(new ShootingStar(canvas.width, canvas.height));
            }
        }
    }
    
    // 绘制星星连线（星座效果）- 优化性能版本
    let connectionFrameCount = 0;
    function drawConnections() {
        // 仅在深色模式下绘制连线
        if (!isDarkMode) return;
        
        // 每5帧绘制一次连线，减少计算量
        connectionFrameCount++;
        if (connectionFrameCount % 5 !== 0) return;
        
        const maxDistance = 120; // 最大连线距离
        const maxConnections = 50; // 最大连线数量限制
        let connectionCount = 0;
        
        // 只检查相邻的星星，减少计算量
        for (let i = 0; i < stars.length && connectionCount < maxConnections; i++) {
            for (let j = i + 1; j < Math.min(i + 10, stars.length) && connectionCount < maxConnections; j++) {
                const dx = stars[i].x - stars[j].x;
                const dy = stars[i].y - stars[j].y;
                const distanceSquared = dx * dx + dy * dy; // 使用距离平方避免开方运算
                
                if (distanceSquared < maxDistance * maxDistance) {
                    const distance = Math.sqrt(distanceSquared);
                    const opacity = (1 - distance / maxDistance) * 0.08;
                    ctx.beginPath();
                    ctx.moveTo(stars[i].x, stars[i].y);
                    ctx.lineTo(stars[j].x, stars[j].y);
                    ctx.strokeStyle = 'rgba(255, 255, 255, ' + opacity + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                    connectionCount++;
                }
            }
        }
    }
    
    // 更新深色模式状态
    function updateDarkMode() {
        isDarkMode = document.body.classList.contains('dark-mode');
        initStars();
        initShootingStars();
    }
    
    // 动画循环
    function animate() {
        if (isPaused) {
            animationId = requestAnimationFrame(animate);
            return;
        }
        
        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 仅在深色模式下绘制星空效果
        if (isDarkMode) {
            // 清空画布（使用半透明黑色实现拖尾效果）
            ctx.fillStyle = 'rgba(10, 10, 26, 0.15)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // 绘制星星连线（性能优化：减少绘制频率）
            drawConnections();
            
            // 更新并绘制所有星星
            for (let i = 0; i < stars.length; i++) {
                stars[i].update();
                stars[i].draw();
            }
            
            // 更新并绘制流星
            for (let i = 0; i < shootingStars.length; i++) {
                shootingStars[i].update();
                shootingStars[i].draw();
            }
        }
        
        animationId = requestAnimationFrame(animate);
    }
    
    // 初始化
    function init() {
        createCanvas();
        updateDarkMode(); // 初始化深色模式状态
        animate();
        
        // 监听深色模式切换
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    updateDarkMode();
                }
            });
        });
        
        observer.observe(document.body, { attributes: true });
        
        // 页面可见性变化处理
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                isPaused = true;
            } else {
                isPaused = false;
            }
        });
        
        // 窗口大小变化时重新初始化
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                resizeCanvas();
                updateDarkMode();
            }, 250);
        });
    }
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

