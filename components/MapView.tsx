import React, { useEffect, useRef, useState } from 'react';
import type { PollutantLayer, Location, CurrentAirQuality } from '../types';
import { POLLUTANT_LAYERS } from '../constants';
import { PlusIcon, MinusIcon, SearchIcon, CrosshairsIcon, XIcon, LoadingSpinner } from './icons';

declare const L: any;

// --- Updated Mock Data ---
const ALL_MOCK_LOCATIONS: Location[] = [
    { name: 'Hồ Chí Minh, Việt Nam', lat: 10.8231, lon: 106.6297 },
    { name: 'Hà Nội, Việt Nam', lat: 21.0285, lon: 105.8542 },
    { name: 'New York, NY, USA', lat: 40.7128, lon: -74.0060 },
    { name: 'Paris, France', lat: 48.8566, lon: 2.3522 },
];

const MOCK_AQI_DATA: { [key: string]: CurrentAirQuality } = {
    'Hồ Chí Minh, Việt Nam': {
        aqi: 155,
        primaryPollutant: 'PM2.5',
        category: 'Unhealthy',
        summary: 'Air quality is unhealthy due to high levels of PM2.5. Everyone may begin to experience health effects.',
        measurements: [
            { parameter: 'PM2.5', value: 65.5, unit: 'µg/m³' },
            { parameter: 'O3', value: 45.2, unit: 'ppb' },
            { parameter: 'NO2', value: 20.1, unit: 'ppb' },
            { parameter: 'AQI', value: 155, unit: ''},
        ]
    },
    'Hà Nội, Việt Nam': {
        aqi: 120,
        primaryPollutant: 'PM2.5',
        category: 'Unhealthy for Sensitive Groups',
        summary: 'Members of sensitive groups may experience health effects. The general public is not likely to be affected.',
        measurements: [
            { parameter: 'PM2.5', value: 43.8, unit: 'µg/m³' },
            { parameter: 'O3', value: 50.1, unit: 'ppb' },
            { parameter: 'NO2', value: 25.6, unit: 'ppb' },
            { parameter: 'AQI', value: 120, unit: ''},
        ]
    },
    'New York, NY, USA': {
        aqi: 45,
        primaryPollutant: 'O3',
        category: 'Good',
        summary: "It's a great day to be active outside. Air quality is considered satisfactory.",
        measurements: [
            { parameter: 'PM2.5', value: 10.2, unit: 'µg/m³' },
            { parameter: 'O3', value: 35.5, unit: 'ppb' },
            { parameter: 'NO2', value: 15.3, unit: 'ppb' },
            { parameter: 'AQI', value: 45, unit: ''},
        ]
    },
    'Paris, France': {
        aqi: 78,
        primaryPollutant: 'NO2',
        category: 'Moderate',
        summary: 'Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people.',
        measurements: [
            { parameter: 'PM2.5', value: 18.9, unit: 'µg/m³' },
            { parameter: 'O3', value: 42.0, unit: 'ppb' },
            { parameter: 'NO2', value: 30.7, unit: 'ppb' },
            { parameter: 'AQI', value: 78, unit: ''},
        ]
    }
};

const simulateGeocodingAPI = async (query: string): Promise<Location[]> => {
    await new Promise(resolve => setTimeout(resolve, 400)); // Simulate network delay
    if (!query) return [];
    const lowerCaseQuery = query.toLowerCase();
    return ALL_MOCK_LOCATIONS.filter(location => 
        location.name.toLowerCase().includes(lowerCaseQuery)
    );
};
// --- End of Mock Data ---

const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return 'text-green-500';
    if (aqi <= 100) return 'text-yellow-500';
    if (aqi <= 150) return 'text-orange-500';
    if (aqi <= 200) return 'text-red-500';
    if (aqi <= 300) return 'text-purple-500';
    return 'text-red-700';
};

// Returns a Tailwind background color class based on AQI value
const getAqiBgClass = (aqi: number) => {
    if (aqi <= 50) return 'bg-green-500';
    if (aqi <= 100) return 'bg-yellow-500';
    if (aqi <= 150) return 'bg-orange-500';
    if (aqi <= 200) return 'bg-red-500';
    if (aqi <= 300) return 'bg-purple-700';
    return 'bg-red-800';
};


