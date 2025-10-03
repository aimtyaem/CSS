
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

    return (
        <div className="p-8 flex-1 overflow-y-auto bg-brand-dark">
            <h1 className="text-3xl font-bold text-white mb-8">Alerts & Notifications</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-brand-mid p-6 rounded-lg border border-brand-light">
                    <h2 className="text-xl font-semibold text-white mb-4">Your Alerts</h2>
                    <p className="text-brand-text-muted mb-6">Receive notifications when air quality reaches levels you care about.</p>

                    <div className="space-y-4">
                        {alerts.map(alert => (
                            <div key={alert.id} className="flex items-center justify-between bg-brand-light p-4 rounded-lg">
                                <div>
                                    <p className="font-medium text-white">{alert.pollutant}</p>
                                    <p className="text-sm text-brand-text-muted">Notify when AQI > {alert.threshold}</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={alert.active}
                                        onChange={() => toggleAlert(alert.id)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-brand-dark rounded-full peer peer-focus:ring-2 peer-focus:ring-brand-accent/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-accent"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="bg-brand-mid p-6 rounded-lg border border-brand-light">
                    <h2 className="text-xl font-semibold text-white mb-4">Customize Alerts</h2>
                    <p className="text-brand-text-muted mb-6">Set your own thresholds for different pollutants.</p>
                    
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="pollutant" className="block text-sm font-medium text-brand-text-muted mb-2">Pollutant</label>
                            <select id="pollutant" className="w-full bg-brand-light border-brand-light rounded-lg p-2 text-white focus:ring-brand-accent focus:border-brand-accent">
                                {POLLUTANTS.map(p => <option key={p}>{p}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="threshold" className="block text-sm font-medium text-brand-text-muted mb-2">AQI Threshold</label>
                            <input type="number" id="threshold" defaultValue="120" className="w-full bg-brand-light border-brand-light rounded-lg p-2 text-white focus:ring-brand-accent focus:border-brand-accent"/>
                        </div>
                        <button type="button" className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-2 px-4 rounded-lg transition-colors">
                            Add New Alert
                        </button>
                    </form>
                    <div className="mt-8">
                        <p className="text-brand-text-muted text-sm text-center">
                            Your sensitivity setting is "{userSettings.sensitivity}". Alerts are pre-configured for your profile.
                        </p>
                    </div>
                </div>

                <div className="md:col-span-2 bg-brand-mid p-6 rounded-lg border border-brand-light">
                    <h2 className="text-xl font-semibold text-white mb-4">Alert History</h2>
                    <ul className="space-y-3">
                        <li className="text-sm"><span className="font-semibold text-orange-400">[Moderate]</span> PM2.5 level is 89. (2 hours ago)</li>
                        <li className="text-sm"><span className="font-semibold text-yellow-400">[Good]</span> Air quality has improved. (Yesterday)</li>
                        <li className="text-sm"><span className="font-semibold text-red-500">[Unhealthy]</span> Ozone level is 155. (2 days ago)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
