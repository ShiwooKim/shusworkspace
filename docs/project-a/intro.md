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
          <li><a href="/docs/workspace/intro">소개</a></li>
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
          <li class="active"><a href="/docs/project-a/intro">Project A</a></li>
          <li><a href="/docs/project-c/intro">Project C</a></li>
        </ul>
      </div>
      <div class="nav-section home-link">
        <a href="/docs/intro">📋 Public Docs</a>
      </div>
    </nav>
  </div>

  <div class="main-content">
    <h1>Project A</h1>

    Project A의 기획 및 개발 문서를 관리하는 공간입니다.

    ## 프로젝트 개요

    - 🎯 **목표**: 프로젝트의 주요 목표와 방향성
    - 📅 **일정**: 단계별 개발 일정 및 마일스톤
    - 👥 **팀**: 프로젝트 참여 인원 및 역할
    - 📊 **진행 상황**: 현재까지의 진행 상황

    ## 주요 문서

    - 📝 **기획서**: 프로젝트 기획 및 요구사항
    - 🎨 **디자인**: UI/UX 디자인 가이드
    - 🛠️ **개발**: 기술 스택 및 아키텍처
    - 📈 **분석**: 시장 및 사용자 분석

    ---

    > 이 공간의 문서들은 Project A 팀원들과 공유됩니다.
  </div>
</div>

<style>
.doc-wrapper {
  display: flex;
  gap: 2rem;
  margin: -2rem;
  min-height: calc(100vh - 60px);
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