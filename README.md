# 🥬BaeChu

안녕하세요, 온라인 가계부 서비스 "배추"입니다.
다같이 배춧잎을 지갑에 넣어볼까요?

---

## Contents

- Introduction
- Role Management
- Process
- Result
- Discussion
- Communications

---

## Introduction

본 프로젝트는 **Vue.js** 프레임워크를 기반으로 하는 **온라인 가계부 웹 서비스** 개발을 목표로 합니다.<br>
사용자가 개인 재정을 효율적이고 직관적으로 관리할 수 있도록 돕는 기능을 제공합니다.

---

### 목적

- 수업시간에 배운 기술 요소를 실제 서비스에 접목해 봄으로써 각 개인의 프로그래밍 능력 향상
- 서비스 개발 과정 중 기획, 설계, 코딩, 테스트, 배포의 각 단계를 경험
- 팀 프로젝트 진행 시 협력 및 충돌 경험으로써 의사소통 능력 향상

---

### 목표

- Component를 이용한 기능 별 구조 분리
- Router를 활용한 라우트 이동
- Axios를 활용한 백엔드 서버(Json-server로 대체) 접근
- 반응형 웹 구현
- 실제 동작하는 서비스 구현

---

### 사용 기술

<img src="https://img.shields.io/badge/vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white">
<img src="https://img.shields.io/badge/css3-1572B6?style=for-the-badge&logo=css3&logoColor=white">
<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white">
<img src="https://img.shields.io/badge/bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white">

---

### 사용 툴

<img src="https://img.shields.io/badge/Visual Studio Code-2F80ED?style=for-the-badge&logo=vscode&logoColor=white">
<img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white">
<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">
<img src="https://img.shields.io/badge/figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white">

---

### 기간

- **2025-04-07 (월) ~ 2025-04-11 (금)**

---

## Role Management

<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/Hyukman818"><img src="https://github.com/Hyukman818.png" width="100px;" alt=""/><br /><sub><b>팀장 : 오혁신 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/jungsunwoong"><img src="https://github.com/jungsunwoong.png" width="100px;" alt=""/><br /><sub><b>부팀장 : 정선웅 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/saeun-park"><img src="https://github.com/saeun-park.png" width="100px;" alt=""/><br /><sub><b>팀원 : 박사은 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/maedachaeva"><img src="https://github.com/maedachaeva.png" width="100px;" alt=""/><br /><sub><b>팀원 : 박채연 </b></sub></a><br /></td>
     <tr/>
      <td align="center"><a href="https://github.com/woojeans7"><img src="https://github.com/woojeans7.png" width="100px;" alt=""/><br /><sub><b>팀원 : 송우진 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/yurissssss"><img src="https://github.com/yurissssss.png" width="100px;" alt=""/><br /><sub><b>팀원 : 신유리 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/dahyoon"><img src="https://github.com/dahyoon.png" width="100px;" alt=""/><br /><sub><b>팀원 : 안다윤</b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/kthrc"><img src="https://github.com/kthrc.png" width="100px;" alt=""/><br /><sub><b>팀원 : 최유정</b></sub></a><br /></td>
    </tr>
  </tbody>
</table>

---

## 역할 상세

> ### 박사은

**1. 통계 페이지 구현**

- 페이지 전체 구조 및 레이아웃 설계
- 컴포넌트 연동 및 데이터 흐름 관리

**2. Chart.js 기반 파이차트 구현**

- 월별 지출 카테고리 파이차트 시각화
- Top3 소비 카테고리 및 비율 표시
- 데이터 없을 때 안내 메시지 처리

**3. Chart.js 기반 라인차트 시각화**

- 월별 지출 금액 라인차트 시각화
- 전월 대비 증감률, 8개월 평균 지출액 계산
- 데이터 없을 때 안내 메시지 처리

**4. 순이익 분석**

- 수입 대비 지출 비율 계산 및 시각화
- 지출 수준별 배추 이미지 및 메시지 출력

---

> ### 박채연

**1. 통계 페이지 구현**

- 선택 월 변경에 따른 데이터 자동 갱신 로직 구현
- Pages/Components/Store/Utils 역할 분리 및 폴더 구조화

