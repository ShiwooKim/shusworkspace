export type ProtectedSection = 'workspace' | 'private' | 'project-a' | 'project-c';

export function getDocSection(pathname: string): ProtectedSection | null {
  if (pathname.includes('/docs/workspace/')) return 'workspace';
  if (pathname.includes('/docs/private/')) return 'private';
  if (pathname.includes('/docs/project-a/')) return 'project-a';
  if (pathname.includes('/docs/project-c/')) return 'project-c';
  return null;
}

export function isProtectedDoc(pathname: string): boolean {
  return getDocSection(pathname) !== null;
}
