import React from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// 보호된 경로 목록
const PROTECTED_PATHS = [
  '/docs/private',
  '/docs/workspace', 
  '/docs/project-a',
  '/docs/project-c',
  '/docs/category/-private',
  '/docs/category/-workspace',
  '/docs/category/-project-a', 
  '/docs/category/-project-c',
  '/sws/docs/private',
  '/sws/docs/workspace',
  '/sws/docs/project-a',
  '/sws/docs/project-c',
  '/sws/docs/category/-private',
  '/sws/docs/category/-workspace',
  '/sws/docs/category/-project-a',
  '/sws/docs/category/-project-c'
];

function ProtectionWrapper({children}: {children?: React.ReactNode}) {
  React.useEffect(() => {
    if (!ExecutionEnvironment.canUseDOM) return;
    
    // 현재 경로가 보호된 경로인지 확인
    const checkProtectedPath = () => {
      const currentPath = window.location.pathname;
      const isProtected = PROTECTED_PATHS.some(path => currentPath.startsWith(path));
      
      if (isProtected) {
        // 이미 Workers 도메인이면 리다이렉트하지 않음
        if (window.location.hostname.includes('workers.dev')) {
          return;
        }
        
        // Workers 내부 요청이면 리다이렉트하지 않음
        const isWorkerRequest = navigator.userAgent.includes('Cloudflare-Workers-Internal-Request') ||
                               window.location.search.includes('workers-internal=true') ||
                               document.referrer.includes('workers.dev');
        
        if (!isWorkerRequest) {
          console.log(`[PROTECTION] Redirecting protected path: ${currentPath}`);
          const fullCurrentUrl = window.location.pathname + window.location.search + window.location.hash;
          window.location.replace(`https://shusworkspace-auth.shusworkspace.workers.dev${fullCurrentUrl}`);
          return;
        }
      }
    };
    
    // 초기 페이지 로드 시 체크
    checkProtectedPath();
    
    // 클라이언트 사이드 네비게이션 감지
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      setTimeout(checkProtectedPath, 100); // 약간의 지연 후 체크
    };
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      setTimeout(checkProtectedPath, 100); // 약간의 지연 후 체크
    };
    
    // popstate 이벤트 (뒤로가기/앞으로가기)
    const handlePopState = () => {
      setTimeout(checkProtectedPath, 100);
    };
    
    window.addEventListener('popstate', handlePopState);
    
    // 정리 함수
    return () => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
  
  return <>{children}</>;
}

// Docusaurus Root wrapper
export default function Root({children}: {children?: React.ReactNode}) {
  return (
    <ProtectionWrapper>
      {children}
    </ProtectionWrapper>
  );
}
