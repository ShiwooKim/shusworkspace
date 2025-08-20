import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro', // Public Docs
    {
      type: 'category',
      label: '💼 Workspace',
      items: ['workspace/intro'],
    },
    {
      type: 'category', 
      label: '🔒 Private Notes',
      items: ['private/intro'],
    },
    {
      type: 'category',
      label: '🚀 PJT. AltCast', 
      items: ['project-a/intro', 'project-a/allcasting'],
    },
  ],
};

export default sidebars;