/**
 * 像素图书馆游戏
 * 玩家可以控制像素人物在图书馆中移动，有碰撞检测
 */

// 游戏常量
const TILE_SIZE = 32; // 像素块大小
const PLAYER_SPEED = 4; // 玩家移动速度
const SCREEN_WIDTH = 800; // 屏幕宽度
const SCREEN_HEIGHT = 600; // 屏幕高度

// 游戏变量
let backgroundCanvas, backgroundCtx, characterCanvas, characterCtx;
let player = {
    x: 12 * TILE_SIZE, // 世界坐标
    y: 3 * TILE_SIZE, // 世界坐标
    width: TILE_SIZE,
    height: TILE_SIZE,
    color: '#e74c3c',
    direction: 'down', // 默认方向
    animationFrame: 0 // 用于简单动画效果
};

// 背景偏移 - 用于实现屏幕移动
let backgroundOffsetX = 0;
let backgroundOffsetY = 0;

// 按键状态
let keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

// 图书馆地图 (0=空地, 1=墙壁, 2=书架)
let map = [];
let mapWidth = 25; // 25个方块宽
let mapHeight = 18; // 18个方块高

// 初始化游戏
function initGame() {
    // 获取画布和上下文
    backgroundCanvas = document.getElementById('backgroundCanvas');
    backgroundCtx = backgroundCanvas.getContext('2d');
    
    characterCanvas = document.getElementById('characterCanvas');
    characterCtx = characterCanvas.getContext('2d');
    
    // 设置画布分辨率为屏幕大小
    backgroundCanvas.width = SCREEN_WIDTH;
    backgroundCanvas.height = SCREEN_HEIGHT;
    characterCanvas.width = SCREEN_WIDTH;
    characterCanvas.height = SCREEN_HEIGHT;
    
    // 初始化地图
    initMap();
    
    // 设置初始背景偏移，使玩家居中
    updateBackgroundOffset();
    
    // 设置事件监听
    setupEventListeners();
    
    // 开始游戏循环
    requestAnimationFrame(gameLoop);
}

// 更新背景偏移，使玩家保持在屏幕中央
function updateBackgroundOffset() {
    // 计算背景偏移，使玩家位于屏幕中央
    backgroundOffsetX = player.x - (SCREEN_WIDTH / 2) + (player.width / 2);
    backgroundOffsetY = player.y - (SCREEN_HEIGHT / 2) + (player.height / 2);
    
    // 限制背景偏移不超出地图边界
    backgroundOffsetX = Math.max(0, Math.min(backgroundOffsetX, (mapWidth * TILE_SIZE) - SCREEN_WIDTH));
    backgroundOffsetY = Math.max(0, Math.min(backgroundOffsetY, (mapHeight * TILE_SIZE) - SCREEN_HEIGHT));
}

