// Shu's Workspace - Main JavaScript

class ShusWorkspace {
    constructor() {
        this.currentPage = 'home';
        this.isAuthenticated = false;
        this.privatePassword = 'shu2025';
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.handleInitialRoute();
        this.checkAuthStatus();
        this.setupAnimations();
    }
    
    setupEventListeners() {
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        
        sidebarToggle?.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
        
        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link, .card-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.closest('[data-page]')?.dataset.page;
                if (page) {
                    this.navigateToPage(page);
                }
            });
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                    sidebar.classList.remove('open');
                }
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                sidebar.classList.remove('open');
            }
            if (e.key === 'Enter' && e.target.id === 'privatePassword') {
                this.authenticatePrivate();
            }
        });
        
        window.authenticatePrivate = () => this.authenticatePrivate();
    }
    
    handleInitialRoute() {
        const hash = window.location.hash.slice(1);
        if (hash && document.getElementById(hash)) {
            this.navigateToPage(hash);
        }
    }
    
    navigateToPage(pageId) {
        if (pageId === 'private-planning' && !this.isAuthenticated) {
            this.showAuthRequired();
        }
        
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        
        const targetPage = document.getElementById(pageId);
        const targetNavLink = document.querySelector(`[data-page="${pageId}"]`);
        
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;
            window.location.hash = pageId;
            
            const pageTitle = targetPage.querySelector('.page-title')?.textContent;
            if (pageTitle) {
                document.title = `${pageTitle} - Shu's Workspace`;
            }
        }
        
        if (targetNavLink) {
            targetNavLink.classList.add('active');
        }
        
        if (window.innerWidth <= 1024) {
            document.getElementById('sidebar').classList.remove('open');
        }
        
        window.scrollTo(0, 0);
    }
    
    showAuthRequired() {
        this.navigateToPage('private-planning');
        const authRequired = document.querySelector('.auth-required');
        const privateContent = document.querySelector('.private-content');
        
        if (authRequired && privateContent) {
            authRequired.style.display = 'flex';
            privateContent.style.display = 'none';
        }
    }
    
    authenticatePrivate() {
        const passwordInput = document.getElementById('privatePassword');
        const authError = document.getElementById('authError');
        const password = passwordInput.value;
        
        if (password === this.privatePassword) {
            this.isAuthenticated = true;
            sessionStorage.setItem('shu_workspace_auth', 'true');
            sessionStorage.setItem('shu_workspace_auth_time', Date.now().toString());
            
            this.showPrivateContent();
            passwordInput.value = '';
            authError.textContent = '';
        } else {
            authError.textContent = 'Incorrect password. Please try again.';
            passwordInput.value = '';
        }
    }
    
    showPrivateContent() {
        const authRequired = document.querySelector('.auth-required');
        const privateContent = document.querySelector('.private-content');
        
        if (authRequired && privateContent) {
            authRequired.style.display = 'none';
            privateContent.style.display = 'block';
            privateContent.style.animation = 'fadeIn 0.5s forwards';
        }
    }
    
    checkAuthStatus() {
        const authStatus = sessionStorage.getItem('shu_workspace_auth');
        const authTime = sessionStorage.getItem('shu_workspace_auth_time');
        
        if (authStatus === 'true' && authTime) {
            const timeDiff = Date.now() - parseInt(authTime);
            const twentyFourHours = 24 * 60 * 60 * 1000;
            
            if (timeDiff < twentyFourHours) {
                this.isAuthenticated = true;
            } else {
                sessionStorage.removeItem('shu_workspace_auth');
                sessionStorage.removeItem('shu_workspace_auth_time');
            }
        }
    }
    
    setupAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        setTimeout(() => {
            const elements = document.querySelectorAll('.content-card, .project-card, .note-card, .blog-post');
            elements.forEach((el, index) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
                observer.observe(el);
            });
        }, 100);
    }
}

// Additional styles
const additionalCSS = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
        20%, 40%, 60%, 80% { transform: translateX(3px); }
    }
    
    .sidebar.open {
        transform: translateX(0) !important;
    }
    
    .nav-link::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        transition: left 0.5s;
    }
    
    .nav-link:hover::before {
        left: 100%;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const workspace = new ShusWorkspace();
    
    setTimeout(() => {
        console.log('🚀 Shu\'s Workspace initialized successfully!');
        console.log('🔐 Private password: shu2025');
    }, 1000);
});