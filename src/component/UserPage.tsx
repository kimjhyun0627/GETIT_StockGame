// WebSocket.tsx

import React, { useEffect, useState } from "react";

interface DataType {
    year: number;
    companies: {
        name: string;
        data: number[];
    }[];
}

const UserPage: React.FC = () => {
    const [data, setData] = useState<DataType | null>(null);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:5000");

        socket.onmessage = (event) => {
            const receivedData = JSON.parse(event.data) as DataType;
            console.log("📥 New JSON Received:", receivedData);
            setData(receivedData); // 화면 업데이트
        };

        socket.onclose = () => {
            console.log("🔴 WebSocket Disconnected");
        };

        return () => {
            socket.close();
        };
    }, []);

    return (
        <div>
            <h1>📡 실시간 JSON 데이터</h1>
            {data ? (
                <ul>
                    <li><strong>year:</strong> {data.year}</li>
                    {data.companies.map((company, index) => (
                        <li key={index}>
                            <strong>{company.name}:</strong> {company.data.join(", ")}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>데이터 수신 중...</p>
            )}
        </div>
    );
};

export default UserPage;