// 初始化地图
function initMap() {
    // 创建空地图
    for (let y = 0; y < mapHeight; y++) {
        map[y] = [];
        for (let x = 0; x < mapWidth; x++) {
            map[y][x] = 0; // 默认空地
        }
    }
    
    // 添加边界墙
    for (let x = 0; x < mapWidth; x++) {
        map[0][x] = 1; // 上边界
        map[mapHeight - 1][x] = 1; // 下边界
    }
    for (let y = 0; y < mapHeight; y++) {
        map[y][0] = 1; // 左边界
        map[y][mapWidth - 1] = 1; // 右边界
    }
    
    // 图书馆布局设计
    
    // 1. 添加前台（入口处）
    for (let x = 10; x < 15; x++) {
        map[2][x] = 2; // 前台
    }
    
    // 2. 添加书架排列 - 左侧区域
    for (let y = 5; y < 10; y++) {
        for (let x = 3; x < 7; x++) {
            map[y][x] = 2;
        }
    }
    
    for (let y = 11; y < 16; y++) {
        for (let x = 3; x < 7; x++) {
            map[y][x] = 2;
        }
    }
    
    // 3. 添加书架排列 - 中间区域
    for (let y = 5; y < 8; y++) {
        for (let x = 10; x < 14; x++) {
            map[y][x] = 2;
        }
    }
    
    for (let y = 10; y < 13; y++) {
        for (let x = 10; x < 14; x++) {
            map[y][x] = 2;
        }
    }
    
    for (let y = 14; y < 16; y++) {
        for (let x = 10; x < 14; x++) {
            map[y][x] = 2;
        }
    }
    
    // 4. 添加书架排列 - 右侧区域
    for (let y = 5; y < 10; y++) {
        for (let x = 17; x < 21; x++) {
            map[y][x] = 2;
        }
    }
    
    for (let y = 11; y < 16; y++) {
        for (let x = 17; x < 21; x++) {
            map[y][x] = 2;
        }
    }
    
    // 5. 添加阅读桌椅
    // 左侧阅读区
    map[7][8] = 3; // 桌子
    map[7][9] = 3; // 桌子
    
    // 右侧阅读区
    map[7][15] = 3; // 桌子
    map[7][16] = 3; // 桌子
    
    // 中央阅读区
    map[13][8] = 3; // 桌子
    map[13][9] = 3; // 桌子
    
    // 6. 添加柱子
    map[5][5] = 1;
    map[5][18] = 1;
    map[13][5] = 1;
    map[13][18] = 1;
}

// 设置事件监听
function setupEventListeners() {
    // 键盘按下事件
    document.addEventListener('keydown', (e) => {
        console.log('Key pressed:', e.key);
        switch(e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                keys.up = true;
                console.log('Keys state after down:', {...keys});
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                keys.down = true;
                console.log('Keys state after down:', {...keys});
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                keys.left = true;
                console.log('Keys state after down:', {...keys});
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                keys.right = true;
                console.log('Keys state after down:', {...keys});
                break;
        }
    });
    
    // 键盘释放事件
    document.addEventListener('keyup', (e) => {
        console.log('Key released:', e.key);
        switch(e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                keys.up = false;
                console.log('Keys state after up:', {...keys});
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                keys.down = false;
                console.log('Keys state after up:', {...keys});
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                keys.left = false;
                console.log('Keys state after up:', {...keys});
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                keys.right = false;
                console.log('Keys state after up:', {...keys});
                break;
        }
    });
}

function checkCollision(x, y, width, height) {
    // 2像素的碰撞padding
    const padding = 2;
    const paddedX = x + padding;
    const paddedY = y + padding;
    const paddedWidth = width - (padding * 2);
    const paddedHeight = height - (padding * 2);
    
    // 检查边界
    if (paddedX < 0 || paddedY < 0 || 
        paddedX + paddedWidth > mapWidth * TILE_SIZE || 
        paddedY + paddedHeight > mapHeight * TILE_SIZE) {
        return true; // 边界碰撞
    }
    
    // 计算玩家占据的网格坐标范围
    const startGridX = Math.floor(paddedX / TILE_SIZE);
    const startGridY = Math.floor(paddedY / TILE_SIZE);
    const endGridX = Math.ceil((paddedX + paddedWidth) / TILE_SIZE) - 1;
    const endGridY = Math.ceil((paddedY + paddedHeight) / TILE_SIZE) - 1;
    
    // 检查玩家周围的单元格
    for (let gridY = startGridY; gridY <= endGridY; gridY++) {
        // 确保gridY在有效范围内
        if (gridY < 0 || gridY >= map.length) continue;
        
        for (let gridX = startGridX; gridX <= endGridX; gridX++) {
            // 确保gridX在有效范围内
            if (gridX < 0 || gridX >= map[gridY].length) continue;
            
            const tileType = map[gridY][gridX];
            
            // 检查是否是障碍物（1=墙，2=书架，3=桌子）
            if (tileType === 1 || tileType === 2 || tileType === 3) {
                // 计算障碍物的实际坐标
                const obstacleX = gridX * TILE_SIZE;
                const obstacleY = gridY * TILE_SIZE;
                
                // 矩形碰撞检测
                if (!(paddedX + paddedWidth <= obstacleX || 
                      paddedX >= obstacleX + TILE_SIZE || 
                      paddedY + paddedHeight <= obstacleY || 
                      paddedY >= obstacleY + TILE_SIZE)) {
                    return true; // 碰撞
                }
            }
        }
    }
    
    return false; // 没有碰撞
}

