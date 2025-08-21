export type DocSection = 'workspace' | 'private' | 'project-a';

export function getDocSection(pathname: string): DocSection | null {
  if (pathname.includes('/docs/workspace/')) return 'workspace';
  if (pathname.includes('/docs/private/')) return 'private';
  if (pathname.includes('/docs/project-a/')) return 'project-a';
  return null;
}
