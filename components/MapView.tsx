import React, { useEffect, useRef, useState } from 'react';
import type { PollutantLayer, Location, CurrentAirQuality } from '../types';
import { POLLUTANT_LAYERS } from '../constants';
import { PlusIcon, MinusIcon, SearchIcon, LayersIcon, CrosshairsIcon, XIcon, LoadingSpinner } from './icons';

declare const L: any;

// --- Simulated Geocoding API Data and Function ---
const ALL_MOCK_LOCATIONS: Location[] = [
    { name: 'New York, NY, USA', lat: 40.7128, lon: -74.0060 },
    { name: 'London, UK', lat: 51.5072, lon: -0.1276 },
    { name: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503 },
    { name: 'Paris, France', lat: 48.8566, lon: 2.3522 },
    { name: 'Los Angeles, CA, USA', lat: 34.0522, lon: -118.2437 },
    { name: 'San Francisco, CA, USA', lat: 37.7749, lon: -122.4194 },
    { name: 'San Diego, CA, USA', lat: 32.7157, lon: -117.1611 },
    { name: 'Sydney, Australia', lat: -33.8688, lon: 151.2093 },
    { name: 'Singapore', lat: 1.3521, lon: 103.8198 },
    { name: 'Beijing, China', lat: 39.9042, lon: 116.4074 },
    { name: 'Moscow, Russia', lat: 55.7558, lon: 37.6173 },
    { name: 'Cairo, Egypt', lat: 30.0444, lon: 31.2357 },
];

const simulateGeocodingAPI = async (query: string): Promise<Location[]> => {
    await new Promise(resolve => setTimeout(resolve, 400)); // Simulate network delay
    if (!query) return [];
    const lowerCaseQuery = query.toLowerCase();
    return ALL_MOCK_LOCATIONS.filter(location => 
        location.name.toLowerCase().includes(lowerCaseQuery)
    );
};
// --- End of Simulated API ---

const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return 'text-green-400';
    if (aqi <= 100) return 'text-yellow-400';
    if (aqi <= 150) return 'text-orange-400';
    if (aqi <= 200) return 'text-red-500';
    if (aqi <= 300) return 'text-purple-500';
    return 'text-red-700';
};

const AqiCard: React.FC<{
    location: Location;
    aqiData: CurrentAirQuality | null;
    loading: boolean;
    onShowForecast: () => void;
    onClose: () => void;
}> = ({ location, aqiData, loading, onShowForecast, onClose }) => {
    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-8 ml-[14rem] bg-brand-mid/80 backdrop-blur-sm border border-brand-light rounded-lg shadow-2xl p-6 w-80 text-brand-text z-[1001] animate-fade-in">
            <button onClick={onClose} className="absolute top-2 right-2 p-1 text-brand-text-muted hover:text-white transition-colors">
                <XIcon className="w-5 h-5" />
            </button>
            {loading ? (
                 <div className="flex flex-col items-center justify-center h-48">
                    <LoadingSpinner className="w-8 h-8 text-brand-accent"/>
                    <p className="mt-4 text-brand-text-muted">Fetching Air Quality...</p>
                 </div>
            ) : aqiData ? (
                <>
                    <div className="text-center">
                        <p className="text-sm text-brand-text-muted">{location.name}</p>
                        <p className={`text-6xl font-bold my-2 ${getAqiColor(aqiData.aqi)}`}>{aqiData.aqi}</p>
                        <p className={`font-semibold ${getAqiColor(aqiData.aqi)}`}>{aqiData.category}</p>
                    </div>
                    <div className="my-4 h-px bg-brand-light"></div>
                    <div>
                        <h4 className="font-semibold mb-2">Summary</h4>
                        <p className="text-sm text-brand-text-muted leading-relaxed">{aqiData.summary}</p>
                    </div>
                    <div className="my-4 h-px bg-brand-light"></div>
                    <div className="text-xs text-brand-text-muted">
                        <p>Primary Pollutant: {aqiData.primaryPollutant}</p>
                        <p>Data Sources: TEMPO Satellite, OpenAQ, Weather.com</p>
                    </div>
                    <button onClick={onShowForecast} className="mt-6 w-full bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        View Full Forecast
                    </button>
                </>
            ) : (
                 <div className="flex flex-col items-center justify-center h-48">
                    <p className="text-brand-text-muted">No data available for this location.</p>
                 </div>
            )}
        </div>
    );
};

const MapLegend: React.FC<{ activeLayer: PollutantLayer }> = ({ activeLayer }) => (
    <div className="absolute bottom-4 left-4 bg-brand-mid/80 backdrop-blur-sm border border-brand-light rounded-lg shadow-lg p-4 w-60 text-brand-text z-[1000]">
        <h4 className="font-semibold mb-2 text-sm">{activeLayer.name} ({activeLayer.unit})</h4>
        <div className="flex items-center space-x-2">
            <div className={`flex h-2 rounded-full overflow-hidden flex-1 bg-gradient-to-r ${activeLayer.gradient}`}>
            </div>
        </div>
        <div className="flex justify-between text-xs mt-1 text-brand-text-muted">
            <span>Low</span>
            <span>High</span>
        </div>
    </div>
);

