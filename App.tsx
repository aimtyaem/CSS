
import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { MapView } from './components/MapView';
import { ForecastView } from './components/ForecastView';
import { AlertsView } from './components/AlertsView';
import { TrendsView } from './components/TrendsView';
import { SettingsView } from './components/SettingsView';
import type { View, Pollutant, DataSource, UserSettings, Alert, Location } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('map');
  const [selectedPollutants, setSelectedPollutants] = useState<Pollutant[]>(['PM2.5']);
  const [dataSource, setDataSource] = useState<DataSource>('satellite');
  const [userSettings, setUserSettings] = useState<UserSettings>({
      location: 'Los Angeles, CA',
      sensitivity: 'asthma',
      personaCategory: 'resident',
      jobTitle: '',
      organization: '',
      populationGroups: [],
      primaryUseCases: [],
      publicSector: '',
      tourismFocus: '',
  });
  const [alerts, setAlerts] = useState<Alert[]>([
      { id: 1, pollutant: 'PM2.5', threshold: 100, active: true },
      { id: 2, pollutant: 'O3', threshold: 150, active: true },
      { id: 3, pollutant: 'NO2', threshold: 80, active: false },
  ]);
  const [location, setLocation] = useState<Location | null>(null);


  const handlePollutantChange = useCallback((pollutant: Pollutant) => {
    setSelectedPollutants(prev => 
      prev.includes(pollutant) 
        ? prev.filter(p => p !== pollutant) 
        : [...prev, pollutant]
    );
  }, []);

  const handleDataSourceChange = useCallback((source: DataSource) => {
    setDataSource(source);
  }, []);
  
  const handleSetLocation = (newLocation: Location | null) => {
      setLocation(newLocation);
      if (newLocation) {
          setCurrentView('map');
      }
  }

  const renderView = () => {
    switch (currentView) {
      case 'map':
        return <MapView onShowForecast={() => setCurrentView('forecast')} location={location} setLocation={handleSetLocation} />;
      case 'forecast':
        return <ForecastView location={location} />;
      case 'alerts':
        return <AlertsView alerts={alerts} setAlerts={setAlerts} userSettings={userSettings}/>;
      case 'trends':
        return <TrendsView location={location} />;
      case 'settings':
        return <SettingsView settings={userSettings} setSettings={setUserSettings} />;
      default:
        return <MapView onShowForecast={() => setCurrentView('forecast')} location={location} setLocation={handleSetLocation} />;
    }
  };

  return (
    <div className="bg-brand-dark text-brand-text font-sans flex h-screen overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        onNavigate={setCurrentView}
        selectedPollutants={selectedPollutants}
        onPollutantChange={handlePollutantChange}
        dataSource={dataSource}
        onDataSourceChange={handleDataSourceChange}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
