# Restay 홈페이지 디자인 시범안

범위: 홈페이지와 홈페이지에서 보이는 헤더·검색·카드·푸터. 상세·예약·결제·위시리스트·여행·메시지·인증 페이지로의 디자인 확산은 승인 후 진행한다.

## 분석

- Next.js 15.5.9 / React 18.2 / TypeScript 5.0, CSS Modules와 전역 reset을 사용한다. Jotai, next-intl, Swiper 등 기존 의존성을 유지했다. 패키지를 추가하지 않았다.
- localhost:3000의 기존 개발 서버를 Playwright MCP로 확인했다. 1920/1440/768/375px 변경 전 스크린샷을 저장했다.
- 기존 화면은 카테고리 아래 약 12rem의 누적 여백, 고정 300px 카드, 제목·본문 구분 부족, 작은 화면에서 숨겨지는 로고와 카테고리 문제가 있었다.
- 상세 페이지를 실제로 열어 확인했다. 위시리스트·여행·메시지는 당시 접근 가능한 비로그인 화면을 촬영했다. 인증 우회, 실제 결제, 데이터 쓰기는 수행하지 않았다.

## 디자인 방향과 규칙

차분한 여행 편집물처럼 사진과 여백을 중심으로 구성한다. 기존 로고와 숙소 데이터·사진을 사용하며 가상 후기·평점·할인·재고는 추가하지 않는다.

| 항목 | 규칙 |
| --- | --- |
| 색상 | Ink #193d38, Paper #faf9f6, Surface #ffffff, Muted #69756f, Line #e3e7df, Accent #dce8db |
| 글꼴 | Arial / Apple SD Gothic Neo / Malgun Gothic / sans-serif, 추가 폰트 다운로드 없음 |
| 위계 | 메인 제목 36~53px, 섹션 24~28px, 본문 13~14px, 메타 11~12px |
| 간격 | 4px 기반 4/8/12/16/24/32/48/64px |
| 곡률 | 버튼·입력 12px, 검색 패널 20px, 메인 이미지 28px, 카드 이미지 18px |
| 그림자 | 0 12px 40px rgb(25 61 56 / 8%); 기본 화면은 테두리 위주 |
| 화면 구성 | 최대 폭 1440px, 바깥 여백 desktop 48 / tablet 32 / mobile 20px |
| 분기 | 767px 이하 단일 열, 768~1023px 2열, 1024px 이상 4열 |
| 버튼 | Primary 짙은 청록+흰색, Secondary 흰색+테두리(다음 단계), Text 링크, 원형 아이콘 |
| 입력 | 흰 패널 안의 옅은 배경 검색창, 명확한 레이블·추천 검색, 모바일 16px 입력 |
| 카드 | 테마 → 지역 → 숙소명 → KRW/박, 이미지 스와이프·즐겨찾기 기존 동작 유지 |
| 상태 | 기존 포커스 표시 유지, 테마 선택 강조, 메인 CTA hover, reduced-motion 지원 |

디자인 토큰: styles/design-tokens.css. 홈페이지 CSS Modules 안에 스타일을 제한했다. 공통 카드에는 스타일용 data 속성만 추가했다. 다른 페이지의 기존 레이아웃은 유지한다. 푸터 색상도 홈페이지 헤더가 존재할 때만 적용한다.

## 적용 내용과 파일

- app/client/home-client.tsx, app/page.module.css: 사진 중심 소개, 여행 탐색 CTA, 검색, 스크롤 가능한 테마 목록, 숙소 그리드, 마무리 안내.
- app/[locale]/page.tsx: 홈페이지 전용 폭과 여백을 적용하기 위한 외부 Container 제거. 데이터 조회와 세션 전달은 유지.
- app/component/Header/Navbar.tsx, Navbar.module.css: 홈페이지 전용 sticky 헤더. 모바일 로고·언어·사용자 메뉴 유지.
- app/component/Header/Search.tsx: 홈페이지 검색 안내 문구 prop과 키보드 탐색 지원. 기존 쿼리 처리 유지.
- app/component/listings/{CardInfo,ListingCardMedia,SwiperComponent}.tsx: 홈페이지에서만 카드 스타일을 적용할 data 속성.
- messages/{ko,en}.json: HomeDesign 네임스페이스. 사용자 생성 콘텐츠는 번역하지 않음.
- styles/globals.css: 토큰 import와 홈페이지 한정 푸터 색상.
- tests/listing-cards.test.cjs, tests/ui-regression.test.cjs: 새 DOM 속성과 래퍼 구조에 맞춘 기존 기대값 갱신. 데이터·이벤트 계약 검증 유지.

