// Cloudflare Workers 스크립트 - GitHub Pages 프록시 + 접근 제어
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
const GITHUB_PAGES_URL = 'https://shiwookim.github.io/shusworkspace'

// 각 섹션별 비밀번호 설정
const PASSWORDS = {
  '/docs/private': 'private123',           // Private Notes 전체
  '/docs/workspace': 'workspace456',       // Workspace 전체
  '/docs/project-a': 'projectA789',        // Project A 전체
  '/docs/project-c': 'projectC101',        // Project C 전체
  '/docs/category/-private': 'private123',       // Private Notes 카테고리
  '/docs/category/-workspace': 'workspace456',   // Workspace 카테고리
  '/docs/category/-project-a': 'projectA789',    // Project A 카테고리
  '/docs/category/-project-c': 'projectC101',    // Project C 카테고리
  '/shusworkspace/docs/private': 'private123',           // Private Notes 전체 (baseURL 포함)
  '/shusworkspace/docs/workspace': 'workspace456',       // Workspace 전체 (baseURL 포함)
  '/shusworkspace/docs/project-a': 'projectA789',        // Project A 전체 (baseURL 포함)
  '/shusworkspace/docs/project-c': 'projectC101',        // Project C 전체 (baseURL 포함)
  '/shusworkspace/docs/category/-private': 'private123',       // Private Notes 카테고리 (baseURL 포함)
  '/shusworkspace/docs/category/-workspace': 'workspace456',   // Workspace 카테고리 (baseURL 포함)
  '/shusworkspace/docs/category/-project-a': 'projectA789',    // Project A 카테고리 (baseURL 포함)
  '/shusworkspace/docs/category/-project-c': 'projectC101'     // Project C 카테고리 (baseURL 포함)
}