**2. 통계 계산 함수 구현**

- 카테고리별 총합 계산 함수 개발
- 월별 총합 계산 함수 개발
- 순이익 계산 함수 개발

**3. 월 선택 기능**

- 월별 시작일/종료일 동적 계산

**4. 데이터 관리 및 가공**

- 선택 월 기준 거래 내역 필터링
- 필터링된 데이터로 통계 계산 및 store 반영

---

> ### 송우진

**1. 엑셀로 내보내기**

- 기간별 수입/지출 항목 1개월, 3개월, 기간설정으로 조회
- 조회결과를 엑셀로 내보내기

**2. 예산 설정**

- 카테고리별로 예산 설정 기능
- 확인 시 제출, 취소 기능
- 초기화 기능
- DB와 연결해서 예산 항목 저장

**3. 예산 조회**

- DB에 월별로 저장된 예산 항목 조회
- 월별 지출 내역 조회
- 지출 / 예산 비율 그래프 작성

---

> ### 신유리

**1. 카테고리 필터**

- ‘수입/지출’ 체크박스 선택 유무에 따라 해당되는 카테고리 항목 (+'전체' 항목) 출력
- 선택된 카테고리에 맞는 거래내역만 필터링되어 리스트에 출력
- 예외 처리: 해당 내역이 없을 경우 “표시할 내역이 없습니다.” 출력
- 수입/지출 체크 상태 변경 시 카테고리 초기화

**2. 메모 검색**

- 검색어 입력 후 엔터/아이콘 클릭 시 해당 키워드가 포함된 메모 거래내역 필터링
- 예외 처리: 해당 내역이 없을 경우 “표시할 내역이 없습니다.” 출력

**3. 알림 구조 설계**

- 알림 컴포넌트를 생성하여 전체 구조 설계

---

> ### 안다윤

**1. 사용자 정보 관련 기능 구현**

- 로그인 및 로그아웃 기능
- 유효성 검사 후 회원가입 기능
- 마이페이지에서 사용자 정보 조회 및 수정 기능

**2. 레이아웃 디자인 구현**

- 헤더, 사이드바 메뉴, 푸터

**3. 전체 코드 통합**

- 각 컴포넌트 병합
- 화면 및 컴포넌트별 레이아웃 및 디자인 조정

---

> ### 오혁신

**1. 거래 등록**

- 거래 정보(체크박스, 날짜, 카테고리, 메모, 금액) 입력 후 db.json에 내역 저장
  - 등록 후 새로고침 없이 최신 내역이 추가 되도록 구현
  - 예외처리를 통해 미(오)입력 시 '금액은 0원보다 커야 합니다', '필수 항목입니다' 메시지 출력

**2. 거래 내역**

- 전체 거래 내역 출력
- db에 저장한 정보를 categories.js 에서 mapping을 통해 사용자가 이해하기 쉬운 value 값으로 출력
- 수정/삭제 기능
- 수정 : id 값을 불러와서 해당 id의 데이터 정보를 불러와서 수정
- 삭제 : id 값의 데이터를 삭제하도록 구현
  - 체크박스 선택한 내용 선택 삭제
  - 휴지통 아이콘 누르면 리스트 항목 1개 삭제
  - 삭제에 대한 모든 경우에는 '정말 삭제하시겠습니까?' 확인 알림 뜨도록 구현
- 위 항목들에 대한 예외 처리는 등록 시와 동일

**3. 거래 필터**

- 수입/지출 체크박스 체크 시 체크 한 내용만 화면에 보이도록 구현

---

> ### 정선웅

**1. 서비스 기능**

- 서비스 시작하기
- 로그인 페이지

**2. 홈**

- 홈 요약 페이지
- 총수입,지출,예산 컴포넌트

**3.월 선택 컴포넌트**

- 월 이동으로 월 선택 구현

**4. 전체 라우팅 설정 및 디자인 세팅**

- 라우팅 등록
- 초기 컴포넌트 구성 설정

---

> ### 최유정

**1. 캘린더 출력과 거래 내역 연동**

