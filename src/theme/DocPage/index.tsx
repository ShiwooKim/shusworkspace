import React from 'react';
import DocPage from '@theme-original/DocPage';
import type {WrapperProps} from '@docusaurus/types';
import { useLocation } from '@docusaurus/router';
import { getDocSection } from '@site/src/utils/docUtils';
import CustomSidebar from '@site/src/components/CustomSidebar';

type Props = WrapperProps<typeof DocPage>;

export default function DocPageWrapper(props: Props): React.ReactElement {
  const location = useLocation();
  const section = getDocSection(location.pathname);

  // 전체 도메인 인증이므로 모든 보호된 문서에 CustomSidebar 표시
  if (section && ['workspace', 'private', 'project-a'].includes(section)) {
    return (
      <div style={{ display: 'flex' }}>
        <CustomSidebar currentSection={section as any} />
        <div style={{ flex: 1 }}>
          <DocPage {...props} />
        </div>
      </div>
    );
  }

  return <DocPage {...props} />;
}
