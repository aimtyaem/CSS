
import React, { useState } from 'react';
import type { View, Pollutant, DataSource } from '../types';
import { POLLUTANTS } from '../constants';
import { MapIcon, ChartBarIcon, BellIcon, CogIcon, TrendingUpIcon, ChevronDownIcon, WindIcon } from './icons';

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-colors duration-200 ${
            isActive
                ? 'bg-brand-accent text-white'
                : 'text-brand-text-muted hover:bg-brand-light hover:text-brand-text'
        }`}
    >
        {icon}
        <span className="ml-4">{label}</span>
    </button>
);

interface CollapsibleSectionProps {
    title: string;
    children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="py-4 border-b border-brand-light">
            <button onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center w-full px-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-text">{title}</h3>
                <ChevronDownIcon className={`w-5 h-5 text-brand-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <div className="mt-4 px-4 space-y-3">{children}</div>}
        </div>
    );
};


interface SidebarProps {
    currentView: View;
    onNavigate: (view: View) => void;
    selectedPollutants: Pollutant[];
    onPollutantChange: (pollutant: Pollutant) => void;
    dataSource: DataSource;
    onDataSourceChange: (source: DataSource) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    currentView,
    onNavigate,
    selectedPollutants,
    onPollutantChange,
    dataSource,
    onDataSourceChange
}) => {
    const navItems = [
        { id: 'map', icon: <MapIcon className="w-5 h-5" />, label: 'Map' },
        { id: 'forecast', icon: <ChartBarIcon className="w-5 h-5" />, label: 'Forecast' },
        { id: 'trends', icon: <TrendingUpIcon className="w-5 h-5" />, label: 'Trends & Insights' },
        { id: 'alerts', icon: <BellIcon className="w-5 h-5" />, label: 'Alerts' },
        { id: 'settings', icon: <CogIcon className="w-5 h-5" />, label: 'Settings' },
    ];

    return (
        <aside className="w-72 bg-brand-mid flex flex-col flex-shrink-0 border-r border-brand-light">
            <div className="px-6 py-4 flex items-center space-x-3 border-b border-brand-light">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                   <WindIcon className="w-6 h-6 text-white"/>
                </div>
                <div>
                    <h1 className="text-lg font-bold text-white">Cleaner, Safer Skies</h1>
                    <p className="text-xs text-brand-text-muted">Air Quality Prediction</p>
                </div>
            </div>
            
            {currentView === 'map' && (
              <div className="flex-1 overflow-y-auto">
                  <CollapsibleSection title="Pollutants">
                      {POLLUTANTS.map(p => (
                          <label key={p} className="flex items-center text-sm text-brand-text cursor-pointer">
                              <input
                                  type="checkbox"
                                  checked={selectedPollutants.includes(p)}
                                  onChange={() => onPollutantChange(p)}
                                  className="form-checkbox h-4 w-4 bg-brand-light border-brand-light rounded text-brand-accent focus:ring-brand-accent"
                              />
                              <span className="ml-3">{p}</span>
                          </label>
                      ))}
                  </CollapsibleSection>

                  <CollapsibleSection title="Data Source">
                      <div className="flex flex-col space-y-2">
                          <label className="flex items-center text-sm text-brand-text cursor-pointer">
                              <input
                                  type="radio"
                                  name="dataSource"
                                  value="satellite"
                                  checked={dataSource === 'satellite'}
                                  onChange={() => onDataSourceChange('satellite')}
                                  className="form-radio h-4 w-4 bg-brand-light border-brand-light text-brand-accent focus:ring-brand-accent"
                              />
                              <span className="ml-3">TEMPO Satellite</span>
                          </label>
                          <label className="flex items-center text-sm text-brand-text cursor-pointer">
                              <input
                                  type="radio"
                                  name="dataSource"
                                  value="ground"
                                  checked={dataSource === 'ground'}
                                  onChange={() => onDataSourceChange('ground')}
                                  className="form-radio h-4 w-4 bg-brand-light border-brand-light text-brand-accent focus:ring-brand-accent"
                              />
                              <span className="ml-3">Ground Stations</span>
                          </label>
                      </div>
                  </CollapsibleSection>
              </div>
            )}
            
            <nav className="mt-auto p-2 space-y-1">
                {navItems.map(item => (
                    <NavItem
                        key={item.id}
                        icon={item.icon}
                        label={item.label}
                        isActive={currentView === item.id}
                        onClick={() => onNavigate(item.id as View)}
                    />
                ))}
            </nav>
        </aside>
    );
};