- 오늘 날짜를 기준으로 캘린더 출력
- 선택된 월 기준으로 거래 내역 자동 필터링
- 날짜 선택 시 팝업 띄워 거래 목록 표시

**2. 탭 메뉴 구현 (거래 내역 / 달력 전환) - 부트스트랩**

- 상단 탭으로 거래 내역 리스트와 달력 뷰 전환

**3. 거래 내역 수정 / 추가 팝업 페이지 연동**

- 추가/수정 버튼 클릭 시 입력 폼/ 수정 팝업 페이지로 이동

**4. 알림 세부 기능 구현**

- 지출이 총 예산 초과시 알림 기능 구현

- 정기구독 결제일 3일 전 알림 기능 구현

---

## 🛠️ 개발 환경 및 설치 방법

### 1. Vue 프로젝트 생성

- Vue CLI 이용하여 새 프로젝트 생성

  ```
  npm create-vue@3.16.3
  ```

  - Project name : `AccountBook`
  - Package name : `accountbook`

### 2. 의존성 및 주요 라이브러리 설치

- 📦 프로젝트 기본 의존성

  ```
  npm install
  ```

- 🎨 Bootstrap (UI 프레임워크)

  ```
  npm install bootstrap@5
  ```

- 🧭 Vue Router (페이지 이동 라우팅)

  ```
  npm install vue-router
  ```

- 🌐 Axios (HTTP 통신 라이브러리)

  ```
  npm install axios
  ```

- ⚙️ Pinia (상태 관리 라이브러리)

  ```
  npm install pinia
  ```

- 📊 Chart.js & Vue Chart.js (차트 시각화 도구)

  ```
  npm install chart.js vue-chartjs
  ```

- 📁 xlsx (엑셀 내보내기 기능용 라이브러리)

  ```
  npm install xlsx
  ```

- 🔛 swiper (스와이프 기능)
  ```
  npm install swiper
  ```
- 🍎 jwt.io (로그인 회원가입 토큰)
  ```
  npm install jsonwebtoken
  ```

### 3. 프로젝트 초기 세팅

- 기본 컴포넌트 및 아이콘 폴더, base.css, logo.css, view-Home, About 삭제

- 패키지 폴더 내 `db.json` 파일 생성

### 4. 개발용 JSON 서버 세팅

#### 📦 JSON 서버 설치

- macOS / Linux

  ```
  sudo npm install -g json-server
  ```

- Windows
  ```
  npm install -g json-server
  ```

#### 🚀 JSON 서버 실행

- 서버 실행

  ```
  json-server --watch db.json
  ```

- 실행 후 `localhost:3000` 접속하여 더미 데이터 확인

---

## Process

- 📅 **월별 거래 관리**: 날짜별로 수입/지출 내역 등록 및 조회
- 💸 **예산 설정 및 진척도 시각화**: 카테고리별 예산 설정과 퍼센트 게이지
- 📊 **통계 분석**: 월간 수입/지출 통계, 파이 차트로 시각화
- 🔍 **카테고리별 정리**: 식비, 교통비 등 카테고리 기반 필터링
- 📂 **데이터 저장**: json-server 기반 로컬 DB 사용

---

### 1일차

> - 기능 기획
> - 스토리보드 작성
> - 전체 레이아웃 스케치 작성
> - 역할 분담

### 2일차

> - figma 전체 레이아웃 UI/UX 작성
> - 스토리보드 완성
> - 기능 구현

### 3일차

> - 기능 구현

### 4일차

> - 기능 구현 완성
> - 디자인 작업
> - 기능 병합

### 5일차

> - 발표

---

## Result

---

## Discussion

---

## Communication

### Naming Convetion

- 컴포넌트 파일명: PascalCase (ex. `TransactionForm.vue`, `ExpenseList.vue`)
- 비 컴포넌트 파일: camelCase (ex. `api.js`, `useTransaction.js`)
- 폴더명: 소문자 복수형 (`components`, `pages`, `layout`)
- CSS 클래스명 : snake_case(`popup_layer`)

기타:

- export name, 파일명, 컴포넌트명 일치
- 컴포넌트명은 역할 + 접미사로 2단어 이상 사용 (ex. `List.vue` ❌ → `ExpenseList.vue` ✅)

