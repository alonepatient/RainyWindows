/**
 * 背景音乐控制模块
 * 实现根据主题切换不同背景音乐的功能
 */

class BackgroundMusic {
    constructor() {
        // 创建两个音频元素
        this.rainAudio = null;
        this.oceanAudio = null;
        this.currentAudio = null;
        this.isInitialized = false;
        this.isPlaying = false;
        this.volume = 0.4; // 稍微提高音量，确保能听到
        this.fadeTime = 800; // 稍短的淡入淡出时间，响应更及时
        
        // 用户指定的白噪音音频源
        // 雨声白噪音
        this.rainAudioSrc = 'https://www.soundjay.com/nature/sounds/rain-01.mp3';
        // 海水声和风声混合白噪音
        this.oceanAudioSrc = 'https://www.soundjay.com/nature/sounds/ocean-wave-1.mp3';
    }

    /**
     * 初始化背景音乐
     */
    init() {
        if (this.isInitialized) return;

        // 创建音频元素
        this.rainAudio = this.createAudioElement(this.rainAudioSrc);
        this.oceanAudio = this.createAudioElement(this.oceanAudioSrc);

        // 立即播放当前主题的音乐
        this.playCurrentThemeMusic();
        
        // 监听主题切换事件
        this.setupThemeChangeListener();

        this.isInitialized = true;
        console.log('背景音乐模块已初始化并开始播放');
    }
    
    /**
     * 播放当前主题对应的音乐
     */
    playCurrentThemeMusic() {
        if (!this.rainAudio || !this.oceanAudio) {
            console.warn('音频元素尚未初始化');
            return;
        }
        
        const isDarkMode = document.body.classList.contains('dark-mode');
        const targetAudio = isDarkMode ? this.oceanAudio : this.rainAudio;
        
        // 立即尝试播放
        this.tryPlayAudio(targetAudio, (success) => {
            if (success) {
                this.fadeIn(targetAudio);
                this.currentAudio = targetAudio;
                this.isPlaying = true;
                console.log('开始播放' + (isDarkMode ? '海水声' : '雨声') + '白噪音');
            } else {
                console.warn('首次播放失败，将在用户交互时重试');
                // 即使失败也继续初始化流程
                this.currentAudio = targetAudio;
            }
        });
    }

    /**
     * 创建音频元素
     */
    createAudioElement(src) {
        const audio = new Audio(src);
        audio.loop = true; // 设置为循环播放
        audio.volume = 0; // 初始音量为0
        audio.autoplay = false; // 不自动播放
        audio.preload = 'auto'; // 预加载整个音频，确保可以立即播放
        return audio;
    }

