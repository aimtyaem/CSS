
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
      <div className="bg-brand-light p-4 rounded-lg border border-brand-text-muted/50">
        <p className="label text-brand-text font-semibold">{`${label}`}</p>
        {payload.map((pld: any) => (
          <div key={pld.dataKey} style={{ color: pld.fill || pld.stroke }}>
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
                
                const data = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => ({
                    month,
                    'PM2.5': Math.floor(Math.random() * 60) + 10,
                    'O3': Math.floor(Math.random() * 80) + 20,
                }));
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
                    <LoadingSpinner className="w-10 h-10 text-brand-accent"/>
                    <p className="mt-4 text-brand-text-muted">Loading historical data for {location?.name}...</p>
                </div>
            );
        }
        
         if (!location) {
            return (
                 <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
                    <h2 className="text-2xl font-bold text-white">No Location Selected</h2>
                    <p className="text-brand-text-muted mt-2">Please search for a location on the map to view historical trends.</p>
                </div>
            )
        }

        if (error) {
             return <div className="p-8 flex-1 flex items-center justify-center"><p className="text-red-500">{error}</p></div>;
        }

        return (
            <>
                <div className="bg-brand-mid p-6 rounded-xl border border-brand-light mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-white">Historical AQI</h2>
                        <div className="flex bg-brand-light rounded-lg p-1">
                            <button onClick={() => setTimeRange('month')} className={`px-4 py-1 text-sm font-medium rounded-md ${timeRange === 'month' ? 'bg-brand-accent text-white' : 'text-brand-text-muted'}`}>Month</button>
                            <button onClick={() => setTimeRange('year')} className={`px-4 py-1 text-sm font-medium rounded-md ${timeRange === 'year' ? 'bg-brand-accent text-white' : 'text-brand-text-muted'}`}>Year</button>
                            <button onClick={() => setTimeRange('all')} className={`px-4 py-1 text-sm font-medium rounded-md ${timeRange === 'all' ? 'bg-brand-accent text-white' : 'text-brand-text-muted'}`}>All Time</button>
                        </div>
                    </div>

                    <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={historicalData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="month" stroke="#94A3B8" tick={{ fontSize: 12 }} />
                                <YAxis stroke="#94A3B8" tick={{ fontSize: 12 }} label={{ value: 'Average AQI', angle: -90, position: 'insideLeft', fill: '#94A3B8' }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{fontSize: "14px"}}/>
                                <Bar dataKey="PM2.5" fill="#FBBF24" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="O3" fill="#38BDF8" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-brand-mid p-6 rounded-xl border border-brand-light">
                        <h2 className="text-xl font-semibold text-white mb-4">Data Source Attribution</h2>
                        <p className="text-sm text-brand-text-muted mb-6">This chart shows a breakdown of data sources used for the selected time range.</p>
                        <div>
                            <h3 className="font-semibold text-brand-accent mb-2">Satellite Data</h3>
                            <div className="space-y-2 text-sm">
                                {Object.entries(sourceData.satellite).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-center">
                                        <span className="text-brand-text-muted">{key}</span>
                                        <span className="font-medium text-white">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                         <div className="mt-6">
                            <h3 className="font-semibold text-sky-400 mb-2">Ground Station Data</h3>
                            <div className="space-y-2 text-sm">
                                {Object.entries(sourceData.ground).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-center">
                                        <span className="text-brand-text-muted">{key}</span>
                                        <span className="font-medium text-white">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="bg-brand-mid p-6 rounded-xl border border-brand-light">
                        <h2 className="text-xl font-semibold text-white mb-4">Pollutant Hotspots (Heatmap)</h2>
                        <p className="text-sm text-brand-text-muted mb-6">Visualizing areas with historically higher concentrations of PM2.5 over the last year.</p>
                        <div className="aspect-video bg-brand-dark rounded-lg flex items-center justify-center">
                             <img src="https://picsum.photos/seed/heatmap/600/400" alt="Heatmap of pollutant hotspots" className="rounded-lg opacity-70"/>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className="p-8 flex-1 overflow-y-auto bg-brand-dark animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-2">Trends & Insights</h1>
            <p className="text-brand-text-muted mb-8">Explore historical air quality data for {location?.name || 'a selected location'}</p>
            {renderContent()}
        </div>
    );
};