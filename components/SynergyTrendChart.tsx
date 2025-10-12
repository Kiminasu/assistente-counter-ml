import React from 'react';
import { TimeWinRate } from '../types';

interface SynergyTrendChartProps {
    data: TimeWinRate[];
    color: string;
    heroName: string;
}

const SynergyTrendChart: React.FC<SynergyTrendChartProps> = ({ data, color, heroName }) => {
    if (data.length < 2) {
        return (
            <div className="flex flex-col items-center justify-center h-40 bg-black bg-opacity-20 rounded-lg text-center p-2">
                <p className="text-xs text-gray-400">Dados de tendência insuficientes para gerar um gráfico para a sinergia com {heroName}.</p>
            </div>
        );
    }

    const width = 300;
    const height = 150;
    const padding = { top: 20, right: 20, bottom: 30, left: 35 };

    const winRates = data.map(d => d.winRate * 100);
    const yMin = Math.floor(Math.min(...winRates) - 2);
    const yMax = Math.ceil(Math.max(...winRates) + 2);

    const getX = (index: number) => {
        return padding.left + (index / (data.length - 1)) * (width - padding.left - padding.right);
    };

    const getY = (winRate: number) => {
        const yRange = yMax - yMin;
        if (yRange <= 0) {
            return padding.top + (height - padding.top - padding.bottom) / 2;
        }
        return (height - padding.bottom) - ((winRate - yMin) / yRange) * (height - padding.top - padding.bottom);
    };

    const pathData = data.map((point, i) => {
        const x = getX(i);
        const y = getY(point.winRate * 100);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    
    const areaPathData = `${pathData} L ${getX(data.length - 1)} ${height - padding.bottom} L ${getX(0)} ${height - padding.bottom} Z`;

    return (
        <div className="bg-black bg-opacity-30 rounded-lg p-2">
            <p className="text-xs text-center text-gray-400 mb-1">Taxa de Vitória com {heroName} por Minuto</p>
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img" aria-label={`Gráfico de tendência de sinergia para ${heroName}`}>
                {/* Y-axis labels */}
                <text x={padding.left - 8} y={getY(yMax)} dy="0.3em" textAnchor="end" className="text-[10px] fill-gray-400">{yMax}%</text>
                <text x={padding.left - 8} y={getY(yMin)} dy="0.3em" textAnchor="end" className="text-[10px] fill-gray-400">{yMin}%</text>
                
                {/* Horizontal grid lines */}
                <line x1={padding.left} x2={width - padding.right} y1={getY(yMax)} y2={getY(yMax)} stroke="#4a5568" strokeWidth="0.5" strokeDasharray="2,2" />
                <line x1={padding.left} x2={width - padding.right} y1={getY(yMin)} y2={getY(yMin)} stroke="#4a5568" strokeWidth="0.5" strokeDasharray="2,2" />

                {/* X-axis labels */}
                {data.map((point, i) => (
                    <text key={point.time} x={getX(i)} y={height - padding.bottom + 15} textAnchor="middle" className="text-[10px] fill-gray-400">{point.time}</text>
                ))}

                {/* Area under line */}
                <defs>
                    <linearGradient id={`synergy-gradient-${heroName.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path d={areaPathData} fill={`url(#synergy-gradient-${heroName.replace(/\s+/g, '-')})`} />

                {/* Line */}
                <path d={pathData} fill="none" stroke={color} strokeWidth="2" />
                
                {/* Data points with tooltips */}
                {data.map((point, i) => (
                    <g key={i} className="group cursor-pointer">
                        <circle cx={getX(i)} cy={getY(point.winRate * 100)} r="8" fill="transparent" />
                        <circle cx={getX(i)} cy={getY(point.winRate * 100)} r="3" fill={color} className="group-hover:r-4 transition-all" />
                        <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <rect x={getX(i) - 25} y={getY(point.winRate * 100) - 28} width="50" height="20" rx="4" className="fill-gray-900" />
                            <text x={getX(i)} y={getY(point.winRate * 100) - 18} textAnchor="middle" className="text-[10px] font-bold fill-white">
                                {(point.winRate * 100).toFixed(1)}%
                            </text>
                        </g>
                    </g>
                ))}
            </svg>
        </div>
    );
};

export default SynergyTrendChart;