async function handleRequest(request) {
  const url = new URL(request.url)
  let pathname = url.pathname

  // 강력한 1차 타이포 교정: /workspac/e -> 워크스페이스 인트로로 직접 이동 (baseUrl 유무 모두)
  if (/\/(workspac)\/e(\/|$)/.test(pathname)) {
    // 주소창은 잘못되어 있어도, 바로 올바른 컨텐츠를 200으로 반환 + 주소창 보정
    return await fetchFromGitHubPages('/shusworkspace/docs/workspace/intro/', true, 'workspace', '/shusworkspace/docs/workspace/intro/')
  }

  // private 오타: /privat/e -> private/intro
  if (/\/(privat)\/e(\/|$)/.test(pathname)) {
    return await fetchFromGitHubPages('/shusworkspace/docs/private/intro/', true, 'private', '/shusworkspace/docs/private/intro/')
  }

  // project 오타: /project-/a|c -> project-a|c/intro
  const projectSplit = pathname.match(/\/project-\/(a|c)(\/|$)/)
  if (projectSplit) {
    const proj = projectSplit[1] === 'a' ? 'project-a' : 'project-c'
    return await fetchFromGitHubPages(`/shusworkspace/docs/${proj}/intro/`, true, proj, `/shusworkspace/docs/${proj}/intro/`)
  }

  // 0) 잘못 분리된 섹션 경로 교정: /workspac/e, /project-/a, /project-/c 등
  const fixSplitSection = (p) => {
    try {
      const original = p
      const [pathOnly, searchHash] = p.split(/([?#].*)/, 2)
      const parts = pathOnly.replace(/^\/+/, '').split('/')
      const hasBase = parts[0] === 'shusworkspace'
      const idxDocs = hasBase ? 1 : 0
      if (parts[idxDocs] !== 'docs') return original
      const idxSection = idxDocs + 1
      const sec = parts[idxSection] || ''
      const next = parts[idxSection + 1] || ''
      let fixed = null
      if (sec === 'workspac' && next === 'e') fixed = 'workspace'
      if (sec === 'project-' && (next === 'a' || next === 'c')) fixed = `project-${next}`
      if (fixed) {
        parts.splice(idxSection, 2, fixed)
        const repaired = '/' + parts.join('/') + (searchHash || '')
        return repaired
      }
      return original
    } catch {
      return p
    }
  }

  const repaired = fixSplitSection(pathname)
  if (repaired !== pathname) {
    const location = repaired.startsWith('http') ? repaired : `${url.origin}${repaired}`
    return new Response(null, {
      status: 302,
      headers: { Location: location, 'Cache-Control': 'no-store' }
    })
  }
  
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
  
  // 보호가 필요한 경로인지 확인 (관대한 매칭으로 변경)
  console.log(`[DEBUG] Checking pathname: "${pathname}" (length: ${pathname.length})`)
  const protectedPath = Object.keys(PASSWORDS).find(path => {
    // 더 관대한 매칭: 정확한 매치 또는 startsWith
    const isExactMatch = pathname === path
    const isStartsWithMatch = pathname.startsWith(path)
    const isStartsWithSlash = pathname.startsWith(path + '/')
    const isProtected = isExactMatch || isStartsWithMatch || isStartsWithSlash
    
    console.log(`[DEBUG] Testing "${path}" vs "${pathname}":`)
    console.log(`[DEBUG]   - Exact match: ${isExactMatch}`)
    console.log(`[DEBUG]   - Starts with: ${isStartsWithMatch}`) 
    console.log(`[DEBUG]   - Starts with/: ${isStartsWithSlash}`)
    console.log(`[DEBUG]   - Result: ${isProtected}`)
    
    return isProtected
  })
  console.log(`[DEBUG] Protected path found: ${protectedPath}`)
  
  // 보호되지 않은 경로 처리
  if (!protectedPath) {
    // 루트 경로의 경우 GitHub Pages에서 홈페이지 콘텐츠를 가져와서 표시
    if (pathname === '/' || pathname === '' || pathname === '/shusworkspace/' || pathname === '/shusworkspace') {
      return await fetchFromGitHubPages('/shusworkspace/')
    }
    
    // 다른 공개 경로들은 GitHub Pages에서 가져오기
    return await fetchFromGitHubPages(pathname)
  }
  
  // 경로 정규화 유틸
  const normalizePath = (p) => {
    try {
      if (!p || p === '/') return '/'
      // baseUrl 중복 제거
      if (p.startsWith('/shusworkspace/')) {
        p = p.replace(/^\/shusworkspace/, '')
      }
      // 카테고리/-slug 와 섹션 루트는 슬래시로 마무리
      if (/^\/docs\/(workspace|private|project-a|project-c)(\/.*)?$/.test(p)) {
        // /docs/section -> /docs/section/
        p = p.replace(/^\/(docs\/[^/]+)(?!\/)/, '/$1/')
      }
      if (/^\/docs\/category\/-/.test(p)) {
        p = p.replace(/^(\/docs\/category\/-[^/]+)(?!\/)/, '$1/')
      }
      return p
    } catch (_) {
      return p
    }
  }

  // POST 요청인 경우 로그인 폼에서 제출된 데이터 처리
  if (request.method === 'POST') {
    console.log(`[DEBUG] POST request to ${pathname} - processing password`)
    const formData = await request.formData()
    const password = formData.get('password')
    const canonicalPath = normalizePath(protectedPath)
    const requiredPassword = PASSWORDS[canonicalPath] || PASSWORDS[protectedPath]
    
    console.log(`[DEBUG] Password check: provided="${password}", required="${requiredPassword}", match=${password === requiredPassword}`)
    
    if (password === requiredPassword) {
      // 인증 성공 시 쿠키 설정하고 페이지 제공
      // 폴더 경로를 intro 페이지로 매핑 (GitHub Pages는 슬래시 필요)
      const normalizedPathname = normalizePath(pathname)
      let actualPath
      if (normalizedPathname === '/docs/workspace/' ) {
        actualPath = '/shusworkspace/docs/workspace/intro/'
      } else if (normalizedPathname === '/docs/private/' ) {
        actualPath = '/shusworkspace/docs/private/intro/'
      } else if (normalizedPathname === '/docs/project-a/' ) {
        actualPath = '/shusworkspace/docs/project-a/intro/'
      } else if (normalizedPathname === '/docs/project-c/' ) {
        actualPath = '/shusworkspace/docs/project-c/intro/'
      } else {
        actualPath = `/shusworkspace${normalizedPathname}`
      }
      
      console.log(`[DEBUG] Auth success - mapping ${pathname} to ${actualPath}`)
      
      // 쿠키 설정 후 Workers에서 직접 페이지 제공 (커스텀 사이드바 적용)
      const sectionName = getSectionFromPath(normalizePath(protectedPath))
      // 로그인 성공 시에는 JS 하이드레이션 충돌을 피하기 위해 302로 명시 리다이렉트
      return new Response(null, {
        status: 302,
        headers: {
          Location: `${url.origin}${actualPath}`,
          'Set-Cookie': `auth_${normalizePath(protectedPath).replace(/\//g, '_')}=${password}; Path=/shusworkspace${normalizePath(protectedPath)}; HttpOnly; SameSite=Strict; Max-Age=3600`
        }
      })
    } else {
      // 비밀번호 틀림
      return new Response(getLoginPage(normalizePath(protectedPath), true), {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8'
        }
      })
    }
  }
  
  // 쿠키 확인
  const cookies = request.headers.get('Cookie') || ''
  const canonicalPath = normalizePath(protectedPath)
  const authCookie = `auth_${canonicalPath.replace(/\//g, '_')}=${PASSWORDS[canonicalPath] || PASSWORDS[protectedPath]}`
  
  if (cookies.includes(authCookie)) {
    // 이미 인증됨 - 경로 매핑 적용 (GitHub Pages는 슬래시 필요)
    const normalizedPathname = normalizePath(pathname)
    let actualPath
    if (normalizedPathname === '/docs/workspace/' ) {
      actualPath = '/shusworkspace/docs/workspace/intro/'
    } else if (normalizedPathname === '/docs/private/' ) {
      actualPath = '/shusworkspace/docs/private/intro/'
    } else if (normalizedPathname === '/docs/project-a/' ) {
      actualPath = '/shusworkspace/docs/project-a/intro/'
    } else if (normalizedPathname === '/docs/project-c/' ) {
      actualPath = '/shusworkspace/docs/project-c/intro/'
    } else {
      actualPath = `/shusworkspace${normalizedPathname}`
    }

    console.log(`[DEBUG] Authenticated access - mapping ${pathname} -> ${normalizedPathname} -> ${actualPath}`)
    // 이미 정규 경로라면 직접 페치, 아니면 302로 보정
    if (pathname !== actualPath) {
      return Response.redirect(`${url.origin}${actualPath}`, 302)
    }
    const sectionName = getSectionFromPath(canonicalPath)
    return await fetchFromGitHubPages(actualPath, true, sectionName)
  }
  
  // 인증되지 않음 - 로그인 폼 표시
  return new Response(getLoginPage(normalizePath(protectedPath)), {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  })
}

// 정적 홈페이지 HTML 반환 (무한루프 방지용)
function getStaticHomePage() {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shu's Workspace - 보안 접속</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      margin: 0;
      padding: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    .container {
      text-align: center;
      padding: 2rem;
      max-width: 600px;
    }
    .spinner {
      border: 4px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top: 4px solid white;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .links {
      margin-top: 2rem;
      font-size: 14px;
      opacity: 0.9;
    }
    .links a {
      color: white;
      text-decoration: underline;
      margin: 0 10px;
    }
    .nav-links {
      margin-top: 2rem;
      padding: 1rem;
      background: rgba(255,255,255,0.1);
      border-radius: 8px;
    }
    .nav-links a {
      display: inline-block;
      margin: 5px 10px;
      padding: 8px 16px;
      background: rgba(255,255,255,0.2);
      color: white;
      text-decoration: none;
      border-radius: 4px;
      transition: background 0.3s;
    }
    .nav-links a:hover {
      background: rgba(255,255,255,0.3);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="spinner"></div>
    <h1>🔒 Shu's Workspace</h1>
    <p>보안이 강화된 문서 관리 시스템에 오신 것을 환영합니다.</p>
    
    <div class="nav-links">
      <h3>📂 문서 섹션</h3>
      <a href="/docs/intro">📋 Public Docs</a>
      <a href="/docs/workspace/">💼 Workspace</a>
      <a href="/docs/private/">🔒 Private Notes</a>
      <a href="/docs/project-a/">🚀 Project A</a>
      <a href="/docs/project-c/">🚀 Project C</a>
      <br><br>
      <a href="/blog">✍️ Blog</a>
    </div>
    
    <div class="links">
      <p>문제가 있으시면 관리자에게 문의하세요.</p>
      <a href="https://github.com/shiwookim/shusworkspace" target="_blank">GitHub Repository</a>
    </div>
  </div>
</body>
</html>`
}

// GitHub Pages에서 컨텐츠를 가져오는 함수
async function fetchFromGitHubPages(pathname, applyCustomSidebar = false, section = null, overrideLocationTo = null) {
  // 추가 안전장치: 잘못 분리된 섹션 슬러그(workspac/e 등)를 교정
  const normalizeForGithub = (p) => {
    try {
      if (!p) return p
      const pathOnly = p.split('?')[0].split('#')[0]
      const segments = pathOnly.replace(/^\/+/, '').split('/')
      // docs 섹션의 잘못 분리된 세그먼트 합치기 (baseUrl 유무 모두 지원)
      const hasBase = segments[0] === 'shusworkspace'
      const idxDocs = hasBase ? 1 : 0
      if (segments[idxDocs] === 'docs' && segments.length >= idxDocs + 3) {
        const idxSection = idxDocs + 1
        const allowed = new Set(['workspace', 'private', 'project-a', 'project-c', 'category'])
        if (!allowed.has(segments[idxSection]) && segments[idxSection] !== 'category') {
          const merged = `${segments[idxSection]}${segments[idxSection + 1]}`
          if (['workspace', 'private', 'project-a', 'project-c'].includes(merged)) {
            segments.splice(idxSection, 2, merged)
          }
        }
      }
      const normalized = '/' + segments.join('/')
      return normalized + (p.includes('?') ? '?' + p.split('?')[1] : '')
    } catch {
      return p
    }
  }

  pathname = normalizeForGithub(pathname)
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
    
    console.log(`[DEBUG] GitHub Pages response for ${githubUrl}: status=${response.status}, statusText=${response.statusText}`)
    
    if (!response.ok) {
      console.log(`[DEBUG] GitHub Pages response failed: ${response.status} ${response.statusText}`)
      return new Response(`Content not found: ${githubUrl} (Status: ${response.status})`, { status: 404 })
    }
    
    // 응답 내용을 가져와서 URL을 수정
    let content = await response.text()
    const contentType = response.headers.get('content-type') || ''
    
      // HTML 내용인 경우: 리다이렉트 루프만 방지. baseUrl/href/src 치환은 제거하여 하이드레이션 일관성 유지
    if (contentType.includes('text/html')) {
        // 무한 리다이렉트를 방지하기 위해 리다이렉트 스크립트 제거 (더 포괄적인 패턴)
      content = content.replace(/window\.location\.replace\([^)]*shusworkspace-auth\.shusworkspace\.workers\.dev[^)]*\)/g, '// Redirect disabled for Workers request')
      content = content.replace(/window\.location\.href\s*=\s*[^;]*shusworkspace-auth\.shusworkspace\.workers\.dev[^;]*/g, '// Redirect disabled for Workers request')
      content = content.replace(/location\.replace\([^)]*shusworkspace-auth\.shusworkspace\.workers\.dev[^)]*\)/g, '// Redirect disabled for Workers request')
      content = content.replace(/<meta http-equiv="refresh"[^>]*>/gi, '<!-- Meta refresh disabled for Workers request -->')
        
        // React 기반 리다이렉트도 제거
      content = content.replace(/if\s*\(\s*isProduction\s*&&\s*!isWorkerRequest\s*&&\s*!isAlreadyOnWorkers\s*\)\s*\{[^}]*window\.location\.replace[^}]*\}/g, '// Conditional redirect disabled for Workers request')
        
        // 보호된 페이지에서는 기본 Docusaurus 사이드바만 숨김 (커스텀 주입 없음)
        if (applyCustomSidebar && section) {
          content = hideDocusaurusSidebar(content)
        }

        // 주소창 교체가 필요한 경우(오타 경로 등) 초기 로드 전에 경로를 교정
        if (overrideLocationTo) {
          const replaceScript = `\n<script>(function(){try{if(location.pathname!=='${overrideLocationTo}'){history.replaceState(null,'','${overrideLocationTo}')}}catch(e){}})();</script>\n`
          content = content.replace('</head>', `${replaceScript}</head>`)
        }
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

// 인증 성공 후 리다이렉트 페이지 HTML (React Hydration 에러 방지)


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
    <meta name="robots" content="noindex, nofollow">
    <!-- React와 Docusaurus 스크립트 차단 -->
    <script>
        // Docusaurus/React 초기화 방지
        window.__DOCUSAURUS_INSERT_HYDRATION_ERROR__ = true;
        window.React = undefined;
        window.ReactDOM = undefined;
    </script>
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
            /* Docusaurus CSS 오버라이드 */
            line-height: inherit !important;
            color: inherit !important;
        }
        /* Docusaurus 및 React 관련 요소 숨기기 */
        #__docusaurus, [data-reactroot], .navbar, .footer, .theme-doc-sidebar-container {
            display: none !important;
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
        
        <form method="POST" action="${path}">
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
        
        <script>
        // React의 간섭 없이 순수 HTML 폼으로 작동하도록 
        window.addEventListener('load', function() {
            const form = document.querySelector('form');
            const passwordField = document.getElementById('password');
            
            console.log('Form setup complete');
            
            form.addEventListener('submit', function(e) {
                console.log('Form submitted!', e);
                console.log('Action:', this.action);
                console.log('Method:', this.method);
                console.log('Password field value:', passwordField.value);
                
                // React 간섭 방지를 위해 명시적으로 폼 제출
                if (!passwordField.value.trim()) {
                    e.preventDefault();
                    alert('비밀번호를 입력해주세요.');
                    return false;
                }
            });
            
            // 엔터키 이벤트도 다시 등록
            passwordField.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    form.submit();
                }
            });
            
            // 자동 포커스
            passwordField.focus();
        });
        </script>
        
        <a href="${GITHUB_PAGES_URL}" class="back-btn">🏠 홈으로 돌아가기</a>
        
        <div class="info">
            비밀번호는 해당 프로젝트 팀 멤버에게 문의하세요
        </div>
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

function getSectionFromPath(path) {
  const sections = {
    '/docs/private/': 'private',
    '/docs/workspace/': 'workspace',
    '/docs/project-a/': 'project-a',
    '/docs/project-c/': 'project-c'
  }
  return sections[path] || 'workspace'
}

function hideDocusaurusSidebar(htmlContent) {
  // React Hydration 충돌을 피하기 위해 단순히 CSS로 사이드바만 숨김
  const hideCSS = `
  <style>
  /* Docusaurus 기본 사이드바 숨기기 */
  .theme-doc-sidebar-container {
    display: none !important;
  }
  
  /* 메인 콘텐츠를 전체 폭으로 확장 */
  .docMainContainer_m8Cb {
    max-width: none !important;
  }
  
  .container {
    max-width: 1200px !important;
  }
  
  /* 보호된 페이지임을 나타내는 간단한 헤더 추가 */
  .theme-doc-markdown::before {
    content: "🔒 보호된 문서";
    display: block;
    background: #e7f5ff;
    padding: 0.5rem 1rem;
    margin: -1rem -1rem 2rem -1rem;
    border-left: 4px solid #228be6;
    color: #1971c2;
    font-weight: 600;
    font-size: 0.9rem;
  }
  
  [data-theme='dark'] .theme-doc-markdown::before {
    background: #1e3a8a;
    color: #93c5fd;
    border-left-color: #3b82f6;
  }
  </style>`
  
  const finalContent = htmlContent.replace(
    '</head>',
    `${hideCSS}</head>`
  )
  
  return finalContent
}

// 보호된 문서용 커스텀 사이드바 주입
// 주입형 커스텀 사이드바는 사용하지 않음


