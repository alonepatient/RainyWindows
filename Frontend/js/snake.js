// 像素贪吃蛇自动动画 - GitHub贡献墙风格
(function() {
    'use strict';
    
    let canvas, ctx;
    let snake = [];
    let food = {};
    let dx = 8; // 初始方向：向右
    let dy = 0;
    let score = 0;
    let animationFrameId;
    let frameCount = 0;
    let colorIndex = 0;
    
    // GitHub贡献墙风格的背景数据
    let contributionData = [];
    
    // 像素风格配置 - 改为长方形，减少方格数量，放大方格大小
    const pixelSize = 16; // 放大方格大小
    const gridWidth = 35; // 减少宽度方格数量（原来的一半）
    const gridHeight = 15; // 减少高度方格数量（原来的一半）
    const canvasWidth = gridWidth * pixelSize;
    const canvasHeight = gridHeight * pixelSize;
    
    // GitHub贡献墙颜色
    const contributionColors = {
        level0: '#ebedf0', // 没有贡献
        level1: '#c6e48b', // 少量贡献
        level2: '#7bc96f', // 一般贡献
        level3: '#239a3b', // 较多贡献
        level4: '#196127'  // 大量贡献
    };
    
    // 贪吃蛇颜色数组
    const pixelColors = [
        '#536DFE', '#40C4FF', '#69F0AE', '#FFD740', 
        '#FF7B25', '#FF5252', '#7C4DFF', '#EC407A'
    ];
    
    // 生成模拟的GitHub贡献墙数据
    function generateContributionData() {
        const data = [];
        for (let y = 0; y < gridHeight; y++) {
            data[y] = [];
            for (let x = 0; x < gridWidth; x++) {
                // 生成随机贡献等级，遵循一定的分布规律
                const rand = Math.random();
                if (rand < 0.5) data[y][x] = 0;     // 50% 没有贡献
                else if (rand < 0.75) data[y][x] = 1; // 25% 少量贡献
                else if (rand < 0.9) data[y][x] = 2;  // 15% 一般贡献
                else if (rand < 0.97) data[y][x] = 3; // 7% 较多贡献
                else data[y][x] = 4;                  // 3% 大量贡献
            }
        }
        return data;
    }
    
    // 创建游戏画布
    function createSnakeCanvas() {
        const existingCanvas = document.getElementById('snake-canvas');
        if (existingCanvas) {
            existingCanvas.remove();
        }
        
        canvas = document.createElement('canvas');
        canvas.id = 'snake-canvas';
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = '1px solid #e1e4e8';
        canvas.style.borderRadius = '6px';
        canvas.style.backgroundColor = '#ffffff';
        canvas.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        canvas.style.margin = '20px auto';
        canvas.style.display = 'block';
        canvas.style.imageRendering = 'pixelated'; // 像素效果
        
        // 将画布添加到header元素内部，确保在标题区域显示
        const header = document.querySelector('.header');
        if (header) {
            // 添加到header元素末尾
            header.appendChild(canvas);
        } else {
            document.body.appendChild(canvas);
        }
        ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false; // 禁用平滑，保持像素风格
        
        // 生成GitHub贡献墙数据
        contributionData = generateContributionData();
        
        // 初始化游戏
        initGame();
        
        // 开始自动动画
        animate();
    }
    
    // 初始化游戏
    function initGame() {
        // 初始化蛇的位置和长度（居中放置）
        const startX = Math.floor(gridWidth / 2) * pixelSize;
        const startY = Math.floor(gridHeight / 2) * pixelSize;
        
        snake = [
            {x: startX, y: startY, color: pixelColors[0]},
            {x: startX - pixelSize, y: startY, color: pixelColors[1]},
            {x: startX - pixelSize * 2, y: startY, color: pixelColors[2]},
            {x: startX - pixelSize * 3, y: startY, color: pixelColors[3]}
        ];
        generateFood();
        score = 0;
        dx = pixelSize; // 初始方向：向右
        dy = 0;
    }
    
    // 生成食物
    function generateFood() {
        food = {
            x: Math.floor(Math.random() * gridWidth) * pixelSize,
            y: Math.floor(Math.random() * gridHeight) * pixelSize,
            color: pixelColors[Math.floor(Math.random() * pixelColors.length)],
            blinkTimer: 0,
            isVisible: true
        };
        
        // 确保食物不在蛇身上
        for (let segment of snake) {
            if (segment.x === food.x && segment.y === food.y) {
                generateFood();
                return;
            }
        }
    }
    
    // 像素化渲染 - 取消边框效果
    function drawPixel(x, y, size, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, size, size);
    }
    
    // 绘制GitHub贡献墙背景
    function drawContributionBackground() {
        // 绘制每个贡献格子
        for (let y = 0; y < gridHeight; y++) {
            for (let x = 0; x < gridWidth; x++) {
                const level = contributionData[y][x];
                let color;
                
                switch(level) {
                    case 1: color = contributionColors.level1; break;
                    case 2: color = contributionColors.level2; break;
                    case 3: color = contributionColors.level3; break;
                    case 4: color = contributionColors.level4; break;
                    default: color = contributionColors.level0;
                }
                
                // 绘制贡献格子 - 取消边框效果
                ctx.fillStyle = color;
                ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
            }
        }
    }
    
    // 绘制游戏
    function draw() {
        // 清空画布为白色背景（GitHub风格）
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制GitHub贡献墙背景
        drawContributionBackground();
        
        // 绘制蛇 - 优化像素风格和视觉表现
        for (let i = 0; i < snake.length; i++) {
            const segment = snake[i];
            
            // 蛇身体渐变颜色 - 取消边框效果
            const segmentColor = segment.color || pixelColors[(colorIndex + i) % pixelColors.length];
            ctx.fillStyle = segmentColor;
            ctx.fillRect(segment.x, segment.y, pixelSize, pixelSize);
            
            // 为头部添加更明显的眼睛
            if (i === 0) {
                ctx.fillStyle = 'white';
                const eyeSize = Math.max(1, Math.floor(pixelSize / 3));
                
                // 根据移动方向调整眼睛位置
                if (dx > 0) { // 向右
                    ctx.fillRect(segment.x + Math.floor(pixelSize * 0.6), 
                                segment.y + Math.floor(pixelSize * 0.3), 
                                eyeSize, eyeSize);
                    ctx.fillRect(segment.x + Math.floor(pixelSize * 0.6), 
                                segment.y + Math.floor(pixelSize * 0.6), 
                                eyeSize, eyeSize);
                } else if (dx < 0) { // 向左
                    ctx.fillRect(segment.x + Math.floor(pixelSize * 0.2), 
                                segment.y + Math.floor(pixelSize * 0.3), 
                                eyeSize, eyeSize);
                    ctx.fillRect(segment.x + Math.floor(pixelSize * 0.2), 
                                segment.y + Math.floor(pixelSize * 0.6), 
                                eyeSize, eyeSize);
                } else if (dy > 0) { // 向下
                    ctx.fillRect(segment.x + Math.floor(pixelSize * 0.3), 
                                segment.y + Math.floor(pixelSize * 0.6), 
                                eyeSize, eyeSize);
                    ctx.fillRect(segment.x + Math.floor(pixelSize * 0.6), 
                                segment.y + Math.floor(pixelSize * 0.6), 
                                eyeSize, eyeSize);
                } else if (dy < 0) { // 向上
                    ctx.fillRect(segment.x + Math.floor(pixelSize * 0.3), 
                                segment.y + Math.floor(pixelSize * 0.2), 
                                eyeSize, eyeSize);
                    ctx.fillRect(segment.x + Math.floor(pixelSize * 0.6), 
                                segment.y + Math.floor(pixelSize * 0.2), 
                                eyeSize, eyeSize);
                }
            }
            
            // 为蛇身添加渐变效果，使头部和尾部有所区分
            if (i > 0 && i < snake.length - 1) {
                // 为中间部分添加轻微的阴影效果
                ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.fillRect(segment.x + 1, segment.y + 1, pixelSize - 2, pixelSize - 2);
            }
        }
        
        // 绘制闪烁的食物
        if (food.isVisible) {
            // 优化闪烁效果，使用GitHub风格颜色
            const alpha = 0.6 + 0.4 * Math.sin(frameCount * 0.15);
            ctx.fillStyle = `rgba(237, 73, 86, ${alpha})`; // GitHub red
            ctx.fillRect(food.x, food.y, pixelSize, pixelSize);
            
            // 添加更清晰的食物标记
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
            const dotSize = Math.max(1, Math.floor(pixelSize / 3));
            ctx.fillRect(food.x + Math.floor(pixelSize/2 - dotSize/2), 
                        food.y + Math.floor(pixelSize/2 - dotSize/2), 
                        dotSize, dotSize);
            
            // 食物绘制完成，已取消边框效果
        }
    }
    
    // 自动控制蛇的移动 - 确保不斜着走
    function autoControl() {
        const head = snake[0];
        
        // 简单的寻路算法：朝着食物方向移动
        const horizontalDiff = food.x - head.x;
        const verticalDiff = food.y - head.y;
        
        // 随机改变方向的可能性，增加变化性
        const randomChange = Math.random() < 0.08; // 稍微增加随机变化的概率
        
        if (randomChange) {
            // 随机改变方向，但不允许180度转向和斜向移动
            const possibleDirections = [];
            if (dx !== pixelSize) possibleDirections.push({dx: -pixelSize, dy: 0}); // 左
            if (dx !== -pixelSize) possibleDirections.push({dx: pixelSize, dy: 0}); // 右
            if (dy !== pixelSize) possibleDirections.push({dx: 0, dy: -pixelSize}); // 上
            if (dy !== -pixelSize) possibleDirections.push({dx: 0, dy: pixelSize}); // 下
            
            const randomDir = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
            dx = randomDir.dx;
            dy = randomDir.dy;
        } else {
            // 主要寻路逻辑 - 确保只沿一个方向移动，不会斜着走
            // 基于当前移动方向，优先继续沿该方向移动
            // 只有在需要转向时才改变方向
            
            // 如果当前是水平移动
            if (dx !== 0) {
                // 如果食物在水平方向上的差距更大，继续水平移动
                if (Math.abs(horizontalDiff) > Math.abs(verticalDiff) / 2) {
                    if (horizontalDiff > 0 && dx !== -pixelSize) {
                        dx = pixelSize;
                        dy = 0;
                    } else if (horizontalDiff < 0 && dx !== pixelSize) {
                        dx = -pixelSize;
                        dy = 0;
                    }
                } 
                // 否则转向垂直移动
                else {
                    if (verticalDiff > 0 && dy !== -pixelSize) {
                        dx = 0;
                        dy = pixelSize;
                    } else if (verticalDiff < 0 && dy !== pixelSize) {
                        dx = 0;
                        dy = -pixelSize;
                    }
                }
            }
            // 如果当前是垂直移动
            else {
                // 如果食物在垂直方向上的差距更大，继续垂直移动
                if (Math.abs(verticalDiff) > Math.abs(horizontalDiff) / 2) {
                    if (verticalDiff > 0 && dy !== -pixelSize) {
                        dx = 0;
                        dy = pixelSize;
                    } else if (verticalDiff < 0 && dy !== pixelSize) {
                        dx = 0;
                        dy = -pixelSize;
                    }
                }
                // 否则转向水平移动
                else {
                    if (horizontalDiff > 0 && dx !== -pixelSize) {
                        dx = pixelSize;
                        dy = 0;
                    } else if (horizontalDiff < 0 && dx !== pixelSize) {
                        dx = -pixelSize;
                        dy = 0;
                    }
                }
            }
        }
    }
    
    // 游戏主循环
    function game() {
        // 每5帧更新一次游戏状态，控制动画速度
        if (frameCount % 5 === 0) {
            // 自动控制蛇的移动
            autoControl();
            
            // 移动蛇
            const head = {
                x: snake[0].x + dx,
                y: snake[0].y + dy
            };
            
            // 检查边界碰撞 - 不允许穿出墙壁
            if (head.x < 0 || head.x >= canvasWidth - pixelSize || 
                head.y < 0 || head.y >= canvasHeight - pixelSize) {
                // 碰到墙壁，改变方向
                // 基于当前方向，选择一个有效的新方向
                const currentDir = dx !== 0 ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
                const possibleDirections = [];
                
                // 根据碰到的边界选择可能的方向
                if (head.x < 0 || head.x >= canvasWidth - pixelSize) {
                    // 水平边界碰撞，只能上下移动
                    if (dy !== pixelSize) possibleDirections.push({dx: 0, dy: -pixelSize}); // 上
                    if (dy !== -pixelSize) possibleDirections.push({dx: 0, dy: pixelSize}); // 下
                } else {
                    // 垂直边界碰撞，只能左右移动
                    if (dx !== pixelSize) possibleDirections.push({dx: -pixelSize, dy: 0}); // 左
                    if (dx !== -pixelSize) possibleDirections.push({dx: pixelSize, dy: 0}); // 右
                }
                
                // 如果有可选方向，随机选择一个
                if (possibleDirections.length > 0) {
                    const randomDir = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
                    dx = randomDir.dx;
                    dy = randomDir.dy;
                    
                    // 重新计算头部位置
                    head.x = snake[0].x + dx;
                    head.y = snake[0].y + dy;
                } else {
                    // 没有可选方向，保持原方向但不移动
                    return;
                }
            }
            
            // 为新头部分配一个颜色
            head.color = pixelColors[colorIndex];
            
            // 添加新头部
            snake.unshift(head);
            
            // 检查是否吃到食物
            if (head.x === food.x && head.y === food.y) {
                score += 10;
                generateFood();
                
                // 吃到食物后改变颜色
                colorIndex = (colorIndex + 1) % pixelColors.length;
                
                // 随机改变背景中某些格子的贡献等级
                for (let i = 0; i < 3; i++) {
                    const x = Math.floor(Math.random() * gridWidth);
                    const y = Math.floor(Math.random() * gridHeight);
                    // 只改变没有被蛇覆盖的格子
                    let isSnakeSegment = false;
                    for (const segment of snake) {
                        if (segment.x === x * pixelSize && segment.y === y * pixelSize) {
                            isSnakeSegment = true;
                            break;
                        }
                    }
                    if (!isSnakeSegment) {
                        // 增加贡献等级，但不超过最高等级
                        contributionData[y][x] = Math.min(4, contributionData[y][x] + 1);
                    }
                }
            } else {
                snake.pop();
            }
            
            // 检查自身碰撞 - 重置而不是结束
            for (let i = 1; i < snake.length; i++) {
                if (head.x === snake[i].x && head.y === snake[i].y) {
                    // 重置蛇，但保持长度
                    const newLength = Math.max(4, snake.length - 3);
                    initGame();
                    // 保持一定长度
                    while (snake.length < newLength) {
                        snake.push({x: snake[snake.length - 1].x - dx, 
                                    y: snake[snake.length - 1].y - dy,
                                    color: pixelColors[(colorIndex + snake.length) % pixelColors.length]});
                    }
                    break;
                }
            }
        }
        
        // 食物闪烁效果
        if (frameCount % 20 === 0) {
            food.blinkTimer++;
            if (food.blinkTimer % 2 === 0) {
                food.isVisible = !food.isVisible;
            }
        }
        
        // 绘制游戏
        draw();
        
        // 更新帧计数
        frameCount++;
        
        // 继续动画循环
        animationFrameId = requestAnimationFrame(game);
    }
    
    // 动画主循环 - 优化性能和流畅度
    function animate() {
        // 使用requestAnimationFrame确保流畅的动画
        animationFrameId = requestAnimationFrame(game);
    }
    
    // 优化食物生成，确保不会生成在蛇身上
    function generateFood() {
        let overlapping = true;
        
        while (overlapping) {
            // 在网格范围内随机生成食物位置
            food = {
                x: Math.floor(Math.random() * gridWidth) * pixelSize,
                y: Math.floor(Math.random() * gridHeight) * pixelSize,
                color: pixelColors[Math.floor(Math.random() * pixelColors.length)],
                blinkTimer: 0,
                isVisible: true
            };
            
            // 检查是否与蛇身重叠
            overlapping = false;
            for (let i = 0; i < snake.length; i++) {
                if (snake[i].x === food.x && snake[i].y === food.y) {
                    overlapping = true;
                    break;
                }
            }
        }
    }
    
    // 初始化
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createSnakeCanvas);
        } else {
            createSnakeCanvas();
        }
    }
    
    // 页面卸载时清理动画
    window.addEventListener('unload', function() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    });
    
    init();
})();
