/**
 * 编剧文案策划作品集网站 JavaScript
 * 实现导航、作品展示、模态框等交互功能
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initNavigation();
    initPortfolioFilter();
    initPortfolioModal();
    initContactForm();
    initAnimations();
    initLazyLoading();
});

/**
 * 导航功能初始化
 * 包括平滑滚动和移动端菜单
 */
function initNavigation() {
    // 导航链接点击事件 - 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 关闭移动端菜单
            if (document.querySelector('.nav-menu').classList.contains('active')) {
                toggleMobileMenu();
            }
            
            // 获取目标区域ID
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // 计算滚动位置（考虑导航栏高度）
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                // 平滑滚动
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // 更新活动导航链接
                updateActiveNavLink(targetId);
            }
        });
    });
    
    // 移动端菜单切换
    document.querySelector('.hamburger').addEventListener('click', toggleMobileMenu);
    
    // 滚动时更新活动导航链接
    window.addEventListener('scroll', updateActiveNavOnScroll);
}

/**
 * 切换移动端菜单显示/隐藏
 */
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

/**
 * 根据当前滚动位置更新活动导航链接
 */
function updateActiveNavOnScroll() {
    const scrollPosition = window.scrollY + 100; // 偏移量
    
    // 获取所有导航链接和对应区域
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    let currentSection = '';
    
    // 确定当前可见的区域
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = '#' + section.getAttribute('id');
        }
    });
    
    // 更新活动链接
    if (currentSection) {
        updateActiveNavLink(currentSection);
    }
}

/**
 * 更新活动导航链接样式
 * @param {string} targetId - 目标区域ID
 */
function updateActiveNavLink(targetId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

/**
 * 作品筛选功能初始化
 */
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 更新按钮样式
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // 获取筛选类别
            const filter = this.getAttribute('data-filter');
            
            // 筛选作品
            portfolioItems.forEach(item => {
                // 隐藏所有项目
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                
                // 延迟后显示匹配的项目
                setTimeout(() => {
                    if (filter === 'all' || item.classList.contains(filter)) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        item.style.display = 'none';
                    }
                }, 300);
            });
        });
    });
}

/**
 * 作品详情模态框初始化
 */
function initPortfolioModal() {
    const modal = document.getElementById('portfolioModal');
    const modalBody = document.getElementById('modalBody');
    const closeBtn = document.querySelector('.close');
    const viewButtons = document.querySelectorAll('.view-details');
    
    // 作品数据
    const portfolioData = [
        {
            id: 1,
            title: '世界观设计',
            genre: '科幻、奇幻',
            downloadUrl: 'downloads/世界观设计.pdf'
        },
        {
            id: 2,
            title: '剧情大纲创作',
            genre: '悬疑推理',
            downloadUrl: 'downloads/剧情大纲创作.pdf'
        },
        {
            id: 3,
            title: '小说创作',
            genre: '现实主义',
            downloadUrl: 'downloads/小说创作.pdf'
        },
    ];
    
    // 打开模态框
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const portfolioId = parseInt(this.getAttribute('data-id'));
            const portfolio = portfolioData.find(item => item.id === portfolioId);
            
            if (portfolio) {
                // 填充模态框内容
                modalBody.innerHTML = `
                    <div class="modal-header">
                        <div class="modal-info">
                            <h2 class="modal-title">${portfolio.title}</h2>
                        </div>
                    </div>
                    <div class="modal-details">
                        <div class="detail-item">
                            <span class="detail-label">类型:</span>
                            <span>${portfolio.genre}</span>
                        </div>
                    </div>
                    <div class="modal-actions">
                        <a href="${portfolio.downloadUrl}" class="download-btn" download>
                            <i class="fas fa-download"></i> 下载作品
                        </a>
                        <button class="btn-secondary close-modal">返回列表</button>
                    </div>
                `;
                
                // 显示模态框
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // 防止背景滚动
                
                // 添加关闭按钮事件
                modalBody.querySelector('.close-modal').addEventListener('click', closeModal);
            }
        });
    });
    
    // 关闭模态框
    closeBtn.addEventListener('click', closeModal);
    
    // 点击模态框外部关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // ESC键关闭模态框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
    
    // 关闭模态框函数
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // 恢复背景滚动
    }
}

/**
 * 联系表单初始化
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // 模拟表单提交
            console.log('表单提交数据:', formData);
            
            // 显示提交成功消息
            alert('感谢您的留言！我会尽快回复您。');
            
            // 重置表单
            contactForm.reset();
        });
    }
}

/**
 * 页面动画初始化
 */
function initAnimations() {
    // 使用GSAP初始化页面加载动画
    gsap.from('.navbar', { duration: 1, y: -100, ease: 'power3.out' });
    gsap.from('.banner-title', { duration: 1, opacity: 0, y: 50, delay: 0.3, ease: 'power3.out' });
    gsap.from('.banner-subtitle', { duration: 1, opacity: 0, y: 50, delay: 0.5, ease: 'power3.out' });
    gsap.from('.btn-primary', { duration: 1, opacity: 0, y: 50, delay: 0.7, ease: 'power3.out' });
    gsap.from('.banner-image', { duration: 1.2, opacity: 0, x: 100, delay: 0.5, ease: 'power3.out' });
    
    // 注册ScrollTrigger插件
    gsap.registerPlugin(ScrollTrigger);
    
    // 技能条动画
    gsap.utils.toArray('.skill-progress').forEach(progress => {
        gsap.fromTo(progress, 
            { width: 0 }, 
            { 
                width: progress.style.width, 
                duration: 1.5, 
                scrollTrigger: {
                    trigger: progress,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
    
    // 作品卡片动画
    gsap.utils.toArray('.portfolio-item').forEach((item, i) => {
        gsap.fromTo(item, 
            { opacity: 0, y: 50 }, 
            { 
                opacity: 1, 
                y: 0, 
                duration: 0.8, 
                delay: i * 0.1,
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
    
    // 其他区块动画
    gsap.utils.toArray('section').forEach(section => {
        // 跳过首页banner
        if (section.id === 'home') return;
        
        gsap.fromTo(section.querySelector('.section-title'), 
            { opacity: 0, y: 50 }, 
            { 
                opacity: 1, 
                y: 0, 
                duration: 0.8,
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            }
        );
        
        gsap.fromTo(section.querySelectorAll('.fade-in'), 
            { opacity: 0, y: 30 }, 
            { 
                opacity: 1, 
                y: 0, 
                duration: 0.8,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: section,
                    start: 'top 70%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
}

/**
 * 图片懒加载初始化
 */
function initLazyLoading() {
    // 检查浏览器是否支持原生懒加载
    if ('loading' in HTMLImageElement.prototype) {
        // 支持原生懒加载，使用data-src替换src
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
        });
    } else {
        // 不支持原生懒加载，使用Intersection Observer实现
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}