---
sidebar_position: 1
---

<div class="doc-wrapper">
  <div class="custom-sidebar">
    <div class="sidebar-header">
      <h3>📚 문서 목록</h3>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-section">
        <h4>💼 Workspace</h4>
        <ul>
          <li class="active"><a href="/docs/workspace/intro">소개</a></li>
        </ul>
      </div>
      <div class="nav-section">
        <h4>🔒 Private Notes</h4>
        <ul>
          <li><a href="/docs/private/intro">소개</a></li>
        </ul>
      </div>
      <div class="nav-section">
        <h4>🚀 Projects</h4>
        <ul>
          <li><a href="/docs/project-a/intro">Project A</a></li>
          <li><a href="/docs/project-c/intro">Project C</a></li>
        </ul>
      </div>
      <div class="nav-section home-link">
        <a href="/docs/intro">📋 Public Docs</a>
      </div>
    </nav>
  </div>

  <div class="main-content">
    <h1>Workspace 소개</h1>

    개발과 업무에 관련된 문서들을 정리하는 공간입니다.

    ## 포함 내용

    - 🛠️ **개발 가이드**: 프로젝트 개발 과정에서 얻은 노하우
    - 📊 **업무 프로세스**: 효율적인 업무 진행을 위한 방법론
    - 🔧 **도구 활용법**: 개발/업무 도구 사용법과 팁
    - 📝 **학습 노트**: 새로 배운 기술과 개념 정리

    ## 최근 업데이트

    - 새로운 워크스페이스 구성 완료
    - 다중 문서 인스턴스 적용

    ---

    > 이 공간의 문서들은 공개 가능한 내용들로 구성되어 있습니다.
  </div>
</div>

<style>
.doc-wrapper {
  display: flex;
  gap: 2rem;
  margin: -2rem;  /* Docusaurus 기본 여백 상쇄 */
  min-height: calc(100vh - 60px);  /* 헤더 높이 제외 */
}

.custom-sidebar {
  width: 300px;
  background: #f8f9fa;
  padding: 1.5rem;
  border-right: 1px solid #e9ecef;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.sidebar-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e9ecef;
}

.sidebar-header h3 {
  margin: 0;
  color: #495057;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.nav-section h4 {
  margin: 0 0 0.5rem 0;
  color: #495057;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-section li {
  margin: 0.3rem 0;
}

.nav-section li a {
  display: block;
  padding: 0.5rem 1rem;
  color: #495057;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s;
}

.nav-section li a:hover {
  background: #e9ecef;
  color: #228be6;
}

.nav-section li.active a {
  background: #e7f5ff;
  color: #228be6;
  font-weight: 600;
}

.home-link {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.home-link a {
  display: block;
  padding: 0.8rem 1rem;
  color: #495057;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s;
  text-align: center;
  background: #e9ecef;
}

.home-link a:hover {
  background: #dee2e6;
  color: #228be6;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 900px;
}

/* 다크 모드 지원 */
[data-theme='dark'] .custom-sidebar {
  background: #1b1b1d;
  border-right-color: #2d2d2d;
}

[data-theme='dark'] .sidebar-header {
  border-bottom-color: #2d2d2d;
}

[data-theme='dark'] .sidebar-header h3,
[data-theme='dark'] .nav-section h4,
[data-theme='dark'] .nav-section li a {
  color: #e9ecef;
}

[data-theme='dark'] .nav-section li a:hover {
  background: #2d2d2d;
  color: #74c0fc;
}

[data-theme='dark'] .nav-section li.active a {
  background: #1c7ed6;
  color: white;
}

[data-theme='dark'] .home-link {
  border-top-color: #2d2d2d;
}

[data-theme='dark'] .home-link a {
  background: #2d2d2d;
  color: #e9ecef;
}

[data-theme='dark'] .home-link a:hover {
  background: #343a40;
  color: #74c0fc;
}
</style>