
import React, { useState, useEffect } from 'react';
import type { UserSettings, PersonaCategory, PopulationGroup, PublicSector, TourismFocus, PrimaryUseCase, Sensitivity } from '../types';
import { SENSITIVITY_GROUPS } from '../constants';
import { UserGroupIcon, BuildingLibraryIcon, GlobeAltIcon, HomeIcon } from './icons';

interface SettingsViewProps {
    settings: UserSettings;
    setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
}

const personaOptions = [
    { id: 'health_guardian', name: 'Health & Safety Guardian', description: 'For those protecting vulnerable groups', icon: <UserGroupIcon className="w-8 h-8"/> },
    { id: 'public_official', name: 'Public Official / Planner', description: 'For municipal and policy roles', icon: <BuildingLibraryIcon className="w-8 h-8"/> },
    { id: 'tourism_pro', name: 'Tourism Professional', description: 'For visitor safety and experience', icon: <GlobeAltIcon className="w-8 h-8"/> },
    { id: 'resident', name: 'General Resident', description: 'For personal and family use', icon: <HomeIcon className="w-8 h-8"/> },
];

const populationGroupOptions: {id: PopulationGroup, name: string}[] = [
    { id: 'children', name: 'Children' },
    { id: 'elderly', name: 'Elderly' },
    { id: 'athletes', name: 'Athletes' },
    { id: 'respiratory_patients', name: 'Patients with respiratory conditions' },
    { id: 'general_community', name: 'General Community' },
];

const publicSectorOptions: {id: PublicSector, name: string}[] = [
    { id: 'transportation', name: 'Transportation' },
    { id: 'parks_recreation', name: 'Parks & Recreation' },
    { id: 'municipal_governance', name: 'Municipal Governance' },
    { id: 'environmental_protection', name: 'Environmental Protection' },
];

const tourismFocusOptions: {id: TourismFocus, name: string}[] = [
    { id: 'itinerary_planning', name: 'Itinerary Planning' },
    { id: 'visitor_advisories', name: 'Visitor Safety Advisories' },
    { id: 'hotel_operations', name: 'Hotel Operations' },
];

const primaryUseCasesOptions: {id: PrimaryUseCase, name: string}[] = [
    { id: 'plan_outdoor_activities', name: 'Planning outdoor activities (recess, sports)' },
    { id: 'manage_indoor_air', name: 'Managing indoor air systems' },
    { id: 'issue_public_warnings', name: 'Issuing public warnings/advisories' },
    { id: 'adjust_transportation', name: 'Adjusting transportation/traffic' },
    { id: 'plan_public_events', name: 'Planning public events' },
    { id: 'advise_tourists', name: 'Advising tourists/visitors' },
];

const FormInput: React.FC<{label: string; id: string; children: React.ReactNode}> = ({ label, id, children }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-brand-text-muted mb-2">{label}</label>
        {children}
    </div>
);

