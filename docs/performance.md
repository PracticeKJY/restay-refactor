# 성능 측정 및 변경 기록

## 측정 상태
- 브라우저 LCP/CLS/TTFB/JavaScript 전송량/API 요청 수: **미측정, 사용자 측정 결과 대기**.
- 실제 성능 향상 수치나 개선률은 기재하지 않는다.
- Next.js 빌드의 First Load JS는 브라우저 실제 전송량·LCP와 다르다. next-intl과 로딩 상태 UI가 추가되어 일부 빌드 청크는 기존보다 커질 수 있으며 번들 감소를 달성했다고 단정하지 않는다.
- HTTP smoke는 Production HTML과 metadata 확인용이며 성능 baseline이 아니다.

### 빌드 출력 참고 (브라우저 실측 아님)
| 화면 | 초기 분석 시 First Load JS | 최종 Build First Load JS |
|---|---:|---:|
| 홈 | 179 kB | 199 kB |
| 상세 | 224 kB | 244 kB |
| 예약 | 219 kB | 240 kB |

위 값은 실행한 빌드 출력이다. locale/navigation 및 추가 UI가 포함된 최종 버전의 **번들 감소는 달성하지 못했다**. 동일 브라우저 조건의 실제 전송량/LCP 비교는 아직 없으며 성능 향상률을 계산하지 않는다.

## 구현한 구조 변경
- 최종 검증에서 미사용 전역 AntdRegistry만 제거했다. 동일한 manifest 파일 합집합/gzip level 9 기준 홈 222,938 → 216,780 bytes, 상세 267,994 → 261,835 bytes, 예약 263,894 → 257,734 bytes. 이는 CLI First Load JS나 브라우저 전송량이 아니다. [분석과 제한](final-validation.md) 참조.
- 홈 목록은 서버에서 조회해 JSON 직렬화한 초기 props로 전달. 기존 API와 같은 조회 함수를 공유한다. 브라우저 effect에서 시작하던 초기 `/api/getListings` 호출을 제거했다.
- 공개 숙소 조회에 캐시를 새로 적용하지 않았다. 개인화 응답 캐시도 추가하지 않았다.
- 모달은 표시 시점에 코드 로딩. Container와 정적 Footer의 불필요한 client 선언 제거.
- 카드 전체 이미지 priority 대신 홈 첫 카드 첫 이미지, 상세 첫 이미지에만 적용. 카드/상세 sizes 조정.
- Kakao SDK는 지도 컴포넌트 마운트 시 로드. PortOne SDK는 예약 페이지에서만 afterInteractive로 로드. 사용 준비 상태와 실제 상호작용은 브라우저 검증 필요.
- 외부 폰트에 font-display: swap 적용. 폰트 파일/브랜드 디자인은 유지.

## 재현 절차
1. `npm run build` 후 `npm run start -- --hostname localhost --port 3101` (개발 서버 사용 금지).
2. Chrome 시크릿 창에서 홈과 같은 숙소 상세를 측정. Chrome 버전/OS/기기/로그인 여부/데이터 규모/SDK 실패 여부 기록.
3. Lighthouse Navigation/Performance에서 Mobile과 Desktop을 각각 3회 이상 실행. 보고서 JSON/HTML 보관, 회차별 값과 중앙값 기록.
4. DevTools Performance에서 LCP/CLS 확인. Network Disable cache 후 새로고침하여 JS 필터의 Transferred와 `/api/` 요청 수 기록. 서버 내부 요청은 브라우저 API 수에 포함하지 않는다.
5. Navigation Timing의 responseStart-startTime을 TTFB로 기록. Network의 Waiting for server response는 별도 서버 대기 시간으로 구분.
6. 첫 실행과 서버/이미지 캐시가 준비된 반복 실행을 구분하고 변경 전후 같은 조건을 사용.
7. 이 작업 이전 버전과 이후 버전을 비교하려면 동일 데이터/브라우저/네트워크 조건으로 각각 측정. 실결제나 운영 데이터 생성 없이 수행.

## 결과 입력 양식
| 항목 | 기록 |
|---|---|
| 측정 일시·버전·URL | 사용자 제공 대기 |
| Chrome·OS·화면 크기 | 사용자 제공 대기 |
| CPU·네트워크·캐시·로그인 | 사용자 제공 대기 |
| 홈 LCP / CLS / TTFB | 미측정 |
| 상세 LCP / CLS / TTFB | 미측정 |
| 홈·상세 JS 전송량 / API 수 | 미측정 |
| 보고서 경로·실패한 SDK·특이사항 | 사용자 제공 대기 |
