import React from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// 인증 상태 확인 함수 (세션 + 만료시간 체크)
function checkAuthStatus(): boolean {
  try {
    const authDataStr = sessionStorage.getItem('sws_auth');
    if (!authDataStr) {
      return false;
    }

    const authData = JSON.parse(authDataStr);
    const now = Date.now();
    const elapsed = now - authData.timestamp;

    // 만료 시간 체크
    if (elapsed > authData.expires) {
      console.log('[AUTH] Session expired, clearing auth data');
      sessionStorage.removeItem('sws_auth');
      return false;
    }

    // 비밀번호 검증
    return authData.password === 'shiwookim.po';
  } catch (error) {
    console.error('[AUTH] Error checking auth status:', error);
    sessionStorage.removeItem('sws_auth');
    return false;
  }
}

// 커스텀 로그인 모달 함수
function showLoginModal() {
  // 기존 모달이 있으면 제거
  const existingModal = document.getElementById('sws-login-modal');
  if (existingModal) {
    existingModal.remove();
  }

  // 모달 HTML 생성
  const modalHTML = `
    <div id="sws-login-modal" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <div style="
        background: white;
        padding: 2.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        text-align: center;
        max-width: 400px;
        width: 90%;
      ">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🔐</div>
        <h1 style="color: #333; margin-bottom: 0.5rem; font-size: 1.8rem;">Shu's Workspace</h1>
        <p style="color: #666; margin-bottom: 2rem; font-size: 0.95rem;">이 사이트에 접근하려면 인증이 필요합니다</p>
        
        <div id="error-message" style="
          background: #fee;
          color: #c33;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 1.5rem;
          border: 1px solid #fcc;
          display: none;
        ">❌ 비밀번호가 올바르지 않습니다. 다시 시도해주세요.</div>
        
        <form id="login-form" style="text-align: left;">
          <div style="margin-bottom: 1.5rem;">
            <label for="password" style="
              display: block;
              margin-bottom: 0.5rem;
              color: #333;
              font-weight: 500;
            ">비밀번호</label>
            <input type="password" id="password" required autofocus style="
              width: 100%;
              padding: 12px 16px;
              border: 2px solid #e1e5e9;
              border-radius: 8px;
              font-size: 16px;
              transition: border-color 0.3s;
              outline: none;
              box-sizing: border-box;
            ">
          </div>
          
          <button type="submit" style="
            width: 100%;
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            transition: background 0.3s;
          ">접속하기</button>
        </form>
        
        <div style="
          font-size: 0.85rem;
          color: #666;
          margin-top: 1rem;
          line-height: 1.4;
        ">💡 인증 후 사이트의 모든 문서에 자유롭게 접근할 수 있습니다.</div>
      </div>
    </div>
  `;

  // 모달을 DOM에 추가
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // 이벤트 리스너 등록
  const form = document.getElementById('login-form');
  const errorDiv = document.getElementById('error-message');
  const passwordInput = document.getElementById('password');

  // 포커스 스타일 추가
  passwordInput.addEventListener('focus', (e) => {
    const target = e.target as HTMLInputElement;
    target.style.borderColor = '#667eea';
    target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
  });

  passwordInput.addEventListener('blur', (e) => {
    const target = e.target as HTMLInputElement;
    target.style.borderColor = '#e1e5e9';
    target.style.boxShadow = 'none';
  });

  // 폼 제출 처리
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = (passwordInput as HTMLInputElement).value;
    
    if (password === 'shiwookim.po') {
      // 세션 스토리지 + 만료 시간 설정 (3시간)
      const authData = {
        password: password,
        timestamp: Date.now(),
        expires: 3 * 60 * 60 * 1000 // 3시간 (밀리초)
      };
      sessionStorage.setItem('sws_auth', JSON.stringify(authData));
      document.getElementById('sws-login-modal').remove();
      console.log('[GLOBAL_AUTH] Authentication successful');
    } else {
      errorDiv.style.display = 'block';
      (passwordInput as HTMLInputElement).value = '';
      passwordInput.focus();
    }
  });

  // ESC 키로 닫기 방지 (인증 필수)
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.getElementById('sws-login-modal')) {
      e.preventDefault();
    }
  });
}

function GlobalAuthWrapper({children}: {children?: React.ReactNode}) {
  React.useEffect(() => {
    if (!ExecutionEnvironment.canUseDOM) return;
    
    // 전역 인증 확인
    const checkGlobalAuth = () => {
      // 로컬 개발 환경에서 직접 인증 처리 (ELLO 방식과 동일)
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log(`[GLOBAL_AUTH] Local development mode - checking auth`);
        
        // 로컬에서 인증 상태 확인 (세션 + 만료시간 체크)
        const isAuthenticated = checkAuthStatus();
        
        if (!isAuthenticated) {
          // 커스텀 로그인 폼 표시
          showLoginModal();
          return;
        }
        return;
      }
      
      // 프로덕션 환경에서도 같은 도메인에서 인증 처리 (ELLO 방식)
      console.log(`[GLOBAL_AUTH] Production mode - checking auth`);
      
      // 인증 상태 확인 (세션 + 만료시간 체크)
      const isAuthenticated = checkAuthStatus();
      
      if (!isAuthenticated) {
        // 커스텀 로그인 폼 표시
        showLoginModal();
        return;
      }
    };
    
    // 초기 페이지 로드 시 체크
    checkGlobalAuth();
    
    // 로그아웃 기능 (개발용)
    const handleKeyPress = (e) => {
      // Ctrl+Shift+L로 로그아웃
      if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        sessionStorage.removeItem('sws_auth');
        window.location.reload();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
    
  }, []);
  
  return <>{children}</>;
}

// Docusaurus Root wrapper
export default function Root({children}: {children?: React.ReactNode}) {
  return (
    <GlobalAuthWrapper>
      {children}
    </GlobalAuthWrapper>
  );
}