# LocalVision v0.3.20 — Image Popup Production

배포 기준 버전입니다.

## 이번 버전
- 사장님 / 광고주 / 기관 탭별 정사각형 프로모션 이미지 자동 전환
- PC: 메인 520px 캔버스 왼쪽 여백에 팝업 노출
- 모바일: 첫 Hero 화면 위 중앙 팝업 노출
- 팝업 이미지 클릭 시 현재 탭에 맞는 문의 폼 즉시 오픈
- X 버튼: 현재 페이지에서 팝업 닫기 (새로고침 시 다시 노출 가능)
- `24시간 동안 열지 않기`: localStorage 기준 24시간 동안 재노출 방지
- 문의 모달이 열려 있는 동안 팝업 자동 숨김
- 기존 Vercel `/api/inquiry` → Apps Script → Google Sheet / 메일 구조 유지
- Safari/Chrome 메인 타이틀 렌더링 안정화 유지

## 배포
GitHub 저장소 최상단에 이 폴더의 **내용물 전체**를 덮어쓴 뒤 Commit / Push 하면 연결된 Vercel에서 자동 재배포됩니다.
