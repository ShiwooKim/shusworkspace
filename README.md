# Shu's Workspace

개발자를 위한 문서 공간 - Docusaurus 기반의 모던한 문서 사이트

## ✨ 특징

- **🚀 빠른 속도**: 최적화된 정적 사이트 생성
- **📱 반응형 디자인**: 모든 기기에서 완벽한 표시
- **🎨 깔끔한 디자인**: 모던하고 직관적인 UI
- **🔍 강력한 검색**: 내장된 검색 기능
- **📝 마크다운 지원**: MDX로 풍부한 콘텐츠 작성
- **🌙 다크 모드**: 개발자 친화적인 테마

## 🛠️ 기술 스택

- **Docusaurus 3.8**: 현대적인 문서 사이트 생성기
- **TypeScript**: 타입 안전성과 개발 경험 향상
- **React**: 컴포넌트 기반 UI
- **pnpm**: 빠르고 효율적인 패키지 매니저
- **GitHub Actions**: 자동화된 CI/CD
- **GitHub Pages**: 무료 정적 사이트 호스팅

## 🚀 빠른 시작

### 필수 요구사항

- Node.js 18.0 이상
- pnpm (권장) 또는 npm/yarn

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/shiwookim/sws.git
cd sws

# 의존성 설치
pnpm install

# 개발 서버 시작
pnpm start
```

개발 서버가 시작되면 `http://localhost:3000/sws/`에서 사이트를 확인할 수 있습니다.

## 📋 스크립트

```bash
# 개발 서버 시작
pnpm start

# 프로덕션 빌드
pnpm build

# 빌드된 사이트 로컬 서빙
pnpm serve

# 타입 체크
pnpm typecheck
```

## 🏗️ 프로젝트 구조

```
sws/
├── docs/                 # 문서 콘텐츠
├── blog/                 # 블로그 포스트
├── src/
│   ├── components/       # React 컴포넌트
│   ├── css/             # 커스텀 스타일
│   └── pages/           # 커스텀 페이지
├── static/              # 정적 파일
├── docusaurus.config.ts # Docusaurus 설정
└── sidebars.ts          # 사이드바 구성
```

## 🚀 배포

이 사이트는 GitHub Actions를 통해 자동으로 배포됩니다:

1. `main` 브랜치에 푸시
2. GitHub Actions가 자동으로 빌드 실행
3. GitHub Pages에 배포 완료

라이브 사이트: [https://shiwookim.github.io/sws/](https://shiwookim.github.io/sws/)

## 📝 콘텐츠 작성

### 문서 추가

`docs/` 폴더에 마크다운 파일을 추가하면 자동으로 사이드바에 나타납니다.

### 블로그 포스트 작성

`blog/` 폴더에 날짜 형식의 파일명으로 포스트를 작성할 수 있습니다.

## 🎨 커스터마이징

- `docusaurus.config.ts`: 사이트 전체 설정
- `src/css/custom.css`: 커스텀 스타일
- `sidebars.ts`: 문서 네비게이션 구조

## 📚 더 알아보기

- [Docusaurus 공식 문서](https://docusaurus.io/)
- [MDX 문법 가이드](https://mdxjs.com/)
- [React 컴포넌트 개발](https://reactjs.org/)

---

Built with ❤️ by Shu | Powered by [Docusaurus](https://docusaurus.io/)
