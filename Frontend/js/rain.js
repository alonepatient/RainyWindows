// 雨点效果脚本 - 使用Canvas实现，支持白天和夜间模式
(function() {
    'use strict';
    
    let canvas, ctx;
    let raindrops = [];
    let waterdrops = [];
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
        const existingCanvas = document.getElementById('rain-canvas');
        if (existingCanvas) {
            existingCanvas.remove();
        }
        
        canvas = document.createElement('canvas');
        canvas.id = 'rain-canvas';
        canvas.className = 'rain-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0px';
        canvas.style.left = '0px';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '2';
        
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        
        resizeCanvas();
    }
    
    // 雨点类
    function Raindrop(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight - canvasHeight;
        
        // 根据深色模式设置不同的雨点参数
        if (isDarkMode) {
            this.length = Math.random() * 20 + 10;
            this.speed = Math.random() * 3 + 2;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.lineWidth = 1.5;
        } else {
            // 白天模式：更大的雨点
            this.length = Math.random() * 30 + 20;
            this.speed = Math.random() * 5 + 4;
            this.opacity = Math.random() * 0.4 + 0.4;
            this.lineWidth = 2.5;
        }
        
        this.angle = Math.random() * 0.3 + 0.1; // 倾斜角度
    }
    
    // 更新雨点位置
    Raindrop.prototype.update = function() {
        this.y += this.speed;
        this.x += this.angle * this.speed;
        
        // 如果雨点掉出屏幕，重新从顶部开始
        if (this.y > canvas.height) {
            this.y = Math.random() * canvas.height - canvas.height;
            this.x = Math.random() * canvas.width;
            
            // 随机生成新的水珠
            if (!isDarkMode && Math.random() > 0.7) {
                waterdrops.push(new Waterdrop(this.x, canvas.height));
            }
        }
        
        // 如果雨点超出左右边界，重新从顶部开始
        if (this.x > canvas.width || this.x < 0) {
            this.y = Math.random() * canvas.height - canvas.height;
            this.x = Math.random() * canvas.width;
        }
    };
    
    // 绘制雨点
    Raindrop.prototype.draw = function() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.angle * this.length, this.y + this.length);
        
        // 根据深色模式设置不同的颜色
        const color = isDarkMode ? 
            'rgba(200, 220, 255, ' + this.opacity + ')' : 
            'rgba(100, 150, 200, ' + this.opacity + ')';
            
        ctx.strokeStyle = color;
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
        
        // 添加发光效果（特别是白天模式）
        if (!isDarkMode) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.angle * this.length, this.y + this.length);
            ctx.strokeStyle = 'rgba(255, 255, 255, ' + (this.opacity * 0.5) + ')';
            ctx.lineWidth = this.lineWidth * 1.5;
            ctx.stroke();
        }
    };
    
    // 水珠类（窗上的水珠，增强形状变化效果）
    function Waterdrop(x, y, initialRadius = null) {
        this.x = x;
        this.y = y;
        this.baseRadius = initialRadius || (Math.random() * 8 + 4); // 基础半径
        this.radius = this.baseRadius;
        this.opacity = Math.random() * 0.3 + 0.4; // 透明度
        
        // 运动状态相关
        this.speed = Math.random() * 0.2 + 0.1; // 初始速度较慢
        this.angle = Math.random() * 0.1 - 0.05; // 左右摆动
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.01;
        
        // 流动和停止状态
        this.state = Math.random() > 0.6 ? 'moving' : 'stationary'; // 增加移动概率
        this.stateTimer = Math.random() * 1500 + 800; // 缩短状态持续时间
        this.maxSpeed = Math.random() * 2.5 + 0.8; // 提高最大速度
        this.acceleration = (Math.random() * 0.03) + 0.008; // 增加加速度
        
        // 形状变形参数 - 增加更大的变形范围
        this.shapeDeformation = 1.0 + (Math.random() - 0.5) * 0.3; // 初始就有轻微变形
        this.shapeAxis = Math.random() * Math.PI * 2; // 随机初始变形方向
        this.targetShapeDeformation = this.shapeDeformation; // 目标变形值
        this.shapeChangeSpeed = Math.random() * 0.01 + 0.005; // 形状变化速度
        
        // 分裂相关参数
        this.canSplit = initialRadius === null; // 只有初始水珠可以分裂
        this.splitChance = 0.005; // 每次更新的分裂概率
        this.splitSizeFactor = 0.6; // 分裂后小水珠的大小因子
        
        // 边缘高光点 - 只在边缘，不在中间
        this.edgeHighlights = [];
        for (let i = 0; i < 2; i++) {
            this.edgeHighlights.push({
                angle: Math.random() * Math.PI * 2,
                offset: Math.random() * 0.1 + 0.95, // 靠近边缘
                size: Math.random() * 0.2 + 0.1
            });
        }
    }
    
    // 更新水珠位置和形状
    Waterdrop.prototype.update = function() {
        // 状态转换逻辑
        this.stateTimer -= 16; // 假设60fps
        if (this.stateTimer <= 0) {
            // 随机切换状态
            if (Math.random() > 0.7) {
                const oldState = this.state;
                this.state = this.state === 'stationary' ? 'moving' : 'stationary';
                this.stateTimer = Math.random() * 3000 + 1000; // 新的状态持续时间
                
                // 状态改变时的形状变化
                if (this.state === 'moving' && oldState === 'stationary') {
                    // 从静止到移动时的突然加速和更明显的变形
                    this.speed = Math.random() * this.maxSpeed * 0.8 + 0.2;
                    this.targetShapeDeformation = 1.0 + (Math.random() * 0.6 - 0.2); // 更大的变形范围
                    this.shapeAxis = Math.random() * Math.PI * 2; // 随机变形方向
                } else if (this.state === 'stationary' && oldState === 'moving') {
                    // 从移动到静止时的更明显压缩效果
                    this.speed = 0;
                    this.targetShapeDeformation = 0.7 + Math.random() * 0.2; // 更明显的压扁
                    this.shapeAxis = Math.PI / 2; // 垂直方向压缩
                }
            }
        }
        
        // 根据当前状态更新位置和形状
        if (this.state === 'moving') {
            // 随机加速和减速
            if (Math.random() > 0.85) {
                this.acceleration = (Math.random() - 0.5) * 0.04 + 0.01;
            }
            
            // 应用加速度
            this.speed += this.acceleration;
            
            // 限制速度范围
            if (this.speed < 0.05) this.speed = 0.05;
            if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
            
            // 更新位置
            this.y += this.speed;
            this.x += this.angle * this.speed;
            
            // 动态调整角度
            if (Math.random() > 0.95) {
                this.angle = Math.random() * 0.2 - 0.1;
            }
            
            // 基于速度的形状变化 - 更明显的变形效果
            const speedFactor = this.speed / this.maxSpeed;
            
            // 更频繁地更新目标变形值
            if (Math.random() > 0.85) {
                // 动态调整目标变形值，基于速度但增加随机性
                if (speedFactor > 0.5) {
                    // 移动时可以有更大的变形范围
                    this.targetShapeDeformation = 1.0 + (speedFactor - 0.5) * 0.8;
                    // 限制最大变形范围但允许更明显的变形
                    this.targetShapeDeformation = Math.min(this.targetShapeDeformation, 1.6);
                } else {
                    // 缓慢移动时也允许更多样的形状
                    this.targetShapeDeformation = 0.8 + Math.random() * 0.4;
                }
            }
            
            // 平滑过渡到目标形状
            this.shapeDeformation += (this.targetShapeDeformation - this.shapeDeformation) * this.shapeChangeSpeed;
            
            // 变形方向的更明显变化
            if (Math.random() > 0.8) {
                // 更快地改变变形方向
                this.shapeAxis += (Math.random() - 0.5) * 0.4;
            }
            
            // 随机微小抖动，增加自然感
            const jitter = (Math.random() - 0.5) * 0.02;
            this.shapeDeformation += jitter;
            this.shapeAxis += jitter * 2;
        } else {
            // 静止时的形状变化 - 不再完全恢复圆形，增加轻微变化
            if (Math.random() > 0.8) {
                // 随机调整目标变形值
                this.targetShapeDeformation = 0.9 + Math.random() * 0.2;
            }
            
            // 平滑过渡到目标形状
            this.shapeDeformation += (this.targetShapeDeformation - this.shapeDeformation) * this.shapeChangeSpeed * 0.5;
            
            // 静止时也有微小的变形方向变化
            if (Math.random() > 0.7) {
                this.shapeAxis += (Math.random() - 0.5) * 0.1;
            }
        }
        
        // 更新旋转
        this.rotation += this.rotationSpeed;
        
        // 更新边缘高光位置
        for (let i = 0; i < this.edgeHighlights.length; i++) {
            // 高光位置缓慢变化
            this.edgeHighlights[i].angle += (Math.random() - 0.5) * 0.02;
            this.edgeHighlights[i].size += (Math.random() - 0.5) * 0.01;
            if (this.edgeHighlights[i].size < 0.05) this.edgeHighlights[i].size = 0.05;
            if (this.edgeHighlights[i].size > 0.2) this.edgeHighlights[i].size = 0.2;
        }
        
        // 尝试分裂
        if (this.canSplit && this.state === 'moving' && Math.random() < this.splitChance) {
            this.split();
        }
        
        // 如果水珠掉出屏幕，从数组中移除
        if (this.y > canvas.height + this.radius * 2) {
            const index = waterdrops.indexOf(this);
            if (index !== -1) {
                waterdrops.splice(index, 1);
            }
        }
    };
    
    // 分裂方法
    Waterdrop.prototype.split = function() {
        // 创建2-3个小水珠
        const splitCount = Math.random() > 0.5 ? 2 : 3;
        
        for (let i = 0; i < splitCount; i++) {
            // 计算分裂方向
            const splitAngle = (i / splitCount) * Math.PI * 2;
            const offsetDistance = this.radius * 0.8;
            
            // 创建小水珠
            const newX = this.x + Math.cos(splitAngle) * offsetDistance;
            const newY = this.y + Math.sin(splitAngle) * offsetDistance;
            const newRadius = this.baseRadius * this.splitSizeFactor;
            
            const newDrop = new Waterdrop(newX, newY, newRadius);
            newDrop.state = 'moving';
            newDrop.speed = this.speed * 0.7 + Math.random() * 0.3;
            newDrop.angle = splitAngle * 0.2;
            newDrop.opacity = this.opacity * 0.9;
            
            // 将小水珠添加到数组
            waterdrops.push(newDrop);
        }
        
        // 原始水珠变小或消失
        this.radius *= 0.7;
        this.opacity *= 0.8;
        this.canSplit = false; // 分裂后不能再分裂
    };
    
    // 绘制水珠 - 增强形状变化的视觉效果
    Waterdrop.prototype.draw = function() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // 创建变形的水珠形状
        ctx.beginPath();
        
        // 更明显的形状变形，不限制于保持圆形感
        const rx = this.radius * (this.shapeDeformation > 1.0 ? this.shapeDeformation : 1.0);
        const ry = this.radius * (this.shapeDeformation < 1.0 ? this.shapeDeformation : 1.0);
        
        // 应用变形方向
        ctx.rotate(this.shapeAxis);
        
        // 绘制变形的圆形（椭圆）
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.closePath();
        
        // 创建没有中间高光的渐变效果
        const gradient = ctx.createRadialGradient(
            0, 0, 0,
            0, 0, this.radius * 1.2
        );
        
        // 基于状态调整颜色 - 移除中心高亮，保持圆形感
        if (this.state === 'stationary') {
            // 静止时颜色分布更均匀，更圆润
            gradient.addColorStop(0, 'rgba(180, 210, 240, ' + (this.opacity * 0.8) + ')');
            gradient.addColorStop(0.5, 'rgba(160, 190, 230, ' + (this.opacity * 0.7) + ')');
            gradient.addColorStop(1, 'rgba(140, 180, 220, ' + (this.opacity * 0.5) + ')');
        } else {
            // 流动时边缘更亮，保持圆形质感
            gradient.addColorStop(0, 'rgba(190, 220, 250, ' + (this.opacity * 0.8) + ')');
            gradient.addColorStop(0.7, 'rgba(170, 200, 240, ' + (this.opacity * 0.7) + ')');
            gradient.addColorStop(1, 'rgba(150, 190, 230, ' + (this.opacity * 0.6) + ')');
        }
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // 添加边缘高光效果（只在边缘，不在中间）
        ctx.rotate(-this.shapeAxis); // 恢复旋转以便正确计算高光位置
        
        for (let i = 0; i < this.edgeHighlights.length; i++) {
            const h = this.edgeHighlights[i];
            // 计算高光在边缘的位置，考虑变形
            let highlightX = Math.cos(h.angle) * this.radius * h.offset;
            let highlightY = Math.sin(h.angle) * this.radius * h.offset;
            
            // 应用变形到高光位置
            ctx.rotate(this.shapeAxis);
            highlightX *= (this.shapeDeformation > 1.0 ? this.shapeDeformation : 1.0);
            highlightY *= (this.shapeDeformation < 1.0 ? this.shapeDeformation : 1.0);
            ctx.rotate(-this.shapeAxis);
            
            const highlightSize = h.size * this.radius * 0.5; // 较小的高光
            
            const highlightGradient = ctx.createRadialGradient(
                highlightX, highlightY, 0,
                highlightX, highlightY, highlightSize
            );
            highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.beginPath();
            ctx.arc(highlightX, highlightY, highlightSize, 0, Math.PI * 2);
            ctx.fillStyle = highlightGradient;
            ctx.fill();
        }
        
        // 添加边缘效果
        ctx.beginPath();
        ctx.rotate(this.shapeAxis);
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.closePath();
        
        // 边缘高光根据状态调整
        const edgeOpacity = this.state === 'moving' ? this.opacity * 0.9 : this.opacity * 0.6;
        ctx.strokeStyle = 'rgba(255, 255, 255, ' + edgeOpacity + ')';
        ctx.lineWidth = 0.8;
        ctx.stroke();
        
        ctx.restore();
    };
    
    // 初始化雨点数组
    function initRaindrops() {
        if (!canvas) return;
        
        raindrops = [];
        const isMobile = window.innerWidth < 768;
        // 根据深色模式设置不同的雨点数量
        const count = isDarkMode ? 
            (isMobile ? 50 : 100) : 
            (isMobile ? 30 : 60); // 白天模式少一些但更大的雨点
        
        for (let i = 0; i < count; i++) {
            raindrops.push(new Raindrop(canvas.width, canvas.height));
        }
    }
    
    // 初始化水珠数组（白天模式）
    function initWaterdrops() {
        if (!canvas || isDarkMode) return;
        
        waterdrops = [];
        // 根据屏幕宽度确定初始水珠数量
        const isMobile = window.innerWidth < 768;
        const count = isMobile ? 15 : 30;
        
        for (let i = 0; i < count; i++) {
            const x = Math.random() * canvas.width;
            // 让水珠分布在不同高度，有些靠近顶部，有些在中间
            const y = Math.random() * canvas.height * 0.7;
            
            // 创建水珠并添加到数组
            const drop = new Waterdrop(x, y);
            
            // 让一部分水珠初始时就是移动状态
            if (Math.random() > 0.6) {
                drop.state = 'moving';
                drop.speed = Math.random() * 0.5 + 0.1;
                // 轻微初始变形，保持圆形基本形状
                drop.shapeDeformation = 1.0 + (Math.random() - 0.5) * 0.2;
                drop.shapeAxis = Math.random() * Math.PI * 2;
            }
            
            waterdrops.push(drop);
        }
    }
    
    // 更新深色模式状态
    function updateDarkMode() {
        isDarkMode = document.body.classList.contains('dark-mode');
        initRaindrops();
        initWaterdrops();
    }
    
    // 动画循环 - 添加错误处理确保稳定运行
    function animate() {
        if (isPaused) {
            animationId = requestAnimationFrame(animate);
            return;
        }
        
        try {
            // 清空画布
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // 安全更新并绘制所有雨点
            for (let i = 0; i < raindrops.length; i++) {
                try {
                    raindrops[i].update();
                    raindrops[i].draw();
                } catch (e) {
                    console.warn('Error processing raindrop:', e);
                    // 移除有问题的雨滴
                    if (i < raindrops.length) {
                        raindrops.splice(i, 1);
                        i--;
                    }
                }
            }
            
            // 仅在白天模式绘制水珠
            if (!isDarkMode) {
                // 安全更新并绘制所有水珠
                for (let i = 0; i < waterdrops.length; i++) {
                    try {
                        waterdrops[i].update();
                        waterdrops[i].draw();
                    } catch (e) {
                        console.warn('Error processing waterdrop:', e);
                        // 移除有问题的水珠
                        if (i < waterdrops.length) {
                            waterdrops.splice(i, 1);
                            i--;
                        }
                    }
                }
                
                // 随机添加新的水珠，控制数量上限防止内存泄漏
                if (Math.random() > 0.95 && waterdrops.length < 100) {
                    try {
                        waterdrops.push(new Waterdrop(Math.random() * canvas.width, Math.random() * 50));
                    } catch (e) {
                        console.warn('Error creating new waterdrop:', e);
                    }
                }
                
                // 清理过多的水珠，防止内存泄漏
                if (waterdrops.length > 150) {
                    waterdrops.splice(0, 50);
                }
            }
            
            // 确保雨点数量保持稳定
            const targetRaindropCount = isDarkMode ? 
                (window.innerWidth < 768 ? 50 : 100) : 
                (window.innerWidth < 768 ? 30 : 60);
            
            if (raindrops.length < targetRaindropCount * 0.9) {
                // 补充缺少的雨点
                for (let i = raindrops.length; i < targetRaindropCount; i++) {
                    try {
                        raindrops.push(new Raindrop(canvas.width, canvas.height));
                    } catch (e) {
                        console.warn('Error creating new raindrop:', e);
                    }
                }
            }
        } catch (e) {
            console.error('Critical error in animation loop:', e);
            // 重置状态以尝试恢复
            if (raindrops.length === 0) {
                initRaindrops();
            }
            if (!isDarkMode && waterdrops.length === 0) {
                initWaterdrops();
            }
        } finally {
            // 确保动画循环继续，即使发生错误
            animationId = requestAnimationFrame(animate);
        }
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
                initRaindrops();
                initWaterdrops();
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