// 更新游戏状态
function update() {
    // 添加调试日志
    console.log('Update - Player position:', {x: player.x, y: player.y});
    console.log('Update - Keys pressed:', {...keys});
    
    // 处理玩家移动
    let newX = player.x;
    let newY = player.y;
    let isMoving = false;
    
    // 更新玩家方向和位置
    if (keys.up) {
        newY -= PLAYER_SPEED;
        player.direction = 'up';
        isMoving = true;
        console.log('UP key pressed - newY:', newY);
    }
    if (keys.down) {
        newY += PLAYER_SPEED;
        player.direction = 'down';
        isMoving = true;
        console.log('DOWN key pressed - newY:', newY);
    }
    if (keys.left) {
        newX -= PLAYER_SPEED;
        player.direction = 'left';
        isMoving = true;
        console.log('LEFT key pressed - newX:', newX);
    }
    if (keys.right) {
        newX += PLAYER_SPEED;
        player.direction = 'right';
        isMoving = true;
        console.log('RIGHT key pressed - newX:', newX);
    }
    
    console.log('Calculated new position before collision check:', {newX, newY, isMoving});
    
    // 更新动画帧（仅在移动时）
    if (isMoving) {
        player.animationFrame = (player.animationFrame + 0.2) % 4; // 缓慢更新动画帧
    }
    
    // 先检查边界，再进行碰撞检测
    newX = Math.max(0, Math.min((mapWidth * TILE_SIZE) - player.width, newX));
    newY = Math.max(0, Math.min((mapHeight * TILE_SIZE) - player.height, newY));
    
    console.log('Calculated new position after boundary check:', {newX, newY});
    
    // 碰撞检测 - X轴移动
    const xCollision = checkCollision(newX, player.y, player.width, player.height);
    console.log('X-axis collision check result:', xCollision);
    if (!xCollision) {
        console.log('X-axis movement allowed, updating player.x to:', newX);
        player.x = newX;
    }
    
    // 碰撞检测 - Y轴移动
    const yCollision = checkCollision(player.x, newY, player.width, player.height);
    console.log('Y-axis collision check result:', yCollision);
    if (!yCollision) {
        console.log('Y-axis movement allowed, updating player.y to:', newY);
        player.y = newY;
    }
    
    console.log('Player position after update:', {x: player.x, y: player.y});
    
    // 更新背景偏移，使玩家保持在屏幕中央
    updateBackgroundOffset();
}

function updateDebugInfo() {
    try {
        // 更新玩家位置显示（显示世界坐标）
        document.getElementById('player-position').textContent = `${player.x.toFixed(2)}, ${player.y.toFixed(2)}`;
        
        // 更新背景偏移显示（使用HTML中存在的camera-position元素）
        document.getElementById('camera-position').textContent = `${backgroundOffsetX.toFixed(2)}, ${backgroundOffsetY.toFixed(2)}`;
        
        // 更新碰撞状态显示
        const collisionStatus = document.getElementById('collision-status');
        // 检查当前玩家位置是否有碰撞
        const hasCollision = checkCollision(player.x, player.y, player.width, player.height);
        collisionStatus.textContent = hasCollision ? '碰撞中' : '无碰撞';
        
        // 更新移动方向显示
        const moveDirection = document.getElementById('move-direction');
        if (keys.up) moveDirection.textContent = '向上';
        else if (keys.down) moveDirection.textContent = '向下';
        else if (keys.left) moveDirection.textContent = '向左';
        else if (keys.right) moveDirection.textContent = '向右';
        else moveDirection.textContent = '静止';
    } catch (error) {
        console.error('Error updating debug info:', error);
    }
}

