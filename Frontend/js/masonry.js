// Masonry布局实现 - 确保功能卡片在顶部
class MasonryLayout {
    constructor(container, options = {}) {
        this.container = container;
        this.items = [];
        this.columns = options.columns || 3;
        this.gap = options.gap || 32; // 2rem = 32px
        this.featureCards = [];
        this.articleCards = [];
        
        this.init();
    }
    
    init() {
        // 分离功能卡片和文章卡片
        const allItems = this.container.children;
        for (let item of allItems) {
            if (item.classList.contains('feature-card')) {
                this.featureCards.push(item);
            } else if (item.classList.contains('article-card')) {
                this.articleCards.push(item);
            }
        }
        
        this.layout();
        this.bindEvents();
    }
    
    layout() {
        // 重置容器样式
        this.container.style.position = 'relative';
        
        // 计算列宽
        const containerWidth = this.container.offsetWidth;
        const columnWidth = (containerWidth - (this.columns - 1) * this.gap) / this.columns;
        
        // 初始化列高度数组
        const columnHeights = new Array(this.columns).fill(0);
        
        // 首先放置功能卡片到各列顶部
        this.featureCards.forEach((card, index) => {
            if (index < this.columns) {
                const columnIndex = index;
                const x = columnIndex * (columnWidth + this.gap);
                const y = 0;
                
                this.positionItem(card, x, y, columnWidth);
                columnHeights[columnIndex] = card.offsetHeight + this.gap;
            } else {
                // 多余的功能卡片放到最短的列
                const shortestColumn = this.getShortestColumn(columnHeights);
                const x = shortestColumn * (columnWidth + this.gap);
                const y = columnHeights[shortestColumn];
                
                this.positionItem(card, x, y, columnWidth);
                columnHeights[shortestColumn] += card.offsetHeight + this.gap;
            }
        });
        
        // 然后放置文章卡片
        this.articleCards.forEach(card => {
            const shortestColumn = this.getShortestColumn(columnHeights);
            const x = shortestColumn * (columnWidth + this.gap);
            const y = columnHeights[shortestColumn];
            
            this.positionItem(card, x, y, columnWidth);
            columnHeights[shortestColumn] += card.offsetHeight + this.gap;
        });
        
        // 设置容器高度
        const maxHeight = Math.max(...columnHeights);
        this.container.style.height = `${maxHeight}px`;
    }
    
    positionItem(item, x, y, width) {
        item.style.position = 'absolute';
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
        item.style.width = `${width}px`;
        item.style.marginBottom = '0';
    }
    
    getShortestColumn(heights) {
        let shortest = 0;
        let minHeight = heights[0];
        
        for (let i = 1; i < heights.length; i++) {
            if (heights[i] < minHeight) {
                minHeight = heights[i];
                shortest = i;
            }
        }
        
        return shortest;
    }
    
    bindEvents() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.updateColumns();
                this.layout();
            }, 250);
        });
    }
    
    updateColumns() {
        const width = window.innerWidth;
        if (width <= 768) {
            this.columns = 1;
        } else if (width <= 1200) {
            this.columns = 2;
        } else {
            this.columns = 3;
        }
    }
    
    refresh() {
        this.layout();
    }
}

// 初始化Masonry布局
document.addEventListener('DOMContentLoaded', function() {
    const articlesContainer = document.querySelector('.articles');
    if (articlesContainer) {
        const masonry = new MasonryLayout(articlesContainer, {
            columns: 3,
            gap: 32
        });
        
        // 导出到全局，便于其他脚本使用
        window.masonryLayout = masonry;
    }
});

