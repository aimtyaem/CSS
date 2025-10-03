
import React, { useState, useEffect } from 'react';
import { SunIcon, WindIcon, LoadingSpinner } from './icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Location, Weather, ForecastAqi } from '../types';

type ForecastPeriod = '24h' | '7d';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-brand-light p-4 rounded-lg border border-brand-text-muted/50">
        <p className="label text-brand-text font-semibold">{`${label}`}</p>
        {payload.map((pld: any) => (
          <div key={pld.dataKey} style={{ color: pld.color }}>
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

                const weather: Weather = {
                    temperature: 72,
                    feelsLike: 70,
                    windSpeed: 5,
                    windDirection: 'from SW',
                };
                
                const hourly = Array.from({ length: 24 }, (_, i) => ({
                  time: `${i}:00`,
                  'PM2.5': Math.floor(Math.random() * 80) + 20,
                  'O3': Math.floor(Math.random() * 100) + 30,
                }));

                const daily = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
                  day,
                  'PM2.5': Math.floor(Math.random() * 90) + 10,
                  'O3': Math.floor(Math.random() * 110) + 20,
                }));

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
                <LoadingSpinner className="w-10 h-10 text-brand-accent"/>
                <p className="mt-4 text-brand-text-muted">Loading forecast for {location?.name}...</p>
            </div>
        );
    }
    
    if (!location) {
        return (
             <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-bold text-white">No Location Selected</h2>
                <p className="text-brand-text-muted mt-2">Please search for a location on the map to view its forecast.</p>
            </div>
        )
    }

    if (error || !weatherData || !forecastAqi) {
        return <div className="p-8 flex-1 flex items-center justify-center"><p className="text-red-500">{error || 'Could not load data.'}</p></div>;
    }

    return (
        <div className="p-8 flex-1 overflow-y-auto bg-brand-dark">
            <h1 className="text-3xl font-bold text-white mb-2">Air Quality Forecast</h1>
            <p className="text-brand-text-muted mb-8">{location.name}</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-brand-mid p-6 rounded-lg border border-brand-light">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-white">Pollutant Levels</h2>
                        <div className="flex bg-brand-light rounded-lg p-1">
                            <button 
                                onClick={() => setPeriod('24h')}
                                className={`px-4 py-1 text-sm font-medium rounded-md ${period === '24h' ? 'bg-brand-accent text-white' : 'text-brand-text-muted'}`}>
                                24-Hour
                            </button>
                             <button 
                                onClick={() => setPeriod('7d')}
                                className={`px-4 py-1 text-sm font-medium rounded-md ${period === '7d' ? 'bg-brand-accent text-white' : 'text-brand-text-muted'}`}>
                                7-Day
                            </button>
                        </div>
                    </div>
                    
                    <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={period === '24h' ? forecastAqi.hourly : forecastAqi.daily}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey={period === '24h' ? 'time' : 'day'} stroke="#94A3B8" tick={{ fontSize: 12 }} />
                                <YAxis stroke="#94A3B8" tick={{ fontSize: 12 }} label={{ value: 'AQI', angle: -90, position: 'insideLeft', fill: '#94A3B8' }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{fontSize: "14px"}}/>
                                <Line type="monotone" dataKey="PM2.5" stroke="#FBBF24" strokeWidth={2} dot={{r:2}} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="O3" stroke="#38BDF8" strokeWidth={2} dot={{r:2}} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-brand-mid p-6 rounded-lg border border-brand-light">
                    <h2 className="text-xl font-semibold text-white mb-6">Weather Outlook</h2>
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                             <div className="p-3 bg-yellow-400/10 rounded-lg">
                                <SunIcon className="w-8 h-8 text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-brand-text-muted">Temperature</p>
                                <p className="text-2xl font-bold text-white">{weatherData.temperature}°F</p>
                                <p className="text-sm text-brand-text-muted">Feels like {weatherData.feelsLike}°F</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                             <div className="p-3 bg-sky-400/10 rounded-lg">
                                <WindIcon className="w-8 h-8 text-sky-400" />
                            </div>
                            <div>
                                <p className="text-brand-text-muted">Wind</p>
                                <p className="text-2xl font-bold text-white">{weatherData.windSpeed} mph</p>
                                <p className="text-sm text-brand-text-muted">{weatherData.windDirection}</p>
                            </div>
                        </div>
                    </div>
                     <div className="mt-8">
                        <h3 className="font-semibold text-white mb-4">Pollutant Details</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-brand-text-muted">PM2.5</span>
                                <span className="font-medium text-white">68 (Moderate)</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-brand-text-muted">Ozone (O₃)</span>
                                <span className="font-medium text-white">45 (Good)</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-brand-text-muted">Nitrogen Dioxide (NO₂)</span>
                                <span className="font-medium text-white">22 (Good)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
