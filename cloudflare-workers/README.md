# Cloudflare Workers 전체 도메인 인증 설정

이 폴더에는 Cloudflare Workers를 사용한 전체 도메인 인증 설정이 포함되어 있습니다.

## 인증 방식 변경사항

- **이전**: 문서별 개별 인증 (복잡한 리다이렉트, 하이드레이션 문제)
- **현재**: 클라이언트 사이드 인증 (ELLO 방식과 동일)
  - sessionStorage 기반 (3시간 세션)
  - 브라우저 종료 시 재인증 필요
  - Workers는 단순 프록시 역할

## 설정된 비밀번호

- **전체 사이트**: `shiwookim.po`

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

## Workers 버전별 특징

1. **auth-worker-simple.js**: 단순 프록시 (권장)
   - 클라이언트 사이드 인증과 함께 사용
   - 최소한의 로직으로 안정성 향상

2. **auth-worker.js**: 복합 서버 사이드 인증 (레거시)
   - 복잡한 로직과 하이드레이션 workaround 포함
   - 백업 및 참고용

3. **auth-worker-secure.js**: Basic Auth 방식 (레거시)
   - 브라우저 기본 인증 팝업 사용
   - 백업 및 참고용

## 배포 명령어

```bash
# 권장: 단순 프록시 버전
pnpm run deploy:workers:simple

# 레거시 버전들
pnpm run deploy:workers
pnpm run deploy:workers:secure
```

## 장점

- ✅ 단순한 인증 플로우
- ✅ Docusaurus 네이티브 경험 유지
- ✅ 하이드레이션 문제 해결
- ✅ 브라우저 캐싱 최적화 활용
- ✅ 끊김 없는 네비게이션