    /**
     * 检查当前主题并播放相应音乐
     */
    checkThemeAndPlayMusic() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        this.switchMusic(isDarkMode);
    }

    /**
     * 尝试播放音频
     */
    tryPlayAudio(audio, callback) {
        // 确保重置到开始位置
        audio.currentTime = 0;
        
        audio.play()
            .then(() => {
                console.log('音频播放成功:', audio.src);
                if (callback) callback(true);
            })
            .catch(error => {
                console.warn('音频播放失败，将在用户下次交互时重试:', error);
                // 即使失败也尝试回调，以便继续流程
                if (callback) callback(false);
            });
    }

    /**
     * 切换背景音乐
     */
    switchMusic(isDarkMode) {
        const targetAudio = isDarkMode ? this.oceanAudio : this.rainAudio;
        
        // 如果已经是目标音频且正在播放，则不执行切换
        if (this.currentAudio === targetAudio && !targetAudio.paused) {
            return;
        }

        // 简化切换逻辑，确保能正常工作
        if (this.currentAudio) {
            // 先淡出当前音频
            this.fadeOut(this.currentAudio, () => {
                // 当前音频淡出完成后，尝试播放目标音频
                this.tryPlayAudio(targetAudio, () => {
                    this.fadeIn(targetAudio);
                    this.currentAudio = targetAudio;
                    console.log('已切换到' + (isDarkMode ? '海水声' : '雨声') + '白噪音');
                });
            });
        } else {
            // 如果没有当前音频，直接尝试播放目标音频
            this.tryPlayAudio(targetAudio, () => {
                this.fadeIn(targetAudio);
                this.currentAudio = targetAudio;
                console.log('开始播放' + (isDarkMode ? '海水声' : '雨声') + '白噪音');
            });
        }
    }

    /**
     * 设置主题切换监听器
     */
    setupThemeChangeListener() {
        // 监听body的class变化
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const isDarkMode = document.body.classList.contains('dark-mode');
                    this.switchMusic(isDarkMode);
                }
            });
        });

        // 开始观察body的class变化
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
        });
        
        console.log('主题切换监听器已设置');
    }

    /**
     * 淡入效果
     */
    fadeIn(audio) {
        const startVolume = 0;
        const endVolume = this.volume;
        const duration = this.fadeTime;
        const startTime = Date.now();

        // 使用缓动函数使淡入淡出更自然
        const easeInQuad = (t) => t * t;

        const fade = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeInQuad(progress);
            audio.volume = startVolume + (endVolume - startVolume) * easedProgress;

            if (progress < 1) {
                requestAnimationFrame(fade);
            }
        };

        fade();
    }

    /**
     * 淡出效果
     */
    fadeOut(audio, callback) {
        const startVolume = audio.volume;
        const endVolume = 0;
        const duration = this.fadeTime;
        const startTime = Date.now();

        // 使用缓动函数使淡入淡出更自然
        const easeOutQuad = (t) => t * (2 - t);

        const fade = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuad(progress);
            audio.volume = startVolume + (endVolume - startVolume) * easedProgress;

            if (progress < 1) {
                requestAnimationFrame(fade);
            } else {
                audio.pause();
                if (callback) callback();
            }
        };

        fade();
    }

    /**
     * 设置音量
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume)); // 确保音量在0-1之间
        if (this.currentAudio) {
            this.currentAudio.volume = this.volume;
        }
    }

    /**
     * 暂停所有音乐
     */
    pauseAll() {
        if (this.rainAudio) this.rainAudio.pause();
        if (this.oceanAudio) this.oceanAudio.pause();
        this.currentAudio = null;
    }
}

// 创建全局实例
const bgMusic = new BackgroundMusic();

// 初始化音频
const initAudio = () => {
    if (bgMusic.isInitialized) return;
    
    // 初始化背景音乐
    bgMusic.init();
    console.log('背景音乐初始化完成');
};

// 添加过渡结束事件监听器，这是播放音乐的主要触发点
document.addEventListener('transitionEnd', () => {
    console.log('检测到过渡动画结束，开始初始化背景音乐');
    initAudio();
});

// 尝试在DOM内容加载完成后准备初始化，但不立即播放
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM已加载完成，等待过渡动画结束');
    });
} else {
    console.log('DOM已加载完成，等待过渡动画结束');
}

// 保留页面完全加载的监听，但作为备用
window.addEventListener('load', () => {
    setTimeout(() => {
        // 如果3秒后还没有初始化音乐（可能过渡效果未触发或有问题），尝试初始化
        if (!bgMusic.isInitialized) {
            console.warn('过渡动画结束事件未触发，作为后备方案开始初始化背景音乐');
            initAudio();
        }
    }, 3000);
});

// 添加用户交互事件监听器，确保在用户交互后能播放
const handleUserInteraction = () => {
    // 如果已经初始化但没有播放，则重新尝试播放
    if (bgMusic.isInitialized && !bgMusic.isPlaying) {
        console.log('用户交互后重新尝试播放音乐');
        bgMusic.playCurrentThemeMusic();
    }
};

// 添加多种用户交互事件监听器
document.addEventListener('click', handleUserInteraction);
document.addEventListener('keydown', handleUserInteraction);
document.addEventListener('touchstart', handleUserInteraction);
document.addEventListener('mousedown', handleUserInteraction);
document.addEventListener('mouseup', handleUserInteraction);
document.addEventListener('keypress', handleUserInteraction);
document.addEventListener('scroll', handleUserInteraction);
document.addEventListener('wheel', handleUserInteraction);

// 导出实例供其他模块使用
window.bgMusic = bgMusic;

// 暂时移除焦点管理，简化功能以便测试
// 音量控制方法保留但不自动调节