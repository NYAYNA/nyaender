# 냔냐의 엔더런 위키

공개 위키: https://nyayna.github.io/ender-run-wiki/

관리자 화면: https://nyayna.github.io/ender-run-wiki/admin/

Minecraft 1.20.4 서버의 플레이 가이드입니다. 공개할 사이트 파일만 들어 있습니다. 서버 API 키, 플레이어 데이터, 월드 파일을 이 저장소에 넣지 마세요.

## 로컬 실행

`python -m http.server 8765 --bind 127.0.0.1 --directory site`

- 위키: http://127.0.0.1:8765/
- 관리자: http://127.0.0.1:8765/admin/

## GitHub Pages 배포

1. NYAYNA 계정에 공개 저장소 `ender-run-wiki`를 만듭니다.
2. 이 폴더 전체를 main 브랜치에 올립니다. `site` 디렉터리와 `.github/workflows/pages.yml` 구조를 유지하세요.
3. 저장소 Settings → Pages → Source를 **GitHub Actions**로 설정합니다.
4. Actions에서 Deploy wiki to GitHub Pages를 실행하거나 main에 커밋합니다.
5. 배포 완료 후 `https://nyayna.github.io/ender-run-wiki/`로 접속합니다.
6. 관리자 화면은 `https://nyayna.github.io/ender-run-wiki/admin/`입니다. 뒤에 `/admin`을 붙여도 디렉터리로 이동합니다.

## 관리자 편집

관리 화면 자체는 공개이며 **GitHub가 실제 저장 권한을 검증**합니다. 비밀 주소를 인증 수단으로 사용하지 않습니다. 토큰 없이 편집·JSON 내보내기가 가능하지만 공개 저장은 불가능합니다.

GitHub Settings → Developer settings → Personal access tokens → Fine-grained tokens에서 이 저장소만 선택하고 Contents: Read and write 권한의 만료일 있는 토큰을 준비합니다. 관리자 화면의 GitHub 연결 설정에 직접 입력하세요. 토큰은 메모리에만 두며 localStorage, 파일, 커밋에 보관하지 않습니다. SSAPI 키를 사용하지 마세요.

1. 연결하고 최신 내용 불러오기.
2. 공개 위키와 같은 왼쪽 메뉴에서 페이지를 선택하고 카드의 이름·안내·보상 설명을 눌러 직접 수정.
3. 상단 변경사항 저장 클릭. 변경은 site/content.json 커밋으로 기록됩니다.
4. Pages 배포가 완료되면 공개 사이트 새로고침.

충돌(409)이 나면 JSON을 내려받아 편집을 보관하고 최신 파일을 다시 읽어 수정합니다. 되돌리기는 GitHub 커밋 Revert로 가능합니다. JSON 파일 내려받기는 로컬 백업이며 공개 저장과 다릅니다.

관리자 페이지에서 바꾸는 것은 **위키 설명뿐**입니다. 게임 서버의 보상·확률·플러그인 설정을 바꾸지는 않습니다.

## 파일 구성

- site/content.json: 공개 안내 데이터
- site/assets: 사용자가 제공한 전용 아이템 PNG
- site/index.html, style.css, app.js: 반응형 위키
- site/admin: 인증된 GitHub Contents API 저장 기능
- .github/workflows/pages.yml: Pages 자동 배포

참고 구조: https://hewols.github.io/dabboo_server_wiki/ (카테고리별 규칙·아이템·API 안내). 그래픽과 안내 내용은 이 서버 전용으로 구성했습니다.
