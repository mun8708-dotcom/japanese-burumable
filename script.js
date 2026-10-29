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

    // 🔥 [새 기능] 관리자 리셋 버튼 연결
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

    // 🔥 리셋 버튼 클릭 이벤트 (비밀번호: 0000)
    if (btnAdminReset) {
        btnAdminReset.addEventListener("click", async () => {
            const pwd = prompt("관리자 비밀번호를 입력하세요");
            if (pwd === "0000") {
                if (confirm("정말 모든 플레이어와 도시 데이터를 초기화하시겠습니까?\n(삭제된 데이터는 복구할 수 없습니다.)")) {
                    try {
                        const response = await fetch(API_URL, {
                            method: "POST",
                            body: JSON.stringify({ action: "resetAll" })
                        });
                        const data = await response.json();
                        if(data.status === "success") {
                            localStorage.clear(); 
                            alert("초기화가 완료되었습니다. 화면을 새로고침합니다.");
                            location.reload();
                        }
                    } catch(e) {
                        alert("서버 연결에 실패하여 초기화하지 못했습니다.");
                    }
                }
            } else if (pwd !== null) {
                alert("비밀번호가 틀렸습니다.");
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
        { chapter: 12, page: 137, question: "일본의 만화는 대사를 세로 방향으로 쓰기 때문에, 책을 읽을 때 우리나라와 반대로 오른쪽에서 왼쪽으로 읽고 줄을 바꾼다.", options: ["O", "X"], answerIndex: 0, explanation: "일본 만화는 대사가 세로 방향으로 쓰여 있어 오른쪽에서 왼쪽으로 읽는 것이 특징입니다." }
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
        }
    ];

    const checkQuizEligibility = () => {
        const now = new Date();
        const dateStr = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;
        const isPM = now.getHours() >= 12;
        const timeSlot = isPM ? "PM" : "AM";
        
        // --- 배포 시 아래 4줄의 맨 앞 '//' 를 지워주세요 ---
         const lastPlayed = localStorage.getItem(`quizPlayed_${dateStr}_${timeSlot}`);
         if (lastPlayed) {
             alert("이미 오늘 " + (isPM ? "오후" : "오전") + " 퀴즈를 모두 푸셨습니다!\n(※ 하루 제한: 오전 1회 / 오후 1회)\n다음 시간대에 다시 도전해주세요.");
             return false;
         }

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
