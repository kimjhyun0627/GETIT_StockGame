// stockData.type.ts


export interface stockType {
    company: string,
    stockData: number[]
}

export default interface stockDatasType {
    startYear: number,
    currentYear: number,
    period: number,
    companies: string[],
    stockDatas: stockType[]

    updateStockDataType: (startyear: number, year: number, period: number, companies: string[], stockDatas: stockType[]) => void
    updateStartYear: (startyear: number) => void;
    updateCurrentYear: (currentyear: number) => void;
    updatePeriod: (period: number) => void;
    updateCompanies: (companies: string[]) => void;
    updateStockDatas: (stockDatas: stockType[]) => void;
}