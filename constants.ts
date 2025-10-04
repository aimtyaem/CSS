import type { Pollutant, PollutantLayer } from './types';

export const POLLUTANTS: Pollutant[] = ['PM2.5', 'O3', 'NO2', 'SO2'];

export const POLLUTANT_LAYERS: PollutantLayer[] = [
    { id: 'AQI', name: 'Combined AQI', unit: 'AQI', gradient: 'from-blue-400 via-green-400 via-yellow-400 to-red-500' },
    { id: 'PM2.5', name: 'PM2.5', unit: 'µg/m³', gradient: 'from-cyan-400 to-cyan-700' },
    { id: 'O3', name: 'Ozone (O₃)', unit: 'ppb', gradient: 'from-purple-400 to-purple-700'},
    { id: 'NO2', name: 'Nitrogen Dioxide (NO₂)', unit: 'ppb', gradient: 'from-orange-400 to-orange-700'},
    { id: 'CH2O', name: 'Formaldehyde (CH₂O)', unit: 'ppb', gradient: 'from-teal-400 to-teal-700'},
    { id: 'Aerosol Index', name: 'Aerosol Index', unit: 'index', gradient: 'from-gray-400 to-gray-700'},
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