## 검증

- TypeScript: node node_modules/typescript/bin/tsc --noEmit --incremental false 통과.
- ESLint: package.json lint와 같은 직접 ESLint CLI 검사 통과.
- 프로덕션 빌드: node node_modules/next/dist/bin/next build 통과. 홈페이지 First Load JS 212kB. 이번 작업은 성능 비교 실험이 아니므로 속도 개선 수치를 주장하지 않는다.
- 회귀 검사: node --test tests/listing-cards.test.cjs tests/i18n-routing.test.cjs tests/localization.test.cjs tests/ui-regression.test.cjs tests/responsive-rules.test.cjs — 27/27 통과. 최초 3개 실패는 변경된 DOM/래퍼 기대값 때문이었고 수정 후 통과했다.
- Playwright MCP: 한국어 1920/1440/768/375px, 영어 1440/375px. 가로 넘침 없음. 전체 숙소 16개, 해변 근처 필터 2개, 수영장 검색 2개, 없는 테마 검색 0개와 빈 상태 확인.
- 실제 숙소 상세로 이동하는 동작 확인. 실제 결제·OAuth·데이터 변경은 실행하지 않았다.
- 개발 서버와 빌드의 .next 공유로 검증 중 서버 오류가 발생했다. 서버를 중지하고 빌드를 다시 수행했다. 최종 UI 검증은 개발 모드에서 수행한다.
- 로컬 production start에서는 Auth.js UntrustedHost가 발생했다. 인증 로직/.env는 수정하지 않았다. production 환경의 trusted host 설정 검토는 별도 작업이다.

## 남은 범위

현재 승인 대상은 홈페이지 시각 방향이다. 상세/예약/결제, 위시리스트/여행, 메시지, 인증 폼·모달과 전체 로딩/오류 화면의 새 디자인은 미적용이다. 결제와 외부 OAuth는 화면 검증만으로 정상 동작을 보장할 수 없다. 다음 단계는 승인 후 상세와 예약 페이지부터 같은 규칙을 적용하는 것이다.

참고: 숙박 사이트의 사진 중심 구성과 모바일 예약 동선을 검토하기 위해 https://hoteltechreport.com/news/hotel-website-designs 를 참고했다. 실제 구현안의 색상·레이아웃은 Restay 시범안으로 설계했다.

## 최종 확인 보충

- 전체 package.json 테스트 목록 7개 파일 실행: 38/38 통과 (auth-environment, chat 포함).
- 개발 모드에서 비로그인 로그인 모달을 열고 Esc로 닫는 동작 확인. 제출·외부 OAuth는 실행하지 않음.
- 최종 Playwright 세션의 브라우저 console error: 0건.
- 개발 서버는 npm run dev -- --hostname localhost --port 3000으로 실행 중이다.

## 스크린샷

저장 위치: artifacts/redesign/ (Playwright MCP의 실제 브라우저 캡처).

- before-{1920,1440,768,375}.png: 변경 전
- home-desktop.png: 최종 PC 소개·검색·숙소 카드
- after-375-viewport.png: 최종 모바일 첫 화면
- home-mobile-stays.png: 모바일 검색·테마·숙소 목록
- after-{1920,1440,768,375}.png: 최종 전체 페이지
- after-en-{1440,375}.png: 영어 첫 화면
- detail-verified.png: 상세 이동 검증
- login-verified.png: 로그인 모달 진입 검증

- 태블릿 768px 캡처에서 제목 끝 한 글자가 줄바꿈되는 문제를 발견해 768~1023px 제목을 30px로 보정했다. PC·모바일 제목 크기는 유지했다.
- 기존 개발 환경 경고도 관찰됨: images.domains 사용 중단 예고, Auth.js debug 활성화, 상세 화면의 multiple Jotai instances 경고. 이번 홈페이지 시범안에서는 설정·상태 구조를 변경하지 않았다.
