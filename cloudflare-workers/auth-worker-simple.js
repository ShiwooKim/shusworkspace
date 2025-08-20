// Cloudflare Workers 스크립트 - 단순 프록시 (클라이언트 사이드 인증용)
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// GitHub Pages 원본 URL
const GITHUB_PAGES_URL = 'https://shiwookim.github.io/sws'

async function handleRequest(request) {
  const url = new URL(request.url)
  let pathname = url.pathname

  // 루트 경로 접근 시 /sws/로 리다이렉트
  if (pathname === '/') {
    return Response.redirect(`${url.origin}/sws/`, 302)
  }

  // GitHub Pages에서 콘텐츠 가져오기
  return await fetchFromGitHubPages(pathname)
}

// 단순 프록시 함수
async function fetchFromGitHubPages(pathname) {
  const githubPath = pathname.startsWith('/sws') ? pathname : `/sws${pathname}`
  const githubUrl = `${GITHUB_PAGES_URL.replace('/sws', '')}${githubPath}`
  
  try {
    const response = await fetch(githubUrl, {
      headers: {
        'User-Agent': 'Cloudflare-Workers-Proxy',
        'Cache-Control': 'no-cache'
      }
    })
    
    if (!response.ok) {
      throw new Error(`GitHub Pages responded with ${response.status}`)
    }
    
    const content = await response.text()
    
    return new Response(content, {
      status: response.status,
      headers: {
        ...Object.fromEntries(response.headers.entries()),
        'content-length': content.length.toString()
      }
    })
    
  } catch (error) {
    console.error('[fetchFromGitHubPages] Error:', error.message)
    return new Response(`Failed to fetch from GitHub Pages: ${error.message}`, { status: 500 })
  }
}
