# 최종 검증 및 마무리 — 2026-11-09

## 판정 범위
새 제품 기능을 추가하지 않았다. 인증·예약·결제·DB·Supabase 정책이나 데이터는 변경하지 않았다. 이번 제품 코드 변경은 `app/provider/Provider.tsx`의 미사용 Ant Design registry 제거뿐이다. Jotai store 생성/Provider 범위, Toaster, children 순서는 유지했다.

실제 사용자가 로그인해서 예약하고 채팅하는 전체 흐름의 동일성은 아직 **확정할 수 없다**. 아래의 자동/mock/HTTP 검증과 브라우저 검증을 구분한다.

## 완료한 검증
- 기존 카드 DOM/문구/props/hover, 양 언어 KRW 합계, 홈/API JSON 직렬화·필터·오류 응답, 모달 포커스 테스트 유지.
- 실제 컴포넌트의 핸들러를 mock으로 실행해 즐겨찾기 생성·삭제 payload/갱신 순서/reset, Credentials 성공·실패 피드백, 결제 성공/취소 후 예약·채팅방 payload를 확인. 실제 인증·결제 SDK·DB 쓰기·메시지 전송은 실행하지 않음.
- middleware에서 한국어 URL 안정성, `/en`, ID/query/hash, API/OAuth 제외, `/ko` 정규화 및 반복 query 보존 확인.
- 320/375/768px에서 모바일 CSS 규칙이 우선하는지, 1024/1440px에서 상세·예약의 desktop row와 모달 600px 규칙이 유지되는지 PostCSS로 정적 확인.
- **정적 CSS 검사 통과는 브라우저 배치·overflow·디자인 동일성의 증명이 아니다.** 별도 수동 체크리스트 참조.

### 최종 실행 결과
| 검사 | 결과 |
|---|---|
| `node --test` (package.json test의 6개 파일) | **30개 통과, 실패 0개** |
| `tsc --noEmit --incremental false` | **종료 코드 0** |
| ESLint 전체 js/jsx/ts/tsx/cjs | **오류 0개, 기존 경고 1개** |
| 최적화 후 `next build` | **종료 코드 0** |
| 저장소 기본 줄바꿈 기준 `git diff --check` | **통과** |

Node 절대 경로로 위 로컬 CLI들을 실행했다. 빌드는 제품 코드 최종 변경(AntdRegistry 제거) 후 실행했고, 이후 제품 코드 수정 없이 테스트/문서만 보강했다. 기존 경고는 `app/client/home-client.tsx`의 결제 수단 초기화 effect `setType` 의존성이다. 임의로 변경하지 않았다.

## Production 읽기 전용 HTTP
환경: Windows, Node 22.17.0, Next.js 15.5.9, `next start --hostname localhost --port 3000`. 기존 상세 서버 조회의 로컬 base URL과 실행 포트를 맞췄다. 환경변수는 수정하지 않았다.

실행: `node scripts/smoke-production.cjs --port=3000`

| 범위 | 결과 |
|---|---|
| `/`, `/en` | HTML lang/canonical/alternates 통과 |
| `/trips`, `/en/trips` | 초기 HTML 및 noindex 통과 (로그인 사용자 데이터는 미검증) |
| `/wishList`, `/en/wishList` | 초기 HTML 및 noindex 통과 (클라이언트 API/하트는 별도 mock·브라우저 검증) |
| `/messages`, `/en/messages` | 초기 HTML 및 noindex 통과 |
| 한국어/영어 메시지 방 테스트 URL | 초기 HTML 및 noindex 통과 (Realtime 미실행) |
| 한국어/영어 예약 테스트 URL | 초기 HTML 및 noindex 통과 (로컬 예약 초안·제출 미검증) |
| 한국어/영어 실제 숙소 상세 | 기존 읽기 전용 목록 API에서 샘플 ID를 얻어 HTML/canonical/alternates 및 SSR 오류 marker 없음 확인 |
| `/api/getListings` | POST 읽기 전용 조회 통과. 실제 숙소 내용/ID는 로그에 출력하지 않음 |
| `/api/auth/providers` | **HTTP 500 / UntrustedHost, 보류** |

화면 HTML 검사 **14건 통과**, 숙소 조회 API 통과. 인증 API가 보류이므로 smoke 전체를 성공으로 표기하지 않는다. 점검용 서버는 종료했다.

## 번들 분석과 최적화
증거: [최적화 전](bundle-before-optimization.json), [최적화 후](bundle-after-optimization.json), `scripts/analyze-bundles.cjs`.

측정법: `app-build-manifest`의 locale layout + 해당 page JS 파일 합집합을 중복 제거하고, 각 실제 파일에 gzip level 9를 적용해 합산. 이는 **Next CLI First Load JS도, 실제 브라우저 전송량도 아니다**. module 통계의 raw source 크기는 tree shaking 전 compiler input이므로 emitted 패키지 크기로 해석하지 않는다.

| 화면 | 전 gzip bytes | 후 gzip bytes | 감소 bytes |
|---|---:|---:|---:|
| 홈 | 222,938 | 216,780 | 6,158 |
| 상세 | 267,994 | 261,835 | 6,159 |
| 예약 | 263,894 | 257,734 | 6,160 |

