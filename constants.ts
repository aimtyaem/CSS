import type { Pollutant, PollutantLayer } from './types';

export const POLLUTANTS: Pollutant[] = ['PM2.5', 'O3', 'NO2', 'SO2'];

export const POLLUTANT_LAYERS: PollutantLayer[] = [
    { id: 'AQI', name: 'Combined AQI', unit: 'AQI', imageUrl: 'https://picsum.photos/seed/aqi/1600/1200', gradient: 'from-green-500 via-yellow-500 via-orange-500 to-red-500' },
    { id: 'PM2.5', name: 'PM2.5', unit: 'µg/m³', imageUrl: 'https://picsum.photos/seed/pm25/1600/1200', gradient: 'from-sky-200 via-sky-500 to-sky-900' },
    { id: 'O3', name: 'Ozone (O₃)', unit: 'ppb', imageUrl: 'https://picsum.photos/seed/o3/1600/1200', gradient: 'from-purple-200 via-purple-500 to-purple-900'},
    { id: 'NO2', name: 'Nitrogen Dioxide (NO₂)', unit: 'ppb', imageUrl: 'https://picsum.photos/seed/no2/1600/1200', gradient: 'from-amber-200 via-amber-500 to-amber-900'},
    { id: 'CH2O', name: 'Formaldehyde (CH₂O)', unit: 'ppb', imageUrl: 'https://picsum.photos/seed/ch2o/1600/1200', gradient: 'from-teal-200 via-teal-500 to-teal-900'},
    { id: 'Aerosol Index', name: 'Aerosol Index', unit: 'index', imageUrl: 'https://picsum.photos/seed/aerosol/1600/1200', gradient: 'from-slate-200 via-slate-400 to-slate-600'},
];


export const SENSITIVITY_GROUPS = [
    { id: 'none', name: 'None' },
    { id: 'child', name: 'Children' },
    { id: 'elderly', name: 'Elderly' },
    { id: 'asthma', name: 'Asthma' },
    { id: 'athlete', name: 'Athletes' },
];

export const HEALTH_ADVICE: { [key: string]: { [key: string]: string } } = {
  good: {
    general: "It's a great day to be active outside.",
    sensitive: "Enjoy outdoor activities."
  },
  moderate: {
    general: "Air quality is acceptable. Unusually sensitive people should consider reducing prolonged or heavy exertion.",
    sensitive: "Consider reducing intense outdoor activities."
  },
  unhealthy_sensitive: {
    general: "The general public is not likely to be affected. Members of sensitive groups may experience health effects.",
    sensitive: "Reduce prolonged or heavy exertion outdoors. Take more breaks."
  },
  unhealthy: {
    general: "Everyone may begin to experience health effects. Members of sensitive groups may experience more serious health effects.",
    sensitive: "Avoid prolonged or heavy exertion. Consider moving activities indoors."
  },
  very_unhealthy: {
    general: "Health alert: everyone may experience more serious health effects.",
    sensitive: "Avoid all physical activity outdoors. Keep outdoor activities short."
  },
  hazardous: {
    general: "Health warnings of emergency conditions. The entire population is more likely to be affected.",
    sensitive: "Remain indoors and keep activity levels low."
  }
};
