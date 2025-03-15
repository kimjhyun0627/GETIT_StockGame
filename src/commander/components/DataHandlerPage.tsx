// DataHandlerPage.tsx

import { useEffect, useState } from "react"
import useStockData from "../../store/stores/useStockData"
import stockDatasType, { stockType } from "../../store/types/stockData.type";

const DataHandlerPage = () => {

    const stockDatas: stockDatasType = useStockData();

    // 새 회사 생성
    const createCompany = () => {
        let newCompany = `company ${stockDatas.companies.length + 1}`;
        let newStockData: stockType = {
            company: `company ${stockDatas.companies.length + 1}`,
            stockData: new Array(stockDatas.period).fill(0),
        };

        stockDatas.updateCompanies([...stockDatas.companies, newCompany]);
        stockDatas.updateStockDatas([...stockDatas.stockDatas, newStockData]);
    }

    // 리스트 마지막 회사 삭제
    const removeCompany = () => {
        stockDatas.updateCompanies(stockDatas.companies.slice(0, -1));
        stockDatas.updateStockDatas(stockDatas.stockDatas.slice(0, -1));
    }

    // 회사명 변경
    const updateCompanyHandler = (companyIdx: number, companyName: string) => {
        const newCompanies = stockDatas.companies.slice();
        const newStockDatas = stockDatas.stockDatas.slice();
        newCompanies[companyIdx] = companyName;
        newStockDatas[companyIdx].company = companyName;
        stockDatas.updateCompanies(newCompanies);
        stockDatas.updateStockDatas(newStockDatas);
    }

    // 기간 변경
    const updatePeriodHandler = (value: number) => {
        const newStockDatas = stockDatas.stockDatas;
        newStockDatas.forEach((v) => { v.stockData.length = value; });
        newStockDatas.forEach((v, i) => { v.stockData.fill(0) });

        stockDatas.updatePeriod(value);
        stockDatas.updateStockDatas(newStockDatas);
    }

    // 특정 주식 값 수정
    const updateStockDataHandler = (companyIndex: number, yearIndex: number, value: number) => {
        const newStockDatas = stockDatas.stockDatas.slice();
        newStockDatas[companyIndex].stockData[yearIndex] = value;
        stockDatas.updateStockDatas(newStockDatas);
    }

    useEffect(() => {
        // TODO: axios 작업하기
        console.log(stockDatas);
    }, [stockDatas]);

    return (
        <div>
            {/* 연도 입력 필드 */}
            <p>
                시작년도:
                <input
                    type="number"
                    style={{ marginLeft: "10px", width: "80px" }}
                    onChange={(e) => { stockDatas.updateStartYear(Number(e.target.value)) }}
                />
            </p>
            <p>
                기간:
                <input
                    type="number"
                    style={{ marginLeft: "10px", width: "30px" }}
                    onChange={(e) => { updatePeriodHandler(Number(e.target.value)) }}
                />
                년
            </p>
            <p>
                현재년도:
                <input
                    type="number"
                    style={{ marginLeft: "10px", width: "80px" }}
                    onChange={(e) => { stockDatas.updateCurrentYear(Number(e.target.value)) }}
                />
            </p>
            {/*회사별 데이터*/}
            {stockDatas ? (
                stockDatas.stockDatas.map((companyValue, companyIdx) => (
                    <div key={companyIdx}>
                        <p>회사명:
                            <input
                                type="text"
                                value={companyValue.company}
                                onChange={(e) => { updateCompanyHandler(companyIdx, String(e.target.value)) }} />
                        </p>
                        {companyValue.stockData.map((yearValue, yearIdx) => (
                            <div style={stockDatas.startYear + yearIdx <= stockDatas.currentYear ? { background: "gray" } : {}}>
                                <p >
                                    {stockDatas.startYear + yearIdx}:
                                    <input
                                        type="number"
                                        key={yearIdx}
                                        value={yearValue}
                                        onChange={(e) => { updateStockDataHandler(companyIdx, yearIdx, Number(e.target.value)) }} />
                                </p>
                            </div>
                        ))}
                    </div>
                ))
            ) : <p>데이터 로드 중...</p>}


            <button onClick={createCompany}>회사 추가하기</button>
            <button onClick={removeCompany}>회사 삭제하기</button>

            <button>적용하기</button>
        </div>
    )
}

export default DataHandlerPage