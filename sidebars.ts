import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const WORKER_URL = 'https://shusworkspace-auth.shusworkspace.workers.dev';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro', // Public Docs
    {
      type: 'category',
      label: '💼 Workspace',
      link: {
        type: 'generated-index',
        title: 'Workspace',
        slug: '/category/workspace',
      },
      items: [
        {
          type: 'link',
          label: '소개',
          href: `${WORKER_URL}/docs/workspace/intro`,
        }
      ]
    },
    {
      type: 'category',
      label: '🔒 Private Notes',
      link: {
        type: 'generated-index',
        title: 'Private Notes',
        slug: '/category/private',
      },
      items: [
        {
          type: 'link',
          label: '소개',
          href: `${WORKER_URL}/docs/private/intro`,
        }
      ]
    },
    {
      type: 'category',
      label: '🚀 Project A',
      link: {
        type: 'generated-index',
        title: 'Project A',
        slug: '/category/project-a',
      },
      items: [
        {
          type: 'link',
          label: '소개',
          href: `${WORKER_URL}/docs/project-a/intro`,
        }
      ]
    },
    {
      type: 'category',
      label: '🚀 Project C',
      link: {
        type: 'generated-index',
        title: 'Project C',
        slug: '/category/project-c',
      },
      items: [
        {
          type: 'link',
          label: '소개',
          href: `${WORKER_URL}/docs/project-c/intro`,
        }
      ]
    }
  ],
};

export default sidebars;