---

### Comment Convention

**CSS 주석**

````시작만 표기 (끝X)
/* 헤더 레이아웃 시작 */
~~ 스타일시트 작성 ~~~```
````

---

**Script 주석**

```
// #region 함수 기능
/**
* 함수 내용 요약
 * 변수 설명
 * return 값 설명
 */
 ~~~ 스크립트 작성 ~~~
// endregion
```

---

### 📌 Git 협업 전략

> 원활한 협업을 위한 브랜치 동기화 및 병합 전략
>
> - 꼭 로컬-원격 간 최신화 업데이트를 진행하고 코드를 수정해주세요!!!
> - 개발은 dev 브랜치에서만!
> - feature 별로 각 기능 작업

1. **로컬 `feature` → 원격 `feature` 최신화**
2. **원격 `dev` → 로컬 `dev` 최신화**
3. **로컬 `dev` → 로컬 `feature` 병합 (충돌 여부 확인)**
4. **병합 및 충돌 해결 후 → 원격 `feature`에 반영**
5. **최종적으로 원격 `dev`에 PR 생성**
6. **PR approve 후 `dev`에 병합**

---

### 📌 Commit Message

**형식**: `키워드: 커밋 메시지 내용 04-07(날짜)`

예시:

- `Fix: 회원가입 시 비밀번호 정규식 오류 해결`

| 키워드       | 설명                       |
| ------------ | -------------------------- |
| **Feat**     | 새로운 기능 추가           |
| **Fix**      | 버그 수정                  |
| **Refactor** | 코드 리팩토링              |
| **Design**   | CSS 등 UI/UX 디자인 변경   |
| **Comment**  | 주석 추가/수정             |
| **Docs**     | 문서 관련 작업 (README 등) |
| **Init**     | 초기 설정 및 구성          |
| **Edit**     | 기능 수정 및 편집          |
| **Rename**   | 파일/폴더명 변경           |
| **Remove**   | 파일 삭제                  |
| **Merge**    | 브랜치 병합                |

---

### 📌 Branch

**형식**: `feature/{issue-number}-{feature-name}`

예시:

- `feature/1-init-project`
- `feature/2-main-layout`

이슈번호 관리 : 각 페이지별로 이슈번호 등록, 하위 컴포넌트 작업도 공통 이슈번호로 통일

- Home - 1-home
- 수입/지출 관리 - 2-transaction
- 통계 - 3-statistics
- 예산 관리 - 4-budget
- 레이아웃 - 5-layout

---

### 📌 Pull Request Template

```
### [#이슈번호] 기능 구현 제목

## 개요
- 무엇을, 왜 수정했는지 설명해주세요.

## PR 유형
- [ ] 새로운 기능 추가
- [ ] 버그 수정
- [ ] CSS 등 사용자 UI 디자인 변경
- [ ] 코드 리팩토링
- [ ] 코드에 영향 없는 수정
- [ ] 문서 수정
- [ ] 테스트 추가/리팩토링
- [ ] 빌드/패키지 관련
- [ ] 파일/폴더명 수정
- [ ] 파일 삭제

## PR Checklist
- [ ] 커밋 메시지 컨벤션을 지켰나요?
- [ ] 기능 테스트를 완료했나요?
- [ ] develop 브랜치로 머지 요청했나요?
```

---

### 📌 Label

```
- name: '🐛 bugfix'
  color: 'd73a4a'
  description: '버그 픽스'

- name: '✨ feature'
  color: '0E8A16'
  description: '새로운 기능 추가'

- name: '🔁 refactor'
  color: 'c2e0c6'
  description: '리팩토링 작업'

- name: '📄 documentation'
  color: '0075ca'
  description: '문서 관련 작업'

- name: '💬 question'
  color: 'd876e3'
  description: '논의/질문'

- name: '🎨 design'
  color: 'ffb3c6'
  description: 'UI/UX 관련 작업'

- name: '🧪 test'
  color: 'f9d0c4'
  description: '테스트 코드 또는 테스트 관련 작업'
```

---

```

```
