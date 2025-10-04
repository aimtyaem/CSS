import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Location } from '../types';
import { LoadingSpinner } from './icons';

const sourceData = {
    'satellite': { 'TEMPO': '75%', 'Other': '25%' },
    'ground': { 'OpenAQ': '40%', 'Pandora': '35%', 'TolNet': '25%' }
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-theme-surface/80 backdrop-blur-sm p-4 rounded-lg border border-theme-border shadow-lg">
        <p className="label text-theme-text-primary font-semibold">{`${label}`}</p>
        {payload.map((pld: any) => (
          <div key={pld.dataKey} style={{ color: pld.fill }} className="font-mono">
            {`${pld.dataKey}: ${pld.value.toFixed(0)}`}
          </div>
        ))}
      </div>
    );
  }
  return null;
};


export const TrendsView: React.FC<{location: Location | null}> = ({ location }) => {
    const [timeRange, setTimeRange] = useState('year');
    const [historicalData, setHistoricalData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

     useEffect(() => {
        if (!location) {
            setLoading(false);
            return;
        }

        const fetchHistoricalData = async () => {
            setLoading(true);
            setError(null);
            try {
                await new Promise(res => setTimeout(res, 1100));
                
                const data = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => {
                    // Simulate seasonal pattern: O3 higher in summer, PM2.5 in winter
                    const seasonalFactor = Math.sin((i / 12) * 2 * Math.PI - Math.PI / 2); // -1 in winter, 1 in summer
                    const pm25 = 45 - seasonalFactor * 20 + (Math.random() - 0.5) * 15;
                    const o3 = 50 + seasonalFactor * 35 + (Math.random() - 0.5) * 20;

                    return {
                        month,
                        'PM2.5': Math.max(5, Math.round(pm25)),
                        'O3': Math.max(10, Math.round(o3)),
                    };
                });
                setHistoricalData(data);
            } catch (err) {
                setError('Failed to fetch historical data.');
            } finally {
                setLoading(false);
            }
        };

        fetchHistoricalData();
    }, [location, timeRange]);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
                    <LoadingSpinner className="w-10 h-10 text-theme-primary"/>
                    <p className="mt-4 text-theme-text-secondary">Loading historical data for {location?.name}...</p>
                </div>
            );
        }
        
        if (!location) {
            return (
                <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
                    <h2 className="text-2xl font-bold text-theme-text-primary">No Location Selected</h2>
                    <p className="text-theme-text-secondary mt-2">Please search for a location on the map to view historical trends.</p>
                </div>
            );
        }
        
        if (error) {
            return <div className="p-8 flex-1 flex items-center justify-center"><p className="text-red-500">{error}</p></div>
        }

        return (
            <>
                <div className="bg-theme-surface p-6 rounded-lg border border-theme-border mb-8 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-theme-text-primary">Historical AQI</h2>
                        <div className="flex bg-slate-100 rounded-lg p-1 font-mono text-sm">
                            <button onClick={() => setTimeRange('month')} className={`px-4 py-1 font-medium rounded-md transition-all duration-200 transform hover:scale-105 ${timeRange === 'month' ? 'bg-theme-primary text-white shadow-md' : 'text-theme-text-secondary hover:bg-slate-200'}`}>Month</button>
                            <button onClick={() => setTimeRange('year')} className={`px-4 py-1 font-medium rounded-md transition-all duration-200 transform hover:scale-105 ${timeRange === 'year' ? 'bg-theme-primary text-white shadow-md' : 'text-theme-text-secondary hover:bg-slate-200'}`}>Year</button>
                            <button onClick={() => setTimeRange('all')} className={`px-4 py-1 font-medium rounded-md transition-all duration-200 transform hover:scale-105 ${timeRange === 'all' ? 'bg-theme-primary text-white shadow-md' : 'text-theme-text-secondary hover:bg-slate-200'}`}>All</button>
                        </div>
                    </div>

                    <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={historicalData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                <XAxis dataKey="month" stroke="#64748B" tick={{ fontSize: 12, fontFamily: 'Roboto Mono' }} />
                                <YAxis stroke="#64748B" tick={{ fontSize: 12, fontFamily: 'Roboto Mono' }} label={{ value: 'Average AQI', angle: -90, position: 'insideLeft', fill: '#64748B', style: {fontFamily: 'Roboto Mono'} }} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
                                <Legend wrapperStyle={{fontSize: "14px", fontFamily: 'Roboto Mono'}}/>
                                <Bar dataKey="PM2.5" fill="#F97316" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="O3" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-theme-surface p-6 rounded-lg border border-theme-border shadow-lg">
                        <h2 className="text-xl font-semibold text-theme-text-primary mb-4">Data Source Attribution</h2>
                        <p className="text-sm text-theme-text-secondary mb-6">This chart shows a breakdown of data sources used for the selected time range.</p>
                        <div className="font-mono text-sm">
                            <h3 className="font-semibold text-theme-primary mb-2">SATELLITE DATA</h3>
                            <div className="space-y-2">
                                {Object.entries(sourceData.satellite).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-center">
                                        <span className="text-theme-text-secondary">{key}</span>
                                        <span className="font-medium text-theme-text-primary">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                         <div className="mt-6 font-mono text-sm">
                            <h3 className="font-semibold text-theme-accent mb-2">GROUND STATION DATA</h3>
                            <div className="space-y-2">
                                {Object.entries(sourceData.ground).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-center">
                                        <span className="text-theme-text-secondary">{key}</span>
                                        <span className="font-medium text-theme-text-primary">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="bg-theme-surface p-6 rounded-lg border border-theme-border shadow-lg">
                        <h2 className="text-xl font-semibold text-theme-text-primary mb-4">Pollutant Hotspots (Heatmap)</h2>
                        <p className="text-sm text-theme-text-secondary mb-6">Visualizing areas with historically higher concentrations of PM2.5 over the last year.</p>
                        <div className="aspect-video bg-slate-200 rounded-lg flex items-center justify-center border border-theme-border overflow-hidden">
                             <img src="https://picsum.photos/seed/heatmap_light/600/400" alt="Heatmap of pollutant hotspots" className="rounded-lg opacity-80"/>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className="p-8 flex-1 overflow-y-auto bg-transparent animate-fade-in">
            <h1 className="text-3xl font-bold text-theme-text-primary mb-2">Trends & Insights</h1>
            <p className="text-theme-text-secondary mb-8">Explore historical air quality data for {location?.name || 'a selected location'}</p>
            {renderContent()}
        </div>
    );
};