const CheckboxGroup: React.FC<{ title: string; options: {id: string, name: string}[], selected: string[], onChange: (id: string) => void }> = ({ title, options, selected, onChange }) => (
    <div>
        <h3 className="text-sm font-medium text-brand-text-muted mb-3">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {options.map(option => (
                 <label key={option.id} className="flex items-center text-sm text-brand-text cursor-pointer">
                    <input
                        type="checkbox"
                        checked={selected.includes(option.id)}
                        onChange={() => onChange(option.id)}
                        className="form-checkbox h-4 w-4 bg-brand-light border-brand-light rounded text-brand-accent focus:ring-brand-accent"
                    />
                    <span className="ml-3">{option.name}</span>
                </label>
            ))}
        </div>
    </div>
);

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, setSettings }) => {
    const [formState, setFormState] = useState<UserSettings>(settings);

    useEffect(() => {
        setFormState(settings);
    }, [settings]);

    const handleSave = () => {
        setSettings(formState);
        // Here you would typically show a success message
    };
    
    const handleMultiSelectChange = (field: 'populationGroups' | 'primaryUseCases', value: string) => {
        const currentValues = formState[field] as string[];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];
        
        setFormState(prev => ({...prev, [field]: newValues}));
    };
    
    return (
        <div className="p-8 flex-1 overflow-y-auto bg-brand-dark">
            <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
            
            <div className="max-w-4xl mx-auto">
                {/* Persona Selection */}
                <div className="bg-brand-mid p-8 rounded-lg border border-brand-light">
                    <h2 className="text-xl font-semibold text-white mb-2">Tell us about you</h2>
                    <p className="text-brand-text-muted text-sm mb-6">Selecting a persona helps us customize the app's features, alerts, and insights for your specific needs.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {personaOptions.map(p => (
                            <button key={p.id} onClick={() => setFormState(prev => ({...prev, personaCategory: p.id as PersonaCategory}))}
                                className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${formState.personaCategory === p.id ? 'bg-brand-accent/20 border-brand-accent' : 'bg-brand-light border-brand-light hover:border-brand-text-muted'}`}>
                                <div className={`mb-3 text-${formState.personaCategory === p.id ? 'brand-accent':'brand-text'}`}>{p.icon}</div>
                                <h3 className="font-semibold text-white">{p.name}</h3>
                                <p className="text-xs text-brand-text-muted mt-1">{p.description}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dynamic Persona Details */}
                <div className="bg-brand-mid p-8 rounded-lg border border-brand-light mt-8">
                    <h2 className="text-xl font-semibold text-white mb-6">Your Profile Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <FormInput label="Default Location" id="location">
                             <input type="text" id="location" value={formState.location} onChange={e => setFormState(prev => ({...prev, location: e.target.value}))}
                                placeholder="e.g., San Francisco, CA"
                                className="w-full bg-brand-light border-brand-light rounded-lg p-3 text-white focus:ring-brand-accent focus:border-brand-accent" />
                        </FormInput>

                        {formState.personaCategory !== 'resident' && (
                            <>
                                <FormInput label="Job Title" id="jobTitle">
                                    <input type="text" id="jobTitle" value={formState.jobTitle} onChange={e => setFormState(prev => ({...prev, jobTitle: e.target.value}))}
                                        placeholder={formState.personaCategory === 'health_guardian' ? 'e.g., School Nurse' : 'e.g., Transportation Planner'}
                                        className="w-full bg-brand-light border-brand-light rounded-lg p-3 text-white focus:ring-brand-accent focus:border-brand-accent" />
                                </FormInput>
                                <FormInput label="Organization / Company" id="organization">
                                    <input type="text" id="organization" value={formState.organization} onChange={e => setFormState(prev => ({...prev, organization: e.target.value}))}
                                        placeholder="e.g., Cairo Public Schools"
                                        className="w-full bg-brand-light border-brand-light rounded-lg p-3 text-white focus:ring-brand-accent focus:border-brand-accent" />
                                </FormInput>
                            </>
                        )}
                        
                        {formState.personaCategory === 'health_guardian' && (
                             <div className="md:col-span-2">
                                <CheckboxGroup title="Population I protect" options={populationGroupOptions} selected={formState.populationGroups} onChange={(id) => handleMultiSelectChange('populationGroups', id as PopulationGroup)} />
                             </div>
                        )}
                        {formState.personaCategory === 'public_official' && (
                            <FormInput label="Department / Sector" id="publicSector">
                                <select id="publicSector" value={formState.publicSector} onChange={e => setFormState(prev => ({...prev, publicSector: e.target.value as PublicSector}))}
                                    className="w-full bg-brand-light border-brand-light rounded-lg p-3 text-white focus:ring-brand-accent focus:border-brand-accent">
                                    <option value="">Select a sector</option>
                                    {publicSectorOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                                </select>
                            </FormInput>
                        )}
                         {formState.personaCategory === 'tourism_pro' && (
                            <FormInput label="Primary Focus" id="tourismFocus">
                                <select id="tourismFocus" value={formState.tourismFocus} onChange={e => setFormState(prev => ({...prev, tourismFocus: e.target.value as TourismFocus}))}
                                    className="w-full bg-brand-light border-brand-light rounded-lg p-3 text-white focus:ring-brand-accent focus:border-brand-accent">
                                    <option value="">Select a focus</option>
                                    {tourismFocusOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                                </select>
                            </FormInput>
                        )}
                        
                        {formState.personaCategory === 'resident' && (
                             <FormInput label="Health Sensitivity Group" id="sensitivity">
                                <select id="sensitivity" value={formState.sensitivity} onChange={e => setFormState(prev => ({...prev, sensitivity: e.target.value as Sensitivity}))}
                                    className="w-full bg-brand-light border-brand-light rounded-lg p-3 text-white focus:ring-brand-accent focus:border-brand-accent">
                                    {SENSITIVITY_GROUPS.map(group => <option key={group.id} value={group.id}>{group.name}</option>)}
                                </select>
                            </FormInput>
                        )}

                        {formState.personaCategory !== 'resident' && (
                            <div className="md:col-span-2">
                                <CheckboxGroup title="Primary activities using this app" options={primaryUseCasesOptions} selected={formState.primaryUseCases} onChange={(id) => handleMultiSelectChange('primaryUseCases', id as PrimaryUseCase)} />
                             </div>
                        )}
                    </div>
                </div>

                <div className="bg-brand-mid p-8 rounded-lg border border-brand-light mt-8 space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold text-white mb-2">Resources</h2>
                         <p className="text-brand-text-muted text-sm">Learn more about air quality and the data sources we use.</p>
                    </div>
                    <div className="flex flex-col space-y-3">
                       <a href="#" className="text-brand-accent hover:underline">Data Transparency & Sources</a>
                       <a href="#" className="text-brand-accent hover:underline">Understanding AQI</a>
                       <a href="#" className="text-brand-accent hover:underline">About the TEMPO Mission</a>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button onClick={handleSave} className="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-3 px-6 rounded-lg transition-colors">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};