// 渲染背景
function renderBackground() {
    // 清空背景画布
    backgroundCtx.fillStyle = '#7f8c8d';
    backgroundCtx.fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
    
    // 计算可见区域的地图坐标范围
    const startX = Math.max(0, Math.floor(backgroundOffsetX / TILE_SIZE));
    const startY = Math.max(0, Math.floor(backgroundOffsetY / TILE_SIZE));
    const endX = Math.min(mapWidth - 1, Math.ceil((backgroundOffsetX + SCREEN_WIDTH) / TILE_SIZE));
    const endY = Math.min(mapHeight - 1, Math.ceil((backgroundOffsetY + SCREEN_HEIGHT) / TILE_SIZE));
    
    // 渲染地图（只渲染可见区域）
    for (let y = startY; y <= endY; y++) {
        for (let x = startX; x <= endX; x++) {
            const tileType = map[y][x];
            let tileColor;
            
            switch(tileType) {
                case 0: // 空地
                    tileColor = '#bdc3c7';
                    break;
                case 1: // 墙壁/柱子
                    tileColor = '#2c3e50';
                    break;
                case 2: // 书架/前台
                    tileColor = '#8B4513';
                    break;
                case 3: // 桌子
                    tileColor = '#D2B48C';
                    break;
                default:
                    tileColor = '#bdc3c7';
            }
            
            // 计算屏幕上的绘制位置（应用背景偏移）
            const screenX = x * TILE_SIZE - backgroundOffsetX;
            const screenY = y * TILE_SIZE - backgroundOffsetY;
            
            backgroundCtx.fillStyle = tileColor;
            backgroundCtx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
            
            // 为书架添加细节
            if (tileType === 2) {
                backgroundCtx.fillStyle = '#A0522D';
                // 书架分隔线
                backgroundCtx.fillRect(screenX + 2, screenY + 8, TILE_SIZE - 4, 2);
                backgroundCtx.fillRect(screenX + 2, screenY + 16, TILE_SIZE - 4, 2);
                backgroundCtx.fillRect(screenX + 2, screenY + 24, TILE_SIZE - 4, 2);
                // 书籍（简单表示为彩色方块）
                const bookColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7b731'];
                for (let i = 0; i < 4; i++) {
                    backgroundCtx.fillStyle = bookColors[i % bookColors.length];
                    backgroundCtx.fillRect(screenX + 4 + i * 6, screenY + 2, 4, 4);
                    backgroundCtx.fillRect(screenX + 4 + i * 6, screenY + 10, 4, 4);
                    backgroundCtx.fillRect(screenX + 4 + i * 6, screenY + 18, 4, 4);
                    backgroundCtx.fillRect(screenX + 4 + i * 6, screenY + 26, 4, 4);
                }
            }
            
            // 为桌子添加细节
            if (tileType === 3) {
                backgroundCtx.fillStyle = '#8B4513';
                // 桌腿
                backgroundCtx.fillRect(screenX + 4, screenY + TILE_SIZE - 6, 4, 6);
                backgroundCtx.fillRect(screenX + TILE_SIZE - 8, screenY + TILE_SIZE - 6, 4, 6);
            }
            
            // 添加网格线
            backgroundCtx.strokeStyle = '#95a5a6';
            backgroundCtx.strokeRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
        }
    }
}

