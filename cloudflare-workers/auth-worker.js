// Cloudflare Workers 스크립트 - 전체 도메인 인증 방식
addEventListener('fetch', event => {
  event.respondWith(
    (async () => {
      try {
        return await handleRequest(event.request)
      } catch (err) {
        return new Response(`Worker error: ${err && err.message ? err.message : String(err)}`, { status: 500 })
      }
    })()
  )
})

// GitHub Pages 원본 URL
const GITHUB_PAGES_URL = 'https://shiwookim.github.io/sws'

// 전체 사이트 비밀번호 (Cloudflare Secret로 오버라이드 가능)
const SITE_PASSWORD = 'shiwookim.po'

// Cloudflare Secrets로 설정된 비밀번호가 있으면 우선 사용
function getSitePassword() {
  try {
    return globalThis.SITE_PASSWORD || SITE_PASSWORD
  } catch (_) {
    return SITE_PASSWORD
  }
}

async function handleRequest(request) {
  const url = new URL(request.url)
  let pathname = url.pathname

  // 루트 경로 접근 시 /sws/로 리다이렉트
  if (pathname === '/') {
    return Response.redirect(`${url.origin}/sws/`, 302)
  }
  
  // 로그아웃 경로 - 인증 쿠키 삭제
  if (pathname === '/logout' || pathname === '/sws/logout') {
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${url.origin}/sws/`,
        'Set-Cookie': 'site_auth=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'
      }
    })
  }

  // 비밀번호 제출 처리
  if (request.method === 'POST' && (pathname === '/auth' || pathname === '/sws/auth')) {
    const formData = await request.formData()
    const password = formData.get('password')
    const requiredPassword = getSitePassword()
    
    console.log(`[DEBUG] Password check: provided="${password}", required="${requiredPassword}", match=${password === requiredPassword}`)
    
    if (password === requiredPassword) {
      // 인증 성공 시 전역 쿠키 설정하고 홈으로 리다이렉트
      return new Response(null, {
        status: 302,
        headers: {
          Location: `${url.origin}/sws/`,
          'Set-Cookie': `site_auth=${password}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400` // 24시간
        }
      })
    } else {
      // 비밀번호 틀림
      return new Response(getLoginPage(true), {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8'
        }
      })
    }
  }
  
  // 인증 확인
  const cookies = request.headers.get('Cookie') || ''
  const requiredPassword = getSitePassword()
  const authCookie = `site_auth=${requiredPassword}`
  
  if (cookies.includes(authCookie)) {
    // 이미 인증됨 - GitHub Pages에서 콘텐츠 가져오기
    return await fetchFromGitHubPages(pathname)
  }
  
  // 인증되지 않음 - 로그인 폼 표시
  return new Response(getLoginPage(), {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  })
}

// GitHub Pages에서 컨텐츠를 가져오는 함수 (단순화)
async function fetchFromGitHubPages(pathname) {
  // 경로 정규화
  const githubPath = pathname.startsWith('/sws') ? pathname : `/sws${pathname}`
  
  // URL에 cache-busting 파라미터 추가
  const urlParams = new URLSearchParams()
  urlParams.set('workers-internal', 'true')
  urlParams.set('ts', String(Date.now()))
  const githubUrl = `${GITHUB_PAGES_URL.replace('/sws', '')}${githubPath}?${urlParams.toString()}`
  
  try {
    const response = await fetch(githubUrl, {
      headers: {
        'User-Agent': 'Cloudflare-Workers-Internal-Request',
        'X-Forwarded-For': '127.0.0.1',
        'Cache-Control': 'no-cache'
      }
    })
    
    if (!response.ok) {
      throw new Error(`GitHub Pages responded with ${response.status}`)
    }
    
    let content = await response.text()
    const contentType = response.headers.get('content-type') || ''
    
    // HTML 내용인 경우: 무한 리다이렉트만 방지
    if (contentType.includes('text/html')) {
      // Workers 리다이렉트 제거 (Root.tsx에서 발생하는 리다이렉트 비활성화)
      content = content.replace(/window\.location\.replace\([^)]*workers\.dev[^)]*\)/g, '// Redirect disabled for Workers request')
      content = content.replace(/window\.location\.href\s*=\s*[^;]*workers\.dev[^;]*/g, '// Redirect disabled for Workers request')
      content = content.replace(/location\.replace\([^)]*workers\.dev[^)]*\)/g, '// Redirect disabled for Workers request')
    }

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

// 로그인 페이지 HTML
function getLoginPage(isError = false) {
  const errorMessage = isError ? '<div class="error-message">❌ 비밀번호가 올바르지 않습니다. 다시 시도해주세요.</div>' : ''
  
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
        .login-container {
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
        .form-group {
            margin-bottom: 1.5rem;
            text-align: left;
        }
        label {
            display: block;
            margin-bottom: 0.5rem;
            color: #333;
            font-weight: 500;
        }
        input[type="password"] {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s;
            outline: none;
        }
        input[type="password"]:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .login-btn {
            width: 100%;
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            transition: background 0.3s;
        }
        .login-btn:hover { 
            background: #5a6fd8; 
        }
        .login-btn:active {
            transform: translateY(1px);
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
    </style>
</head>
<body>
    <div class="login-container">
        <div class="icon">🔐</div>
        <h1>Shu's Workspace</h1>
        <p class="subtitle">이 사이트에 접근하려면 인증이 필요합니다</p>
        
        ${errorMessage}
        
        <form method="POST" action="/auth">
            <div class="form-group">
                <label for="password">비밀번호</label>
                <input type="password" id="password" name="password" required autofocus>
            </div>
            
            <button type="submit" class="login-btn">
                접속하기
            </button>
        </form>
        
        <div class="info">
            💡 인증 후 사이트의 모든 문서에 자유롭게 접근할 수 있습니다.
        </div>
    </div>
    
    <script>
        // 엔터키로 로그인 처리
        document.getElementById('password').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.target.closest('form').submit();
            }
        });
    </script>
</body>
</html>`
}