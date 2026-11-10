# Restay UI 확장 결과

이번 단계는 사용자가 승인한 홈페이지 디자인을 나머지 화면에 확장한다. **숙소 상세와 예약·결제 화면은 제외**한다. 새 패키지, DB/API 스키마, 인증·결제 처리 변경, 배포는 없다.

## 적용 내용

| 화면 | 변경 |
| --- | --- |
| 공통 헤더 | 숙소·위시리스트·여행·메시지 직접 탐색, 현재 메뉴 강조, 모바일에서도 4개 메뉴 제공 |
| 푸터 | 기존 로고, 브랜드 소개, 일관된 여백·타이포·링크 정렬; 기존 회사 정보 유지 |
| 위시리스트 | 공통 페이지 소개, 컬렉션 개수, 반응형 사진 카드, 비로그인 안내, 로딩·조회 오류·재시도 상태 |
| 여행 | 공통 소개, 예약 카드의 날짜·지역·숙소명 정리, 기존 호스트 메시지 버튼 유지 |
| 메시지·채팅 | 공통 소개, 대화 목록·선택 상태, 말풍선, 전송 입력창, 재시도·연결 상태, 모바일 대화 패널 스타일 통일 |
| 로그인·회원가입 | 청록 버튼, 고정 레이블 입력창, 한국어·영어 레이블, 소셜 로그인 구분, 모달 높이·스크롤·닫기 버튼 개선 |
| 호스팅 모달 | 단계 진행 표시, 공통 입력/테마 선택/사진 업로드 UI, 키보드로 조작 가능한 인원 버튼 |
| 상태 UI | 통일된 빈 상태, 아이콘·재시도, 접근성 제목, locale loading/error/not-found의 새 테마 표현 |

## 구현 범위와 경계

- Navbar의 locale 없는 pathname을 기준으로 `/listings/**`, `/reservation/**`에서는 기존 헤더를 반환한다. 그 외 화면만 `data-restay-shell`을 갖는다.
- `styles/modern-ui.css`는 위 속성이 있는 화면에서만 새 스타일을 적용한다. 상세·결제의 공통 Button/Input/Modal 등 기본 CSS는 바꾸지 않았다.
- `PageShell`과 `PageHeader`로 페이지 제목·설명을 재사용한다.
- 기존 헤더는 본문 Jotai Provider 밖에 있다. 페이지의 로그인 CTA는 헤더의 default store에 있는 loginModalAtom을 열도록 연결했다. Provider 구조나 인증 함수는 변경하지 않았다.
- 위시리스트는 기존 서버 세션 정보를 UI에 전달해 비로그인 안내를 표시한다. 로그인 사용자의 조회 URL과 응답 계약은 그대로 유지한다. 조회 실패가 빈 컬렉션처럼 보이지 않도록 재시도를 추가했다.
- 채팅 hooks/transport/API, 예약 금액·결제·인증 처리 코드는 수정하지 않았다.
- 기존에 작업 중이던 Reservation.tsx, package.json, package-lock.json 변경은 그대로 두었다.

## 주요 파일

- 공통: app/component/PageShell.tsx, PageShell.module.css; styles/modern-ui.css, styles/globals.css
- 헤더·푸터: app/component/Header/Navbar.tsx, Navbar.module.css, UserMenu.tsx; app/component/Footer/Footer.tsx, Footer.module.css
- 상태·폼: app/component/{Empty,Heading,Button}.tsx; Input/{Input,TextArea,Counter,CategoryInput,ImageUpload}.tsx; Modal/{Modal,LoginModal,RegisterModal,RentModal}.tsx; Spinner/Spinner.tsx
- 위시리스트: app/[locale]/wishList/page.tsx; app/wishList/{WishListCard,Card}.tsx 및 CSS Modules
- 여행: app/[locale]/trips/page.tsx; app/trips/Trips.tsx, Trips.module.css
- 메시지: app/messages/components/ChatWorkspace.tsx, app/messages/Messages.module.css
- 상태 화면: app/[locale]/{loading,error,not-found}.tsx
- 번역·검증: messages/{ko,en}.json; tests/{ui-regression,localization}.test.cjs

