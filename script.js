/**
 * 보안회사 웹사이트 (시큐닥터) 인터랙션 스크립트
 * 
 * 주요 기능:
 * 1. 모바일 햄버거 메뉴 토글 인터랙션 (열기 / 닫기)
 * 2. 모바일 메뉴 링크 클릭 시 메뉴 자동 닫기
 * 3. 메뉴 외부 영역 클릭 및 ESC 키 입력 시 메뉴 닫기
 * 4. 화면 리사이즈 시 모바일 메뉴 상태 자동 정리
 * 5. 상단 스크롤에 따른 헤더 그림자 효과 및 활성 섹션 하이라이트
 */

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const nav = document.querySelector('.nav') || document.querySelector('nav');
    const navLinks = document.querySelector('.nav-links');
    let navToggle = document.querySelector('.nav-toggle');

    // 1. 모바일 햄버거 토글 버튼이 HTML에 없을 경우 대비 (동적 생성 안전장치)
    if (!navToggle && nav && navLinks) {
        navToggle = document.createElement('button');
        navToggle.className = 'nav-toggle';
        navToggle.id = 'navToggle';
        navToggle.type = 'button';
        navToggle.setAttribute('aria-label', '메뉴 열기');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.innerHTML = '<span class="hamburger-icon">☰</span>';
        nav.insertBefore(navToggle, navLinks);
    }

    const hamburgerIcon = navToggle ? navToggle.querySelector('.hamburger-icon') || navToggle : null;

    // 모바일 메뉴 열기
    function openMenu() {
        if (!navLinks || !navToggle) return;
        navLinks.classList.add('active');
        navToggle.setAttribute('aria-expanded', 'true');
        navToggle.setAttribute('aria-label', '메뉴 닫기');
        if (hamburgerIcon) {
            hamburgerIcon.textContent = '✕';
        }
    }

    // 모바일 메뉴 닫기
    function closeMenu() {
        if (!navLinks || !navToggle) return;
        navLinks.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', '메뉴 열기');
        if (hamburgerIcon) {
            hamburgerIcon.textContent = '☰';
        }
    }

    // 모바일 메뉴 토글
    function toggleMenu() {
        if (!navLinks) return;
        const isOpen = navLinks.classList.contains('active');
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    // 햄버거 버튼 클릭 이벤트 등록
    if (navToggle) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }

    // 네비게이션 메뉴 링크 클릭 시 모바일 메뉴 닫기
    if (navLinks) {
        const links = navLinks.querySelectorAll('a');
        links.forEach((link) => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });
    }

    // 메뉴 바깥 영역 클릭 시 메뉴 닫기
    document.addEventListener('click', (e) => {
        if (navLinks && navLinks.classList.contains('active')) {
            if (nav && !nav.contains(e.target)) {
                closeMenu();
            }
        }
    });

    // ESC 키 입력 시 열려있는 메뉴 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
            closeMenu();
            if (navToggle) {
                navToggle.focus();
            }
        }
    });

    // 브라우저 너비가 모바일 기준(768px)보다 커지면 메뉴 상태 초기화
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navLinks && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });

    // 2. 스크롤 인터랙션: 헤더 그림자 효과 및 현재 섹션 네비게이션 링크 활성화
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a');

    function handleScroll() {
        // 스크롤 시 헤더에 그림자 스타일 추가
        if (header) {
            if (window.scrollY > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // 현재 보고 있는 섹션 계산 및 nav 링크 활성화
        const scrollPosition = window.scrollY + 120;
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navAnchors.forEach((anchor) => {
                    if (anchor.getAttribute('href') === `#${sectionId}`) {
                        anchor.classList.add('active');
                    } else {
                        anchor.classList.remove('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 페이지 로드 시 초기 활성화 상태 반영
});