// 渲染角色
function renderCharacter() {
    // 清空角色画布 - 确保完全清空
    characterCtx.fillStyle = 'transparent';
    characterCtx.fillRect(0, 0, characterCanvas.width, characterCanvas.height);
    characterCtx.clearRect(0, 0, characterCanvas.width, characterCanvas.height);
    
    // 计算动画帧（0-3）
    let frame = Math.floor(player.animationFrame);
    
    // 玩家始终在屏幕中央的位置
    const playerScreenX = (SCREEN_WIDTH / 2) - (player.width / 2);
    const playerScreenY = (SCREEN_HEIGHT / 2) - (player.height / 2);
    
    // 改进的像素人物渲染 - 更像实例人物而非方块
    switch(player.direction) {
        case 'down':
            // 身体
            characterCtx.fillStyle = '#3498db'; // 蓝色上衣
            characterCtx.fillRect(playerScreenX + 8, playerScreenY + 12, 16, 16);
            
            // 头部（圆形效果）
            characterCtx.fillStyle = '#f5deb3'; // 肤色
            characterCtx.fillRect(playerScreenX + 6, playerScreenY + 2, 20, 12);
            characterCtx.fillRect(playerScreenX + 4, playerScreenY + 4, 24, 8);
            
            // 眼睛（向下看）
            characterCtx.fillStyle = '#333333';
            characterCtx.fillRect(playerScreenX + 10, playerScreenY + 8, 3, 3);
            characterCtx.fillRect(playerScreenX + 19, playerScreenY + 8, 3, 3);
            
            // 表情（简单像素化）
            characterCtx.fillStyle = '#8b4513'; // 嘴巴
            characterCtx.fillRect(playerScreenX + 10, playerScreenY + 14, 12, 2);
            
            // 裤子
            characterCtx.fillStyle = '#2c3e50';
            characterCtx.fillRect(playerScreenX + 8, playerScreenY + 24, 16, 8);
            
            // 腿部动画
            if (frame % 2 === 0) {
                // 左腿在前
                characterCtx.fillStyle = '#2c3e50'; // 裤子颜色
                characterCtx.fillRect(playerScreenX + 8, playerScreenY + 28, 6, 4);
                characterCtx.fillStyle = '#f5deb3'; // 鞋子
                characterCtx.fillRect(playerScreenX + 6, playerScreenY + 32, 10, 2);
                
                // 右腿在后
                characterCtx.fillStyle = '#2c3e50';
                characterCtx.fillRect(playerScreenX + 18, playerScreenY + 28, 6, 4);
                characterCtx.fillStyle = '#f5deb3';
                characterCtx.fillRect(playerScreenX + 16, playerScreenY + 32, 10, 2);
            } else {
                // 右腿在前
                characterCtx.fillStyle = '#2c3e50';
                characterCtx.fillRect(playerScreenX + 18, playerScreenY + 28, 6, 4);
                characterCtx.fillStyle = '#f5deb3';
                characterCtx.fillRect(playerScreenX + 16, playerScreenY + 32, 10, 2);
                
                // 左腿在后
                characterCtx.fillStyle = '#2c3e50';
                characterCtx.fillRect(playerScreenX + 8, playerScreenY + 28, 6, 4);
                characterCtx.fillStyle = '#f5deb3';
                characterCtx.fillRect(playerScreenX + 6, playerScreenY + 32, 10, 2);
            }
            
            // 手臂（下垂）
            characterCtx.fillStyle = '#f5deb3'; // 肤色
            characterCtx.fillRect(playerScreenX + 2, playerScreenY + 16, 6, 8);
            characterCtx.fillRect(playerScreenX + 24, playerScreenY + 16, 6, 8);
            break;
            
        case 'up':
            // 身体
            characterCtx.fillStyle = '#3498db'; // 蓝色上衣
            characterCtx.fillRect(playerScreenX + 8, playerScreenY + 12, 16, 16);
            
            // 头部（圆形效果）
            characterCtx.fillStyle = '#f5deb3'; // 肤色
            characterCtx.fillRect(playerScreenX + 6, playerScreenY + 2, 20, 12);
            characterCtx.fillRect(playerScreenX + 4, playerScreenY + 4, 24, 8);
            
            // 眼睛（向上看）
            characterCtx.fillStyle = '#333333';
            characterCtx.fillRect(playerScreenX + 10, playerScreenY + 4, 3, 3);
            characterCtx.fillRect(playerScreenX + 19, playerScreenY + 4, 3, 3);
            
            // 表情
            characterCtx.fillStyle = '#8b4513'; // 嘴巴
            characterCtx.fillRect(playerScreenX + 10, playerScreenY + 10, 12, 2);
            
            // 裤子
            characterCtx.fillStyle = '#2c3e50';
            characterCtx.fillRect(playerScreenX + 8, playerScreenY + 24, 16, 8);
            
            // 腿部动画
            if (frame % 2 === 0) {
                characterCtx.fillStyle = '#2c3e50';
                characterCtx.fillRect(playerScreenX + 8, playerScreenY + 28, 6, 4);
                characterCtx.fillStyle = '#f5deb3';
                characterCtx.fillRect(playerScreenX + 6, playerScreenY + 32, 10, 2);
                
                characterCtx.fillStyle = '#2c3e50';
                characterCtx.fillRect(playerScreenX + 18, playerScreenY + 28, 6, 4);
                characterCtx.fillStyle = '#f5deb3';
                characterCtx.fillRect(playerScreenX + 16, playerScreenY + 32, 10, 2);
            } else {
                characterCtx.fillStyle = '#2c3e50';
                characterCtx.fillRect(playerScreenX + 18, playerScreenY + 28, 6, 4);
                characterCtx.fillStyle = '#f5deb3';
                characterCtx.fillRect(playerScreenX + 16, playerScreenY + 32, 10, 2);
                
                characterCtx.fillStyle = '#2c3e50';
                characterCtx.fillRect(playerScreenX + 8, playerScreenY + 28, 6, 4);
                characterCtx.fillStyle = '#f5deb3';
                characterCtx.fillRect(playerScreenX + 6, playerScreenY + 32, 10, 2);
            }
            
            // 手臂（举到前方）
            characterCtx.fillStyle = '#f5deb3';
            characterCtx.fillRect(playerScreenX + 4, playerScreenY + 14, 4, 8);
            characterCtx.fillRect(playerScreenX + 24, playerScreenY + 14, 4, 8);
            break;
            
        case 'left':
            // 身体
            characterCtx.fillStyle = '#3498db'; // 蓝色上衣
            characterCtx.fillRect(playerScreenX + 10, playerScreenY + 12, 14, 16);
            
            // 头部（圆形效果）
            characterCtx.fillStyle = '#f5deb3'; // 肤色
            characterCtx.fillRect(playerScreenX + 8, playerScreenY + 2, 16, 12);
            characterCtx.fillRect(playerScreenX + 10, playerScreenY + 4, 12, 8);
            
            // 眼睛（向左看）
            characterCtx.fillStyle = '#333333';
            characterCtx.fillRect(playerScreenX + 8, playerScreenY + 8, 3, 3);
            characterCtx.fillRect(playerScreenX + 13, playerScreenY + 8, 3, 3);
            
            // 表情
            characterCtx.fillStyle = '#8b4513'; // 嘴巴
            characterCtx.fillRect(playerScreenX + 10, playerScreenY + 14, 8, 2);
            
            // 裤子
            characterCtx.fillStyle = '#2c3e50';
            characterCtx.fillRect(playerScreenX + 10, playerScreenY + 24, 14, 8);
            
            // 左腿
            characterCtx.fillStyle = '#2c3e50';
            characterCtx.fillRect(playerScreenX + 10, playerScreenY + 28, 6, 4);
            characterCtx.fillStyle = '#f5deb3';
            characterCtx.fillRect(playerScreenX + 8, playerScreenY + 32, 10, 2);
            
            // 右腿
            characterCtx.fillStyle = '#2c3e50';
            characterCtx.fillRect(playerScreenX + 18, playerScreenY + 28, 6, 4);
            characterCtx.fillStyle = '#f5deb3';
            characterCtx.fillRect(playerScreenX + 16, playerScreenY + 32, 10, 2);
            
            // 手臂动画
            characterCtx.fillStyle = '#f5deb3'; // 肤色
            if (frame % 2 === 0) {
                // 手臂后摆
                characterCtx.fillRect(playerScreenX + 4, playerScreenY + 16, 6, 6);
            } else {
                // 手臂前摆
                characterCtx.fillRect(playerScreenX + 2, playerScreenY + 18, 8, 6);
            }
            
            // 另一只手臂（固定）
            characterCtx.fillStyle = '#f5deb3';
            characterCtx.fillRect(playerScreenX + 20, playerScreenY + 16, 4, 6);
            break;
            
        case 'right':
            // 身体
            characterCtx.fillStyle = '#3498db'; // 蓝色上衣
            characterCtx.fillRect(playerScreenX + 8, playerScreenY + 12, 14, 16);
            
            // 头部（圆形效果）
            characterCtx.fillStyle = '#f5deb3'; // 肤色
            characterCtx.fillRect(playerScreenX + 8, playerScreenY + 2, 16, 12);
            characterCtx.fillRect(playerScreenX + 10, playerScreenY + 4, 12, 8);
            
            // 眼睛（向右看）
            characterCtx.fillStyle = '#333333';
            characterCtx.fillRect(playerScreenX + 17, playerScreenY + 8, 3, 3);
            characterCtx.fillRect(playerScreenX + 22, playerScreenY + 8, 3, 3);
            
            // 表情
            characterCtx.fillStyle = '#8b4513'; // 嘴巴
            characterCtx.fillRect(playerScreenX + 14, playerScreenY + 14, 8, 2);
            
            // 裤子
            characterCtx.fillStyle = '#2c3e50';
            characterCtx.fillRect(playerScreenX + 8, playerScreenY + 24, 14, 8);
            
            // 左腿
            characterCtx.fillStyle = '#2c3e50';
            characterCtx.fillRect(playerScreenX + 8, playerScreenY + 28, 6, 4);
            characterCtx.fillStyle = '#f5deb3';
            characterCtx.fillRect(playerScreenX + 6, playerScreenY + 32, 10, 2);
            
            // 右腿
            characterCtx.fillStyle = '#2c3e50';
            characterCtx.fillRect(playerScreenX + 16, playerScreenY + 28, 6, 4);
            characterCtx.fillStyle = '#f5deb3';
            characterCtx.fillRect(playerScreenX + 14, playerScreenY + 32, 10, 2);
            
            // 手臂动画
            characterCtx.fillStyle = '#f5deb3'; // 肤色
            if (frame % 2 === 0) {
                // 手臂后摆
                characterCtx.fillRect(playerScreenX + 22, playerScreenY + 16, 6, 6);
            } else {
                // 手臂前摆
                characterCtx.fillRect(playerScreenX + 24, playerScreenY + 18, 8, 6);
            }
            
            // 另一只手臂（固定）
            characterCtx.fillStyle = '#f5deb3';
            characterCtx.fillRect(playerScreenX + 8, playerScreenY + 16, 4, 6);
            break;
    }
}

// 游戏循环
// 添加计数器来限制调试日志频率
let frameCount = 0;

function gameLoop() {
    // 每10帧输出一次调试信息，避免控制台被淹没
    frameCount++;
    if (frameCount % 10 === 0) {
        console.log('Game loop running - Frame:', frameCount);
    }
    
    // 更新游戏状态
    update();
    
    // 更新调试信息
    updateDebugInfo();
    
    // 渲染游戏画面
    renderBackground();
    renderCharacter();
    
    // 请求下一帧
    requestAnimationFrame(gameLoop);
}

// 当页面加载完成后初始化游戏
window.addEventListener('load', initGame);