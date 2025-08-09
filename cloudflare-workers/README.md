# Cloudflare Workers 접근 제어 설정

이 폴더에는 Cloudflare Workers를 사용한 접근 제어 설정이 포함되어 있습니다.

## 설정된 비밀번호

- **Private Notes**: `private123`
- **Workspace**: `workspace456`  
- **Project A**: `projectA789`
- **Project C**: `projectC101`

> ⚠️ **보안 주의**: 실제 사용 시에는 반드시 강력한 비밀번호로 변경하세요!

## 배포 방법

### 1. Wrangler CLI 설치
```bash
npm install -g wrangler
```

### 2. Cloudflare 계정 로그인
```bash
wrangler login
```

### 3. Workers 배포
```bash
cd cloudflare-workers
wrangler deploy
```

### 4. 도메인 연결
1. Cloudflare 대시보드에서 도메인 추가
2. GitHub Pages 도메인을 Cloudflare를 통해 프록시
3. Workers Routes에서 경로 설정

## 사용자 경험

보호된 경로 접근 시:
1. 브라우저에서 로그인 팝업이 표시됩니다
2. **사용자명**: 아무거나 입력 (예: admin)
3. **비밀번호**: 해당 섹션의 설정된 비밀번호

## 비밀번호 변경

`auth-worker.js` 파일의 `PASSWORDS` 객체에서 비밀번호를 수정하고 재배포하면 됩니다.