## 검증

- TypeScript: `node node_modules/typescript/bin/tsc --noEmit --incremental false` 통과.
- ESLint: package.json과 같은 직접 CLI 전체 검사 통과.
- 전체 테스트: package.json에 등록된 7개 파일을 실행해 **40/40 통과**. 기존 38개에 상세·예약 테마 제외와 페이지 로그인 CTA의 저장소 연결 검증 2개를 추가했다.
- 번역 검사 첫 실행에서는 새 ICU 변수(number/current/total/label)가 테스트 샘플에 없어 실패했다. 테스트 값을 보완한 뒤 통과했다.
- Playwright MCP: 한국어 위시리스트·여행·메시지 각각 1920/1440/768/375px, 영어 각각 1440/768/375px에서 가로 넘침 없음.
- 홈페이지 320px에서도 가로 넘침 없음.
- 실제 로그인 창 진입, 로그인↔회원가입 전환, Esc 닫기, 회원가입 빈 폼 3개 필드의 오류 표시 확인. 실제 가입/로그인/OAuth 요청은 실행하지 않았다.
- `/trips?review=design`에서 언어를 전환한 뒤 `/en/trips?review=design`으로 경로·쿼리 유지 확인.
- 상세와 예약 경로의 새 테마 속성 없음 및 기존 body 배경 유지 확인. 실제 결제는 실행하지 않았다.

## 캡처

저장 디렉터리: artifacts/redesign/

- phase2-before-{wishList,trips,messages,login}.png: 이전 화면
- phase2-{wishList,trips,messages}-{1920,1440,768,375}.png: 수정 후 전체 화면
- phase2-en-{wishList,trips,messages}-{1440,768,375}.png: 영어 화면
- phase2-register-375.png / phase2-register-validation-375.png: 회원가입과 입력 검증
- phase2-login-en-375.png: 영어 로그인
- phase2-excluded-detail.png / phase2-excluded-reservation.png: 제외 화면 확인

## 확인 한계와 기존 문제

로그인을 우회하거나 사용자 데이터를 생성하지 않았다. 따라서 실제 예약·저장 목록이 채워진 화면과 인증된 실시간 대화·호스팅 폼은 브라우저에서 검증하지 못했다. 관련 컴포넌트와 기존 동작은 코드·회귀 테스트로 확인했다. 이 부분의 실제 계정 확인이 후속 QA 범위다.

기존 RegisterModal의 가입 요청 경로(`/api/auth/signup`)와 실제 가입 Route Handler 경로(`/api/signup`)가 다르다. 이번 디자인 범위에서 인증 연결을 변경하거나 실제 가입 요청을 수행하지 않았다.

이전 단계에서 발견한 로컬 production start의 Auth.js UntrustedHost 설정 문제는 그대로다. .env를 읽거나 수정하지 않았다. images.domains 사용 중단 예고와 개발 모드 Auth.js debug 경고도 기존 설정 사항이다.

최종 프로덕션 빌드도 통과했다 (`node node_modules/next/dist/bin/next build`). 빌드 시 TypeScript·Next.js ESLint 단계와 20개 정적 페이지 생성이 완료됐다. 홈페이지 First Load JS는 212kB로 표시됐고, 이번 단계에서는 성능 개선 수치를 주장하지 않는다.

최종 개발 서버 재기동 후 위시리스트→여행→메시지 직접 메뉴 이동, 로그인/회원가입 모달 전환과 Esc 닫기를 다시 확인했다. 320×640px 로그인 모달은 높이 576px, 콘텐츠 높이 776px로 내부 스크롤이 가능하며 페이지 가로 넘침은 없다. 최종 세션 browser console error는 0건이다.

최종 대표 캡처:
- phase2-final-wishlist-desktop.png
- phase2-final-trips-desktop.png
- phase2-final-messages-mobile.png
- phase2-final-login-desktop.png
- phase2-final-login-320.png
- phase2-final-register-320.png

후속 권장 QA: 실제 계정으로 저장 목록/예약 내역/대화 내용을 확인하고, 디자인 범위와 분리해 기존 가입 연결 경로와 로컬 production host 설정을 검토한다.
