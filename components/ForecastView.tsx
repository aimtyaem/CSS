import React, { useState, useEffect } from 'react';
import { SunIcon, WindIcon, LoadingSpinner } from './icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Location, Weather, ForecastAqi } from '../types';

type ForecastPeriod = '24h' | '7d';

// Simple hash function for pseudo-random but deterministic data
const simpleHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-theme-surface/80 backdrop-blur-sm p-4 rounded-lg border border-theme-border shadow-lg">
        <p className="label text-theme-text-primary font-semibold">{`${label}`}</p>
        {payload.map((pld: any) => (
          <div key={pld.dataKey} style={{ color: pld.stroke }} className="font-mono">
            {`${pld.dataKey}: ${pld.value.toFixed(0)}`}
          </div>
        ))}
      </div>
    );
  }
  return null;
};


export const ForecastView: React.FC<{location: Location | null}> = ({ location }) => {
    const [period, setPeriod] = useState<ForecastPeriod>('24h');
    const [weatherData, setWeatherData] = useState<Weather | null>(null);
    const [forecastAqi, setForecastAqi] = useState<ForecastAqi | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!location) {
            setLoading(false);
            return;
        };

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Simulate fetching weather and AQI forecast
                await new Promise(res => setTimeout(res, 1000));
                
                const seed = simpleHash(location.name);

                const weather: Weather = {
                    temperature: 60 + (seed % 25), // Temp between 60 and 85
                    feelsLike: 58 + (seed % 25),
                    windSpeed: 3 + (seed % 10),
                    windDirection: ['from N', 'from NE', 'from E', 'from SE', 'from S', 'from SW', 'from W', 'from NW'][seed % 8],
                };
                
                const basePm25 = 20 + (seed % 60);
                const baseO3 = 30 + (seed % 70);

                // Generate hourly data with a diurnal pattern
                const hourly = Array.from({ length: 24 }, (_, i) => {
                    // PM2.5 can have small peaks at commute times
                    const pm25Diurnal = (Math.sin((i - 8) * Math.PI / 12) + Math.sin((i - 18) * Math.PI / 12)) * 15;
                    // O3 peaks with sunlight in the afternoon
                    const o3Diurnal = Math.max(0, Math.sin((i - 6) * Math.PI / 12)) * 40;

                    return {
                      time: `${i}:00`,
                      'PM2.5': Math.max(0, Math.round(basePm25 + pm25Diurnal + (Math.random() - 0.5) * 10)),
                      'O3': Math.max(0, Math.round(baseO3 + o3Diurnal + (Math.random() - 0.5) * 15)),
                    };
                });
                
                // Generate daily data with some variation
                const daily = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                    const randomFactor = (simpleHash(`${location.name}-${day}`) % 20) - 10;
                    return {
                        day,
                        'PM2.5': Math.max(0, basePm25 + randomFactor),
                        'O3': Math.max(0, baseO3 - randomFactor + 5),
                    };
                });

                setWeatherData(weather);
                setForecastAqi({ hourly, daily });

            } catch (err) {
                setError('Failed to fetch forecast data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [location]);

    if (loading) {
        return (
            <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
                <LoadingSpinner className="w-10 h-10 text-theme-primary"/>
                <p className="mt-4 text-theme-text-secondary">Loading forecast for {location?.name}...</p>
            </div>
        );
    }
    
    if (!location) {
        return (
             <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-bold text-theme-text-primary">No Location Selected</h2>
                <p className="text-theme-text-secondary mt-2">Please search for a location on the map to view its forecast.</p>
            </div>
        )
    }

    if (error || !weatherData || !forecastAqi) {
        return <div className="p-8 flex-1 flex items-center justify-center"><p className="text-red-500">{error || 'Could not load data.'}</p></div>;
    }

    return (
        <div className="p-8 flex-1 overflow-y-auto bg-transparent animate-fade-in">
            <h1 className="text-3xl font-bold text-theme-text-primary mb-2">Air Quality Forecast</h1>
            <p className="text-theme-text-secondary mb-8">{location.name}</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-theme-surface p-6 rounded-lg border border-theme-border shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-theme-text-primary">Pollutant Levels</h2>
                        <div className="flex bg-slate-100 rounded-lg p-1 font-mono text-sm">
                            <button 
                                onClick={() => setPeriod('24h')}
                                className={`px-4 py-1 font-medium rounded-md transition-all duration-200 transform hover:scale-105 ${period === '24h' ? 'bg-theme-primary text-white shadow-md' : 'text-theme-text-secondary hover:bg-slate-200'}`}>
                                24-Hour
                            </button>
                             <button 
                                onClick={() => setPeriod('7d')}
                                className={`px-4 py-1 font-medium rounded-md transition-all duration-200 transform hover:scale-105 ${period === '7d' ? 'bg-theme-primary text-white shadow-md' : 'text-theme-text-secondary hover:bg-slate-200'}`}>
                                7-Day
                            </button>
                        </div>
                    </div>
                    
                    <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={period === '24h' ? forecastAqi.hourly : forecastAqi.daily}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                <XAxis dataKey={period === '24h' ? 'time' : 'day'} stroke="#64748B" tick={{ fontSize: 12, fontFamily: 'Roboto Mono' }} />
                                <YAxis stroke="#64748B" tick={{ fontSize: 12, fontFamily: 'Roboto Mono' }} label={{ value: 'AQI', angle: -90, position: 'insideLeft', fill: '#64748B', style: {fontFamily: 'Roboto Mono'} }} />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(59, 130, 246, 0.5)', strokeWidth: 1, strokeDasharray: '3 3'}}/>
                                <Legend wrapperStyle={{fontSize: "14px", fontFamily: 'Roboto Mono'}}/>
                                <Line type="monotone" dataKey="PM2.5" stroke="#F97316" strokeWidth={2} dot={{r:2}} activeDot={{ r: 6, strokeWidth: 2, fill: '#FFFFFF', stroke: '#F97316' }} />
                                <Line type="monotone" dataKey="O3" stroke="#3B82F6" strokeWidth={2} dot={{r:2}} activeDot={{ r: 6, strokeWidth: 2, fill: '#FFFFFF', stroke: '#3B82F6' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-theme-surface p-6 rounded-lg border border-theme-border shadow-lg">
                    <h2 className="text-xl font-semibold text-theme-text-primary mb-6">Weather Outlook</h2>
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                             <div className="p-3 bg-theme-accent/10 rounded-lg border border-theme-accent/20">
                                <SunIcon className="w-8 h-8 text-theme-accent" />
                            </div>
                            <div>
                                <p className="text-theme-text-secondary">Temperature</p>
                                <p className="text-2xl font-bold text-theme-text-primary">{weatherData.temperature}°F</p>
                                <p className="text-sm text-theme-text-secondary">Feels like {weatherData.feelsLike}°F</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                             <div className="p-3 bg-theme-primary/10 rounded-lg border border-theme-primary/20">
                                <WindIcon className="w-8 h-8 text-theme-primary" />
                            </div>
                            <div>
                                <p className="text-theme-text-secondary">Wind</p>
                                <p className="text-2xl font-bold text-theme-text-primary">{weatherData.windSpeed} mph</p>
                                <p className="text-sm text-theme-text-secondary">{weatherData.windDirection}</p>
                            </div>
                        </div>
                    </div>
                     <div className="mt-8">
                        <h3 className="font-semibold text-theme-text-primary mb-4">Pollutant Details</h3>
                        <div className="space-y-3 text-sm font-mono">
                            <div className="flex justify-between">
                                <span className="text-theme-text-secondary">PM2.5</span>
                                <span className="font-medium text-theme-text-primary">{forecastAqi.daily[0]['PM2.5']} (Moderate)</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-theme-text-secondary">Ozone (O₃)</span>
                                <span className="font-medium text-theme-text-primary">{forecastAqi.daily[0]['O3']} (Good)</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-theme-text-secondary">Nitrogen Dioxide</span>
                                <span className="font-medium text-theme-text-primary">22 (Good)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};