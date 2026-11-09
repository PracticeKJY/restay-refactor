# Restay 리팩토링 진행 기록

## 최신 마무리 결과
- [최종 검증 보고서](final-validation.md)가 아래 R1~R5 당시 기록보다 최신이다.
- 테스트 **30개 통과**, TypeScript/Production Build 통과, ESLint 오류 0개·기존 경고 1개.
- 실제 숙소 상세 포함 한국어/영어 Production HTML **14건** 및 읽기 전용 숙소 API 통과. 예약/채팅방은 초기 shell만 검증, 실제 제출/Realtime은 미검증.
- 반응형 320/375/768/1024/1440px 정적 CSS cascade 검증 통과. 실제 화면 비교·overflow·모바일 키보드는 체크리스트로 분리.
- 사용하지 않는 전역 AntdRegistry만 제거. 동일 manifest JS 파일 합집합의 gzip level 9 합계는 홈 222,938→216,780 bytes, 상세 267,994→261,835 bytes, 예약 263,894→257,734 bytes로 감소. CLI First Load JS 및 브라우저 수치와 구분한다.
- Next CLI First Load JS는 홈/상세/예약 199/244/240 kB로 초기 179/224/219 kB보다 여전히 크다. 원래 수준으로의 전체 감소 및 실제 성능 개선은 미확정.
- UntrustedHost는 로컬 production에서 여전히 재현. 설치 버전의 가상 env 추론 테스트 3개로 조건 확인, 공식 해결안을 문서화했으나 인증 정책·환경변수는 변경하지 않음.
- 점검용 localhost:3000 서버 종료. 제품 기능 추가·실결제·운영 데이터 변경·commit/push/배포 없음.

## 범위
- R1 → R2 → R3 → R4 → R5. 기존 숙소 카드 공통화 유지.
- 예약·결제 처리/계산, 인증 정책, DB 데이터/스키마, Supabase 정책, API 계약 변경 금지.
- P0-2B~F 제외. 현재 P0-2A 관련 파일 상태를 임의로 복원하지 않는다.
- 브라우저 자동화는 이전 URL 확인 제한으로 중단됐다. 시각적/실사용 검증은 미검증.
- 브라우저 성능 수치는 사용자 제공 전까지 기록하지 않는다.

## 진행 (2026-11-09)
- R1: 카드 공통화 유지, 날짜 버튼 중복 통합, 상세 atom의 쓰기 전용 구독, 상세 타입 5곳 통합, 메시지 목록 중복 구현 통합.
- R2: 정적 Container/Footer 경계, 모달 dynamic import, 이미지 priority/sizes 조정, 지도 SDK를 지도 마운트 시 로딩, PortOne SDK를 예약 페이지에서만 로딩. 결제 호출/금액/payload는 유지.
- R2 후속: 홈 초기 목록을 서버 조회로 전달. API와 동일한 조회 함수를 공유하며 필터/응답 계약 유지. 클라이언트 초기 API effect 제거. mock DB/API/페이지 비교 테스트 통과.
- R3: 1024px 미만 Navbar/검색/모달/상세/예약/달력/목록/호스팅 CSS 보완, 채팅 긴 텍스트와 입력 폭 보완. 데스크톱 및 320/375/768/1024px 브라우저 비교는 미검증.
- R4: next-intl 4 사용. ko 기본/as-needed/자동 감지 비활성화. 화면 page만 [locale]로 이동, API 원래 위치 유지. 언어 선택기와 locale-aware navigation 적용.
- R4 검증: 번역 전에 middleware URL/ID/query/hash/API·OAuth 제외 테스트 4개 및 Production Build 통과.
- R4 번역: 기능별 ko/en 리소스, 표시 카테고리와 DB 값 분리, 날짜/숫자 locale 표시, 복수형, 서버 Footer 메시지를 client bundle에서 제외.
- R5: 모달 dialog/Escape/Tab 포커스/복귀, 메뉴·카테고리·하트 키보드 입력, 폼 오류 연결, focus-visible, locale metadata/canonical/hreflang 및 개인화 noindex, robots 적용.
- R4 root layout과 화면 page는 모두 `app/[locale]` 아래로 이동했다. 언어별 html lang/messages를 같은 layout 경계에서 갱신한다. 기존 URL은 middleware가 내부 locale 경로로 rewrite한다.
- R5 검증 명령을 package.json에 추가. Next.js 15의 next lint가 제거됐다는 이전 AGENTS 설명과 달리 설치 버전에서는 존재하지만, 명시적 ESLint CLI를 사용하도록 스크립트를 정리했다. AGENTS.md 자체는 변경하지 않았다.

## 최종 자동 검증
실행 환경: Windows PowerShell, Node.js 22.17.0, npm 11.6.1, Next.js 15.5.9. Node 절대 경로 실행을 사용했다. 시스템 PATH/환경변수/비밀키 변경, 패키지 설치/업그레이드 없음.

| 검사 | 명령/방식 | 결과 |
|---|---|---|
| 회귀 테스트 | `node --test tests/listing-cards.test.cjs tests/i18n-routing.test.cjs tests/localization.test.cjs tests/ui-regression.test.cjs` | **16개 통과** |
| 타입 | `tsc --noEmit --incremental false` | **통과** |
| ESLint | `eslint . --ext .js,.jsx,.ts,.tsx,.cjs --ignore-pattern .next --ignore-pattern node_modules --ignore-pattern .codex` | **오류 0개, 기존 경고 1개** |
| Production Build | `next build` | **종료 코드 0** |
| diff | 저장소 기존 줄바꿈 설정의 `git diff --check` | **통과** |
| Production HTTP | `next start --hostname localhost --port 3101` + `node scripts/smoke-production.cjs` | **화면 HTML 검사 8건 통과, 인증 API 보류** |

