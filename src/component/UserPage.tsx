// WebSocket.tsx

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Chart.js 컴포넌트 등록
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface DataType {
    year: number;
    companies: {
        name: string;
        data: number[];
    }[];
}

interface UserPageProps {
    name: string;
}

const UserPage: React.FC<UserPageProps> = ({ name }) => {
    const [chartData, setChartData] = useState<any>(null);

    let rgbdata: string[] = [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 206, 86)",
        "rgb(75, 192, 192)",
        "rgb(153, 102, 255)",
        "rgb(255, 159, 64)",
    ];

    useEffect(() => {

        const socket = new WebSocket("ws://localhost:5000");

        socket.onmessage = (event) => {
            const receivedData = JSON.parse(event.data) as DataType;
            console.log("📥 New JSON Received:", receivedData);
            // 2020년부터 year 값까지 데이터를 표시하고 그 이후는 보이지 않도록 필터링
            const labels = ["2020", "2021", "2022", "2023", "2024", "2025", "2026"];
            const visibleData = receivedData.companies.map((company) => company.data.slice(0, receivedData.year - 2019)); // 첫 번째 인덱스만 표시
            // 차트 데이터 설정
            setChartData({
                labels: labels,
                datasets: receivedData.companies.map((company, index) => ({
                    label: company.name,
                    data: visibleData[index], // 첫 번째 값만 표시
                    fill: false,
                    borderColor: rgbdata[index],
                    tension: 0.1,
                })),
            });
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
            <h1>주식 차트</h1>
            <h2>{name} 님, GETIT 7기 부원이 되신 것을 환영합니다!</h2>
            {chartData ? (
                <Line
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: "주식 차트",
                            },
                            legend: {
                                position: "top",
                            },
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                            }
                        },
                    }}
                />
            ) : (
                <p>차트 데이터를 불러오는 중...</p>
            )}
        </div>
    );
};

export default UserPage;
