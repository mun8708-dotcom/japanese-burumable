document.addEventListener("DOMContentLoaded", () => {
    // 🔥 여기에 구글 앱스 스크립트 '웹앱 배포 URL'을 넣으세요.
    const API_URL = "https://script.google.com/macros/s/AKfycbxSYqWJ4PAaiGAUUBdeIAnOPBsCTpaORSrdoSq22bG4lBwxHjPT6ZLHJqxArnsvX6em/exec";

    const board = document.getElementById("board");
    const btnQuiz = document.getElementById("btn-quiz");
    const btnRoll = document.getElementById("btn-roll");
    const btnRanking = document.getElementById("btn-ranking");
    const btnCloseRanking = document.getElementById("btn-close-ranking");
    
    const btnInfo = document.getElementById("btn-info");
    const btnCloseInfo = document.getElementById("btn-close-info");
    const infoModal = document.getElementById("info-modal");

    const btnAdminReset = document.getElementById("btn-admin-reset");

    const loginModal = document.getElementById("login-modal");
    const btnLogin = document.getElementById("btn-login");
    const playerNameInput = document.getElementById("player-name-input");

    const playerNameSpan = document.getElementById("player-name");
    const playerMoneySpan = document.getElementById("player-money");
    const topRankerInfoSpan = document.getElementById("top-ranker-info");
    
    const quizModal = document.getElementById("quiz-modal");
    const quizTitle = document.getElementById("quiz-title");
    const quizQuestion = document.getElementById("quiz-question");
    const quizOptions = document.getElementById("quiz-options");
    
    const buildModal = document.getElementById("build-modal");
    const buildTitle = document.getElementById("build-title");
    const buildDesc = document.getElementById("build-desc");
    const buildOptions = document.getElementById("build-options");

    const diceOverlay = document.getElementById("dice-overlay");
    const diceWrapper = document.getElementById("dice-wrapper");
    const diceResultText = document.getElementById("dice-result-text");

    const rankingModal = document.getElementById("ranking-modal");
    const rankingList = document.getElementById("ranking-list");

    const boardData = [
        { name: "출발", type: "corner" },
        { name: "후쿠오카", type: "city", price: 3000 }, { name: "사가", type: "city", price: 3500 },
        { name: "나가사키", type: "city", price: 4000 }, { name: "오이타", type: "city", price: 4500 },
        { name: "황금열쇠🔑", type: "golden-key" },
        { name: "구마모토", type: "city", price: 5000 }, { name: "미야자키", type: "city", price: 5500 },
        { name: "가고시마", type: "city", price: 6000 }, { name: "오키나와", type: "city", price: 10000 },
        { name: "무인도", type: "corner" },
        { name: "에히메", type: "city", price: 6500 }, { name: "가가와", type: "city", price: 7000 },
        { name: "도쿠시마", type: "city", price: 7500 }, { name: "고치", type: "city", price: 8000 },
        { name: "황금열쇠🔑", type: "golden-key" },
        { name: "히로시마", type: "city", price: 8500 }, { name: "오카야마", type: "city", price: 9000 },
        { name: "돗토리", type: "city", price: 9500 }, { name: "시마네", type: "city", price: 10000 },
        { name: "사회복지기금", type: "corner" },
        { name: "야마구치", type: "city", price: 11000 }, { name: "효고", type: "city", price: 12000 },
        { name: "오사카", type: "city", price: 18000 }, { name: "교토", type: "city", price: 15000 },
        { name: "황금열쇠🔑", type: "golden-key" },
        { name: "나라", type: "city", price: 13000 }, { name: "와카야마", type: "city", price: 14000 },
        { name: "미에", type: "city", price: 15000 }, { name: "아이치", type: "city", price: 16000 },
        { name: "우주여행", type: "corner" },
        { name: "시즈오카", type: "city", price: 17000 }, { name: "기후", type: "city", price: 18000 },
        { name: "나가노", type: "city", price: 19000 }, { name: "야마나시", type: "city", price: 20000 },
        { name: "황금열쇠🔑", type: "golden-key" },
        { name: "가나가와", type: "city", price: 21000 }, { name: "도쿄", type: "city", price: 25000 },
        { name: "사이타마", type: "city", price: 22000 }, { name: "홋카이도", type: "city", price: 30000 }
    ];

    let currentPosition = 0;
    let diceCount = 0; 
    let currentMoney = 50000; 
    let playerName = "";
    let playerToken = ""; 
    let allPlayersData = []; 
    let allCitiesData = {}; 

    const avatars = ["🦊", "🍡", "🍣", "🥷", "👺", "🐱", "🐶", "🐰", "🐼", "🐯", "🐸", "🐷"];

    // 🔥 [보안 수정] 리셋 버튼 클릭 이벤트 (안내 문구 제거됨)
    if (btnAdminReset) {
        btnAdminReset.addEventListener("click", async () => {
            const pwd = prompt("관리자 비밀번호를 입력하세요");
            
            if (pwd) { 
                if (confirm("정말 모든 플레이어와 도시 데이터를 초기화하시겠습니까?\n(삭제된 데이터는 복구할 수 없습니다.)")) {
                    try {
                        const response = await fetch(API_URL, {
                            method: "POST",
                            body: JSON.stringify({ action: "resetAll", password: pwd }) 
                        });
                        const data = await response.json();
                        
                        if(data.status === "success") {
                            localStorage.clear(); 
                            alert("초기화가 완료되었습니다. 화면을 새로고침합니다.");
                            location.reload();
                        } else {
                            alert("비밀번호가 틀렸거나 권한이 없습니다."); 
                        }
                    } catch(e) {
                        alert("서버 연결에 실패하여 초기화하지 못했습니다.");
                    }
                }
            }
        });
    }

    const updateTokenPosition = (position) => {
        let token = document.getElementById("player-token");
        if (!token) {
            token = document.createElement("div");
            token.id = "player-token";
            token.className = "token";
            token.innerText = playerToken;
            board.appendChild(token); 
        }
        
        const targetCell = document.querySelector(`.cell[data-index="${position}"]`);
        if (targetCell) {
            const x = targetCell.offsetLeft + (targetCell.offsetWidth / 2);
            const y = targetCell.offsetTop + (targetCell.offsetHeight / 2);
            token.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
        }
    };

    window.addEventListener("resize", () => {
        if(document.getElementById("player-token")) {
            updateTokenPosition(currentPosition);
        }
    });

    const renderBoard = () => {
        board.innerHTML = "";
        const centerLogo = document.createElement("div");
        centerLogo.id = "center-logo";
        centerLogo.innerHTML = `
            <div class="center-title">日本 일주</div>
            <div class="center-subtitle">Nippon Burumabul</div>
            <div class="center-decor-container">
                <div class="center-icon">🌸</div>
                <div class="center-icon">🗻</div>
                <div class="center-icon">⛩️</div>
            </div>
        `;
        board.appendChild(centerLogo);

        for (let i = 0; i < boardData.length; i++) {
            const cell = document.createElement("div");
            
            let cellClass = "cell";
            if (boardData[i].type === 'corner') cellClass += " corner";
            if (boardData[i].type === 'golden-key') cellClass += " golden-key";
            
            cell.className = cellClass;
            cell.dataset.index = i;
            
            if(allCitiesData[boardData[i].name]) {
                boardData[i].owner = allCitiesData[boardData[i].name].owner;
                boardData[i].building = allCitiesData[boardData[i].name].building;
                boardData[i].toll = allCitiesData[boardData[i].name].toll;
            }
            
            const priceText = boardData[i].price ? boardData[i].price.toLocaleString() : '';
            let ownerHTML = boardData[i].owner ? `<div class="owner-mark">${boardData[i].building}</div>` : '';
            
            cell.innerHTML = `
                <div class="city-name">${boardData[i].name}</div>
                <div class="city-price">${priceText}</div>
                ${ownerHTML}
            `;

            let row, col;
            if (i >= 0 && i < 10) { row = 11; col = 11 - i; }
            else if (i >= 10 && i < 20) { row = 11 - (i - 10); col = 1; }
            else if (i >= 20 && i < 30) { row = 1; col = 1 + (i - 20); }
            else { row = 1 + (i - 30); col = 11; }
            cell.style.gridRow = row;
            cell.style.gridColumn = col;
            board.appendChild(cell);
        }
        
        if (playerName !== "") {
            updateTokenPosition(currentPosition);
        }
    };

    const renderAllPlayers = () => {
        document.querySelectorAll('.token-group').forEach(el => el.remove());
        const positionMap = {};
        allPlayersData.forEach(p => {
            if (!p.name) return; 
            const pos = Number(p.position) || 0;
            if (!positionMap[pos]) positionMap[pos] = [];
            positionMap[pos].push(p);
        });

        for (let pos in positionMap) {
            const targetCell = document.querySelector(`.cell[data-index="${pos}"]`);
            if (targetCell) {
                const group = document.createElement("div");
                group.className = "token-group";
                positionMap[pos].forEach(p => {
                    if (p.name !== playerName) {
                        const span = document.createElement("span");
                        span.innerText = p.token;
                        span.title = p.name; 
                        group.appendChild(span);
                    }
                });
                if (group.children.length > 0) {
                    targetCell.appendChild(group);
                }
            }
        }
    };

    async function savePlayerToServer() {
        if(!API_URL || API_URL === "여기에_웹앱_URL을_붙여넣으세요") return;
        
        let totalAsset = currentMoney;
        boardData.forEach(cell => {
            if(cell.owner === playerName) {
                let buildingValue = 0;
                if(cell.building === "🏯") buildingValue = cell.price * 5;
                else if (cell.building === "♨️") buildingValue = cell.price * 3;
                else if (cell.building === "🏮") buildingValue = cell.price;
                totalAsset += buildingValue;
            }
        });
        
        const payload = {
            action: "updatePlayer",
            name: playerName,
            token: playerToken,
            position: currentPosition,
            money: currentMoney,
            asset: totalAsset
        };

        try {
            await fetch(API_URL, {
                method: "POST",
                body: JSON.stringify(payload)
            });
        } catch(e) {
            console.error("서버 저장 실패:", e);
        }
    }
    
    async function saveCityToServer(cellData) {
        if(!API_URL || API_URL === "여기에_웹앱_URL을_붙여넣으세요") return;
        
        const payload = {
            action: "updateCity",
            cityName: cellData.name,
            owner: cellData.owner,
            building: cellData.building,
            price: cellData.price, 
            toll: cellData.toll
        };

        try {
            await fetch(API_URL, {
                method: "POST",
                body: JSON.stringify(payload)
            });
            savePlayerToServer(); 
        } catch(e) {
            console.error("도시 서버 저장 실패:", e);
        }
    }

    async function fetchAllData() {
        if(!API_URL || API_URL === "여기에_웹앱_URL을_붙여넣으세요") {
            console.log("로컬 모드로 실행됩니다.");
            renderBoard();
            return;
        }
        
        try {
            const cityRes = await fetch(API_URL + "?action=getCities");
            allCitiesData = await cityRes.json();
            
            const playerRes = await fetch(API_URL + "?action=getPlayers");
            allPlayersData = await playerRes.json();
            
            const myData = allPlayersData.find(p => p.name === playerName);
            if (myData) {
                currentPosition = Number(myData.position);
                currentMoney = Number(myData.money);
                playerToken = myData.token; 
                playerNameSpan.innerText = `${playerToken} ${playerName}`;
                playerMoneySpan.innerText = `${currentMoney.toLocaleString()}엔`;
                alert(`환영합니다! 이전 위치와 자산을 불러왔습니다.`);
            } else {
                savePlayerToServer();
            }

            if(allPlayersData.length > 0) {
                const sorted = [...allPlayersData].sort((a, b) => (Number(b.asset) || 0) - (Number(a.asset) || 0));
                topRankerInfoSpan.innerText = `👑 1위: ${sorted[0].name}(${(Number(sorted[0].asset) || 0).toLocaleString()}엔)`;
            }
            
            renderBoard();
            renderAllPlayers(); 

            // 🔥 오늘의 전원 출석 미션 현황 계산
            const todayStr = new Date().toLocaleDateString();
            let todayCount = 0;
            allPlayersData.forEach(p => {
                if (p.lastUpdate) {
                    const pDate = new Date(p.lastUpdate).toLocaleDateString();
                    if (pDate === todayStr) todayCount++;
                }
            });
            
            const attendanceSpan = document.getElementById("attendance-count");
            const banner = document.getElementById("mission-banner");
            if (attendanceSpan && banner) {
                attendanceSpan.innerText = todayCount;
                if (todayCount >= 12) {
                    banner.classList.add("success");
                    banner.innerText = "🎉 12명 전원 출석 달성! (선생님께 내일 보너스를 기대하세요!)";
                }
            }
            
        } catch (error) {
            console.error("데이터 로딩 실패:", error);
            renderBoard();
        }
    }

    btnLogin.addEventListener("click", () => {
        if (playerNameInput.value.trim() === "") {
            alert("이름을 입력해주세요!");
            return;
        }
        playerName = playerNameInput.value.trim();
        playerToken = avatars[Math.floor(Math.random() * avatars.length)];
        
        playerNameSpan.innerText = `${playerToken} ${playerName}`;
        playerMoneySpan.innerText = `${currentMoney.toLocaleString()}엔`;
        
        loginModal.classList.add("hidden");
        fetchAllData();
    });

    btnRanking.addEventListener("click", async () => {
        if(!API_URL || API_URL === "여기에_웹앱_URL을_붙여넣으세요") {
            alert("서버 연동 전입니다. 추후 업데이트 예정입니다.");
            return;
        }
        
        try {
            const res = await fetch(API_URL + "?action=getPlayers");
            allPlayersData = await res.json();
            
            renderAllPlayers();
            
            rankingList.innerHTML = "";
            const sortedPlayers = [...allPlayersData].sort((a, b) => (Number(b.asset) || 0) - (Number(a.asset) || 0));
            sortedPlayers.forEach((p, index) => {
                const div = document.createElement("div");
                div.className = "ranking-item";
                
                const pos = Number(p.position) || 0;
                const cityName = boardData[pos] ? boardData[pos].name : "알 수 없음";
                
                div.innerHTML = `<span>${index + 1}위 ${p.token} ${p.name} <small style="color:#718096; font-size:12px; margin-left:6px;">(${cityName})</small></span><span>${(Number(p.asset) || 0).toLocaleString()}엔</span>`;
                rankingList.appendChild(div);
            });
            rankingModal.classList.remove("hidden");
        } catch(e) {
            alert("랭킹을 불러오는데 실패했습니다.");
        }
    });
    btnCloseRanking.addEventListener("click", () => rankingModal.classList.add("hidden"));

    btnInfo.addEventListener("click", () => infoModal.classList.remove("hidden"));
    btnCloseInfo.addEventListener("click", () => infoModal.classList.add("hidden"));

    const moveTokenStepByStep = (startPos, totalSteps) => {
        return new Promise(resolve => {
            let currentStep = 0;
            const stepInterval = setInterval(() => {
                currentStep++;
                const nextPos = (startPos + currentStep) % 40;
                
                updateTokenPosition(nextPos);
                
                if (currentStep >= totalSteps) {
                    clearInterval(stepInterval);
                    resolve(nextPos);
                }
            }, 300); 
        });
    };

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    const oxQuizList = [
        { chapter: 1, page: 11, question: "일본어 표기에는 히라가나와 가타카나 두 종류의 문자만 사용된다.", options: ["O", "X"], answerIndex: 1, explanation: "일본어를 표기할 때는 히라가나, 가타카나, 한자 등의 문자가 주로 사용됩니다." },
        { chapter: 1, page: 11, question: "히라가나와 가타카나는 각각 총 46음의 문자로 구성되어 있다.", options: ["O", "X"], answerIndex: 0, explanation: "각각 총 46음의 문자이며, 이를 정리한 표를 오십음도라고 합니다." },
        { chapter: 1, page: 13, question: "일본어 한자는 우리나라와 동일한 한자 정자를 사용한다.", options: ["O", "X"], answerIndex: 1, explanation: "한자 정자를 쓰는 우리나라와 달리 일본어에서는 획수를 줄인 신자체 한자가 사용됩니다." },
        { chapter: 1, page: 14, question: "일본어로 문장을 쓸 때는 원칙적으로 띄어쓰기를 하지 않는다.", options: ["O", "X"], answerIndex: 0, explanation: "생김새가 다른 문자를 섞어 쓰기 때문에 띄어 쓰지 않아도 글을 이해하기 쉽기 때문입니다." },
        { chapter: 1, page: 11, question: "일본어는 우리나라 말과 어순이 비슷하여 한자의 사용 빈도도 우리말과 비슷한 수준이다.", options: ["O", "X"], answerIndex: 1, explanation: "어순은 비슷하지만, 우리말에 비해 일본어의 한자 사용 빈도가 훨씬 높습니다." },
        { chapter: 1, page: 11, question: "일본어 문자인 'ん(ン)'은 자음과 모음의 조합이 아니므로 오십음도에 포함되지 않는다.", options: ["O", "X"], answerIndex: 0, explanation: "자음과 모음의 조합이 아니어서 원칙적으로 오십음도에 포함되지 않으나, 편의상 같이 제시되는 경우가 많습니다." },
        { chapter: 1, page: 12, question: "일본어는 모음이 다섯 개뿐이기 때문에 동음이의어가 많이 존재한다.", options: ["O", "X"], answerIndex: 0, explanation: "모음 수가 적어 발음이 같은 동음이의어가 많습니다." },
        { chapter: 1, page: 12, question: "외래어나 다른 나라의 이름, 지명을 표기할 때는 주로 히라가나를 사용한다.", options: ["O", "X"], answerIndex: 1, explanation: "외래어, 나라명, 인명, 지명을 표기하거나 강조하는 부분에는 주로 가타카나를 사용합니다." },
        { chapter: 1, page: 11, question: "한자는 뜻을 나타내는 표의 문자이고, 히라가나와 가타카나는 소리 나는 대로 표기하는 표음 문자이다.", options: ["O", "X"], answerIndex: 0, explanation: "한자는 일정한 뜻을 나타내며, 가나 문자는 한글처럼 소리를 기호로 나타냅니다." },
        { chapter: 1, page: 14, question: "일본어 문장에서는 원칙적으로 물음표(?)나 느낌표(!)를 사용하지 않는다.", options: ["O", "X"], answerIndex: 0, explanation: "쓰지 않는 것이 원칙이나 요즘은 사용하는 경우도 많아졌습니다." },
        { chapter: 2, page: 25, question: "일본에서는 덮밥이나 카레라이스처럼 밥과 반찬이 식기 하나에 담겨 나오는 경우, 비빔밥처럼 한꺼번에 섞어 먹지 않는 것이 일반적이다.", options: ["O", "X"], answerIndex: 0, explanation: "덮밥이나 카레라이스처럼 밥과 반찬이 식기 하나에 담겨 나오는 경우, 우리나라와 달리 한꺼번에 섞어 먹지 않습니다." },
        { chapter: 3, page: 33, question: "일본인은 대인 관계를 원활히 유지하기 위해 불만이 생기더라도 직설적인 비판을 삼가고, 자신의 속마음(本音)을 겉으로 잘 드러내지 않는 경향이 있다.", options: ["O", "X"], answerIndex: 0, explanation: "일본인은 속마음(本音)을 좀처럼 드러내지 않은 채 겉모습(建前)으로 소통함으로써 대인 관계를 원활히 유지하고자 합니다." },
        { chapter: 4, page: 46, question: "일본은 5월부터 7월 사이에 장마가 오며, 장마 전선의 영향을 거의 받지 않는 홋카이도는 여름 피서지로 인기가 많다.", options: ["O", "X"], answerIndex: 0, explanation: "홋카이도는 여름에 장마 전선의 영향을 거의 받지 않고 평균 20도 정도로 시원하여 피서지로 인기가 많습니다." },
        { chapter: 5, page: 66, question: "세쓰분(節分)에는 '도깨비는 밖으로! 복은 안으로!'라고 외치며 콩 던지기를 하고, 무탈하게 보낸다는 의미로 나이만큼 볶은 콩을 먹는다.", options: ["O", "X"], answerIndex: 0, explanation: "입춘 전날인 세쓰분에는 질병이나 재난을 막고자 콩 던지며, 나이만큼 볶은 콩을 먹는 풍습이 있습니다." },
        { chapter: 6, page: 74, question: "신사나 절에서 구입한 에마(絵馬)는 좋은 기운이 도망가지 않도록 오마모리(お守り)처럼 항상 몸에 지니고 다녀야 한다.", options: ["O", "X"], answerIndex: 1, explanation: "에마는 오마모리와 달리 집으로 가져오거나 몸에 지니지 않고 신사나 절에 마련된 전용 공간에 걸어 둡니다." },
        { chapter: 7, page: 83, question: "가부키(歌舞伎)는 초기에는 여성이 주축이 되었으나, 현재는 성인 남성 배우로만 구성된 공연이 되었다.", options: ["O", "X"], answerIndex: 0, explanation: "가부키는 원래 여성이 주축이 되었으나, 현재는 성인 남성 배우로만 구성되어 공연을 펼칩니다." },
        { chapter: 8, page: 98, question: "큰 시험을 앞두고 합격을 기원하며 돈가스를 먹는 풍습은 '가쓰(カツ)'가 '이기다'라는 뜻의 동사와 발음이 같기 때문이다.", options: ["O", "X"], answerIndex: 0, explanation: "돈가스의 '가쓰'가 '이기다'라는 뜻의 동사 'かつ'와 발음이 같아 합격을 기원하며 먹습니다." },
        { chapter: 9, page: 108, question: "일본은 곰팡이를 방지하기 위해 보통 욕실(おふろ)과 화장실(トイレ)이 분리되어 있는 경우가 많다.", options: ["O", "X"], answerIndex: 0, explanation: "일본의 기후 특성상 한 공간에 있으면 습기 때문에 곰팡이가 쉽게 생기므로 대개 분리되어 있습니다." },
        { chapter: 10, page: 118, question: "일본의 택시는 승객이 타고 내릴 때 스스로 차 문을 열고 닫는 것이 일반적인 예절이다.", options: ["O", "X"], answerIndex: 1, explanation: "일본 택시의 차 문은 운전사가 조작하는 자동문이므로 승객이 직접 문을 여닫을 필요가 없습니다." },
        { chapter: 11, page: 127, question: "우리나라의 새 학기는 3월에 시작하지만, 일본의 학교는 대부분 4월에 입학식을 하고 이듬해 3월에 졸업식을 한다.", options: ["O", "X"], answerIndex: 0, explanation: "일본의 학교는 대개 1년 3학기 과정으로 4월에 새 학기를 시작합니다." },
        { chapter: 12, page: 137, question: "일본의 만화는 대사를 세로 방향으로 쓰기 때문에, 책을 읽을 때 우리나라와 반대로 오른쪽에서 왼쪽으로 읽고 줄을 바꾼다.", options: ["O", "X"], answerIndex: 0, explanation: "일본 만화는 대사가 세로 방향으로 쓰여 있어 오른쪽에서 왼쪽으로 읽는 것이 특징입니다." },
        {"chapter": 1, "page": 11, "question": "일본어로 한자를 읽을 때는 우리나라와 동일하게 음으로만 읽어야 한다.", "options": ["O", "X"], "answerIndex": 1, "explanation": "일본어로 한자를 읽는 방법에는 음으로 읽는 '음독'과 한자 고유의 뜻으로 읽는 '훈독' 두 가지가 있습니다."},
        {"chapter": 1, "page": 11, "question": "일본어의 히라가나는 곡선 모양이 많은 데 비해, 가타카나는 각진 모양이 많고 획수가 적어 비교적 간단하다.", "options": ["O", "X"], "answerIndex": 0, "explanation": "히라가나는 곡선이 많고, 가타카나는 각진 모양이 많아 구별하기 쉽습니다."},
        {"chapter": 1, "page": 12, "question": "한자어는 중국에서 들어온 어휘만 해당하며, 일본 고유어를 한자로 표현한 단어는 없다.", "options": ["O", "X"], "answerIndex": 1, "explanation": "한자어 중에는 중국에서 들어온 어휘뿐만 아니라 일본의 고유어를 한자로 표현한 '일본식 한자어'도 있습니다."},
        {"chapter": 1, "page": 13, "question": "일본어 문장에서 문장이 끝났음을 표시할 때는 마침표(.) 대신 고리점(。)을 사용한다.", "options": ["O", "X"], "answerIndex": 0, "explanation": "일본어에서는 마침표(.) 대신 '。'를 쓰며, 쉼표(,) 대신 '、'를 사용합니다."},
        {"chapter": 2, "page": 21, "question": "일본에서는 아침, 점심, 저녁에 상관없이 만날 때 항상 'こんにちは(곤니치와)'라고 인사한다.", "options": ["O", "X"], "answerIndex": 1, "explanation": "일본에서는 우리나라와 달리 시간대에 따라 아침(おはよう), 점심(こんにちは), 저녁(こんばんは) 인사말을 구별하여 사용합니다."},
        {"chapter": 2, "page": 22, "question": "'すみません(스미마센)'은 사과할 때뿐만 아니라 상점에서 점원을 부르거나 감사를 표현할 때도 사용한다.", "options": ["O", "X"], "answerIndex": 0, "explanation": "すみません은 미안할 때 외에도 사람을 부를 때(저기요/실례합니다)나 상대방의 호의에 고마움을 나타낼 때 등 다양하게 쓰입니다."},
        {"chapter": 2, "page": 23, "question": "일본인은 자신이 속한 집단인 '우치(内)'의 사람을 남에게 이야기할 때는 높여 부르고, 남인 '소토(外)'의 사람은 낮춰 부른다.", "options": ["O", "X"], "answerIndex": 1, "explanation": "반대입니다. 일본인은 '소토(남)'를 높여서 말하고, '우치(우리)'를 낮춰서 말합니다. (예: 남에게 자기 엄마를 말할 때는 낮춰서 '母'라고 함)"},
        {"chapter": 2, "page": 25, "question": "일본에서는 식사할 때 밥그릇이나 국그릇을 식탁에 둔 채로 먹어야 하며, 들고 먹으면 예의에 어긋난다.", "options": ["O", "X"], "answerIndex": 1, "explanation": "우리나라와 달리 일본에서는 밥그릇이나 국그릇을 손에 들고 먹는 것이 일반적인 예절입니다."},
        {"chapter": 2, "page": 26, "question": "일본에서는 우동이나 메밀국수 같은 면 요리를 먹을 때 후루룩 소리를 내면서 먹어도 괜찮다.", "options": ["O", "X"], "answerIndex": 0, "explanation": "일본인은 소리를 내면서 먹으면 뜨거운 면의 온도를 낮추고 풍미를 더 잘 즐길 수 있다고 생각하여 면 요리를 먹을 때 소리를 냅니다."},
        {"chapter": 3, "page": 35, "question": "일본에서는 무언가를 거절할 때, 상대방이 오해하지 않도록 구체적인 이유를 명확하고 단호하게 말하는 대화 방식이 발달했다.", "options": ["O", "X"], "answerIndex": 1, "explanation": "일본인은 거절할 때 직접적인 표현보다는 말끝을 흐리거나 생략하여 두루뭉술하게 거절 의사를 넌지시 표현하는 방식을 선호합니다."},
        {"chapter": 3, "page": 36, "question": "일본인에게 대화 중 맞장구(あいづち)를 치는 것은 상대방에 대한 공감과 배려를 나타내는 중요한 대화 예법이다.", "options": ["O", "X"], "answerIndex": 0, "explanation": "일본에서는 맞장구를 치면서 이야기를 듣는 것이 예의이며, 맞장구가 없으면 자기 말에 흥미가 없다고 오해할 수 있습니다."},
        {"chapter": 3, "page": 37, "question": "한국어의 '발이 넓다'와 같은 의미를 가진 일본의 관용구는 '顔が 広い(얼굴이 넓다)'이다.", "options": ["O", "X"], "answerIndex": 0, "explanation": "우리나라는 '발이 넓다'라고 표현하지만, 일본에서는 인맥이 넓다는 뜻으로 '顔が 広い(얼굴이 넓다)'라는 관용구를 사용합니다."},
        {"chapter": 3, "page": 38, "question": "일본의 성씨 종류는 약 5,500개 정도로, 우리나라와 비슷한 수준의 성씨 개수를 가지고 있다.", "options": ["O", "X"], "answerIndex": 1, "explanation": "우리나라의 성씨는 약 5,500개이지만, 일본의 성씨는 약 30만 개에 이를 정도로 전 세계적으로도 그 종류가 매우 많습니다."},
        {"chapter": 3, "page": 38, "question": "일본에서는 결혼을 하면 부부가 각자의 원래 성씨를 유지하는 부부 별성 제도가 원칙이다.", "options": ["O", "X"], "answerIndex": 1, "explanation": "일본에서는 결혼하면 남편이나 아내의 성씨 중 하나를 따르는 '부부 동성'이 원칙이며, 대개 아내가 남편의 성씨를 따릅니다."},
        {"chapter": 4, "page": 47, "question": "일본의 행정 구역은 1개의 도와 46개의 현으로 이루어져 있어 '47도현'이라고 부른다.", "options": ["O", "X"], "answerIndex": 1, "explanation": "일본의 행정 구역은 1도(도쿄도), 1도(홋카이도), 2부(오사카부, 교토부), 43현으로 나뉘어 총 '47도도부현(都道府県)'이라고 부릅니다."},
        {"chapter": 4, "page": 49, "question": "간토(関東) 지역에 있는 센소지(浅草寺)는 도쿄에서 가장 잘 알려진 절로, 주변에 기념품 가게와 길거리 음식점이 많다.", "options": ["O", "X"], "answerIndex": 0, "explanation": "도쿄의 아사쿠사에 있는 센소지는 대표적인 관광 명소로 늘 관광객으로 붐비는 곳입니다."},
        {"chapter": 4, "page": 49, "question": "긴키(近畿) 지역에 속하는 오사카는 약 천 년 동안 일본의 수도였으며, 세계에서 가장 오래된 목조 건축물인 호류지가 있다.", "options": ["O", "X"], "answerIndex": 1, "explanation": "약 천 년 동안 일본의 수도였던 곳은 '교토'이며, 세계에서 가장 오래된 목조 건축물인 호류지가 있는 곳은 '나라'입니다. 오사카는 제2의 도시로 다코야키 등으로 유명합니다."},
        {"chapter": 4, "page": 51, "question": "오키나와는 1879년 일본에 편입되기 전까지 '류큐 왕국'이라는 독립적인 왕국이었기 때문에 일본 본토와 다른 독자적인 문화를 가지고 있다.", "options": ["O", "X"], "answerIndex": 0, "explanation": "오키나와는 과거 류큐 왕국 시대의 역사를 가지고 있어 문화와 음식(고야찬푸루 등)이 일본 본토와 다릅니다."},
        {"chapter": 4, "page": 52, "question": "일본의 대표적인 겨울 축제인 홋카이도 삿포로의 '유키마쓰리(눈 축제)'는 신을 모시는 고대 종교 의식에서 기원한 것이다.", "options": ["O", "X"], "answerIndex": 1, "explanation": "유키마쓰리는 1950년 초 중고등학생들이 얼음으로 작품을 만든 데서 시작된 '현대에 새롭게 만들어진' 축제입니다."},
        {"chapter": 5, "page": 57, "question": "3월 3일 히나마쓰리(ひなまつり)는 여자아이가 건강하고 행복하게 성장하기를 기원하며 투구와 갑옷을 장식하는 날이다.", "options": ["O", "X"], "answerIndex": 1, "explanation": "히나마쓰리에는 '히나 인형'을 장식합니다. 투구와 갑옷(5월 인형)을 장식하는 날은 남자아이의 성장을 기원하는 5월 5일 단오절입니다."},
        {"chapter": 5, "page": 58, "question": "일본의 단풍놀이인 '모미지가리(紅葉狩り)'의 '가리(狩り)'는 원래 '동물 사냥'이라는 뜻이었으나 자연을 감상하거나 과일을 채취할 때도 쓰이게 되었다.", "options": ["O", "X"], "answerIndex": 0, "explanation": "맞습니다. '가리(がり)'는 원래 동물 사냥을 뜻했지만, 모미지가리, 링고가리(사과 따기) 등 채취나 감상의 의미로 확장되었습니다."},
        {"chapter": 5, "page": 59, "question": "일본에서는 12월 마지막 날(오미소카)에 건강과 장수를 기원하는 의미로 우동을 먹는다.", "options": ["O", "X"], "answerIndex": 1, "explanation": "일본에서는 한 해의 마지막 날 가늘고 긴 '메밀국수(해넘이국수)'를 먹으며 장수를 기원합니다."},
        {"chapter": 5, "page": 59, "question": "일본의 설날 음식인 '오세치(おせち) 요리'는 연휴 동안 일손을 덜기 위해 찬합에 담아 상온에 두어도 잘 상하지 않는 조림 요리가 많다.", "options": ["O", "X"], "answerIndex": 0, "explanation": "오세치 요리는 설 연휴 동안 다 함께 먹기 위해 미리 준비하여 찬합에 담는 보존성이 높은 음식들로 구성됩니다."},
        {"chapter": 5, "page": 60, "question": "성인의 날에 미혼 여성은 예복으로 남성용 기모노 하의인 '하카마(はかま)'를 입고 성인식 행사에 참석한다.", "options": ["O", "X"], "answerIndex": 1, "explanation": "미혼 여성은 성인식에 소맷자락이 긴 기모노인 '후리소데(ふりそで)'를 입습니다. 하카마는 남성의 예복입니다."},
        {"chapter": 6, "page": 65, "question": "오마모리(부적) 주머니의 입구를 끈으로 묶어두는 이유는 신에게 받은 좋은 기운이 밖으로 도망가지 않게 하기 위해서이다.", "options": ["O", "X"], "answerIndex": 0, "explanation": "오마모리 주머니를 끈으로 묶는 형태는 신의 기운이 빠져나가지 못하게 하려는 믿음에서 유래했습니다."},
        {"chapter": 6, "page": 66, "question": "에마(絵馬)는 소원을 적은 후 오마모리와 마찬가지로 항상 몸에 지니고 다니는 것이 일반적이다.", "options": ["O", "X"], "answerIndex": 1, "explanation": "에마는 오마모리와 달리 몸에 지니거나 집으로 가져가지 않고, 신사나 절에 마련된 전용 공간에 걸어 둡니다."},
        {"chapter": 6, "page": 67, "question": "신사나 절에서 뽑은 운세 뽑기 종이인 오미쿠지(おみくじ)는 집에 가져가도 되지만, 흉이 나왔을 경우에는 보통 지정된 장소에 묶어 둔다.", "options": ["O", "X"], "answerIndex": 0, "explanation": "오미쿠지는 집에 가져가서 교훈으로 삼아도 되지만, '흉'이 나왔을 경우 나쁜 운을 떨쳐내고자 신사에 묶어 두고 오는 경우가 많습니다."},
        {"chapter": 6, "page": 68, "question": "마네키네코 중에서 '오른쪽 앞발'을 든 고양이는 손님을 불러오고, '왼쪽 앞발'을 든 고양이는 금전운을 불러온다고 알려져 있다.", "options": ["O", "X"], "answerIndex": 1, "explanation": "반대입니다. 오른쪽 앞발은 금전운(돈)을 부르고, 왼쪽 앞발은 손님을 부른다고 하여 식당이나 상점에는 왼쪽 앞발을 든 고양이를 많이 둡니다."},
        {"chapter": 6, "page": 69, "question": "시중에서 파는 달마(다루마) 인형은 눈이 그려져 있지 않은데, 소원을 빌 때 오른쪽 눈을 먼저 칠하고 소원이 이루어지면 왼쪽 눈을 칠한다.", "options": ["O", "X"], "answerIndex": 1, "explanation": "반대입니다. 소원을 빌 때 '왼쪽 눈'을 칠하고, 소원이 이루어지면 감사의 의미로 '오른쪽 눈'을 칠합니다."},
        {"chapter": 7, "page": 73, "question": "일본의 고전 연극인 가부키(歌舞伎)는 원래 남성이 주축이었으나, 현재는 여성과 남성이 함께 공연하는 종합 예술로 발전하였다.", "options": ["O", "X"], "answerIndex": 1, "explanation": "반대입니다. 가부키는 원래 여성이 주축이 되어 시작되었으나, 현재는 성인 남성 배우로만 구성되어 모든 역할을 연기합니다."},
        {"chapter": 7, "page": 74, "question": "일본 다도를 완성한 센노 리큐는 다도에 임하는 마음으로 '일생에 단 한 번뿐인 만남'이라는 뜻의 이치고이치에(一期一会)를 강조했다.", "options": ["O", "X"], "answerIndex": 0, "explanation": "센노 리큐는 다도를 할 때 손님과의 만남을 평생 단 한 번뿐인 소중한 인연으로 여기고 성심성의껏 대접하라는 이치고이치에를 강조했습니다."},
        {"chapter": 7, "page": 75, "question": "일본의 서도(書道)는 글자를 아름답게 쓰는 예술일 뿐만 아니라, 어릴 때부터 자신을 표현하고 정신을 수양하는 도구로 여겨진다.", "options": ["O", "X"], "answerIndex": 0, "explanation": "서도는 자기표현이자 정신 수양의 행위로, 일본 초등 교육 과정에도 '습자'라는 과목으로 붓글씨 연습이 포함되어 있습니다."},
        {"chapter": 7, "page": 76, "question": "새해에 가족들과 즐기는 전통 카드놀이인 '가루타'는 포르투갈어로 '편지'를 뜻하는 단어에서 유래했다.", "options": ["O", "X"], "answerIndex": 1, "explanation": "가루타는 포르투갈어로 '편지'가 아니라 '카드'를 뜻하는 단어에서 유래했습니다."},
        {"chapter": 7, "page": 77, "question": "배드민턴처럼 나무 라켓으로 깃털 달린 공을 치는 '하네쓰키' 놀이에서 지면, 얼굴에 먹물로 낙서를 하는 벌칙이 있다.", "options": ["O", "X"], "answerIndex": 0, "explanation": "하네쓰키는 주로 여자아이들이 새해에 즐기는 놀이로, 먹물 낙서에는 나쁜 기운을 물리친다는 주술적 의미가 담겨 있습니다."},
        {"chapter": 8, "page": 81, "question": "일본의 전통 음식 문화인 '와쇼쿠(和食)'는 2013년 우리나라의 김치·김장 문화와 함께 유네스코 무형 문화유산으로 등록되었다.", "options": ["O", "X"], "answerIndex": 0, "explanation": "와쇼쿠는 가정식을 포함한 일본의 식문화 전반을 일컫는 말로, 2013년에 유네스코 무형 문화유산으로 등재되었습니다."},
        {"chapter": 8, "page": 82, "question": "일본식 덮밥인 '돈부리(どんぶり)'를 먹을 때는 우리나라의 비빔밥처럼 밥과 토핑을 골고루 섞어 먹는 것이 올바른 예절이다.", "options": ["O", "X"], "answerIndex": 1, "explanation": "일본에서는 덮밥을 먹을 때 밥과 반찬을 섞지 않고 젓가락을 사용하여 그대로 떠서 먹습니다."},
        {"chapter": 8, "page": 83, "question": "일본의 라면 중 '쇼유라면'은 소금으로 간을 한 담백한 라면이고, '시오라면'은 간장으로 간을 한 라면이다.", "options": ["O", "X"], "answerIndex": 1, "explanation": "반대입니다. '시오'가 소금이고, '쇼유'가 간장입니다. 시오라면이 소금라면, 쇼유라면이 간장라면입니다."},
        {"chapter": 8, "page": 85, "question": "철판구이 요리 중 '오코노미야키'는 양배추 등 자신이 좋아하는 재료를 마음대로 넣어서 굽는다는 뜻에서 유래된 이름이다.", "options": ["O", "X"], "answerIndex": 0, "explanation": "'오코노미'는 '좋아함/취향'이라는 뜻이고 '야키'는 '구이'라는 뜻으로, 좋아하는 재료를 넣어 굽는 음식입니다."},
        {"chapter": 8, "page": 86, "question": "일본 전통 과자(와가시)는 팥소가 들어 단맛이 강하므로 보통 우유나 커피와 함께 먹는 것이 일반적이다.", "options": ["O", "X"], "answerIndex": 1, "explanation": "단맛이 강한 일본 전통 과자는 쌉싸름한 가루 녹차인 '말차'를 곁들여 먹는 것이 일반적입니다."},
        {"chapter": 9, "page": 91, "question": "일본에서 '만숀(マンション)'이라고 부르는 아파트는 주로 우리나라처럼 아주 거대한 대단지 아파트를 의미한다.", "options": ["O", "X"], "answerIndex": 1, "explanation": "일본의 만숀(아파트)은 3층 이상의 공동 주택이지만 우리나라처럼 동 수가 많은 대단지보다는 한 동이거나 소규모 단지인 경우가 많습니다."},
        {"chapter": 9, "page": 93, "question": "일본의 주택 구조를 설명하는 용어인 'LDK'에서 K는 차고(차량 주차 공간)를 의미한다.", "options": ["O", "X"], "answerIndex": 1, "explanation": "LDK에서 L은 거실(Living room), D는 식사 공간(Dining room), K는 부엌(Kitchen)을 의미합니다."},
        {"chapter": 9, "page": 92, "question": "일본은 태풍이 잦아 강한 비바람에 의한 피해를 줄이고 겨울철 보온 효과를 얻기 위해 창문에 나무나 금속으로 '이중창(아마도)'을 만든다.", "options": ["O", "X"], "answerIndex": 0, "explanation": "태풍과 비바람의 피해를 막고 보온 효과를 내기 위해 창문 밖에 이중창(아마도)을 덧대는 것이 일본 주택의 특징입니다."},
        {"chapter": 9, "page": 95, "question": "일본 전통 방(와시쓰)에 들어갈 때는 실내화를 신고 다다미의 경계선을 밟으며 걷는 것이 올바른 예절이다.", "options": ["O", "X"], "answerIndex": 1, "explanation": "방에 들어갈 때는 반드시 실내화를 벗어야 하며 문턱이나 다다미의 경계선, 방석을 밟지 않도록 주의해야 합니다."},
        {"chapter": 9, "page": 94, "question": "일본 전통 방에서 족자를 걸거나 꽃 등을 장식하기 위해 바닥을 한 층 높게 만들어 둔 특별한 공간을 '도코노마'라고 한다.", "options": ["O", "X"], "answerIndex": 0, "explanation": "도코노마(とこのま)는 옛날에는 신을 모시는 장소였고, 지금은 족자나 꽃, 도자기 등을 장식하는 곳입니다."},
        {"chapter": 10, "page": 101, "question": "일본에서 자전거를 구입하면 도난 사고를 예방하고 무단 방치를 단속하기 위해 반드시 '자전거 방범 등록'을 해야 한다.", "options": ["O", "X"], "answerIndex": 0, "explanation": "일본에서는 자전거 구매 시 방범 등록을 하고 스티커를 붙이는 것이 의무이며, 지정된 곳에만 주차해야 합니다."},
        {"chapter": 10, "page": 102, "question": "일본에서는 자동차를 구매할 때 '주차장 확보 증명서(차고지 증명서)'가 필요하며, 크기가 작은 경차의 경우에도 전국 어디서나 예외 없이 필수이다.", "options": ["O", "X"], "answerIndex": 1, "explanation": "자동차 구매 시 주차장 확보 증명서가 필요하지만, 배기량 660cc 이하의 경차는 예외 적용을 받는 지역도 있습니다."},
        {"chapter": 10, "page": 103, "question": "일본의 일반 노선버스는 대개 승객이 앞문으로 탑승하고 요금을 낸 뒤, 뒷문으로 내리는 방식이 전국적으로 동일하다.", "options": ["O", "X"], "answerIndex": 1, "explanation": "일본의 버스는 지역마다 타는 방식이 다릅니다. 대개 뒷문으로 타고 앞문으로 내리지만, 도쿄 등 앞문으로 타는 버스도 있습니다."},
        {"chapter": 10, "page": 104, "question": "일본의 전철 중 급행열차와 특급 열차를 탈 때는 반드시 일반 승차권 외에 별도의 '특급 승차권'을 함께 구입해야 한다.", "options": ["O", "X"], "answerIndex": 1, "explanation": "급행열차는 일반 승차권으로 이용할 수 있지만, 특급 열차를 이용하려면 특급 승차권을 별도로 구입해야 합니다."},
        {"chapter": 10, "page": 106, "question": "일본에서 버스나 전철 등 대중교통을 환승할 때 교통 카드(IC카드)를 사용하면 우리나라처럼 환승 할인 요금이 적용된다.", "options": ["O", "X"], "answerIndex": 1, "explanation": "우리나라와 달리 일본에서는 대중교통 환승 시 환승 할인 요금이 적용되지 않습니다."},
        {"chapter": 11, "page": 91, "question": "우리나라는 3월에 새 학기가 시작되지만, 일본의 학교는 3월에 졸업식을 하고 보통 4월에 새 학기(입학식)가 시작된다.", "options": ["O", "X"], "answerIndex": 0, "explanation": "일본의 학교는 보통 4월에 입학식과 개학식을 하며, 1년 과정은 대개 3학기제로 운영됩니다."},
        {"chapter": 11, "page": 92, "question": "일본 고등학교의 동아리 활동(부활동)은 필수이므로, 수업이 끝난 후 동아리 활동을 하지 않고 곧바로 하교하는 학생은 없다.", "options": ["O", "X"], "answerIndex": 1, "explanation": "동아리는 방과 후 자율적으로 이루어지며, 동아리 활동을 하지 않고 바로 집에 가는 이른바 '귀가부(帰宅部)' 학생들도 있습니다."},
        {"chapter": 11, "page": 93, "question": "일본 고등학교 체육 대회에서는 단결력을 키우는 종목을 주로 겨루며, 팀을 나눌 때는 우리나라와 마찬가지로 청팀과 백팀으로 나눈다.", "options": ["O", "X"], "answerIndex": 1, "explanation": "우리나라는 보통 청팀과 백팀으로 나누지만, 일본은 '홍팀과 백팀(홍백전)'으로 팀을 나눕니다."},
        {"chapter": 11, "page": 94, "question": "일본에서 국공립 대학교를 지원할 경우에는 1차 시험으로 반드시 '대학입학공통시험'을 응시해야 한다.", "options": ["O", "X"], "answerIndex": 0, "explanation": "국공립 대학교 지원 시 1차로 대학입학공통시험 응시가 필수입니다. 사립 대학은 학교마다 다르지만 점수가 필요한 곳도 있습니다."},
        {"chapter": 11, "page": 96, "question": "일본의 의무 교육 과정은 소학교부터 고등학교까지 총 12년이다.", "options": ["O", "X"], "answerIndex": 1, "explanation": "일본의 의무 교육 과정은 소학교(6년)부터 중학교(3년)까지 총 9년입니다."},
        {"chapter": 12, "page": 101, "question": "일본 만화(만가)는 우리나라와 마찬가지로 왼쪽에서 오른쪽으로 읽으며 가로로 줄을 바꾼다.", "options": ["O", "X"], "answerIndex": 1, "explanation": "일본 만화는 우리나라와 달리 오른쪽에서 왼쪽으로 읽으며, 대사가 세로로 쓰여 있어 오른쪽에서 왼쪽으로 줄을 바꿉니다."},
        {"chapter": 12, "page": 103, "question": "일본 고유의 짧은 시인 '하이쿠(俳句)'는 5·7·5의 3구 17음절로 이루어져 있으며, 반드시 계절을 나타내는 단어가 들어가야 한다.", "options": ["O", "X"], "answerIndex": 0, "explanation": "하이쿠는 5·7·5의 17음절로 이루어지며, 계절감을 느낄 수 있는 단어(계어)를 꼭 넣어야 하는 규칙이 있습니다."},
        {"chapter": 12, "page": 104, "question": "일본의 전통 건축물은 지진과 고온 다습한 기후 때문에 습기 조절이 가능한 나무를 못 없이 짜 맞추어 짓는 공법이 발달했다.", "options": ["O", "X"], "answerIndex": 0, "explanation": "일본은 잦은 지진과 고온 다습한 기후를 견디기 위해 유연하고 습기 조절이 잘 되는 목조 공법(못 없이 나무를 짜 맞추는 방식)이 발달했습니다."},
        {"chapter": 12, "page": 105, "question": "일본의 전통 스포츠인 스모(相撲)에서 가장 높은 최고 등급 선수(천하장사)를 '고시엔'이라고 부른다.", "options": ["O", "X"], "answerIndex": 1, "explanation": "스모의 최고 등급 선수는 '요코즈나(横綱)'입니다. '고시엔(甲子園)'은 일본 전국 고등학교 야구 대회의 별칭이자 야구장 이름입니다."},
        {"chapter": 12, "page": 105, "question": "일본 전국 고등학교 야구 대회인 '고시엔(甲子園)'에서 시합에 진 팀의 선수들이 아쉬운 마음에 고시엔 구장의 흙을 퍼 담아가는 것은 하나의 전통이다.", "options": ["O", "X"], "answerIndex": 0, "explanation": "매년 8월 열리는 고시엔 야구 대회에서 패배한 팀의 선수들이 구장의 흙을 주머니에 퍼 담아가는 광경은 일본의 유명한 야구 전통입니다."}
    ];

    const goldenKeyQuizList = [
        {
            chapter: 1,
            page: 15,
            question: "일본어에서 '감사합니다'를 뜻하는 올바른 표현은 무엇일까요?",
            options: ["오하요고자이마스", "아리가토고자이마스", "스미마센", "고멘나사이", "사요나라"],
            answerIndex: 1, 
            explanation: "아침 인사는 '오하요고자이마스', 감사는 '아리가토고자이마스'입니다."
        },
        {
            chapter: 2,
            page: 28,
            question: "일본의 전통 의상인 '기모노'를 입을 때 주로 신는 신발의 이름은?",
            options: ["게타", "조리", "스니커즈", "구두", "부츠"],
            answerIndex: 0,
            explanation: "기모노나 유카타를 입을 때는 주로 나무로 만든 굽이 있는 '게타'를 신습니다."
        },
        {"chapter": 1, "page": 11, "question": "다음 중 일본어 한자에 대한 설명으로 옳지 않은 것은 무엇일까요?", "options": ["상용한자는 총 2,136자이다.", "우리나라와 똑같은 복잡한 한자 정자를 사용한다.", "읽는 방법에는 음독과 훈독이 있다.", "하나의 한자가 두 개 이상의 음으로 읽히기도 한다.", "한자는 일정한 뜻을 나타내는 표의 문자이다."], "answerIndex": 1, "explanation": "일본어에서는 한자 정자를 쓰는 우리나라와 달리 획수를 줄인 '신자체' 한자를 주로 사용합니다."},
        {"chapter": 1, "page": 13, "question": "다음 중 일본어 문장 부호와 그 쓰임이 올바르게 짝지어진 것은 무엇일까요?", "options": ["。(마침표) - 어휘를 열거할 때", "、(쉼표) - 문장이 끝났을 때", "「 」(낫표) - 회화문이나 인용문을 쓸 때", "『 』(겹낫표) - 물음표나 느낌표를 대신할 때", "? (물음표) - 도서명을 쓸 때"], "answerIndex": 2, "explanation": "회화문이나 인용문에는 낫표(「 」)를 쓰고, 도서명에는 겹낫표(『 』)를 사용합니다."},
        {"chapter": 1, "page": 12, "question": "다음 중 일본어 어휘의 종류(고유어, 한자어, 외래어, 혼종어)에 포함되지 않는 것은?", "options": ["고유어", "한자어", "외래어", "혼종어", "동음이의어"], "answerIndex": 4, "explanation": "일본어 어휘는 크게 고유어, 한자어, 외래어, 혼종어로 나뉩니다. 동음이의어는 어휘의 한 종류가 아니라 발음이 같고 뜻이 다른 단어를 뜻합니다."},
        {"chapter": 2, "page": 24, "question": "일본의 선물 문화에 대한 설명으로 가장 알맞은 단어는 무엇일까요?\n[여행지나 출장지에서 구입한 그 지역의 특산품을 가족이나 친구, 직장 동료 등에게 주는 선물]", "options": ["오카에시 (お返し)", "오지기 (おじぎ)", "오미야게 (お土産)", "푸레젠토 (プレゼント)", "우치 (内)"], "answerIndex": 2, "explanation": "지역 특산품이나 방문 시 준비하는 선물은 '오미야게'라고 합니다. 친한 사이에 주고받는 생일 선물 등은 '푸레젠토', 받은 선물에 대한 답례품은 '오카에시'라고 합니다."},
        {"chapter": 2, "page": 24, "question": "다음 중 일본인의 일상생활 제스처에 대한 설명으로 옳지 않은 것은 무엇일까요?", "options": ["인사할 때 머리를 숙이는 동작을 오지기(おじぎ)라고 한다.", "자신을 가리킬 때는 검지를 자기 코에 댄다.", "거절을 표시할 때는 얼굴 앞에서 손날을 세워 좌우로 흔든다.", "상대방을 부를 때는 손바닥을 위로 향한 채 손가락을 까딱거린다.", "숫자를 셀 때 6~10은 양손을 이용하여 셉니다."], "answerIndex": 3, "explanation": "일본에서 상대방을 부를 때는 우리나라와 마찬가지로 손바닥을 상대방에게 보인 채 손을 위아래로 움직입니다. 마네키네코의 앞발 동작이 여기서 유래했습니다."},
        {"chapter": 2, "page": 27, "question": "일본의 식사 예절 중 젓가락 사용 금기(해서는 안 되는 행동)와 그 뜻이 올바르게 짝지어지지 않은 것은 무엇일까요?", "options": ["하시와타시: 다른 사람과 젓가락으로 음식을 주고받는 행위", "사시바시: 젓가락으로 음식을 푹 찍어서 먹는 행위", "마요이바시: 어떤 반찬을 먹을지 젓가락을 들고 망설이는 행위", "다테바시: 식사 후 젓가락을 밥그릇 위에 가로로 얹어두는 행위", "요세바시: 젓가락으로 그릇을 끌어당겨서 먹는 행위"], "answerIndex": 3, "explanation": "다테바시(たてばし)는 젓가락을 밥에 수직으로 꽂는 행위로 금기시됩니다. 밥그릇 위에 젓가락을 얹어두는 것은 '와타시바시'라고 합니다."},
        {"chapter": 3, "page": 37, "question": "다음 중 뜻이 같은 한국어와 일본어의 속담/관용구가 올바르게 짝지어지지 않은 것은 무엇일까요?", "options": ["원숭이도 나무에서 떨어진다 - さるも 木から 落ちる", "손을 씻다 (나쁜 일을 그만두다) - 足を 洗う (발을 씻다)", "티끌 모아 태산 - ちりも つもれば 山と なる", "뱃속이 검다 - はらが 黒い", "머리가 잘 돌아가다 - ねこの 手も 借りたい"], "answerIndex": 4, "explanation": "'ねこの 手も 借りたい(고양이 손이라도 빌리고 싶다)'는 너무 바쁘다는 뜻의 속담입니다. '머리가 잘 돌아가다'는 '頭が よく まわる'입니다."},
        {"chapter": 3, "page": 38, "question": "일본인의 호칭 문화에 대한 설명으로 가장 알맞은 것은 무엇일까요?", "options": ["학교에서 친하지 않은 동급생을 부를 때는 성씨 없이 이름만 부른다.", "성씨의 종류가 적어 구별을 위해 성씨보다 이름을 부르는 경우가 많다.", "さん(상)은 공적인 자리나 손님을 응대할 때만 쓰는 아주 공손한 표현이다.", "일반적으로 상대방을 부를 때 성씨에 さん(상)을 붙여서 부른다.", "격식 있는 공적인 메일을 보낼 때는 이름 뒤에 ちゃん(짱)이나 くん(군)을 붙인다."], "answerIndex": 3, "explanation": "일본에서는 성씨 종류가 많아 이름보다 성씨를 부르는 경우가 많으며, 일반적으로 성씨 뒤에 さん을 붙입니다. 격식 있는 자리나 손님에게는 さま(사마)를 씁니다."},
        {"chapter": 3, "page": 34, "question": "다음 빈칸에 공통으로 들어갈 알맞은 단어는 무엇일까요?\n일본인은 ( A )과 ( B )을 구별해서 행동하는 성향이 있다. 직설적인 비판을 삼가고 ( A )을 드러내지 않은 채 ( B )으로만 소통하는 듯하지만, 이면에는 상대방을 존중하는 마음이 있다.", "options": ["A: 겉모습(建前) / B: 속마음(本音)", "A: 속마음(本音) / B: 겉모습(建前)", "A: 소토(外) / B: 우치(内)", "A: 우치(内) / B: 소토(外)", "A: 맞장구(あいづち) / B: 오지기(おじぎ)"], "answerIndex": 1, "explanation": "일본인은 속마음(혼네, 本音)을 드러내는 것을 자제하고 겉모습(다테마에, 建前)으로 대인 관계를 원만하게 유지하려는 성향이 있습니다."},
        {"chapter": 4, "page": 46, "question": "다음 중 일본의 기후와 지형에 대한 설명으로 옳은 것은 무엇일까요?", "options": ["동서로 길게 뻗어 있어 동서 간의 기후 차이가 크다.", "활화산은 모두 소멸하였고, 지진 활동의 영향으로만 온천이 발달했다.", "홋카이도는 냉대, 혼슈 등 본토는 온대, 남쪽 섬은 열대 기후에 속한다.", "일본 열도 주변을 '얼음의 고리'라고 부르며 자연재해가 매우 적다.", "5월부터 7월 사이에 눈이 많이 내려 교통이 마비되는 현상이 잦다."], "answerIndex": 2, "explanation": "일본은 북동에서 남서쪽으로 길게 뻗어 있어 북쪽(홋카이도)은 냉대 기후, 중간은 온대, 남쪽 섬들은 열대 기후를 보입니다."},
        {"chapter": 4, "page": 52, "question": "다음 중 일본을 대표하는 3대 전통 축제(마쓰리)와 개최 도시가 올바르게 짝지어진 것은 무엇일까요?", "options": ["간다마쓰리 - 도쿄", "기온마쓰리 - 아오모리", "덴진마쓰리 - 삿포로", "네부타마쓰리 - 교토", "유키마쓰리 - 오사카"], "answerIndex": 0, "explanation": "일본의 3대 전통 축제는 도쿄의 간다마쓰리, 교토의 기온마쓰리, 오사카의 덴진마쓰리입니다."},
        {"chapter": 4, "page": 48, "question": "다음 중 지역과 그 지역의 유명한 특산물(또는 명소)이 올바르게 짝지어지지 않은 것은 무엇일까요?", "options": ["홋카이도 - 털게, 삿포로 라면, 유제품", "야마가타 - 체리, 요네자와 소고기", "니가타 - 쌀, 일본 전통주", "가가와(시코쿠) - 카스텔라, 짬뽕", "시즈오카 - 차(茶), 후지산"], "answerIndex": 3, "explanation": "가가와는 '사누키우동'의 본고장으로 유명합니다. 카스텔라와 짬뽕이 유명하고 네덜란드풍의 하우스텐보스가 있는 곳은 규슈의 '나가사키'입니다."},
        {"chapter": 5, "page": 58, "question": "다음 중 조상을 기리는 명절로, 사람들이 고향을 방문하고 수많은 불빛과 함께 '본오도리'라는 전통 춤을 추는 일본의 연중행사는 무엇일까요?", "options": ["다나바타(칠석)", "오본(お盆)", "세쓰분(節分)", "시치고산(七五三)", "히나마쓰리"], "answerIndex": 1, "explanation": "8월 15일 전후인 '오본'은 우리나라의 명절처럼 많은 사람이 고향을 방문해 조상을 기리고, 본오도리 춤을 추는 행사입니다."},
        {"chapter": 5, "page": 59, "question": "다음 중 새해를 맞아 일본 각 가정에서 하는 장식과 그 의미가 올바르게 연결되지 않은 것은 무엇일까요?", "options": ["시메나와 - 나쁜 기운의 침입을 막기 위해 현관에 장식한다.", "가도마쓰 - 대나무와 소나무로 만들어 장수와 행운을 빈다.", "가가미모치 - 둥근 떡을 2단으로 쌓고 귤을 얹어 신에게 공양한다.", "고이노보리 - 새해 첫날 좋은 꿈(매, 가지 등)을 꾸기 위해 침실에 장식한다.", "가도마쓰와 시메나와 - 설날이 지나면 신사나 절에 가져가서 태운다."], "answerIndex": 3, "explanation": "고이노보리(잉어 모양 깃발)는 새해가 아니라 5월 5일 단오절에 남자아이의 출세와 성장을 기원하며 밖(지붕 등)에 다는 장식입니다."},
        {"chapter": 5, "page": 60, "question": "다음 중 입춘 전날인 2월 3일경 '도깨비는 밖으로! 복은 안으로!'라고 외치며 콩을 던지는 일본의 행사 이름은 무엇일까요?", "options": ["단오절", "세쓰분(節分)", "달맞이(月見)", "시치고산(七五三)", "오미소카(大晦日)"], "answerIndex": 1, "explanation": "계절이 바뀔 때 생기기 쉬운 나쁜 기운을 막기 위해 콩을 던지고 나이만큼 볶은 콩을 먹는 행사를 '세쓰분(절분)'이라고 합니다."},
        {"chapter": 6, "page": 66, "question": "다음 중 신사나 절에서 소원을 빌거나 이루어졌을 때 바치는 '에마(絵馬)'에 대한 설명으로 올바른 것은 무엇일까요?", "options": ["모든 에마에는 반드시 고양이 그림이 그려져 있어야 한다.", "옛 풍습의 영향으로 오각형 형태가 많으며, 보통 나무판 뒤에 소원을 적는다.", "소원이 이루어지기 전까지는 부적(오마모리)처럼 지갑에 넣고 다닌다.", "바빠서 신사에 방문하지 못하는 사람들을 위해 이메일로 제출할 수 있다.", "제물로 바치던 살아 있는 소 대신 소 그림을 그린 것에서 유래했다."], "answerIndex": 1, "explanation": "에마는 옛날 지붕을 달던 풍습 때문에 오각형이 일반적이며, 과거 제물로 바치던 '말'을 그림으로 대신한 나무판입니다."},
        {"chapter": 6, "page": 68, "question": "마네키네코(고양이 장식품)의 색깔에 따른 의미가 올바르게 짝지어진 것은 무엇일까요?", "options": ["하얀색 - 무병장수", "빨간색 - 금전운", "검은색 - 나쁜 기운 막기(액막이)", "노란색 - 시험 합격", "파란색 - 연애 성공"], "answerIndex": 2, "explanation": "마네키네코는 하얀색(행운과 복), 검은색(나쁜 기운을 막음), 빨간색(무병장수)의 의미를 가집니다."},
        {"chapter": 6, "page": 69, "question": "비가 그치고 날씨가 개기를 바라며 하얀색 천이나 종이 안에 동그란 것을 넣어 묶은 후 창문 등에 매달아 놓는 인형의 이름은 무엇일까요?", "options": ["에마", "다루마", "데루테루보즈", "마네키네코", "오미쿠지"], "answerIndex": 2, "explanation": "소풍이나 운동회를 앞두고 맑은 날씨를 기원하며 매달아 두는 인형은 '데루테루보즈'입니다. (반대로 비가 오기를 바랄 때는 거꾸로 매답니다.)"},
        {"chapter": 7, "page": 73, "question": "일본의 고전 연극 가부키에 대한 설명으로 올바른 것은 무엇일까요?", "options": ["모든 등장인물은 분장을 하지 않고 맨얼굴로 연기한다.", "대체로 권선징악보다는 남녀 간의 비극적 사랑을 주로 다룬다.", "가부키좌와 같은 전용 극장이 없어서 야외에서만 정기 공연을 한다.", "노, 분라쿠와 함께 일본의 3대 고전 연극으로 꼽힌다.", "흰색 분 화장에 검은색 선을 그리면 보통 '선인(착한 사람)'을 상징한다."], "answerIndex": 3, "explanation": "가부키는 노, 분라쿠와 함께 3대 고전 연극이며, 흰 얼굴에 선을 그리는 '구마도리' 화장을 합니다. (붉은색 선이 선인, 푸른색 선이 악인을 의미합니다.)"},
        {"chapter": 7, "page": 77, "question": "가면의 윤곽만 그려진 종이 위에 '눈을 가린 채' 눈, 코, 입 조각을 올려놓아 가장 재미있거나 평범한 얼굴을 만드는 새해 전통 놀이는 무엇일까요?", "options": ["다루마오토시 (だるま落とし)", "후쿠와라이 (ふくわらい)", "다케우마 (竹馬)", "겐다마 (けん玉)", "가루타 (かるた)"], "answerIndex": 1, "explanation": "눈을 가리고 얼굴 조각을 맞춰 우스꽝스러운 얼굴을 만들어 사람들에게 웃음과 복을 주는 놀이는 '후쿠와라이'입니다."},
        {"chapter": 7, "page": 78, "question": "우리가 흔히 '가장 자신 있고 잘하는 것'을 뜻할 때 쓰는 '십팔번(十八番)'이라는 말의 유래로 가장 올바른 것은 무엇일까요?", "options": ["18번 숫자가 적힌 가루타 카드를 뽑은 사람이 승리하는 룰에서 유래했다.", "옛날 가부키 배우가 자신이 가장 잘하는 대본 18개를 상자에 넣어 다닌 것에서 유래했다.", "일본 다도에서 차를 18번 저어서 거품을 내는 것이 가장 맛있는 것에서 유래했다.", "다루마 인형을 18번 만에 쓰러뜨리지 않고 나무 조각을 빼내는 기술에서 유래했다.", "가부키 극장의 가장 명당자리 번호가 18번인 것에서 유래했다."], "answerIndex": 1, "explanation": "십팔번(おはこ)은 유명한 가부키 배우가 자신이 가장 잘하는 대본 열여덟 개를 상자(箱, 하코)에 넣어 가지고 다닌 것에서 유래했습니다."},
        {"chapter": 8, "page": 81, "question": "다음 중 일본 요리에 불을 사용하는 음식보다 생선회(날것)나 절임 음식이 많이 발달하게 된 배경으로 알맞지 않은 것은 무엇일까요?", "options": ["제철에 수확한 재료의 신선함을 살리기 위해", "과거 1871년까지 불교의 영향으로 육식 금지령이 있었기 때문에", "나무로 만든 목조 주택이 많아 불 사용을 조심했기 때문에", "날씨가 건조하고 추운 기후라 불을 피우기 어려웠기 때문에", "고온 다습한 기후 때문에 음식이 상하는 것을 막으려고 진하게 간을 하거나 절였기 때문에"], "answerIndex": 3, "explanation": "일본은 춥고 건조한 것이 아니라 '고온 다습'한 기후 특성을 가집니다. 때문에 음식이 쉽게 상하는 것을 막고자 소금, 식초로 간을 한 절임 음식이 발달했습니다."},
        {"chapter": 8, "page": 84, "question": "일본의 튀김 요리와 그에 대한 설명이 올바르게 짝지어진 것은 무엇일까요?", "options": ["가라아게 - 밀가루와 달걀물을 입힌 후 빵가루를 묻혀 튀긴 요리", "덴푸라 - 야채나 어패류 등에 밀가루와 달걀물을 튀김옷으로 사용하여 튀긴 요리", "가쓰 - 밀가루나 전분을 아주 얇게 묻혀 튀긴 닭고기 튀김 요리", "크로켓 - 돼지 등뼈를 오랜 시간 고아서 만든 튀김 요리", "가라아게 - 큰 냄비에 육수를 끓이며 식탁에서 바로 건져 먹는 전골 요리"], "answerIndex": 1, "explanation": "밀가루/전분을 얇게 묻혀 튀기는 것은 '가라아게', 빵가루를 묻혀 바삭하게 튀기는 것은 '가쓰(돈가스 등)', 으깬 감자에 빵가루를 묻힌 것은 '크로켓'입니다."},
        {"chapter": 8, "page": 87, "question": "일본 전국 철도역에서 판매하며, 기차 여행을 하며 각 지역의 특색 있는 먹거리를 맛볼 수 있도록 만들어진 도시락을 부르는 말은 무엇일까요?", "options": ["에키벤", "캐라벤(캐릭터 도시락)", "오세치", "가이세키", "쇼진 요리"], "answerIndex": 0, "explanation": "역(에키)에서 파는 도시락(벤토)이라는 뜻으로 '에키벤(駅弁)'이라고 부릅니다."},
        {"chapter": 9, "page": 92, "question": "일본 주택에서 화장실과 욕실(목욕 공간)을 분리해 두는 가장 주된 이유로 알맞은 것은 무엇일까요?", "options": ["욕조가 커서 화장실과 함께 둘 공간이 부족하기 때문에", "고온 다습한 기후로 인해 한 공간에 두면 습기로 곰팡이가 쉽게 생기기 때문에", "욕실에 항상 온열 장치인 고타쓰를 설치해야 하기 때문에", "지진 발생 시 신속하게 대피하기 위한 안전 확보를 위해", "나무로 만든 다다미가 물에 젖어 썩는 것을 방지하기 위해"], "answerIndex": 1, "explanation": "고온 다습한 일본 기후 특성상 화장실과 욕실이 함께 있으면 습기로 곰팡이가 생기기 쉬워 대개 분리하여 건축합니다."},
        {"chapter": 9, "page": 94, "question": "다음 중 일본 전통 방(와시쓰)의 창문과 출입문 역할을 하며, 얇은 종이를 발라 부드러운 빛이 방 전체에 퍼지게 하는 미닫이문은 무엇일까요?", "options": ["다다미", "고타쓰", "후스마", "쇼지", "도코노마"], "answerIndex": 3, "explanation": "얇은 종이를 발라 빛이 들어오게 하는 미닫이문은 쇼지(しょうじ)입니다. (후스마는 두꺼운 종이를 발라 빛이 들어오지 않는 미닫이문입니다.)"},
        {"chapter": 9, "page": 95, "question": "다음 중 습기를 조절하고 탈취 효과가 있는 일본 전통 바닥재이며, 일본에서 방의 크기를 잴 때(예: '6조 방') 그 단위로도 쓰이는 것은 무엇일까요?", "options": ["다다미", "고타쓰", "이중창(아마도)", "후스마", "쇼지"], "answerIndex": 0, "explanation": "다다미(たたみ)는 볏짚이나 골풀로 엮은 바닥재로, 방에 깔린 다다미의 장수로 방 크기를 나타냅니다."},
        {"chapter": 10, "page": 102, "question": "다음 중 일본의 자동차 및 택시 문화에 대한 설명으로 옳은 것은 무엇일까요?", "options": ["자동차 운전석은 우리나라와 동일하게 왼쪽에 있다.", "택시 탑승 시 승객이 직접 뒷문을 열고 닫아야 한다.", "면허 취득 후 3년 미만인 운전자는 초보 운전 마크를 의무적으로 붙여야 한다.", "도로가 좁아 배기량 1000cc 이하의 소형차가 경차로 분류된다.", "택시의 빈 차 표시등은 대개 앞유리 왼쪽 하단에 있다."], "answerIndex": 4, "explanation": "일본은 우핸들 좌측통행이며, 택시는 자동문이므로 승객이 문을 직접 열지 않습니다. 초보 운전 마크는 면허 취득 '1년' 미만 의무입니다."},
        {"chapter": 10, "page": 105, "question": "1964년 도쿄와 오사카 구간에 처음 개통되었으며, 현재 홋카이도부터 규슈까지 오가는 일본의 JR 고속 열차를 부르는 명칭은 무엇일까요?", "options": ["신칸센", "모노레일", "JR 패스", "지하철", "에키벤"], "answerIndex": 0, "explanation": "일본의 가장 대표적인 고속 열차는 '신칸센(新幹線)'입니다. (도카이도 신칸센 등 10개 노선 운행)"},
        {"chapter": 10, "page": 105, "question": "단기 관광이 목적인 외국인에게만 판매하는 승차권으로, 일정 기간 동안 일본 전역의 신칸센을 비롯한 JR 열차를 무제한 이용할 수 있는 패스는 무엇일까요?", "options": ["엔조이 에코 카드", "Suica(스이카)", "PASMO(파스모)", "JR 패스", "초록색 창구 티켓"], "answerIndex": 3, "explanation": "외국인 관광객을 위한 무제한 철도 패스는 'JR 패스'입니다. 스이카나 파스모는 일반적인 충전식 교통카드(IC카드)입니다."},
        {"chapter": 11, "page": 95, "question": "일본의 사교육 시설 중 하나로, 주로 대입을 목표로 하는 고등학교 3학년이나 재수생이 이용하며 자신이 원하는 강의를 선택해 수강하는 교육 시설은 무엇일까요?", "options": ["전문학교", "예비교", "단기 대학", "진학 학원", "보습 학원"], "answerIndex": 1, "explanation": "대학 입시 준비가 주된 목적인 교육 시설로 고3 학생이나 재수생이 다니는 곳을 '예비교'라고 합니다."},
        {"chapter": 11, "page": 93, "question": "일본의 학교 행사 중, 연극이나 전시회, 유령의 집, 길거리 음식(다코야키, 야키소바 등)을 파는 간이식당 등을 운영하며 학생들이 주도하는 행사는 무엇일까요?", "options": ["체육 대회(体育祭)", "동아리 합숙", "재난 대피 훈련", "종업식", "문화제(文化祭)"], "answerIndex": 4, "explanation": "문화의 날(11월 3일) 무렵에 자주 열리며 무대 공연, 전시, 간이식당 등을 운영하는 행사를 문화제라고 합니다."},
        {"chapter": 11, "page": 96, "question": "일본 교육 제도에 대한 설명으로 올바른 것은 무엇일까요?", "options": ["모든 고등학교는 예외 없이 반드시 입학시험을 통과해야 진학할 수 있다.", "약학, 수의학, 의학 등은 우리나라처럼 6년제 대학교 과정이다.", "고등학교 졸업 후 전문학교에 진학할 수 없다.", "고등전문학교는 소학교를 졸업한 후 진학하는 곳이다.", "단기 대학은 무조건 4년 과정으로만 운영된다."], "answerIndex": 1, "explanation": "대부분의 대학교는 4년제이지만, 의학/약학/수의학 등은 우리나라와 마찬가지로 6년제입니다. 고등전문학교는 중학교 졸업 후 진학하며, 단기 대학은 2~3년제입니다."},
        {"chapter": 12, "page": 102, "question": "헤이안 시대부터 시작된 일본의 전통 궁중 음악으로 가장 오래된 형태이며, 우리나라와 중국에서 전래되어 발전한 이 음악의 이름은 무엇일까요?", "options": ["J-POP", "가부키(歌舞伎)", "노(能)", "가가쿠(雅楽)", "엔카"], "answerIndex": 3, "explanation": "일본의 전통 궁중 음악의 가장 오래된 형태는 가가쿠(아악)입니다. 가부키나 노는 가가쿠 등의 전통 음악에 기반을 둔 음악극(공연)입니다."},
        {"chapter": 12, "page": 103, "question": "다음 중 일본 문학과 수상 작가에 대한 설명으로 올바른 것은 무엇일까요?", "options": ["무라카미 하루키와 히가시노 게이고는 일본의 역대 노벨 문학상 수상자이다.", "세계 최초의 장편 소설로 평가받는 작품은 『라쇼몬』이다.", "일본에서 가장 오래된 역사서는 『만엽집』이다.", "추리 소설에 수여하는 유명한 상은 '아쿠타가와 류노스케상'이다.", "뛰어난 순수 단편 소설에 수여하는 유명한 상은 '아쿠타가와 류노스케상'이다."], "answerIndex": 4, "explanation": "단편 순수 문학상은 아쿠타가와상, 추리 소설상은 에도가와 란포상입니다. 노벨 문학상 수상자는 가와바타 야스나리, 오에 겐자부로 두 명입니다."},
        {"chapter": 12, "page": 104, "question": "다음 중 프랑스의 에펠 탑 디자인의 영향을 받아 만들어진 일본 도쿄의 유명한 건축물은 무엇일까요?", "options": ["도쿄 스카이트리", "도쿄 타워", "신국립경기장", "국립 신미술관", "이쓰쿠시마 신사"], "answerIndex": 1, "explanation": "프랑스 에펠 탑의 영향을 받아 붉은색과 흰색 철골로 디자인된 건축물은 도쿄 타워입니다. 스카이트리는 이후에 세워진 전파 탑입니다."}
    ];

    const checkQuizEligibility = () => {
        const now = new Date();
        const dateStr = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;
        const isPM = now.getHours() >= 12;
        const timeSlot = isPM ? "PM" : "AM";
        
        // --- 배포 시 아래 4줄의 맨 앞 '//' 를 지워주세요 ---
        // const lastPlayed = localStorage.getItem(`quizPlayed_${dateStr}_${timeSlot}`);
        // if (lastPlayed) {
        //     alert("이미 오늘 " + (isPM ? "오후" : "오전") + " 퀴즈를 모두 푸셨습니다!\n(※ 하루 제한: 오전 1회 / 오후 1회)\n다음 시간대에 다시 도전해주세요.");
        //     return false;
        // }

        return { dateStr, timeSlot };
    };

    let currentOXIndex = 0;
    let correctOXCount = 0;

    const startOXQuiz = () => {
        if(playerName === "") {
            alert("이름을 먼저 입력해야 합니다!");
            loginModal.classList.remove("hidden");
            return;
        }

        const eligibility = checkQuizEligibility();
        if (!eligibility) return;

        shuffle(oxQuizList); 
        currentOXIndex = 0;
        correctOXCount = 0;
        
        localStorage.setItem(`quizPlayed_${eligibility.dateStr}_${eligibility.timeSlot}`, "true");
        renderNextOXQuiz();
    };

    const renderNextOXQuiz = () => {
        if (currentOXIndex >= 3) {
            quizModal.classList.add("hidden");
            
            // 🔥 오픈 기념 정착 지원금 로직
            const bonusKey = `settlementBonus_${playerName}`;
            const hasReceivedBonus = localStorage.getItem(bonusKey);
            let bonusMoney = 0;
            let bonusMsg = "";

            if (!hasReceivedBonus) {
                if (correctOXCount === 3) bonusMoney = 30000;
                else if (correctOXCount === 2) bonusMoney = 20000;
                else if (correctOXCount === 1) bonusMoney = 10000;
                
                if (bonusMoney > 0) {
                    bonusMsg = `\n\n🎁 [오픈 기념 특별 지원금]\n첫 퀴즈 보너스 ${bonusMoney.toLocaleString()}엔이 추가 지급되었습니다!`;
                } else {
                    bonusMsg = `\n\n😢 [오픈 기념 특별 지원금]\n0점이라 지원금을 받지 못했습니다...`;
                }
                localStorage.setItem(bonusKey, "true");
            }

            if (correctOXCount === 3) {
                diceCount = 2; currentMoney += 5000 + bonusMoney; 
                playerMoneySpan.innerText = `${currentMoney.toLocaleString()}엔`;
                alert(`🎉 완벽합니다! 3개 모두 정답!\n주사위 2개와 상금 5,000엔을 획득했습니다. 🎲🎲${bonusMsg}`);
            } else if (correctOXCount === 2) {
                diceCount = 2; currentMoney += 2000 + bonusMoney; 
                playerMoneySpan.innerText = `${currentMoney.toLocaleString()}엔`;
                alert(`👍 2개 정답!\n주사위 2개와 상금 2,000엔을 획득했습니다. 🎲🎲${bonusMsg}`);
            } else if (correctOXCount === 1) {
                diceCount = 1; currentMoney += 1000 + bonusMoney; 
                playerMoneySpan.innerText = `${currentMoney.toLocaleString()}엔`;
                alert(`😊 1개 정답!\n주사위 1개와 학습 장려금 1,000엔을 획득했습니다. 🎲${bonusMsg}`);
            } else {
                diceCount = 0; currentMoney += bonusMoney; 
                playerMoneySpan.innerText = `${currentMoney.toLocaleString()}엔`;
                alert(`아쉽네요! 모두 틀려서 주사위를 얻지 못했습니다. 😢${bonusMsg}\n다음 기회에 신중하게 도전해보세요!`);
            }
            savePlayerToServer(); 
            return;
        }

        const currentQuiz = oxQuizList[currentOXIndex];
        quizTitle.innerText = `🎲 오늘의 O/X 퀴즈 (${currentOXIndex + 1}/3)`;
        
        quizQuestion.innerHTML = currentQuiz.question.replace(/\n/g, '<br>');
        quizOptions.innerHTML = "";

        const timerInfo = document.createElement("div");
        timerInfo.style.color = "#e53e3e";
        timerInfo.style.fontWeight = "bold";
        timerInfo.style.marginBottom = "15px";
        timerInfo.innerText = "👀 문제를 읽어주세요... (3초 후 선택 가능)";
        quizOptions.appendChild(timerInfo);

        let buttons = [];
        currentQuiz.options.forEach((opt, index) => {
            const btn = document.createElement("button");
            btn.className = "option-btn";
            btn.innerText = opt; 
            
            btn.disabled = true;
            btn.style.opacity = "0.5";
            btn.style.cursor = "not-allowed";

            btn.addEventListener("click", () => {
                const isCorrect = (index === currentQuiz.answerIndex);
                if (isCorrect) correctOXCount++;
                const resultMsg = isCorrect ? "정답입니다! ⭕" : "오답입니다. ❌";
                alert(`${resultMsg}\n\n📖 [${currentQuiz.chapter}단원 ${currentQuiz.page}쪽]\n💡 ${currentQuiz.explanation}`);
                currentOXIndex++;
                renderNextOXQuiz();
            });
            quizOptions.appendChild(btn);
            buttons.push(btn);
        });

        let timeLeft = 3;
        const countdown = setInterval(() => {
            timeLeft--;
            if (timeLeft > 0) {
                timerInfo.innerText = `👀 문제를 읽어주세요... (${timeLeft}초 후 선택 가능)`;
            } else {
                clearInterval(countdown);
                timerInfo.innerText = "✅ 이제 정답을 선택하세요!";
                timerInfo.style.color = "#38a169";
                buttons.forEach(btn => {
                    btn.disabled = false;
                    btn.style.opacity = "1";
                    btn.style.cursor = "pointer";
                });
            }
        }, 1000);

        quizModal.classList.remove("hidden");
    };

    btnQuiz.addEventListener("click", startOXQuiz);

    const showGoldenKeyQuiz = () => {
        shuffle(goldenKeyQuizList);
        const currentGoldenQuiz = goldenKeyQuizList[0]; 
        
        quizTitle.innerText = "🔑 황금열쇠 퀴즈 (심화 5지선다)";
        quizQuestion.innerHTML = currentGoldenQuiz.question.replace(/\n/g, '<br>');
        quizOptions.innerHTML = "";
        
        const timerInfo = document.createElement("div");
        timerInfo.style.color = "#e53e3e";
        timerInfo.style.fontWeight = "bold";
        timerInfo.style.marginBottom = "15px";
        timerInfo.innerText = "👀 문제를 신중히 읽어주세요... (3초 후 선택 가능)";
        quizOptions.appendChild(timerInfo);

        let buttons = [];
        currentGoldenQuiz.options.forEach((opt, index) => {
            const btn = document.createElement("button");
            btn.className = "option-btn";
            btn.innerText = opt;
            
            btn.disabled = true;
            btn.style.opacity = "0.5";
            btn.style.cursor = "not-allowed";

            btn.addEventListener("click", () => {
                quizModal.classList.add("hidden");
                const isCorrect = (index === currentGoldenQuiz.answerIndex);
                
                if(isCorrect) {
                    currentMoney += 15000; 
                    playerMoneySpan.innerText = `${currentMoney.toLocaleString()}엔`;
                    alert(`정답입니다! ⭕\n\n📖 [${currentGoldenQuiz.chapter}단원 ${currentGoldenQuiz.page}쪽]\n💡 ${currentGoldenQuiz.explanation}\n\n황금열쇠 보상으로 무려 15,000엔을 획득했습니다! 💰`);
                } else {
                    alert(`오답입니다. ❌\n\n📖 [${currentGoldenQuiz.chapter}단원 ${currentGoldenQuiz.page}쪽]\n💡 ${currentGoldenQuiz.explanation}\n\n아쉽게도 보상을 얻지 못했습니다.`);
                }
                savePlayerToServer();
            });
            quizOptions.appendChild(btn);
            buttons.push(btn);
        });

        let timeLeft = 3;
        const countdown = setInterval(() => {
            timeLeft--;
            if (timeLeft > 0) {
                timerInfo.innerText = `👀 문제를 신중히 읽어주세요... (${timeLeft}초 후 선택 가능)`;
            } else {
                clearInterval(countdown);
                timerInfo.innerText = "✅ 이제 정답을 선택하세요!";
                timerInfo.style.color = "#38a169";
                buttons.forEach(btn => {
                    btn.disabled = false;
                    btn.style.opacity = "1";
                    btn.style.cursor = "pointer";
                });
            }
        }, 1000);

        quizModal.classList.remove("hidden");
    };

    const showBuildModal = (cellData, cellIndex, isUpgrade = false) => {
        buildTitle.innerText = `[${cellData.name}]`;
        buildOptions.innerHTML = ""; 
        const basePrice = cellData.price;

        if (!isUpgrade) {
            buildDesc.innerText = "빈 도시입니다. 건물을 세우시겠습니까?\n(첫 방문 시 천수각 건설 불가)";
        } else {
            buildDesc.innerText = `현재 ${cellData.building}가 있습니다. 증축하시겠습니까?`;
        }

        let options = [];

        if (!isUpgrade) {
            options.push({
                label: `♨️ 료칸까지 건설하기 (${(basePrice * 3).toLocaleString()}엔)`,
                price: basePrice * 3,
                emoji: "♨️",
                buildingName: "료칸",
                tollMultiplier: 3
            });
            options.push({
                label: `🏮 마치야만 건설하기 (${basePrice.toLocaleString()}엔)`,
                price: basePrice,
                emoji: "🏮",
                buildingName: "마치야",
                tollMultiplier: 1
            });
        } else {
            if (cellData.building === "🏮") { 
                options.push({
                    label: `🏯 천수각으로 증축 (+${(basePrice * 4).toLocaleString()}엔)`,
                    price: basePrice * 4,
                    emoji: "🏯",
                    buildingName: "천수각",
                    tollMultiplier: 6
                });
                options.push({
                    label: `♨️ 료칸으로 증축 (+${(basePrice * 2).toLocaleString()}엔)`,
                    price: basePrice * 2,
                    emoji: "♨️",
                    buildingName: "료칸",
                    tollMultiplier: 3
                });
            } else if (cellData.building === "♨️") { 
                options.push({
                    label: `🏯 천수각으로 증축 (+${(basePrice * 2).toLocaleString()}엔)`,
                    price: basePrice * 2,
                    emoji: "🏯",
                    buildingName: "천수각",
                    tollMultiplier: 6
                });
            }
        }

        options.forEach(opt => {
            const btn = document.createElement("button");
            btn.className = "option-btn";
            btn.innerText = opt.label;
            btn.addEventListener("click", () => {
                if (currentMoney >= opt.price) {
                    currentMoney -= opt.price;
                    
                    cellData.owner = playerName;
                    cellData.building = opt.emoji; 
                    cellData.toll = basePrice * opt.tollMultiplier;
                    playerMoneySpan.innerText = `${currentMoney.toLocaleString()}엔`;
                    
                    const targetCellDiv = document.querySelector(`.cell[data-index="${cellIndex}"]`);
                    
                    const existingMark = targetCellDiv.querySelector('.owner-mark');
                    if (existingMark) existingMark.remove();

                    const flag = document.createElement("div");
                    flag.className = "owner-mark";
                    flag.innerText = opt.emoji;
                    targetCellDiv.appendChild(flag);
                    
                    alert(`축하합니다! ${cellData.name}에 성공적으로 ${opt.buildingName}(을)를 지었습니다.`);
                    buildModal.classList.add("hidden");
                    saveCityToServer(cellData);
                } else {
                    alert("현금이 부족합니다.");
                }
            });
            buildOptions.appendChild(btn);
        });

        const cancelBtn = document.createElement("button");
        cancelBtn.className = "option-btn";
        cancelBtn.style.background = "#e2e8f0";
        cancelBtn.style.color = "#4a5568";
        cancelBtn.innerText = "취소 (그냥 쉬어가기)";
        cancelBtn.addEventListener("click", () => {
            buildModal.classList.add("hidden");
        });
        buildOptions.appendChild(cancelBtn);

        buildModal.classList.remove("hidden");
    };

    const showTakeoverModal = (cellData, cellIndex, tollAmount, takeoverCost) => {
        buildTitle.innerText = `[${cellData.name}] 도착!`;
        buildDesc.innerText = `통행료 ${tollAmount.toLocaleString()}엔을 지불했습니다.\n추가로 ${takeoverCost.toLocaleString()}엔을 내고 이 도시를 인수(뺏기)하시겠습니까?`;
        buildOptions.innerHTML = "";

        const btnTakeover = document.createElement("button");
        btnTakeover.className = "option-btn";
        btnTakeover.innerText = `🤝 인수하기 (-${takeoverCost.toLocaleString()}엔)`;
        btnTakeover.addEventListener("click", () => {
            currentMoney -= takeoverCost;
            cellData.owner = playerName;
            playerMoneySpan.innerText = `${currentMoney.toLocaleString()}엔`;
            
            alert(`축하합니다! ${cellData.name}(을)를 성공적으로 인수했습니다! (다음 방문 시 천수각 증축 가능)`);
            buildModal.classList.add("hidden");
            saveCityToServer(cellData); 
        });
        buildOptions.appendChild(btnTakeover);

        const cancelBtn = document.createElement("button");
        cancelBtn.className = "option-btn";
        cancelBtn.style.background = "#e2e8f0";
        cancelBtn.style.color = "#4a5568";
        cancelBtn.innerText = "취소 (그냥 지나가기)";
        cancelBtn.addEventListener("click", () => {
            buildModal.classList.add("hidden");
            savePlayerToServer(); 
        });
        buildOptions.appendChild(cancelBtn);

        buildModal.classList.remove("hidden");
    };

    btnRoll.addEventListener("click", () => {
        if(playerName === "") {
            alert("이름을 먼저 입력해야 합니다!");
            loginModal.classList.remove("hidden");
            return;
        }

        if (diceCount <= 0) {
            alert("먼저 오늘의 퀴즈를 풀어 주사위 기회를 얻으세요!");
            return;
        }
        
        const numDiceToRoll = diceCount; 
        diceCount = 0; 
        
        diceWrapper.innerHTML = "";
        diceResultText.innerText = "주사위를 굴리는 중...";
        const diceElements = [];
        let totalMove = 0;

        const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
        for (let i = 0; i < numDiceToRoll; i++) {
            const die = document.createElement("div");
            die.className = "die rolling";
            die.innerText = "🎲";
            diceWrapper.appendChild(die);
            diceElements.push(die);
        }
        diceOverlay.classList.remove("hidden");

        setTimeout(() => {
            diceElements.forEach(die => {
                die.classList.remove("rolling");
                const rand = Math.floor(Math.random() * 6);
                totalMove += (rand + 1);
                die.innerText = diceFaces[rand];
            });
            diceResultText.innerText = `총 ${totalMove}칸 이동합니다!`;

            setTimeout(async () => {
                diceOverlay.classList.add("hidden");
                
                const previousPosition = currentPosition;
                
                currentPosition = await moveTokenStepByStep(currentPosition, totalMove);
                
                if (currentPosition < previousPosition) {
                    currentMoney += 10000; 
                    playerMoneySpan.innerText = `${currentMoney.toLocaleString()}엔`;
                    alert("한 바퀴 완주! 여행 지원금 10,000엔을 받았습니다.");
                }

                setTimeout(() => {
                    const cellData = boardData[currentPosition];
                    
                    if (cellData.type === 'golden-key') {
                        showGoldenKeyQuiz();
                    } 
                    else if (cellData.type === 'corner') {
                        if (currentPosition === 20) { 
                            currentMoney -= 3000; 
                            playerMoneySpan.innerText = `${currentMoney.toLocaleString()}엔`;
                            alert("사회복지기금 칸에 도착했습니다.\n좋은 일에 3,000엔을 기부합니다!");
                        } else {
                            alert(`[${cellData.name}] 특수 칸에 도착했습니다.`);
                        }
                        savePlayerToServer();
                    } 
                    else if (cellData.type === 'city') {
                        if (!cellData.owner) {
                            showBuildModal(cellData, currentPosition, false);
                        } else if (cellData.owner === playerName) {
                            if (cellData.building === "🏯") {
                                alert(`내 도시인 [${cellData.name}]에 도착했습니다. 천수각에서 편안히 쉬어갑니다.`);
                                savePlayerToServer();
                            } else {
                                showBuildModal(cellData, currentPosition, true);
                            }
                        } else {
                            const tollAmount = cellData.toll || cellData.price;
                            if (currentMoney < tollAmount) {
                                currentMoney = 0;
                                alert(`[${cellData.name}]에 도착했습니다.\n통행료 ${tollAmount.toLocaleString()}엔을 내야 하지만 현금이 부족하여 파산했습니다! 💸`);
                                playerMoneySpan.innerText = `${currentMoney.toLocaleString()}엔`;
                                savePlayerToServer();
                            } else {
                                currentMoney -= tollAmount;
                                playerMoneySpan.innerText = `${currentMoney.toLocaleString()}엔`;
                                
                                if (cellData.building === "🏯") {
                                    alert(`[${cellData.name}]에 도착했습니다!\n천수각 통행료 ${tollAmount.toLocaleString()}엔을 지불했습니다. 💸\n(랜드마크인 천수각은 인수할 수 없습니다.)`);
                                    savePlayerToServer();
                                } else {
                                    let propertyValue = cellData.price; 
                                    if (cellData.building === "♨️") propertyValue = cellData.price * 3; 
                                    const takeoverCost = propertyValue * 2;
                                    
                                    if (currentMoney >= takeoverCost) {
                                        showTakeoverModal(cellData, currentPosition, tollAmount, takeoverCost);
                                    } else {
                                        alert(`[${cellData.name}]에 도착했습니다!\n건물 통행료 ${tollAmount.toLocaleString()}엔을 지불했습니다. 💸\n(자금이 부족하여 인수는 불가능합니다.)`);
                                        savePlayerToServer();
                                    }
                                }
                            }
                        }
                    } else {
                        savePlayerToServer();
                    }
                }, 400);
            }, 1000);
        }, 1500);
    });
});
