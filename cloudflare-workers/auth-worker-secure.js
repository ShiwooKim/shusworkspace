// Cloudflare Workers 스크립트 - 환경변수 사용 버전
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const pathname = url.pathname
  
  // 보호가 필요한 경로와 해당 환경변수 매핑
  const protectedPaths = {
    '/docs/private/': 'PRIVATE_PASSWORD',
    '/docs/workspace/': 'WORKSPACE_PASSWORD',
    '/docs/project-a/': 'PROJECT_A_PASSWORD',
    '/docs/project-c/': 'PROJECT_C_PASSWORD'
  }
  
  // 보호가 필요한 경로인지 확인
  const pathEntry = Object.entries(protectedPaths).find(([path]) => 
    pathname.startsWith(path)
  )
  
  // 보호되지 않은 경로는 그대로 통과
  if (!pathEntry) {
    return fetch(request)
  }
  
  const [protectedPath, envVarName] = pathEntry
  
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
  
  // 환경변수에서 비밀번호 가져오기
  const requiredPassword = globalThis[envVarName] || 'default123'
  
  if (password !== requiredPassword) {
    return new Response(getLoginPage(protectedPath, true), {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Protected Area"',
        'Content-Type': 'text/html; charset=utf-8'
      }
    })
  }
  
  // 인증 성공 시 원본 요청 전달
  return fetch(request)
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
