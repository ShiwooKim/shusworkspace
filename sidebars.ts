import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const WORKER_URL = 'https://shusworkspace-auth.shusworkspace.workers.dev';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro', // Public Docs
  {
      type: 'link',
      label: '💼 Workspace',
      href: `${WORKER_URL}/docs/workspace/`,
    },
    {
      type: 'link',
      label: '🔒 Private Notes',
      href: `${WORKER_URL}/docs/private/`,
    },
    {
      type: 'link',
      label: '🚀 PJT. AltCast',
      href: `${WORKER_URL}/docs/project-a/`,
    },
    {
      type: 'link',
      label: '🚀 PJT. Project C',
      href: `${WORKER_URL}/docs/project-c/`,
    }
  ],
};

export default sidebars;