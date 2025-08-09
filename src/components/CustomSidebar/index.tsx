import React from 'react';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';

interface CustomSidebarProps {
  currentSection: 'workspace' | 'private' | 'project-a' | 'project-c';
}

export default function CustomSidebar({ currentSection }: CustomSidebarProps): JSX.Element {
  const location = useLocation();

  return (
    <div className={styles.customSidebar}>
      <div className={styles.sidebarHeader}>
        <h3>📚 문서 목록</h3>
      </div>
      <nav className={styles.sidebarNav}>
        <div className={styles.navSection}>
          <h4>💼 Workspace</h4>
          <ul>
            <li className={currentSection === 'workspace' ? styles.active : ''}>
              <Link to="/docs/workspace/intro">소개</Link>
            </li>
          </ul>
        </div>
        <div className={styles.navSection}>
          <h4>🔒 Private Notes</h4>
          <ul>
            <li className={currentSection === 'private' ? styles.active : ''}>
              <Link to="/docs/private/intro">소개</Link>
            </li>
          </ul>
        </div>
        <div className={styles.navSection}>
          <h4>🚀 Projects</h4>
          <ul>
            <li className={currentSection === 'project-a' ? styles.active : ''}>
              <Link to="/docs/project-a/intro">Project A</Link>
            </li>
            <li className={currentSection === 'project-c' ? styles.active : ''}>
              <Link to="/docs/project-c/intro">Project C</Link>
            </li>
          </ul>
        </div>
        <div className={styles.homeLink}>
          <Link to="/docs/intro">📋 Public Docs</Link>
        </div>
      </nav>
    </div>
  );
}
