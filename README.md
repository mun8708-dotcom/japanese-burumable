# ⛩️ 일본 전국 일주 부루마블 (Nippon Burumabul)

학급 활동을 위한 교육용 웹 기반 보드게임입니다. 
구글 스프레드시트를 백엔드 데이터베이스로 활용하여 여러 학생들이 동시에 접속하여 랭킹 및 도시 점령 현황을 공유할 수 있습니다.

## 🚀 GitHub Pages 배포 방법

이 폴더에 있는 파일들을 GitHub 저장소에 올리기만 하면 누구나 접속할 수 있는 웹사이트가 만들어집니다.

1. **GitHub 저장소 만들기**
   - GitHub(https://github.com)에 로그인 후, 우측 상단의 `+` 버튼을 눌러 **New repository**를 클릭합니다.
   - Repository name에 원하는 이름(예: `nippon-burumabul`)을 적고 **Create repository**를 클릭합니다.

2. **파일 업로드하기**
   - `uploading an existing file` 링크를 클릭합니다.
   - 현재 다운로드 받은 `index.html`, `script.js`, `style.css` 3개의 파일을 화면에 드래그하여 업로드하고 **Commit changes**를 누릅니다.

3. **Google Apps Script(웹앱) URL 등록하기**
   - ⚠️ 중요: `script.js` 파일을 열고 두 번째 줄에 있는 `API_URL` 부분에 선생님이 발급받으신 **구글 앱스 스크립트 웹앱 주소**를 반드시 다시 적어주셔야 합니다!
     ```javascript
     const API_URL = "https://script.google.com/macros/s/.../exec";
     ```
   - 수정한 후 GitHub에 다시 저장(Commit)합니다.

4. **GitHub Pages 켜기**
   - 해당 저장소의 상단 메뉴 중 **[⚙️ Settings]**를 클릭합니다.
   - 좌측 메뉴에서 **[Pages]**를 클릭합니다.
   - 'Build and deployment' 항목의 **Source**가 'Deploy from a branch'로 되어있는지 확인합니다.
   - 바로 아래 **Branch**에서 `None`을 클릭하여 `main`(또는 `master`)을 선택하고 **[Save]**를 누릅니다.

5. **완료!**
   - 약 1~2분 정도 기다린 후 화면을 새로고침하면 상단에 **`Your site is live at https://[아이디].github.io/[저장소이름]/`** 이라는 초록색 알림창과 링크가 뜹니다.
   - 이 주소를 학생들에게 공유하시면 됩니다!

## 🎮 주요 기능
* **O/X 및 객관식 퀴즈 연동:** 정답 개수에 따른 주사위/상금 차등 지급
* **실시간 미션 현황판:** 학급 전원 참여 독려 UI
* **초기 정착금 시스템:** 첫 로그인 시 퀴즈 정답 수에 따라 최대 3만 엔 지원
* **관리자 리셋 기능:** 게임 우측 상단의 `⚙️ 리셋` 버튼 클릭 후 `0000` 입력 시 구글 시트 데이터 전면 초기화
