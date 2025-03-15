// stockData.ts

import { create } from "zustand";
import stockDataType, { stockType } from "../types/stockData.type";

const useStockData = create<stockDataType>((set, get) => ({
    startYear: 0,
    currentYear: 0,
    period: 5,
    companies: [],
    stockDatas: [],
    updateStockDataType: (startyear, currentyear, period, companies, stockdatas) => set(() => ({
        startYear: startyear,
        currentYear: currentyear,
        period: period,
        companies: companies,
        stockDatas: stockdatas,
    })),
    updateStartYear: (startyear) => set(() => ({
        startYear: startyear,
    })),
    updateCurrentYear: (currentyear) => set(() => ({
        currentYear: currentyear,
    })),
    updatePeriod: (period: number) => set(() => ({
        period: period,
    })),
    updateCompanies: (companies: string[]) => set(() => ({
        companies: companies,
    })),
    updateStockDatas: (stockdatas: stockType[]) => set(() => ({
        stockDatas: stockdatas,
    }))
}));

export default useStockData;