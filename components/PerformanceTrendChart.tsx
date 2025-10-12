import React from 'react';
import { HeroDailyStats } from '../types';

interface PerformanceTrendChartProps {
    data: HeroDailyStats[];
}

const ChartLine: React.FC<{ pathData: string; color: string; areaId: string; areaPathData: string }> = ({ pathData, color, areaId, areaPathData }) => (
    <>
        <defs>
            <linearGradient id={areaId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
        </defs>
        <path d={areaPathData} fill={`url(#${areaId})`} />
        <path d={pathData} fill="none" stroke={color} strokeWidth="2" />
    </>
);

const PerformanceTrendChart: React.FC<PerformanceTrendChartProps> = ({ data }) => {
    if (data.length < 2) {
        return (
            <div className="flex flex-col items-center justify-center h-48 bg-black bg-opacity-20 rounded-lg text-center p-2">
                <p className="text-xs text-gray-400">Dados de tendência insuficientes para gerar um gráfico.</p>
            </div>
        );
    }
    
    const width = 400;
    const height = 200;
    const padding = { top: 20, right: 20, bottom: 40, left: 40 };

    const winRates = data.map(d => d.winRate * 100);
    const pickRates = data.map(d => d.pickRate * 100);
    const banRates = data.map(d => d.banRate * 100);

    const allRates = [...winRates, ...pickRates, ...banRates];
    const yMin = Math.max(0, Math.floor(Math.min(...allRates) - 1));
    const yMax = Math.ceil(Math.max(...allRates) + 1);

    const getX = (index: number) => {
        return padding.left + (index / (data.length - 1)) * (width - padding.left - padding.right);
    };

    const getY = (rate: number) => {
        const yRange = yMax - yMin;
        if (yRange <= 0) {
            return padding.top + (height - padding.top - padding.bottom) / 2;
        }
        return (height - padding.bottom) - ((rate - yMin) / yRange) * (height - padding.top - padding.bottom);
    };

    const createPath = (rates: number[]) => {
        return rates.map((rate, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(rate)}`).join(' ');
    };

    const createAreaPath = (path: string) => {
        return `${path} L ${getX(data.length - 1)} ${height - padding.bottom} L ${getX(0)} ${height - padding.bottom} Z`;
    };
    
    const winRatePath = createPath(winRates);
    const pickRatePath = createPath(pickRates);
    const banRatePath = createPath(banRates);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-black bg-opacity-30 rounded-lg p-2">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img" aria-label="Gráfico de tendência de desempenho">
                {/* Y-axis labels and grid lines */}
                {[...Array(5)].map((_, i) => {
                    const value = yMin + (yMax - yMin) * i / 4;
                    const yPos = getY(value);
                    return (
                        <g key={i}>
                            <line x1={padding.left} x2={width - padding.right} y1={yPos} y2={yPos} stroke="#4a5568" strokeWidth="0.5" strokeDasharray="2,2" />
                            <text x={padding.left - 8} y={yPos} dy="0.3em" textAnchor="end" className="text-[10px] fill-gray-400">{value.toFixed(1)}%</text>
                        </g>
                    )
                })}

                {/* X-axis labels */}
                <text x={getX(0)} y={height - padding.bottom + 15} textAnchor="middle" className="text-[10px] fill-gray-400">{formatDate(data[0].date)}</text>
                <text x={getX(data.length - 1)} y={height - padding.bottom + 15} textAnchor="middle" className="text-[10px] fill-gray-400">{formatDate(data[data.length - 1].date)}</text>
                
                {/* Lines and Areas */}
                <ChartLine pathData={winRatePath} color="#4ade80" areaId="win-area" areaPathData={createAreaPath(winRatePath)} />
                <ChartLine pathData={pickRatePath} color="#60a5fa" areaId="pick-area" areaPathData={createAreaPath(pickRatePath)} />
                <ChartLine pathData={banRatePath} color="#f87171" areaId="ban-area" areaPathData={createAreaPath(banRatePath)} />
            </svg>
            <div className="flex justify-center gap-4 mt-2 text-xs">
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#4ade80]"></div><span>Vitórias</span></div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#60a5fa]"></div><span>Escolhas</span></div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#f87171]"></div><span>Bans</span></div>
            </div>
        </div>
    );
};

export default PerformanceTrendChart;