- 16개 테스트: 카드 4, locale routing 4, 메시지 키/ICU/복수형 3, 양 언어 동일 KRW 합계 1, 홈/API JSON·필터 계약 1, API 오류 계약 1, 모달 포커스 1, 결제 옵션 표시/콜백 유지 1.
- 초기 테스트 보조 코드의 Moment default import 설정 오류는 보완 후 통과했다. 제품의 날짜 계산은 변경하지 않았다.
- 홈 fetch effect 제거로 해당 effect의 경고 2개가 함께 사라졌다. 결제 수단 초기화 effect의 기존 `setType` 의존성 경고 1개는 유지했다.
- HTTP 통과 URL: `/`, `/en`, `/trips`, `/en/trips`, `/wishList`, `/en/wishList`, `/messages`, `/en/messages`. HTML lang/canonical/ko·en alternates와 개인화 noindex 확인. 실제 브라우저 JS 상호작용 검사는 아니다.
- 초기 `--hostname 127.0.0.1` 실행에서 내부 rewrite와 hostname 차이로 한국어 경로에 307 응답이 발생했다. `--hostname localhost`와 localhost 접속을 일치시켜 재검증했다. 애플리케이션의 locale 정책이나 시스템 설정을 바꾸지 않았다.
- `/api/auth/providers`는 기존 NextAuth **UntrustedHost**로 500. smoke 전체는 성공 처리하지 않고 보류 항목을 출력하며 비정상 종료한다. 인증 정책/환경변수는 수정하지 않았다. middleware API/OAuth 제외는 단위 테스트에서 통과했다.
- 테스트는 mock/SSR 및 로컬 읽기 전용 HTTP 검사다. 실제 로그인·DB 쓰기·실결제를 수행하지 않았다. 점검용 3101 서버는 종료했다.

## 보류/미검증
- 인증·결제·권한·DB·Supabase 관련 P0 후보는 수정하지 않음.
- OAuth 완료 redirectTo는 기존 `/` 유지. 영어 로그인 완료 후 한국어 홈 복귀 가능. 정책/흐름 변경 없이 독립 검토 대상으로 남김.
- 브라우저 시각적 회귀/실로그인/예약·결제·채팅·모바일 키보드는 미검증. 실결제/운영 데이터 쓰기 없음.
- 사용자 제공 브라우저 성능 실측 대기. JS 번들 크기와 실제 체감 성능을 동일시하지 않는다.
- 최종 Build의 First Load JS는 홈 199 kB, 상세 244 kB, 예약 240 kB였다. 초기 분석의 179/224/219 kB보다 커졌으므로 **번들 감소 목표는 미달성**이다. next-intl/navigation 및 추가 기능 비용을 포함한 값이며, 후속 bundle 분석으로 따로 줄여야 한다. 실제 브라우저 전송량이나 향상률로 해석하지 않는다.
- 상세/예약의 실제 데이터·SDK 상호작용과 인증 사용자 흐름은 미검증. 기존 상세의 환경 URL 기반 서버 조회, 예약의 로컬 상태 사용, Supabase 초기화 등 제외된 P0 후보를 이번 검증을 위해 바꾸지 않았다.

## 문서/파일 및 이어서 할 작업
- [변경 파일 목록](refactoring-files.md): 기존 page/layout의 D 표시는 locale 경로 이동으로 설명.
- [수동 회귀 검증](manual-verification.md): 지원 너비별 시각적 비교, 언어 전환, 세션/예약 초안, 지도/모달/채팅 절차.
- [성능 기록](performance.md): 실제 브라우저 baseline 대기, 구조 변경과 측정 절차.
- R1~R5의 위 구현은 적용했다. **모든 완료 기준을 충족했다고 선언하지 않는다**: 데스크톱/반응형 시각 회귀, 실제 사용자 흐름, 브라우저 성능, 번들 감소는 남아 있다.
- 다음 실행에서는 전체 재분석 대신 사용자 브라우저 결과부터 반영하고, 정상 인증 환경에서 회귀 확인 및 번들 분석을 진행한다. 인증·결제·DB·API 정책 변경 필요 시 해당 항목만 별도 승인받는다.
- Git commit/push/Vercel 배포 없음. 기존 package-lock.json·AGENTS.md·.codex 변경 상태를 유지했다.

## 채팅 후속 수정
- 전송 즉시 표시와 응답·Realtime 중복 제거, 올바른 기존 세션 초기화 API 연결.
- UUID/이메일 텍스트 제거 및 반응형 대화 UI, 메뉴/여행 예약별 진입 연결.
- 인증·RLS·예약·결제·API 계약 변경 없음. 상세 검증 및 미확인 항목: [chat-flow.md](chat-flow.md).


### 채팅 자동 스크롤 및 UI 보완
- 새 메시지 추가와 최초 로딩 완료 시 대화 영역을 맨 아래로 이동. 이전 스크롤 위치에 따른 제한 제거. 페이지 전체는 스크롤하지 않음.
- 목록 헤더 고정, 날짜 구분선, 입력창/빈 화면/선택 항목 및 모바일 여백 개선.
- Navbar 메시지 링크의 현재 활성 상태 유지. 서버·예약·결제·인증 로직 변경 없음.
- 자동 스크롤은 모의 DOM 회귀 테스트로 확인. 실제 브라우저 시각 및 모바일 키보드 확인은 미검증.