const AqiCard: React.FC<{
    location: Location;
    aqiData: CurrentAirQuality | null;
    loading: boolean;
    onShowForecast: () => void;
    onClose: () => void;
    activeLayer: PollutantLayer;
}> = ({ location, aqiData, loading, onShowForecast, onClose, activeLayer }) => {
    
    const activeMeasurement = aqiData?.measurements.find(m => m.parameter === activeLayer.id);

    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-8 ml-[14rem] bg-theme-surface border border-theme-border rounded-lg shadow-2xl p-6 w-80 text-theme-text-primary z-[1001] animate-fade-in">
            <button onClick={onClose} className="absolute top-2 right-2 p-1 text-theme-text-secondary hover:text-theme-text-primary transition-colors">
                <XIcon className="w-5 h-5" />
            </button>
            {loading ? (
                 <div className="flex flex-col items-center justify-center h-48">
                    <LoadingSpinner className="w-8 h-8 text-theme-primary"/>
                    <p className="mt-4 text-theme-text-secondary">Fetching Air Quality...</p>
                 </div>
            ) : aqiData ? (
                <>
                    <div className="text-center">
                        <p className="text-sm text-theme-text-secondary">{location.name}</p>
                        <p className="text-xs text-theme-text-secondary font-mono mt-1">OVERALL AQI</p>
                        <p className={`text-6xl font-bold my-1 ${getAqiColor(aqiData.aqi)}`}>{aqiData.aqi}</p>
                        <p className={`font-semibold ${getAqiColor(aqiData.aqi)}`}>{aqiData.category}</p>
                    </div>
                    {activeMeasurement && (
                        <div className="mt-4 text-center bg-slate-50 p-2 rounded-lg border border-theme-border">
                            <p className="text-xs text-theme-text-secondary font-mono">{activeLayer.name.toUpperCase()}</p>
                            <p className="text-xl font-bold text-theme-primary">{activeMeasurement.value.toFixed(1)} <span className="text-sm font-normal text-theme-text-secondary">{activeMeasurement.unit}</span></p>
                        </div>
                    )}
                    <div className="my-4 h-px bg-theme-border"></div>
                    <div>
                        <h4 className="font-semibold mb-2 font-mono uppercase text-sm tracking-wider">Summary</h4>
                        <p className="text-sm text-theme-text-secondary leading-relaxed">{aqiData.summary}</p>
                    </div>

                    <button onClick={onShowForecast} className="mt-6 w-full bg-theme-primary hover:bg-theme-primary-hover text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-theme-primary/20 hover:shadow-glow-primary transform hover:scale-105">
                        View Full Forecast
                    </button>
                </>
            ) : (
                 <div className="flex flex-col items-center justify-center h-48">
                    <p className="text-theme-text-secondary">No data available for this location.</p>
                 </div>
            )}
        </div>
    );
};