const MapSearch: React.FC<{ onSearch: (location: Location) => void }> = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Location[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // Debounced search effect
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
        }, 300); // 300ms debounce

        return () => clearTimeout(handler);
    }, [query]);
    
    // Effect to handle clicks outside the search component
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
                    placeholder="Search for a city..."
                    className="w-full bg-brand-mid/80 backdrop-blur-sm border border-brand-light rounded-full shadow-lg py-3 pl-12 pr-12 text-brand-text placeholder-brand-text-muted focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <SearchIcon className="w-5 h-5 text-brand-text-muted" />
                </div>
                {isLoading && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <LoadingSpinner className="w-5 h-5 text-brand-text-muted" />
                    </div>
                )}
            </div>
            
            {results.length > 0 && (
                <div className="absolute mt-2 w-full bg-brand-mid/90 backdrop-blur-sm border border-brand-light rounded-lg shadow-lg max-h-60 overflow-y-auto animate-fade-in-up-fast">
                    <ul>
                        {results.map((result) => (
                            <li key={`${result.lat}-${result.lon}`}>
                                <button
                                    onClick={() => handleSelectLocation(result)}
                                    className="w-full text-left px-4 py-3 text-brand-text hover:bg-brand-light transition-colors"
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


const LayerToggle: React.FC<{ activeLayer: PollutantLayer; onLayerChange: (layer: PollutantLayer) => void; }> = ({ activeLayer, onLayerChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="absolute bottom-20 left-4 z-[1000]">
            {isOpen && (
                 <div className="bg-brand-mid/80 backdrop-blur-sm border border-brand-light rounded-lg shadow-lg p-2 mb-2 w-48 animate-fade-in-up">
                    <div className="space-y-1">
                        {POLLUTANT_LAYERS.map(layer => (
                            <button key={layer.id} onClick={() => { onLayerChange(layer); setIsOpen(false); }}
                                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${activeLayer.id === layer.id ? 'bg-brand-accent text-white' : 'text-brand-text hover:bg-brand-light'}`}>
                                {layer.name}
                            </button>
                        ))}
                    </div>
                 </div>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="bg-brand-mid/80 backdrop-blur-sm border border-brand-light rounded-lg shadow-lg p-3 hover:bg-brand-light transition-colors">
                <LayersIcon className="w-6 h-6 text-brand-text"/>
            </button>
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
            <button onClick={handleZoomIn} className="bg-brand-mid/80 backdrop-blur-sm border border-brand-light rounded-lg shadow-lg p-3 hover:bg-brand-light transition-colors">
                <PlusIcon className="w-6 h-6 text-brand-text"/>
            </button>
            <button onClick={handleZoomOut} className="bg-brand-mid/80 backdrop-blur-sm border border-brand-light rounded-lg shadow-lg p-3 hover:bg-brand-light transition-colors">
                <MinusIcon className="w-6 h-6 text-brand-text"/>
            </button>
            <button onClick={handleMyLocation} className="bg-brand-mid/80 backdrop-blur-sm border border-brand-light rounded-lg shadow-lg p-3 mt-2 hover:bg-brand-light transition-colors">
                <CrosshairsIcon className="w-6 h-6 text-brand-text"/>
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
    const overlayRef = useRef<any>(null);
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
            
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                maxZoom: 19,
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

            const icon = L.divIcon({
                className: 'custom-div-icon',
                html: `<div class="w-4 h-4 bg-brand-accent rounded-full border-2 border-white shadow-lg animate-pulse"></div>`,
                iconSize: [16, 16],
                iconAnchor: [8, 8]
            });

            markerRef.current = L.marker([location.lat, location.lon], { icon }).addTo(map);

            // Simulate API call
            setTimeout(() => {
                const mockAqiData: CurrentAirQuality = {
                    aqi: Math.floor(Math.random() * 150) + 20,
                    primaryPollutant: 'PM2.5',
                    category: 'Moderate',
                    summary: 'AQI may worsen slightly in the afternoon due to increased traffic. Sensitive groups should monitor symptoms.',
                    measurements: [
                        { parameter: 'PM2.5', value: 68, unit: 'µg/m³' },
                        { parameter: 'O3', value: 45, unit: 'ppb' }
                    ]
                };
                 if (mockAqiData.aqi <= 50) mockAqiData.category = 'Good';
                 else if (mockAqiData.aqi <= 100) mockAqiData.category = 'Moderate';
                 else if (mockAqiData.aqi <= 150) mockAqiData.category = 'Unhealthy for Sensitive Groups';
                 else mockAqiData.category = 'Unhealthy';

                setCurrentAqi(mockAqiData);
                setIsAqiLoading(false);
            }, 1200);

        } else if (!location && mapRef.current && markerRef.current) {
             mapRef.current.removeLayer(markerRef.current);
             markerRef.current = null;
        }

    }, [location]);

    useEffect(() => {
        if (mapRef.current) {
            if (overlayRef.current) {
                mapRef.current.removeLayer(overlayRef.current);
            }
            const bounds = mapRef.current.getBounds();
            const imageBounds = [[bounds.getNorth(), bounds.getWest()], [bounds.getSouth(), bounds.getEast()]];
            
            const overlay = L.imageOverlay(activeLayer.imageUrl, imageBounds, {
                opacity: 0.6,
                interactive: false,
            }).addTo(mapRef.current);
            overlayRef.current = overlay;
        }
    }, [activeLayer, mapRef.current]);

    return (
        <div className="relative flex-1 bg-brand-dark" style={{height: '100%', width: '100%'}}>
            <div ref={mapContainerRef} className="w-full h-full" />
            <MapSearch onSearch={setLocation} />
            <MapControls map={mapRef.current} />
            <LayerToggle activeLayer={activeLayer} onLayerChange={setActiveLayer} />
            <MapLegend activeLayer={activeLayer} />
            {location && <AqiCard onShowForecast={onShowForecast} onClose={() => setLocation(null)} location={location} aqiData={currentAqi} loading={isAqiLoading}/>}
        </div>
    );
};
