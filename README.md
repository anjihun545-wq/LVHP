# LocalVision Web v0.3.17 Production

의정부 생활공간 기반 LocalVision 홈페이지 운영 배포본입니다.

## 배포
압축을 푼 뒤 이 폴더 안의 파일과 폴더를 GitHub 저장소 루트에 그대로 업로드하고 Vercel에서 배포합니다. 별도 Build Command는 필요하지 않습니다.

필수 루트 구조:
- `index.html`
- `api/inquiry.js`
- `assets/`
- `css/`
- `js/`
- `vercel.json`

## 문의 흐름
브라우저 → `/api/inquiry` → Google Apps Script → Google Sheet 저장 → `1to75uni@naver.com` 메일 알림 → 접수 결과 반환

실제 문의 기능은 GitHub Pages 단독 배포가 아니라 Vercel 배포가 필요합니다.
