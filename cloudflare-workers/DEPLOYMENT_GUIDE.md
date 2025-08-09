# 📋 Cloudflare Workers 배포 가이드

GitHub Pages + Cloudflare Workers를 사용한 접근 제어 설정 방법입니다.

## 🚀 1단계: Cloudflare 계정 준비

1. [Cloudflare](https://cloudflare.com)에서 무료 계정 생성
2. 도메인이 있다면 Cloudflare로 DNS 이전 (선택사항)

## 🛠️ 2단계: Wrangler CLI 설치

```bash
# Wrangler CLI 전역 설치
npm install -g wrangler

# Cloudflare 계정 로그인
wrangler login
```

## 📁 3단계: Workers 배포

```bash
# 프로젝트 루트에서
cd cloudflare-workers

# Workers 배포 (간단한 버전)
wrangler deploy auth-worker.js

# 또는 보안 강화 버전 배포
wrangler deploy auth-worker-secure.js
```

## 🔐 4단계: 환경변수 설정 (보안 강화 버전 사용 시)

```bash
# 각 섹션별 비밀번호 설정
wrangler secret put PRIVATE_PASSWORD
wrangler secret put WORKSPACE_PASSWORD  
wrangler secret put PROJECT_A_PASSWORD
wrangler secret put PROJECT_C_PASSWORD
```

## 🌐 5단계: 도메인 연결

### 옵션 A: GitHub Pages 도메인 사용
```
1. Workers 대시보드에서 Routes 설정
2. Pattern: shiwookim.github.io/shusworkspace/*
3. Worker: 배포한 Workers 선택
```

### 옵션 B: 커스텀 도메인 사용
```
1. Cloudflare에 도메인 추가
2. DNS 설정에서 GitHub Pages IP 연결
3. Workers Routes에서 yoursite.com/* 패턴 설정
```

## 🧪 6단계: 테스트

1. **공개 페이지**: `https://yoursite.com/docs/intro` (접근 가능)
2. **보호된 페이지**: `https://yoursite.com/docs/private/` (로그인 필요)

### 테스트 계정 정보
- **사용자명**: 아무거나 (예: admin)
- **비밀번호**: 각 섹션별 설정된 비밀번호

## 🔧 설정 변경

### 비밀번호 변경
```bash
# 환경변수 업데이트
wrangler secret put PRIVATE_PASSWORD
# 새 비밀번호 입력

# Workers 재배포
wrangler deploy
```

### 새 보호 경로 추가
1. `auth-worker.js`에서 `PASSWORDS` 객체에 경로 추가
2. 재배포: `wrangler deploy`

## 📊 모니터링

- Cloudflare 대시보드에서 요청 로그 확인
- Workers 분석에서 인증 성공/실패 통계 확인

## 🆘 문제 해결

### 인증이 작동하지 않는 경우
1. Workers Routes 설정 확인
2. 배포된 Workers 코드 확인
3. 브라우저 캐시 삭제 후 재시도

### 환경변수가 인식되지 않는 경우
1. `wrangler secret list`로 환경변수 확인
2. Workers 재배포
3. 몇 분 후 다시 시도 (전파 시간 필요)

---

> 💡 **팁**: 무료 Cloudflare 계정은 하루 100,000개 요청까지 지원하므로 소규모 프로젝트에 충분합니다!
