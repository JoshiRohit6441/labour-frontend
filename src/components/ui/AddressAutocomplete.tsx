
import React, { useRef, useEffect, useState } from 'react';
import useGoogleMapsAPI from '@/hooks/useGoogleMapsAPI';
import { Input } from '@/components/ui/input';

interface AddressAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  country?: string;
  initialValue?: string;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({ onPlaceSelect, country, initialValue }) => {
  const { isLoaded } = useGoogleMapsAPI();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(initialValue || '');

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        componentRestrictions: country ? { country } : undefined,
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          setInputValue(place.formatted_address || '');
          onPlaceSelect(place);
        }
      });
    }
  }, [isLoaded, onPlaceSelect, country]);

  useEffect(() => {
    setInputValue(initialValue || '');
  }, [initialValue]);

  return (
    <Input
      ref={inputRef}
      type="text"
      placeholder="Search for an address"
      onChange={(e) => setInputValue(e.target.value)}
      value={inputValue}
    />
  );
};

export default AddressAutocomplete;