const MapSearch: React.FC<{ onSearch: (location: Location) => void }> = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Location[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (query.trim().length < 2) {
            setResults([]);
            return;
        }

        const handler = setTimeout(async () => {
            setIsLoading(true);
            const apiResults = await simulateGeocodingAPI(query);
            setResults(apiResults);
            setIsLoading(false);
        }, 300); 

        return () => clearTimeout(handler);
    }, [query]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setResults([]);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectLocation = (location: Location) => {
        setQuery(location.name);
        setResults([]);
        onSearch(location);
    };

    return (
        <div ref={searchContainerRef} className="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-md z-[1000]">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a city or region..."
                    className="w-full bg-theme-surface border border-theme-border rounded-full shadow-lg py-3 pl-12 pr-12 text-theme-text-primary placeholder-theme-text-secondary focus:outline-none focus:ring-2 focus:ring-theme-primary"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <SearchIcon className="w-5 h-5 text-theme-text-secondary" />
                </div>
                {isLoading && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <LoadingSpinner className="w-5 h-5 text-theme-text-secondary" />
                    </div>
                )}
            </div>
            
            {results.length > 0 && (
                <div className="absolute mt-2 w-full bg-theme-surface border border-theme-border rounded-lg shadow-lg max-h-60 overflow-y-auto animate-fade-in-up">
                    <ul>
                        {results.map((result) => (
                            <li key={`${result.lat}-${result.lon}`}>
                                <button
                                    onClick={() => handleSelectLocation(result)}
                                    className="w-full text-left px-4 py-3 text-theme-text-primary hover:bg-theme-primary/10 transition-colors"
                                >
                                    {result.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const MapControls: React.FC<{map: any}> = ({ map }) => {

    const handleZoomIn = () => map?.zoomIn();
    const handleZoomOut = () => map?.zoomOut();
    const handleMyLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                map?.flyTo([position.coords.latitude, position.coords.longitude], 13);
            },
            () => alert('Could not get your location. Please ensure location services are enabled.'),
            { enableHighAccuracy: true }
        );
    };

    return (
        <div className="absolute bottom-4 right-4 z-[1000] flex flex-col space-y-2">
            <button onClick={handleZoomIn} className="bg-theme-surface border border-theme-border rounded-lg shadow-lg p-3 hover:bg-slate-50 transition-transform duration-200 hover:scale-110 hover:border-theme-primary/50">
                <PlusIcon className="w-6 h-6 text-theme-text-primary"/>
            </button>
            <button onClick={handleZoomOut} className="bg-theme-surface border border-theme-border rounded-lg shadow-lg p-3 hover:bg-slate-50 transition-transform duration-200 hover:scale-110 hover:border-theme-primary/50">
                <MinusIcon className="w-6 h-6 text-theme-text-primary"/>
            </button>
            <button onClick={handleMyLocation} className="bg-theme-surface border border-theme-border rounded-lg shadow-lg p-3 mt-2 hover:bg-slate-50 transition-transform duration-200 hover:scale-110 hover:border-theme-primary/50">
                <CrosshairsIcon className="w-6 h-6 text-theme-text-primary"/>
            </button>
        </div>
    );
};


export const MapView: React.FC<{
    onShowForecast: () => void;
    location: Location | null;
    setLocation: (location: Location | null) => void;
}> = ({ onShowForecast, location, setLocation }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const [activeLayer, setActiveLayer] = useState<PollutantLayer>(POLLUTANT_LAYERS[0]);
    const [currentAqi, setCurrentAqi] = useState<CurrentAirQuality | null>(null);
    const [isAqiLoading, setIsAqiLoading] = useState(false);
    
    useEffect(() => {
        if (mapContainerRef.current && !mapRef.current) {
            const map = L.map(mapContainerRef.current, {
                center: [39.82, -98.58],
                zoom: 4,
                zoomControl: false,
                attributionControl: false,
            });
            mapRef.current = map;
            
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            }).addTo(map);
        }
    }, []);
    
    useEffect(() => {
        if (location && mapRef.current) {
            setIsAqiLoading(true);
            setCurrentAqi(null);
            
            const map = mapRef.current;
            map.flyTo([location.lat, location.lon], 10);
            
            if (markerRef.current) {
                map.removeLayer(markerRef.current);
            }

            const loadingIcon = L.divIcon({
                className: 'custom-div-icon',
                html: `<div class="w-10 h-10 rounded-full flex items-center justify-center bg-slate-400 border-2 border-white shadow-lg"><div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div></div>`,
                iconSize: [40, 40],
                iconAnchor: [20, 20]
            });
            markerRef.current = L.marker([location.lat, location.lon], { icon: loadingIcon }).addTo(map);

            setTimeout(() => {
                const mockAqiData = MOCK_AQI_DATA[location.name];

                setCurrentAqi(mockAqiData || null);
                setIsAqiLoading(false);

                if (mockAqiData) {
                    const measurement = mockAqiData.measurements.find(m => m.parameter === activeLayer.id) || mockAqiData.measurements.find(m => m.parameter === 'AQI')!;
                    const value = measurement.value;
                    const bgClass = getAqiBgClass(mockAqiData.aqi); 
                    
                    const icon = L.divIcon({
                         className: 'custom-div-icon',
                         html: `<div class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-base border-2 border-white shadow-lg ${bgClass}">${Math.round(value)}</div>`,
                         iconSize: [48, 48],
                         iconAnchor: [24, 24]
                    });
                    if(markerRef.current) markerRef.current.setIcon(icon);
                }

            }, 1200);

        } else if (!location && mapRef.current && markerRef.current) {
             mapRef.current.removeLayer(markerRef.current);
             markerRef.current = null;
        }

    }, [location, activeLayer]);


    return (
        <div className="relative flex-1 bg-slate-200" style={{height: '100%', width: '100%'}}>
            <div ref={mapContainerRef} className="w-full h-full" />
            <MapSearch onSearch={setLocation} />
            <MapControls map={mapRef.current} />
            {location && <AqiCard onShowForecast={onShowForecast} onClose={() => setLocation(null)} location={location} aqiData={currentAqi} loading={isAqiLoading} activeLayer={activeLayer}/>}
        </div>
    );
};
