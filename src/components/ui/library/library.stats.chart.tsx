/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import React, { useState, useMemo } from 'react';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';

// Mock data for the last 30 days
const chartData = Array.from({ length: 30 }).map((_, i) => ({
    date: `2024-05-${(i + 1).toString().padStart(2, '0')}`,
    watchHours: Math.floor(Math.random() * 5) + 2,
    storageGB: Math.floor(Math.random() * 10) + 100 + i,
}));

export const LibraryActivityChart: React.FC = () => {
    const [activeType, setActiveType] = useState<'watchHours' | 'storageGB'>('watchHours');

    const totalStats = useMemo(() => ({
        watchHours: chartData.reduce((acc, curr) => acc + curr.watchHours, 0),
        storageGB: chartData[chartData.length - 1].storageGB
    }), []);

    return (
        <div className="Custom-Chart-Container">
            {/* Header / Toggle Section */}
            <div className="Chart-Header-Toggle">
                <button 
                    className={`Chart-Toggle-Btn ${activeType === 'watchHours' ? 'active' : ''}`}
                    onClick={() => setActiveType('watchHours')}
                >
                    <span className="Label">Watch Hours</span>
                    <span className="Value">{totalStats.watchHours} hrs</span>
                </button>
                <button 
                    className={`Chart-Toggle-Btn ${activeType === 'storageGB' ? 'active' : ''}`}
                    onClick={() => setActiveType('storageGB')}
                >
                    <span className="Label">Library Size</span>
                    <span className="Value">{totalStats.storageGB} GB</span>
                </button>
            </div>

            {/* Graph Area */}
            <div style={{ width: '100%', height: 200, marginTop: '1rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis 
                            dataKey="date" 
                            hide 
                        />
                        <YAxis 
                            hide 
                            domain={['auto', 'auto']} 
                        />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: '#2a2a2a', 
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                fontSize: '12px'
                            }}
                            itemStyle={{ color: activeType === 'watchHours' ? '#0066ff' : '#ff6b35' }}
                            labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Line
                            type="monotone"
                            dataKey={activeType}
                            stroke={activeType === 'watchHours' ? 'var(--primary-blue)' : 'var(--accent-orange)'}
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};