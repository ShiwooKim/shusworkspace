import type {ReactNode} from 'react';
import { useEffect, useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const [isLocalhost, setIsLocalhost] = useState(false);
  
  useEffect(() => {
    // 브라우저 환경에서만 실행
    if (ExecutionEnvironment.canUseDOM) {
      // 로컬호스트인지 확인
      const localhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname.includes('.local');
      setIsLocalhost(localhost);
      
      // 프로덕션 환경에서만 Workers 사이트로 리다이렉트
      const isProduction = !localhost;
      
      // Workers 내부 요청인지 확인 (User-Agent 체크)
      const isWorkerRequest = navigator.userAgent.includes('Cloudflare-Workers-Internal-Request');
      
      // 프로덕션이고 Workers 내부 요청이 아닐 때만 리다이렉트
      if (isProduction && !isWorkerRequest) {
        window.location.replace('https://shusworkspace-auth.shusworkspace.workers.dev');
      }
    }
  }, []);

  if (isLocalhost) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
        <h1>🛠️ 로컬 개발 환경</h1>
        <p>현재 로컬 개발 모드입니다. 프로덕션에서는 자동으로 보안 사이트로 리다이렉트됩니다.</p>
        
        <div style={{ margin: '2rem 0', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
          <h3>📋 로컬 테스트</h3>
          <ul>
            <li><a href="http://localhost:3000/shusworkspace/docs/intro">📋 문서</a></li>
            <li><a href="http://localhost:3000/shusworkspace/blog">✍️ 블로그</a></li>
          </ul>
          
          <h4>📂 모든 문서 섹션</h4>
          <ul>
            <li><a href="http://localhost:3000/docs/intro">📋 Public Docs</a></li>
            <li><a href="http://localhost:3000/docs/workspace/intro">💼 Workspace</a></li>
            <li><a href="http://localhost:3000/docs/private/intro">🔒 Private Notes</a></li>
            <li><a href="http://localhost:3000/docs/project-a/intro">🚀 Project A</a></li>
            <li><a href="http://localhost:3000/docs/project-c/intro">🚀 Project C</a></li>
          </ul>
          
          <p><strong>💡 팁:</strong> 상단 네비게이션바의 "문서" 버튼을 클릭해도 intro 페이지로 이동할 수 있습니다!</p>
          <p><small>💡 로컬에서는 모든 페이지에 자유롭게 접근할 수 있습니다.</small></p>
        </div>

        <div style={{ margin: '2rem 0', padding: '1rem', background: '#e3f2fd', borderRadius: '8px' }}>
          <h3>🔗 프로덕션 링크</h3>
          <ul>
            <li><a href="https://shiwookim.github.io/shusworkspace/" target="_blank">GitHub Pages (자동 리다이렉트)</a></li>
            <li><a href="https://shusworkspace-auth.shusworkspace.workers.dev" target="_blank">Workers 직접 접근</a></li>
          </ul>
        </div>

        <div style={{ margin: '2rem 0', padding: '1rem', background: '#fff3e0', borderRadius: '8px' }}>
          <h3>🔐 보호된 페이지 테스트</h3>
          <ul>
            <li><a href="https://shusworkspace-auth.shusworkspace.workers.dev/docs/workspace/" target="_blank">💼 Workspace (workspace456)</a></li>
            <li><a href="https://shusworkspace-auth.shusworkspace.workers.dev/docs/private/" target="_blank">🔒 Private Notes (private123)</a></li>
            <li><a href="https://shusworkspace-auth.shusworkspace.workers.dev/docs/project-a/" target="_blank">🚀 Project A (projectA789)</a></li>
            <li><a href="https://shusworkspace-auth.shusworkspace.workers.dev/docs/project-c/" target="_blank">🚀 Project C (projectC101)</a></li>
          </ul>
        </div>
      </div>
    );
  }

  // 프로덕션 환경에서는 리다이렉트 페이지 표시
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      margin: 0,
      padding: 0,
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white'
    }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{
          border: '4px solid rgba(255,255,255,0.3)',
          borderRadius: '50%',
          borderTop: '4px solid white',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }}></div>
        <h1>🔒 보안 접속 중...</h1>
        <p>보안이 강화된 사이트로 이동하고 있습니다.</p>
        
        <div style={{ marginTop: '2rem', fontSize: '14px', opacity: 0.8 }}>
          <p>자동으로 이동되지 않는다면{' '}
          <a href="https://shusworkspace-auth.shusworkspace.workers.dev" 
             style={{ color: 'white', textDecoration: 'underline' }}>
            여기를 클릭
          </a>하세요.</p>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
