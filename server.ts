import express from "express";
import { WebSocketServer } from "ws";
import cors from "cors"; // CORS 라이브러리 임포트

const app = express();
const port = 5000;

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
        { name: "Company 1", data: [1000, 1100, 1200, 1300] },
        { name: "Company 2", data: [2000, 2100, 2200, 2300] },
        { name: "Company 3", data: [3000, 3100, 3200, 3300] },
        { name: "Company 4", data: [4000, 4100, 4200, 4300] },
        { name: "Company 5", data: [5000, 5100, 5200, 5300] },
        { name: "Company 6", data: [6000, 6100, 6200, 6300] },
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
