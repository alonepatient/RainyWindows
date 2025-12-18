/**
 * 打字效果功能实现
 * - 为profile-role和profile-motto元素添加打字效果
 * - 英文打字 → 退格 → 中文打字（保留表情图标）
 * - 同步显示和消失效果
 */

// 文本内容配置（分离表情图标和文字内容）
const textContent = {
    role: {
        icon: '👦',
        en: ' A AlonePatient Bound By Freedom',
        zh: ' 推动自由巨石的西西弗斯'
    },
    motto: {
        icon: '📝',
        en: ' The only way to do great is to love what you do.',
        zh: ' 人注定是要受自由之苦的'
    }
};

// 打字效果配置
const typingConfig = {
    typingSpeed: 180,      // 打字速度（毫秒/字符）- 减慢打字速度
    erasingSpeed: 90,      // 退格速度（毫秒/字符）- 减慢退格速度
    delayBetweenLang: 5000, // 英文显示时间（毫秒）- 延长到5秒
    delayAfterChinese: 5000 // 中文显示后等待时间（毫秒）- 延长到5秒
};

/**
 * 打字效果函数
 * @param {HTMLElement} element - 目标元素
 * @param {string} text - 要显示的文本
 * @param {number} speed - 打字速度
 * @returns {Promise} - 打字完成的Promise
 */
async function typeText(element, text, speed) {
    return new Promise((resolve) => {
        let index = 0;
        const timer = setInterval(() => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(timer);
                resolve();
            }
        }, speed);
    });
}

/**
 * 退格效果函数（保留表情图标）
 * @param {HTMLElement} element - 目标元素
 * @param {string} icon - 要保留的表情图标
 * @param {number} speed - 退格速度
 * @returns {Promise} - 退格完成的Promise
 */
async function eraseText(element, icon, speed) {
    return new Promise((resolve) => {
        const timer = setInterval(() => {
            // 确保只删除到表情图标为止
            if (element.textContent.length > icon.length) {
                element.textContent = element.textContent.substring(0, element.textContent.length - 1);
            } else {
                clearInterval(timer);
                resolve();
            }
        }, speed);
    });
}

/**
 * 延迟函数
 * @param {number} ms - 延迟时间（毫秒）
 * @returns {Promise} - 延迟完成的Promise
 */
async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 为单个元素执行英文打字流程
 * @param {HTMLElement} element - 目标元素
 * @param {Object} content - 包含表情图标、英文和中文内容的对象
 */
async function typeEnglishText(element, content) {
    // 设置表情图标
    element.textContent = content.icon;
    
    // 英文打字效果
    await typeText(element, content.en, typingConfig.typingSpeed);
}

/**
 * 为单个元素执行英文退格流程
 * @param {HTMLElement} element - 目标元素
 * @param {Object} content - 包含表情图标、英文和中文内容的对象
 */
async function eraseEnglishText(element, content) {
    // 退格效果（保留表情图标）
    await eraseText(element, content.icon, typingConfig.erasingSpeed);
}

/**
 * 为单个元素执行中文打字流程
 * @param {HTMLElement} element - 目标元素
 * @param {Object} content - 包含表情图标、英文和中文内容的对象
 */
async function runChineseTyping(element, content) {
    // 中文打字效果
    await typeText(element, content.zh, typingConfig.typingSpeed);
}

/**
 * 为单个元素执行消失（退格）流程
 * @param {HTMLElement} element - 目标元素
 * @param {Object} content - 包含表情图标、英文和中文内容的对象
 */
async function runDisappearing(element, content) {
    // 退格效果（保留表情图标）
    // 确保退格过程不会在消失后添加延迟
    await eraseText(element, content.icon, typingConfig.erasingSpeed);
}

/**
 * 初始化打字效果 - 循环版本
 * 实现英文和中文的循环交替显示
 */
async function initTypingEffect() {
    // 获取两个元素
    const roleElement = document.querySelector('.profile-role');
    const mottoElement = document.querySelector('.profile-motto');
    
    // 确保两个元素都存在
    if (!roleElement || !mottoElement) return;
    
    // 添加循环配置
    const loopConfig = {
        // 中英文切换之间的间隔时间（毫秒）
        switchDelay: 1500 // 适当延长切换间隔，使过渡更自然
    };
    
    // 无限循环函数
    async function typingLoop() {
        // 第一部分：英文显示流程
        // 英文打字
        await Promise.all([
            typeEnglishText(roleElement, textContent.role),
            typeEnglishText(mottoElement, textContent.motto)
        ]);
        
        // 英文显示停留时间
        await delay(typingConfig.delayBetweenLang);
        
        // 英文退格（保留表情图标）
        await Promise.all([
            eraseEnglishText(roleElement, textContent.role),
            eraseEnglishText(mottoElement, textContent.motto)
        ]);
        
        // 中英文切换间隔
        await delay(loopConfig.switchDelay);
        
        // 第二部分：中文显示流程
        // 中文打字
        await Promise.all([
            runChineseTyping(roleElement, textContent.role),
            runChineseTyping(mottoElement, textContent.motto)
        ]);
        
        // 中文显示停留时间
        await delay(typingConfig.delayAfterChinese);
        
        // 中文退格（保留表情图标）
        await Promise.all([
            runDisappearing(roleElement, textContent.role),
            runDisappearing(mottoElement, textContent.motto)
        ]);
        
        // 中英文切换间隔
        await delay(loopConfig.switchDelay);
        
        // 继续循环
        typingLoop();
    }
    
    // 启动循环
    typingLoop();
}

// 当DOM加载完成后初始化打字效果
document.addEventListener('DOMContentLoaded', initTypingEffect);