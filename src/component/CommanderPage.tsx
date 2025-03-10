import React, { useEffect, useState } from "react";

interface Company {
    name: string;
    data: number[];
}

interface DataType {
    year: number;
    companies: Company[];
}

const CommanderPage: React.FC = () => {
    const [data, setData] = useState<DataType | null>(null);
    const [, setSocket] = useState<WebSocket | null>(null);

    // 입력 값 상태 설정
    const [newYear, setNewYear] = useState<number>(2022);
    const [newCompanies, setNewCompanies] = useState<Company[]>([
        { name: "Company 1", data: [1000, 1100, 1200, 1300, 1400, 1500, 2000] },
        { name: "Company 2", data: [2000, 2100, 2200, 2300, 2400, 2500, 2000] },
        { name: "Company 3", data: [3000, 3100, 3200, 3300, 3300, 3400, 2001] },
        { name: "Company 4", data: [4000, 4100, 4200, 4300, 1500, 1600, 2001] },
        { name: "Company 5", data: [5000, 5100, 5200, 5300, 5400, 5500, 2002] },
        { name: "Company 6", data: [6000, 6100, 6200, 6300, 6400, 6500, 2003] },
    ]);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:5000");

        ws.onmessage = (event) => {
            const receivedData = JSON.parse(event.data) as DataType;
            console.log("📥 New JSON Received:", receivedData);
            setData(receivedData);
        };

        ws.onclose = () => {
            console.log("🔴 WebSocket Disconnected");
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, []);

    // 버튼 클릭 시 백엔드에 데이터 전송
    const handleUpdateData = () => {
        fetch("http://localhost:5000/update-data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                year: newYear,
                companies: newCompanies,
            }),
        })
            .then((response) => response.text())
            .then((data) => {
                console.log("📡 Data updated successfully:", data);
            })
            .catch((error) => console.error("❌ Error updating data:", error));
    };

    // 날짜 변경 핸들러
    const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewYear(Number(event.target.value));
    };

    // 회사 데이터 변경 핸들러
    const handleCompanyDataChange = (
        companyIndex: number,
        dataIndex: number,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updatedCompanies = [...newCompanies];
        updatedCompanies[companyIndex].data[dataIndex] = Number(event.target.value);
        setNewCompanies(updatedCompanies);
    };

    return (
        <div>
            <h1>📡운영진이시군요? 주식게임 화이팅~</h1>
            {data ? (
                <div>
                    {/* 연도 입력 필드 */}
                    <h2>
                        Year:{" "}
                        <input
                            type="number"
                            value={newYear}
                            onChange={handleYearChange}
                            style={{ marginLeft: "10px", width: "80px" }}
                        />
                    </h2>

                    {/* 회사별 데이터 입력 필드 */}
                    {newCompanies.map((company, companyIndex) => (
                        <div key={companyIndex} style={{ marginBottom: "20px" }}>
                            <strong>{company.name}:</strong>
                            {company.data.map((value, dataIndex) => (
                                < input
                                    key={dataIndex}
                                    type="number"
                                    value={value}
                                    onChange={(event) => handleCompanyDataChange(companyIndex, dataIndex, event)}
                                    style={{ marginLeft: "10px", width: "80px" }}
                                />
                            ))}
                        </div>
                    ))}

                    {/* 데이터 업데이트 버튼 */}
                    <button onClick={handleUpdateData} style={{ marginTop: "20px" }}>
                        데이터 업데이트
                    </button>
                </div>
            ) : (
                <p>데이터 수신 중...</p>
            )}
        </div>
    );
};

export default CommanderPage;
