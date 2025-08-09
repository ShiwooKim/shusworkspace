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
  
  // 로그아웃 경로 - 모든 인증 쿠키 삭제
  if (pathname === '/logout' || pathname === '/logout/') {
    const logoutResponse = new Response(`
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>로그아웃 완료</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            margin: 0; padding: 0; min-height: 100vh;
            display: flex; align-items: center; justify-content: center;
        }
        .container {
            background: white; padding: 2rem; border-radius: 10px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1); text-align: center;
            max-width: 400px; width: 90%;
        }
        h1 { color: #333; margin-bottom: 1rem; }
        .btn { background: #28a745; color: white; border: none; padding: 12px 24px;
               border-radius: 6px; cursor: pointer; font-size: 16px; text-decoration: none;
               display: inline-block; transition: background 0.3s; }
        .btn:hover { background: #218838; }
    </style>
</head>
<body>
    <div class="container">
        <h1>✅ 로그아웃 완료</h1>
        <p>모든 세션이 종료되었습니다.</p>
        <a href="${GITHUB_PAGES_URL}" class="btn">🏠 홈으로 돌아가기</a>
    </div>
</body>
</html>`, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Set-Cookie': [
          'auth__docs_private_=; Path=/docs/private/; Max-Age=0',
          'auth__docs_workspace_=; Path=/docs/workspace/; Max-Age=0', 
          'auth__docs_project-a_=; Path=/docs/project-a/; Max-Age=0',
          'auth__docs_project-c_=; Path=/docs/project-c/; Max-Age=0'
        ].join(', ')
      }
    })
    return logoutResponse
  }
  
  // 보호가 필요한 경로인지 확인
  const protectedPath = Object.keys(PASSWORDS).find(path => 
    pathname.startsWith(path)
  )
  
  // 보호되지 않은 경로는 GitHub Pages에서 가져와서 반환
  if (!protectedPath) {
    return await fetchFromGitHubPages(pathname)
  }
  
  // POST 요청인 경우 로그인 폼에서 제출된 데이터 처리
  if (request.method === 'POST') {
    const formData = await request.formData()
    const password = formData.get('password')
    const requiredPassword = PASSWORDS[protectedPath]
    
    if (password === requiredPassword) {
      // 인증 성공 시 쿠키 설정하고 페이지 제공
      const response = await fetchFromGitHubPages(pathname)
      response.headers.set('Set-Cookie', `auth_${protectedPath.replace(/\//g, '_')}=${password}; Path=${protectedPath}; HttpOnly; SameSite=Strict; Max-Age=3600`)
      return response
    } else {
      // 비밀번호 틀림
      return new Response(getLoginPage(protectedPath, true), {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8'
        }
      })
    }
  }
  
  // 쿠키 확인
  const cookies = request.headers.get('Cookie') || ''
  const authCookie = `auth_${protectedPath.replace(/\//g, '_')}=${PASSWORDS[protectedPath]}`
  
  if (cookies.includes(authCookie)) {
    // 이미 인증됨
    return await fetchFromGitHubPages(pathname)
  }
  
  // 인증되지 않음 - 로그인 폼 표시
  return new Response(getLoginPage(protectedPath), {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  })
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
  
  // URL에 Workers 내부 요청 표시 파라미터 추가
  const urlParams = new URLSearchParams()
  urlParams.set('workers-internal', 'true')
  const githubUrl = `https://shiwookim.github.io${githubPath}?${urlParams.toString()}`
  
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

// 커스텀 로그인 폼 페이지 HTML
function getLoginPage(path, isError = false) {
  const sectionName = getSectionName(path)
  const errorMessage = isError ? '<div class="error-message">❌ 비밀번호가 올바르지 않습니다. 다시 시도해주세요.</div>' : ''
  
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔒 ${sectionName} - 접근 제한</title>
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
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
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
            font-size: 1.5rem;
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
            margin-bottom: 1rem;
        }
        .login-btn:hover { 
            background: #5a6fd8; 
        }
        .login-btn:active {
            transform: translateY(1px);
        }
        .back-btn {
            background: #6c757d;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            text-decoration: none;
            display: inline-block;
            transition: background 0.3s;
        }
        .back-btn:hover { 
            background: #5a6268; 
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
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="icon">🔒</div>
        <h1>${sectionName}</h1>
        <p class="subtitle">이 섹션은 비밀번호로 보호되어 있습니다</p>
        
        ${errorMessage}
        
        <form method="POST">
            <div class="form-group">
                <label for="password">비밀번호</label>
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    placeholder="비밀번호를 입력하세요"
                    required
                    autofocus
                >
            </div>
            
            <button type="submit" class="login-btn">
                🔑 로그인
            </button>
        </form>
        
        <a href="${GITHUB_PAGES_URL}" class="back-btn">🏠 홈으로 돌아가기</a>
        
        <div class="info">
            비밀번호는 해당 프로젝트 팀 멤버에게 문의하세요
        </div>
    </div>

    <script>
        // 엔터키로 로그인
        document.getElementById('password').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.target.closest('form').submit();
            }
        });
        
        // 자동 포커스
        window.onload = function() {
            document.getElementById('password').focus();
        };
    </script>
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
