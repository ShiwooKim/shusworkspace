// Cloudflare Workers 스크립트 - GitHub Pages 프록시 + 접근 제어
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// GitHub Pages 원본 URL
const GITHUB_PAGES_URL = 'https://shiwookim.github.io/shusworkspace'

// 각 섹션별 비밀번호 설정
const PASSWORDS = {
  '/docs/private/': 'private123',      // Private Notes 비밀번호
  '/docs/workspace/': 'workspace456',  // Workspace 비밀번호 
  '/docs/project-a/': 'projectA789',   // Project A 비밀번호
  '/docs/project-c/': 'projectC101'    // Project C 비밀번호
}

async function handleRequest(request) {
  const url = new URL(request.url)
  const pathname = url.pathname
  
  // 루트 경로 접근 시 /shusworkspace/로 리다이렉트
  if (pathname === '/') {
    return Response.redirect(`${url.origin}/shusworkspace/`, 302)
  }
  
  // 로그아웃 경로 - 강제로 재인증 요구
  if (pathname === '/logout' || pathname === '/logout/') {
    return new Response('로그아웃되었습니다. 브라우저를 새로고침하세요.', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Logged Out"',
        'Content-Type': 'text/html; charset=utf-8'
      }
    })
  }
  
  // 보호가 필요한 경로인지 확인
  const protectedPath = Object.keys(PASSWORDS).find(path => 
    pathname.startsWith(path)
  )
  
  // 보호되지 않은 경로는 GitHub Pages에서 가져와서 반환
  if (!protectedPath) {
    return await fetchFromGitHubPages(pathname)
  }
  
  // Basic Auth 헤더 확인
  const authHeader = request.headers.get('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return new Response(getLoginPage(protectedPath), {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Protected Area"',
        'Content-Type': 'text/html; charset=utf-8'
      }
    })
  }
  
  // 인증 정보 파싱
  const credentials = atob(authHeader.slice(6))
  const [username, password] = credentials.split(':')
  
  // 비밀번호 확인 (사용자명은 무시하고 비밀번호만 확인)
  const requiredPassword = PASSWORDS[protectedPath]
  
  if (password !== requiredPassword) {
    return new Response(getLoginPage(protectedPath, true), {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Protected Area"',
        'Content-Type': 'text/html; charset=utf-8'
      }
    })
  }
  
  // 인증 성공 시 GitHub Pages에서 컨텐츠 가져와서 반환
  return await fetchFromGitHubPages(pathname)
}

// GitHub Pages에서 컨텐츠를 가져오는 함수
async function fetchFromGitHubPages(pathname) {
  // 루트 경로 요청을 GitHub Pages baseURL로 리다이렉트
  let githubPath = pathname
  
  // 루트 경로나 빈 경로는 /shusworkspace/로 매핑
  if (pathname === '/' || pathname === '') {
    githubPath = '/shusworkspace/'
  } else if (!pathname.startsWith('/shusworkspace/')) {
    // 다른 경로들도 /shusworkspace/ 접두사 추가
    githubPath = `/shusworkspace${pathname}`
  }
  
  const githubUrl = `https://shiwookim.github.io${githubPath}`
  
  try {
    // 무한 리다이렉트 방지를 위한 특별한 User-Agent 헤더 추가
    const response = await fetch(githubUrl, {
      headers: {
        'User-Agent': 'Cloudflare-Workers-Internal-Request',
        'X-Forwarded-For': '127.0.0.1', // 내부 요청임을 표시
      }
    })
    
    if (!response.ok) {
      return new Response(`Content not found: ${githubUrl}`, { status: 404 })
    }
    
    // 응답 내용을 가져와서 URL을 수정
    let content = await response.text()
    const contentType = response.headers.get('content-type') || ''
    
    // HTML 내용인 경우 상대 경로를 수정
    if (contentType.includes('text/html')) {
      // baseURL 관련 에러 메시지가 있으면 제거하거나 수정
      content = content.replace(/baseUrl = \/shusworkspace\//g, 'baseUrl = /')
      content = content.replace(/href="\/shusworkspace\//g, 'href="/')
      content = content.replace(/src="\/shusworkspace\//g, 'src="/')
      content = content.replace(/action="\/shusworkspace\//g, 'action="/')
      
      // 무한 리다이렉트를 방지하기 위해 리다이렉트 스크립트 제거
      content = content.replace(/window\.location\.replace\(['"`]https:\/\/shusworkspace-auth\.shusworkspace\.workers\.dev['"`]\);?/g, '// Redirect disabled for Workers request')
      content = content.replace(/<meta http-equiv="refresh"[^>]*>/gi, '<!-- Meta refresh disabled for Workers request -->')
    }
    
    // 새로운 응답 생성
    const newResponse = new Response(content, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers.entries()),
        'content-length': content.length.toString()
      }
    })
    
    return newResponse
  } catch (error) {
    return new Response(`Error fetching content from ${githubUrl}: ${error.message}`, { status: 500 })
  }
}

// 사용자 친화적인 로그인 페이지 HTML
function getLoginPage(path, isError = false) {
  const sectionName = getSectionName(path)
  const errorMessage = isError ? '<p style="color: red;">❌ 비밀번호가 올바르지 않습니다.</p>' : ''
  
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔒 ${sectionName} - 접근 제한</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 400px;
            width: 90%;
        }
        h1 { color: #333; margin-bottom: 1rem; }
        p { color: #666; margin-bottom: 1.5rem; }
        .refresh-btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            transition: background 0.3s;
        }
        .refresh-btn:hover { background: #5a6fd8; }
        .back-btn {
            background: #6c757d;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-top: 1rem;
            text-decoration: none;
            display: inline-block;
        }
        .back-btn:hover { background: #5a6268; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔒 ${sectionName}</h1>
        <p>이 섹션은 비밀번호로 보호되어 있습니다.</p>
        ${errorMessage}
        <button class="refresh-btn" onclick="window.location.reload()">
            🔑 비밀번호 입력하기
        </button>
        <br>
        <a href="${GITHUB_PAGES_URL}" class="back-btn">🏠 홈으로 돌아가기</a>
    </div>
</body>
</html>`
}

function getSectionName(path) {
  const names = {
    '/docs/private/': 'Private Notes',
    '/docs/workspace/': 'Workspace',
    '/docs/project-a/': 'Project A',
    '/docs/project-c/': 'Project C'
  }
  return names[path] || 'Protected Area'
}