- 리팩토링 전 대비 증가한 공통 비용: 새 next-intl/navigation/use-intl/ICU 런타임이 공통 client graph에 포함됨. 원래 빌드의 모듈 통계는 없어 증가분 전체를 특정 라이브러리에 정확히 배분할 수 없다. 번역 JSON의 Flight/HTML payload는 JS 파일 합계와도 구분해야 한다.
- 잔여 비용: 홈 카드의 Swiper·react-hook-form·Axios, 상세/예약의 Datepicker·Moment·date-fns 등이 graph에 존재. `react-icons` barrel의 거대한 원본 크기를 전송량으로 오인하지 않음. Next 15는 해당 icon 경로의 import 최적화를 이미 기본 적용한다.
- 개선: 실제 사용 화면에는 Ant Design 컴포넌트가 없고 미사용 예제 `DropDown.tsx`에만 import가 있음을 확인. 전역 `AntdRegistry`만 제거해 미사용 css-in-js 경로 비용을 줄였다. 의존성 삭제·UI 라이브러리 교체는 하지 않았다.
- Next CLI는 전/후 모두 홈 199 kB, 상세 244 kB, 예약 240 kB로 표시했다. 다른 집계의 수치를 섞어 개선률을 주장하지 않는다. 최초 179/224/219 kB 수준으로의 회복 및 브라우저 성능 개선은 아직 미달성/미측정이다.
- 추가 코드 분할로 폼 입력 보존이나 첫 swipe 반응이 바뀌지 않도록 이번에는 무리한 carousel/form 재설계를 하지 않았다.

## UntrustedHost 발생 조건과 해결안 (미적용)
근거: 설치된 `@auth/core/lib/utils/env.js`, `lib/utils/assert.js`, `next-auth/lib/env.js`와 가상 env 테스트 3개.

- 에러는 최종 `trustHost`가 false일 때 발생한다. 현재 로컬 production의 auth/provider·session 요청에서 재현됐다.
- 설치된 beta.30에서는 production + `NEXTAUTH_URL`만 있는 가상 환경은 URL override를 적용하더라도 host trust를 자동 활성화하지 않았다. 개발 모드 및 `VERCEL`/`CF_PAGES`, 유효한 `AUTH_URL`, `AUTH_TRUST_HOST=true` 가상 환경은 자동 추론 결과가 달랐다.
- 이것은 가상 env 테스트다. 실제 `.env` 값을 읽거나 변경하지 않았다. 접속 hostname/port 정합성과 host trust는 별개의 문제이며 3000 포트 정합성만 맞춰도 UntrustedHost는 남았다.

해결 절차:
1. 운영 플랫폼/프록시가 Host·X-Forwarded-Host·X-Forwarded-Proto를 신뢰 가능하게 설정하는지 확인한다.
2. 로컬 production을 신뢰하는 환경으로 명시할 경우, **별도 승인 후** 로컬 환경에 `AUTH_TRUST_HOST=true`를 설정하는 방안을 검토한다. 프록시 입력을 검증하지 않은 채 운영 전체에 무조건 적용하지 않는다.
3. canonical 인증 URL을 정할 경우 `AUTH_URL`/기존 `NEXTAUTH_URL`과 OAuth 등록 callback URL·실행 origin을 함께 검토한다. URL만 바꾸면 OAuth 복귀 주소도 영향을 받을 수 있다.
4. Vercel에서만 재현되지 않는다면 플랫폼 자동 신뢰 추론 여부를 비교한다. 단순히 오류를 숨기기 위해 production에 가짜 플랫폼 flag를 추가하지 않는다.
5. 승인된 정상 환경에서 provider 조회 → Credentials/OAuth → session → 보호 페이지 → 로그아웃 순서로 재검증한다.

참고: [Auth.js 배포 문서](https://authjs.dev/getting-started/deployment), [UntrustedHost](https://authjs.dev/reference/core/errors#untrustedhost). 이번에는 위 설정·정책을 적용하지 않았다.

## 남은 항목
- [브라우저 체크리스트](manual-verification.md): desktop 시각 회귀, 실제 화면 overflow, 언어 전환 후 입력/세션/날짜 상태, 지도·모달·터치·SDK, 실제 인증·Realtime.
- 실제 LCP/CLS/TTFB/전송량: 사용자 측정 대기. [성능 문서](performance.md).
- 전체 기능 동일성에 대한 최종 승인: 정상 인증 환경과 테스트 데이터에서 브라우저 회귀를 마친 뒤 가능.
- commit/push/배포 및 실결제/운영 데이터 변경 없음.

## 이번 마무리에서 변경한 파일
- 제품: `app/provider/Provider.tsx` — 미사용 registry import/래퍼 제거만 수행.
- 빌드 분석: `next.config.js`, `scripts/bundle-report-plugin.cjs`, `scripts/analyze-bundles.cjs` — build-time 통계, 원본 source/env 값 제외. 새 라이브러리 없음.
- 검증: `scripts/smoke-production.cjs`, `tests/i18n-routing.test.cjs`, `tests/ui-regression.test.cjs`, 신규 `tests/auth-environment.test.cjs`, 신규 `tests/responsive-rules.test.cjs`, `package.json` test 파일 목록.
- 문서: 이 보고서, `docs/bundle-before-optimization.json`, `docs/bundle-after-optimization.json`, `docs/manual-verification.md`, `docs/performance.md`, `docs/refactoring-progress.md`, `README.md`.
- 인증·예약·결제·Supabase 관련 주요 원본 파일과 API 핸들러는 이번 단계에서 수정하지 않았다. 기존 작업 트리 변경·lockfile은 유지했다.
