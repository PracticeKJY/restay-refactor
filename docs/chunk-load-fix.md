# 반복 새로고침 ChunkLoadError 대응

화면에 표시된 오류는 `/_next/static/chunks/app/%5Blocale%5D/page.js` 요청 실패다. layout의 Provider 줄은 오류가 전파된 위치이며, 이 증상만으로 next-intl 설정 문제를 의미하지 않는다.

확인한 위험 요인: 기존 Next.js 15 설정에서 `next dev`, `next build`, `next start`가 모두 `.next`를 사용했다. 앞선 검증에서도 개발/빌드의 출력 충돌이 실제로 관찰됐다. 이번 사용자 오류는 접속 시 이미 재현되지 않았으므로 그 순간의 실패 원인을 단정하지 않고, 확인된 충돌 경로를 차단했다.

변경:
- next.config.js: 개발 단계의 distDir을 `.next-dev`, production build/start는 `.next`로 지정.
- .gitignore, .eslintrc.json: 새 생성 폴더 제외.
- tsconfig.json: 개발 생성 타입 경로 포함.
- tests/ui-regression.test.cjs: 개발/빌드/운영 출력 경로의 분리와 일치 검증 추가.

검증:
- 새 개발 폴더로 npm run dev를 재시작.
- 개발 서버를 실행한 상태에서 production build를 수행하면서 Playwright MCP로 홈페이지를 20번 새로고침. 20회 모두 HTTP 200, 정적 청크 오류 0건, pageerror 0건.
- 사용자 화면의 정확한 청크 URL을 다시 요청해 HTTP 200과 JavaScript content-type 확인.
- 빌드 후 /, /en, /wishList, /trips, /messages 실제 제목 렌더링 확인.
- TypeScript, ESLint, production build, 전체 테스트 41개 통과.
- 캡처: artifacts/redesign/chunkload-fixed.png.

기존 브라우저 탭에 오류 화면이 남아 있으면 Ctrl+Shift+R로 한 번 새로고침한다. UI/인증/결제 로직 변경은 없다.

설정 근거: https://nextjs.org/docs/pages/api-reference/config/next-config-js/distDir

## 재발 후 확인한 실제 충돌과 보완

사용자가 vendor-chunks/react-icons.js 누락 오류를 다시 제보했다. 이번에는 브라우저에서 HTTP 500도 재현했다. OS의 리스너와 프로세스를 확인한 결과 같은 프로젝트 Next 개발 서버 두 개가 3000 포트의 `::1`과 `::`에 각각 실행되어 같은 `.next-dev`를 사용하고 있었다. 에이전트가 실행해 둔 서버도 포함되어 있었다. 개발/production 출력 분리만으로는 두 개발 서버 사이의 충돌을 방지하지 못했다.

조치:
- 확인된 두 프로젝트 서버와 부모 CLI를 종료했다.
- workspace 내부의 `.next-dev` 경로 및 reparse point 여부를 검증한 뒤 손상된 개발 생성 캐시만 제거했다.
- `npm run dev`를 scripts/dev-server.cjs로 연결해 프로젝트 단위 PID 잠금을 획득한 후 Next를 실행하도록 했다. 기존 launcher 또는 기록된 child 프로세스가 살아 있으면 두 번째 실행은 거절한다. 둘 다 종료된 잠금은 다음 실행에서 정리한다.
- `.next-dev.lock`은 Next가 관리하는 폴더 밖에 두고 Git에서 제외했다. Next 버전, react-icons 설치, 인증/UI 코드 변경은 없다.
- 실행 명령은 `npm run dev`를 사용한다. 직접 `next dev`를 호출하면 launcher의 중복 실행 보호를 거치지 않는다.

추가 검증:
- 실제 두 번째 `npm run dev`가 의도대로 종료 코드 1과 already running 안내를 반환했다.
- OS 리스너는 `::`:3000의 한 프로세스만 남아 있는 것을 확인했다.
- `.next-dev/server/vendor-chunks/react-icons.js` 재생성 확인.
- Playwright MCP에서 IPv4(127.0.0.1)와 IPv6(::1) 탭을 동시에 새로고침 10회씩, 총 20회 수행했다. 모두 HTTP 200, pageerror 0건, 실패 문서/정적 청크 응답 0건.
- 전체 테스트 44개 통과(중복 launcher 차단, 잔여 child 보호, 종료된 잠금 복구 포함). ESLint 통과.
- 최종 캡처: artifacts/redesign/vendor-chunks-fixed.png.
