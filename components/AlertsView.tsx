import React from 'react';
import type { Alert, UserSettings } from '../types';
import { POLLUTANTS } from '../constants';

interface AlertsViewProps {
    alerts: Alert[];
    setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>;
    userSettings: UserSettings;
}

export const AlertsView: React.FC<AlertsViewProps> = ({ alerts, setAlerts, userSettings }) => {
    
    const toggleAlert = (id: number) => {
        setAlerts(prevAlerts => 
            prevAlerts.map(alert => 
                alert.id === id ? { ...alert, active: !alert.active } : alert
            )
        );
    };

    const mockAlertHistory = [
        { level: 'Moderate', pollutant: 'PM2.5', value: 89, time: '2 hours ago', color: 'text-orange-500' },
        { level: 'Good', pollutant: 'Air quality', value: 'improved', time: 'Yesterday', color: 'text-yellow-500' },
        { level: 'Unhealthy', pollutant: 'Ozone', value: 155, time: '2 days ago', color: 'text-red-500' },
        { level: 'Moderate', pollutant: 'NO2', value: 72, time: '4 days ago', color: 'text-orange-500' },
    ];


    return (
        <div className="p-8 flex-1 overflow-y-auto bg-transparent animate-fade-in">
            <h1 className="text-3xl font-bold text-theme-text-primary mb-8">Alerts & Notifications</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-theme-surface p-6 rounded-lg border border-theme-border shadow-lg">
                    <h2 className="text-xl font-semibold text-theme-text-primary mb-4">Your Alerts</h2>
                    <p className="text-theme-text-secondary mb-6">Receive notifications when air quality reaches levels you care about.</p>

                    <div className="space-y-4">
                        {alerts.map(alert => (
                            <div key={alert.id} className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border border-theme-border">
                                <div>
                                    <p className="font-medium text-theme-text-primary font-mono">{alert.pollutant}</p>
                                    <p className="text-sm text-theme-text-secondary">Notify when AQI > {alert.threshold}</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={alert.active}
                                        onChange={() => toggleAlert(alert.id)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-theme-primary/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-theme-primary"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="bg-theme-surface p-6 rounded-lg border border-theme-border shadow-lg">
                    <h2 className="text-xl font-semibold text-theme-text-primary mb-4">Customize Alerts</h2>
                    <p className="text-theme-text-secondary mb-6">Set your own thresholds for different pollutants.</p>
                    
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="pollutant" className="block text-sm font-medium text-theme-text-secondary mb-2">Pollutant</label>
                            <select id="pollutant" className="w-full bg-slate-50 border-slate-300 rounded-lg p-2 text-theme-text-primary focus:ring-theme-primary focus:border-theme-primary">
                                {POLLUTANTS.map(p => <option key={p}>{p}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="threshold" className="block text-sm font-medium text-theme-text-secondary mb-2">AQI Threshold</label>
                            <input type="number" id="threshold" defaultValue="120" className="w-full bg-slate-50 border-slate-300 rounded-lg p-2 text-theme-text-primary focus:ring-theme-primary focus:border-theme-primary"/>
                        </div>
                        <button type="button" className="w-full bg-theme-primary hover:bg-theme-primary-hover text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-theme-primary/20 hover:shadow-glow-primary transform hover:scale-105">
                            Add New Alert
                        </button>
                    </form>
                    <div className="mt-8">
                        <p className="text-theme-text-secondary text-sm text-center">
                            Your sensitivity setting is "{userSettings.sensitivity}". Alerts are pre-configured for your profile.
                        </p>
                    </div>
                </div>

                <div className="md:col-span-2 bg-theme-surface p-6 rounded-lg border border-theme-border shadow-lg">
                    <h2 className="text-xl font-semibold text-theme-text-primary mb-4">Alert History</h2>
                    <ul className="space-y-3 font-mono text-sm">
                       {mockAlertHistory.map((item, index) => (
                            <li key={index}>
                                <span className={`font-semibold ${item.color}`}>[{item.level}]</span>{' '}
                                {item.pollutant} level {item.value === 'improved' ? 'has' : 'is'} {item.value}. ({item.time})
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};