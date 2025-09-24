
import React from 'react';
import { Hero, HeroDailyRate } from '../types';

interface HeroTrendChartProps {
    hero: Hero;
    data: HeroDailyRate[];
    isLoading: boolean;
    color: string; // e.g., '#3b82f6' for ally, '#ef4444' for enemy
}

const HeroTrendChart: React.FC<HeroTrendChartProps> = ({ hero, data, isLoading, color }) => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-48 bg-black bg-opacity-20 rounded-lg">
                <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-gray-400"></div>
                <p className="mt-2 text-xs text-gray-400">A carregar tendência de {hero.name}...</p>
            </div>
        );
    }
    
    if (data.length < 2) {
        return (
             <div className="flex flex-col items-center justify-center h-48 bg-black bg-opacity-20 rounded-lg text-center p-4">
                 <p className="font-bold text-sm text-gray-300" style={{ color }}>{hero.name}</p>
                 <p className="mt-2 text-xs text-gray-400">Dados de tendência insuficientes para gerar um gráfico.</p>
             </div>
        )
    }

    const width = 300;
    const height = 150;
    const padding = 30;

    const winRates = data.map(d => d.win_rate * 100);
    const minWinRate = Math.min(...winRates);
    const maxWinRate = Math.max(...winRates);
    
    // Add a small buffer to min/max so the line doesn't touch the edges
    const yMin = Math.floor(minWinRate - 1);
    const yMax = Math.ceil(maxWinRate + 1);

    const getX = (index: number) => {
        return padding + (index / (data.length - 1)) * (width - padding * 2);
    };

    const getY = (winRate: number) => {
        const yRange = yMax - yMin;
        if (yRange === 0) {
            return (height - padding) / 2; // Center the line if flat
        }
        return (height - padding) - ((winRate - yMin) / yRange) * (height - padding * 2);
    };

    const pathData = data.map((point, i) => {
        const x = getX(i);
        const y = getY(point.win_rate * 100);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    
    const areaPathData = `${pathData} L ${getX(data.length - 1)} ${height - padding} L ${getX(0)} ${height - padding} Z`;
    
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-black bg-opacity-20 rounded-lg p-3">
             <p className="font-bold text-sm text-center mb-2" style={{ color }}>{hero.name}</p>
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" aria-labelledby={`chart-title-${hero.id}`} role="img">
                <title id={`chart-title-${hero.id}`}>Gráfico de tendência de vitórias para {hero.name}</title>
                {/* Y-axis labels */}
                <text x={padding - 8} y={getY(yMax)} dy="0.3em" textAnchor="end" className="text-[10px] fill-gray-400">{yMax}%</text>
                <text x={padding - 8} y={getY(yMin)} dy="0.3em" textAnchor="end" className="text-[10px] fill-gray-400">{yMin}%</text>

                {/* X-axis labels */}
                <text x={getX(0)} y={height - padding + 15} textAnchor="middle" className="text-[10px] fill-gray-400">{formatDate(data[0].date)}</text>
                <text x={getX(data.length - 1)} y={height - padding + 15} textAnchor="middle" className="text-[10px] fill-gray-400">{formatDate(data[data.length - 1].date)}</text>

                {/* Area under line */}
                <defs>
                    <linearGradient id={`gradient-${hero.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path d={areaPathData} fill={`url(#gradient-${hero.id})`} />

                {/* Line */}
                <path d={pathData} fill="none" stroke={color} strokeWidth="2" />
                
                {/* Data points with tooltips */}
                {data.map((point, i) => (
                    <g key={i} className="group cursor-pointer">
                        <circle cx={getX(i)} cy={getY(point.win_rate * 100)} r="8" fill="transparent" />
                        <circle cx={getX(i)} cy={getY(point.win_rate * 100)} r="3" fill={color} className="group-hover:r-4 transition-all" />
                        <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <rect x={getX(i) - 25} y={getY(point.win_rate * 100) - 28} width="50" height="20" rx="4" className="fill-gray-900" />
                            <text x={getX(i)} y={getY(point.win_rate * 100) - 18} textAnchor="middle" className="text-[10px] font-bold fill-white">
                                {(point.win_rate * 100).toFixed(1)}%
                            </text>
                        </g>
                    </g>
                ))}
            </svg>
        </div>
    );
};

export default HeroTrendChart;
