// Cloudflare Workers 스크립트 - 전체 도메인 인증 방식 (보안 강화)
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const pathname = url.pathname
  
  // 루트 경로 접근 시 리다이렉트
  if (pathname === '/') {
    return Response.redirect(`${url.origin}/sws/`, 302)
  }
  
  // 로그아웃 경로
  if (pathname === '/logout' || pathname === '/sws/logout') {
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${url.origin}/sws/`,
        'Set-Cookie': 'site_auth=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'
      }
    })
  }

  // Basic Auth 헤더 확인
  const authHeader = request.headers.get('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return new Response(getLoginPage(), {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Shu\'s Workspace"',
        'Content-Type': 'text/html; charset=utf-8'
      }
    })
  }
  
  // 인증 정보 파싱
  const credentials = atob(authHeader.slice(6))
  const [username, password] = credentials.split(':')
  
  // 환경변수에서 비밀번호 가져오기
  const requiredPassword = globalThis.SITE_PASSWORD || 'shiwookim.po'
  
  if (password !== requiredPassword) {
    return new Response(getLoginPage(true), {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Shu\'s Workspace"',
        'Content-Type': 'text/html; charset=utf-8'
      }
    })
  }
  
  // 인증 성공 시 원본 요청 전달
  return fetch(request)
}

// Basic Auth 로그인 페이지 HTML
function getLoginPage(isError = false) {
  const errorMessage = isError ? '<div class="error-message">❌ 인증에 실패했습니다. 올바른 인증 정보를 입력해주세요.</div>' : ''
  
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔒 Shu's Workspace - 인증 필요</title>
    <meta name="robots" content="noindex, nofollow">
    <style>
        * {
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .auth-container {
            background: white;
            padding: 2.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            text-align: center;
            max-width: 400px;
            width: 100%;
        }
        .icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        h1 { 
            color: #333; 
            margin-bottom: 0.5rem;
            font-size: 1.8rem;
        }
        .subtitle {
            color: #666; 
            margin-bottom: 2rem;
            font-size: 0.95rem;
        }
        .error-message {
            background: #fee;
            color: #c33;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 1.5rem;
            border: 1px solid #fcc;
        }
        .info {
            font-size: 0.85rem;
            color: #666;
            margin-top: 1rem;
            line-height: 1.4;
        }
        .retry-btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            margin-top: 1rem;
        }
        .retry-btn:hover {
            background: #5a6fd8;
        }
    </style>
</head>
<body>
    <div class="auth-container">
        <div class="icon">🔐</div>
        <h1>Shu's Workspace</h1>
        <p class="subtitle">브라우저 인증이 필요합니다</p>
        
        ${errorMessage}
        
        <div class="info">
            💡 브라우저에서 인증 팝업이 표시됩니다.<br>
            사용자명은 아무거나 입력하고, 비밀번호를 입력해주세요.
        </div>
        
        <button class="retry-btn" onclick="location.reload()">
            다시 시도
        </button>
    </div>
</body>
</html>`
}

// 섹션명 반환 (호환성 유지)
function getSectionName(path) {
  return "Shu's Workspace"
}