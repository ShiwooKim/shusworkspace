import React from 'react';
import styles from './styles.module.css';
import CustomSidebar from '../CustomSidebar';

interface ProtectedLayoutProps {
  children?: React.ReactNode;
  section: 'workspace' | 'private' | 'project-a' | 'project-c';
}

export default function ProtectedLayout({ children, section }: ProtectedLayoutProps): React.ReactElement {
  return (
    <div className={styles.docWrapper}>
      <CustomSidebar currentSection={section} />
      <div className={styles.mainContent}>
        {children}
      </div>
    </div>
  );
}
