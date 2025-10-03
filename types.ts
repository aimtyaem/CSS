
export type View = 'map' | 'forecast' | 'alerts' | 'trends' | 'settings';

export type Pollutant = 'PM2.5' | 'O3' | 'NO2' | 'SO2' | 'CH2O' | 'Aerosol Index' | 'AQI';

export type DataSource = 'satellite' | 'ground';

export type Sensitivity = 'none' | 'child' | 'elderly' | 'asthma' | 'athlete';

// NEW Persona types
export type PersonaCategory = 'health_guardian' | 'public_official' | 'tourism_pro' | 'resident';
export type PopulationGroup = 'children' | 'elderly' | 'athletes' | 'respiratory_patients' | 'general_community';
export type PublicSector = 'transportation' | 'parks_recreation' | 'municipal_governance' | 'environmental_protection';
export type TourismFocus = 'itinerary_planning' | 'visitor_advisories' | 'hotel_operations';
export type PrimaryUseCase = 'plan_outdoor_activities' | 'manage_indoor_air' | 'issue_public_warnings' | 'adjust_transportation' | 'plan_public_events' | 'advise_tourists';


export interface Location {
    name: string;
    lat: number;
    lon: number;
}

export interface UserSettings {
    location: string;
    sensitivity: Sensitivity;
    // New persona fields
    personaCategory: PersonaCategory;
    jobTitle: string;
    organization: string;
    // Arrays for multi-select
    populationGroups: PopulationGroup[];
    primaryUseCases: PrimaryUseCase[];
    // Single select
    publicSector: PublicSector | '';
    tourismFocus: TourismFocus | '';
}

export interface Alert {
    id: number;
    pollutant: Pollutant;
    threshold: number; // AQI value
    active: boolean;
}

export interface PollutantLayer {
    id: Pollutant;
    name: string;
    unit: string;
    imageUrl: string;
    gradient: string;
}

// New types for API data
export interface AirQualityMeasurement {
  parameter: Pollutant | string;
  value: number;
  unit: string;
}

export interface CurrentAirQuality {
  aqi: number;
  primaryPollutant: Pollutant;
  category: string;
  summary: string;
  measurements: AirQualityMeasurement[];
}

export interface Weather {
    temperature: number;
    feelsLike: number;
    windSpeed: number;
    windDirection: string;
}

export interface ForecastAqi {
    hourly: { time: string; [key: string]: number | string }[];
    daily: { day: string; [key: string]: number | string }[];
}
