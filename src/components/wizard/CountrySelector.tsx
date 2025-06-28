
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Globe } from 'lucide-react';

interface Country {
  code: string;
  name: string;
  currency: string;
  p1_name?: string;
  p2_name?: string;
}

interface CountrySelectorProps {
  selectedCountry: string;
  onCountrySelect: (countryCode: string) => void;
  className?: string;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountry,
  onCountrySelect,
  className = ''
}) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('code, name, currency, p1_name, p2_name')
        .order('name');

      if (error) {
        console.error('Error loading countries:', error);
        return;
      }

      setCountries(data || []);
    } catch (error) {
      console.error('Error loading countries:', error);
    } finally {
      setLoading(false);
    }
  };

  const popularCountries = ['RW', 'KE', 'UG', 'TZ', 'GH', 'NG'];
  const filteredCountries = showAll 
    ? countries 
    : countries.filter(c => popularCountries.includes(c.code));

  const selectedCountryData = countries.find(c => c.code === selectedCountry);

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-4 bg-white/20 rounded animate-pulse"></div>
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-12 bg-white/20 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Globe className="w-4 h-4 text-white/70" />
        <span className="text-sm text-white/70">
          Select your country for mobile money integration
        </span>
      </div>

      {selectedCountryData && (
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white">{selectedCountryData.name}</div>
                <div className="text-sm text-white/70">
                  Currency: {selectedCountryData.currency}
                  {selectedCountryData.p1_name && ` • ${selectedCountryData.p1_name}`}
                  {selectedCountryData.p2_name && ` • ${selectedCountryData.p2_name}`}
                </div>
              </div>
              <Check className="w-5 h-5 text-green-400" />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-2">
        {filteredCountries.map((country) => (
          <Button
            key={country.code}
            variant={selectedCountry === country.code ? "default" : "outline"}
            onClick={() => onCountrySelect(country.code)}
            className={`h-auto p-3 text-left justify-start ${
              selectedCountry === country.code
                ? 'bg-white text-black border-white'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
            }`}
          >
            <div className="text-sm">
              <div className="font-medium">{country.name}</div>
              <div className="text-xs opacity-70">{country.currency}</div>
            </div>
          </Button>
        ))}
      </div>

      <Button
        variant="ghost"
        onClick={() => setShowAll(!showAll)}
        className="w-full text-white/70 hover:text-white hover:bg-white/10"
      >
        {showAll ? 'Show Popular Countries' : 'Show All Countries'}
      </Button>
    </div>
  );
};
