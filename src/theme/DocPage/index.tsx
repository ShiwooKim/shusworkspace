import React from 'react';
import DocPage from '@theme-original/DocPage';
// Docusaurus theme type import can break in TS; avoid direct type import and infer WrapperProps via typeof DocPage
import type {WrapperProps} from '@docusaurus/types';
import { useLocation } from '@docusaurus/router';
import { isProtectedDoc, getDocSection } from '@site/src/utils/docUtils';
import ProtectedLayout from '@site/src/components/ProtectedLayout';

type Props = WrapperProps<typeof DocPage>;

export default function DocPageWrapper(props: Props): React.ReactElement {
  const location = useLocation();
  const isProtected = isProtectedDoc(location.pathname);
  const section = getDocSection(location.pathname);

  if (isProtected && section) {
    return (
      <ProtectedLayout section={section}>
        <DocPage {...props} />
      </ProtectedLayout>
    );
  }

  return <DocPage {...props} />;
}
