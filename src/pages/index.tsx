import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import BrowserOnly from '@docusaurus/BrowserOnly';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            📋 문서 시작하기 - 5분 ⏱️
          </Link>
        </div>
      </div>
    </header>
  );
}

function LocalDevDashboard() {
  return (
    <Layout
      title="로컬 개발 환경"
      description="로컬 개발 대시보드">
      <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
        <h1>🛠️ 로컬 개발 환경</h1>
        <p>현재 로컬 개발 모드입니다. 프로덕션에서는 자동으로 보안 사이트로 리다이렉트됩니다.</p>
        
        <div style={{ margin: '2rem 0', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
          <h3>📋 로컬 테스트</h3>
          <ul>
            <li><a href="/docs/intro">📋 문서 (intro 페이지)</a></li>
            <li><a href="/blog">✍️ 블로그</a></li>
          </ul>
          
          <h4>📂 모든 문서 섹션</h4>
          <ul>
            <li><a href="/docs/intro">📋 Public Docs</a></li>
            <li><a href="/docs/workspace/intro">💼 Workspace</a></li>
            <li><a href="/docs/private/intro">🔒 Private Notes</a></li>
            <li><a href="/docs/project-a/intro">🚀 Project A</a></li>
            <li><a href="/docs/project-c/intro">🚀 Project C</a></li>
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
    </Layout>
  );
}



export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();

  return (
    <BrowserOnly fallback={<div>Loading...</div>}>
      {() => {
        // 로컬호스트 체크
        const isLocalhost = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1' ||
                           window.location.hostname.includes('.local');

        // 로컬호스트면 개발 대시보드
        if (isLocalhost) {
          return <LocalDevDashboard />;
        }

        // 그 외에는 기본 Docusaurus 홈페이지
        return (
          <Layout
            title={`Hello from ${siteConfig.title}`}
            description="Shu's Workspace - 보안이 강화된 문서 관리 시스템">
            <HomepageHeader />
            <main>
              <HomepageFeatures />
            </main>
          </Layout>
        );
      }}
    </BrowserOnly>
  );
}