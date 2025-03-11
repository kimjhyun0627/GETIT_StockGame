// WebSocket.tsx

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { useCookies } from "react-cookie"; // react-cookie 사용

// Chart.js 컴포넌트 등록
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface DataType {
    year: number;
    companies: {
        name: string;
        data: number[];  // 연도별 주식 데이터
    }[];
}

interface UserPageProps {
    name: string;
}

const UserPage: React.FC<UserPageProps> = ({ name }) => {
    const initialCash = 1000000;  // 초기 보유 현금 100만원
    const [cookies, setCookie] = useCookies(["cash", "stocks", "year"]); // 쿠키 관련
    const [chartData, setChartData] = useState<any>(null);
    const [cash, setCash] = useState<number>(parseFloat(cookies.cash || `${initialCash}`));  // 현금
    const [stocks, setStocks] = useState<any>(cookies.stocks || {});  // 보유 주식
    const [totalAssets, setTotalAssets] = useState<number>(cash);  // 총 자산
    const [year, setYear] = useState<number>(parseInt(cookies.year || "2022"));  // 연도
    const [data, setData] = useState<DataType | null>(null);  // WebSocket으로 받은 데이터

    const rgbdata: string[] = [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 206, 86)",
        "rgb(75, 192, 192)",
        "rgb(153, 102, 255)",
        "rgb(255, 159, 64)",
    ];

    // cash cookie가 없으면 초기값으로 생성
    useEffect(() => {
        if (!cookies.cash) {
            const expires = new Date();
            expires.setTime(expires.getTime() + 5 * 60 * 60 * 1000); // 5시간 후 만료
            setCookie("cash", initialCash.toString(), { expires: expires });
            setCash(initialCash);  // 현금 업데이트
        }
    }, [cookies, setCookie]);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:5000");

        socket.onmessage = (event) => {
            const receivedData = JSON.parse(event.data) as DataType;
            // console.log("📥 New JSON Received:", receivedData);
            setData(receivedData);  // WebSocket으로 받은 데이터 저장

            // 차트 데이터 설정
            setChartData({
                labels: ["2020", "2021", "2022", "2023", "2024", "2025", "2026"],
                datasets: receivedData.companies.map((company, index) => ({
                    label: company.name,
                    data: receivedData.companies.map((company) =>
                        company.data.slice(0, receivedData.year - 2019)
                    )[index],
                    fill: false,
                    borderColor: rgbdata[index],
                    tension: 0.1,
                })),
            });

            setYear(receivedData.year);  // 연도 업데이트
        };

        socket.onclose = () => {
            // console.log("🔴 WebSocket Disconnected");
        };

        return () => {
            socket.close();
        };
    }, []);

    useEffect(() => {
        // 쿠키에 연도 저장
        const expires = new Date();
        expires.setTime(expires.getTime() + 5 * 60 * 60 * 1000); // 5시간 후 만료
        setCookie("year", data?.year.toString(), { expires: expires });
        const defaultStocks: { [key: string]: number } = data ? {
            ...data.companies.reduce((acc, company) => ({ ...acc, [company.name]: 0 }), {}),  // 모든 회사의 주식 수량 0개로 설정
        } : {};
        // stocks가 없으면 초기값으로 설정
        if (Object.keys(stocks).length === 0) {

            // console.log(defaultStocks);
            setStocks(defaultStocks);

            const expires = new Date();
            expires.setTime(expires.getTime() + 5 * 60 * 60 * 1000); // 5시간 후 만료
            setCookie("stocks", defaultStocks, { expires: expires });  // 쿠키에 주식 상태 저장
        } else {
            const stocksFromCookie = cookies.stocks || defaultStocks;  // 보유 주식
            setStocks(stocksFromCookie);  // 보유 주식 업데이트
        }
    }, [data, year])

    // chartdata 바뀔때만 총자산 수정
    useEffect(() => {
        // 총 자산 = 현금 + sum(현재년도의 주식 가격 * 해당 주식 보유량)
        const totalAssets = cash + (data ? data.companies.reduce((acc, company) => {
            const currentPrice = company.data[cookies.year - 2020];  // 현재 가격
            return acc + (currentPrice * (stocks[company.name] || 0));
        }, 0) : 0);
        setTotalAssets(totalAssets);  // 총 자산 업데이트
    }, [data, year, cash, stocks]);

    // 주식 구매 함수
    const buyStock = (companyName: string, amount: number, price: number) => {
        const totalCost = price * amount;
        if (totalCost <= cash) {
            const newCash = cash - totalCost;
            const newStocks = {
                ...stocks,
                [companyName]: (stocks[companyName] || 0) + amount,
            };
            setCash(newCash);
            setStocks(newStocks);
            // 쿠키에 현금 및 주식 상태 저장
            const expires = new Date();
            expires.setTime(expires.getTime() + 5 * 60 * 60 * 1000); // 5시간 후 만료
            setCookie("cash", newCash.toString(), { expires: expires });
            setCookie("stocks", JSON.stringify(newStocks), { expires: expires });
        } else {
            alert("현금이 부족합니다!");
        }
    };

    // 주식 판매 함수
    const sellStock = (companyName: string, amount: number, price: number) => {
        const ownedAmount = stocks[companyName] || 0;
        if (ownedAmount >= amount) {
            const newCash = cash + price * amount;
            const newStocks = {
                ...stocks,
                [companyName]: ownedAmount - amount,
            };
            setCash(newCash);
            setStocks(newStocks);
            // 쿠키에 현금 및 주식 상태 저장
            const expires = new Date();
            expires.setTime(expires.getTime() + 5 * 60 * 60 * 1000); // 5시간 후 만료
            setCookie("stocks", JSON.stringify(newStocks), { expires: expires });
        } else {
            alert("보유 주식 수량이 부족합니다!");
        }
    };

    return (
        <div>
            <h1>주식 차트</h1>
            <h2>{name} 님, GETIT 7기 부원이 되신 것을 환영합니다!</h2>
            <h3>지금은... {year}년</h3>
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
            <div>
                <h3>보유 현금: ₩{cash.toLocaleString()}</h3>
                <h3>총 자산: ₩{totalAssets.toLocaleString()}</h3>
                <h3>보유 주식:</h3>
                <ul>
                    {chartData?.datasets.map((dataset: any) => {
                        const companyName = dataset.label;
                        const currentPrice = dataset.data[dataset.data.length - 1];  // 현재 가격
                        return (
                            <li key={companyName}>
                                {companyName}: {stocks[companyName] || 0} 주 {currentPrice ? `₩${(stocks[companyName] * currentPrice).toLocaleString()}` : ""}
                                <input type="number" name={`number${companyName}`} min="1" defaultValue="1" />
                                <button onClick={() => sellStock(companyName, parseInt((document.querySelector(`input[name="number${companyName}"]`) as HTMLInputElement).value), currentPrice)}>
                                    판매
                                </button>
                                <button onClick={() => buyStock(companyName, parseInt((document.querySelector(`input[name="number${companyName}"]`) as HTMLInputElement).value), currentPrice)}>
                                    구매
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default UserPage;
