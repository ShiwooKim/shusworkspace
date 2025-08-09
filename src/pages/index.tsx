import type {ReactNode} from 'react';
import { useEffect } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  
  useEffect(() => {
    // 즉시 Workers 사이트로 리다이렉트
    window.location.replace('https://shusworkspace-auth.shusworkspace.workers.dev');
  }, []);

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
