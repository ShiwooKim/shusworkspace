import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const WORKER_URL = 'https://shusworkspace-auth.shusworkspace.workers.dev';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro', // Public Docs
    {
      type: 'link',
      label: '💼 Workspace',
      href: `${WORKER_URL}/shusworkspace/docs/workspace/`,
    },
    {
      type: 'link',
      label: '🔒 Private Notes',
      href: `${WORKER_URL}/shusworkspace/docs/private/`,
    },
    {
      type: 'link',
      label: '🚀 Project A',
      href: `${WORKER_URL}/shusworkspace/docs/project-a/`,
    },
    {
      type: 'link',
      label: '🚀 Project C',
      href: `${WORKER_URL}/shusworkspace/docs/project-c/`,
    }
  ],
};

export default sidebars;