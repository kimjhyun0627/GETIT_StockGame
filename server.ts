import express from "express";
import { WebSocketServer } from "ws";
import cors from "cors"; // CORS 라이브러리 임포트

const app = express();
const port = 5000;
const clientID = process.env.REACT_APP_GOOGLE_CLIENT_ID!;

// CORS 미들웨어 추가 (모든 출처에서 접근을 허용)
app.use(cors());

// JSON 데이터 파싱을 위한 미들웨어
app.use(express.json());

// HTTP 서버 실행
const server = app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
});

// WebSocket 서버 생성
const wss = new WebSocketServer({ server });

// 초기 JSON 데이터
let jsonData = {
    year: 2022,
    companies: [
        { name: "Company 1", data: [1000, 1100, 1200, 1300, 1400, 1500, 2000] },
        { name: "Company 2", data: [2000, 2100, 2200, 2300, 2400, 2500, 2000] },
        { name: "Company 3", data: [3000, 3100, 3200, 3300, 3300, 3400, 2001] },
        { name: "Company 4", data: [4000, 4100, 4200, 4300, 1500, 1600, 2001] },
        { name: "Company 5", data: [5000, 5100, 5200, 5300, 5400, 5500, 2002] },
        { name: "Company 6", data: [6000, 6100, 6200, 6300, 6400, 6500, 2003] },
    ],
};

// 모든 클라이언트에게 데이터 전송하는 함수
const broadcastData = () => {
    const jsonString = JSON.stringify(jsonData);
    wss.clients.forEach((client) => {
        if (client.readyState === 1) {
            client.send(jsonString);
        }
    });
};

// WebSocket 연결 처리
wss.on("connection", (ws) => {
    console.log("🟢 Client Connected");

    // 연결된 클라이언트에게 현재 데이터 전송
    ws.send(JSON.stringify(jsonData));

    ws.on("close", () => console.log("🔴 Client Disconnected"));
});

app.get('/login', (req, res) => {
    let url = 'https://accounts.google.com/o/oauth2/v2/auth';
    // client_id는 위 스크린샷을 보면 발급 받았음을 알 수 있음
    // 단, 스크린샷에 있는 ID가 아닌 당신이 직접 발급 받은 ID를 사용해야 함.
    url += `?client_id=${clientID}`
    // 아까 등록한 redirect_uri
    // 로그인 창에서 계정을 선택하면 구글 서버가 이 redirect_uri로 redirect 시켜줌
    url += `&redirect_uri=http://localhost:3000/login/user`
    // 필수 옵션.
    url += '&response_type=code'
    // 구글에 등록된 유저 정보 email, profile을 가져오겠다 명시
    url += '&scope=email profile'
    // 완성된 url로 이동
    // 이 url이 위에서 본 구글 계정을 선택하는 화면임.
    res.redirect(url);
})

app.get('/login/redirect', (req, res) => {
    const { code } = req.query;
    console.log(`code: ${code}`);
    res.send('ok');
});

// 데이터 업데이트를 위한 HTTP 라우터 추가
app.post("/update-data", (req, res) => {
    const { year, companies } = req.body;

    if (year !== undefined) {
        jsonData.year = year;
    }

    if (companies !== undefined) {
        jsonData.companies = companies;
    }

    console.log("📡 Data Updated:", jsonData);

    // 변경된 데이터 클라이언트로 전송
    broadcastData();

    res.send("Data updated successfully!");
});
