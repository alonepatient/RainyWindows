// 留言板交互功能
document.addEventListener('DOMContentLoaded', function() {
    // 表情选择器功能
    const emojiButtons = document.querySelectorAll('.emoji-btn');
    const messageTextarea = document.getElementById('messageContent');
    
    emojiButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const emoji = this.getAttribute('data-emoji');
            const currentValue = messageTextarea.value;
            const cursorPosition = messageTextarea.selectionStart;
            
            // 在光标位置插入表情
            const newValue = currentValue.slice(0, cursorPosition) + 
                           emoji + ' ' + 
                           currentValue.slice(cursorPosition);
            
            messageTextarea.value = newValue;
            messageTextarea.focus();
            
            // 设置光标位置
            const newCursorPosition = cursorPosition + emoji.length + 1;
            messageTextarea.setSelectionRange(newCursorPosition, newCursorPosition);
            
            // 添加点击动画
            this.style.transform = 'scale(0.9) rotate(0deg)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // 表单提交处理
    const messageForm = document.getElementById('messageForm');
    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        // 提交按钮动画
        submitBtn.textContent = '发布中...';
        submitBtn.style.transform = 'scale(0.95)';
        submitBtn.disabled = true;
        
        // 模拟提交过程
        setTimeout(() => {
            submitBtn.textContent = '发布成功 ✓';
            submitBtn.style.background = '#27ae60';
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.style.transform = '';
                submitBtn.disabled = false;
                
                // 清空表单
                messageForm.reset();
                
                // 显示成功提示
                showNotification('留言发布成功！', 'success');
            }, 1500);
        }, 1000);
    });
    
    // 点赞功能
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const likeCount = this.querySelector('.like-count');
            const likeIcon = this.querySelector('.like-icon');
            let currentCount = parseInt(likeCount.textContent);
            
            // 切换点赞状态
            if (this.classList.contains('liked')) {
                this.classList.remove('liked');
                likeCount.textContent = currentCount - 1;
                likeIcon.textContent = '👍';
            } else {
                this.classList.add('liked');
                likeCount.textContent = currentCount + 1;
                likeIcon.textContent = '❤️';
                
                // 点赞动画
                this.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            }
        });
    });
    
    // 回复功能
    const replyButtons = document.querySelectorAll('.reply-btn');
    replyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const replyTo = this.getAttribute('data-reply-to');
            const messageContent = document.getElementById('messageContent');
            
            // 在输入框中添加@回复
            const currentValue = messageContent.value;
            const replyText = `@${replyTo} `;
            
            if (!currentValue.includes(replyText)) {
                messageContent.value = replyText + currentValue;
                messageContent.focus();
                
                // 设置光标位置
                messageContent.setSelectionRange(replyText.length, replyText.length);
            }
            
            // 滚动到表单
            document.querySelector('.message-form').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        });
    });
    
    // 输入框自动调整高度
    const textarea = document.getElementById('messageContent');
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.max(140, this.scrollHeight) + 'px';
    });
    
    // 输入框焦点效果
    const inputs = document.querySelectorAll('.form-group input, .form-group textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    // 加载更多留言
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            const originalText = this.textContent;
            this.textContent = '加载中...';
            this.disabled = true;
            
            // 模拟加载过程
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
                showNotification('已加载更多留言', 'info');
            }, 1000);
        });
    }
    
    // 通知提示功能
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // 添加样式
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? '#27ae60' : 
                       type === 'error' ? '#e74c3c' : '#3498db',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: '1000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // 显示动画
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // 自动隐藏
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // 页面加载动画
    const animateElements = document.querySelectorAll('.message-item, .message-form, .page-header');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                entry.target.style.transition = 'all 0.6s ease';
                
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, entry.target.dataset.delay || 0);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    animateElements.forEach((el, index) => {
        el.dataset.delay = index * 100;
        observer.observe(el);
    });
});

