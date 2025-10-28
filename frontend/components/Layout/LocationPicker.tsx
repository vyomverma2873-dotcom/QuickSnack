import React, { useState, useEffect } from 'react';
import { X, MapPin, Search, Loader2, Navigation } from 'lucide-react';
import { placesAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface LocationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: string) => void;
}

interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  isOpen,
  onClose,
  onLocationSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setPredictions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setIsLoading(true);
        const response = await placesAPI.autocomplete(searchQuery);
        setPredictions(response.data.predictions || []);
      } catch (error) {
        console.error('Error fetching predictions:', error);
        toast.error('Failed to fetch location suggestions');
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleAutoDetect = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
      return;
    }

    setIsDetecting(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await placesAPI.reverseGeocode({
            lat: latitude,
            lng: longitude,
          });

          if (response.data.results && response.data.results.length > 0) {
            const address = response.data.results[0].formatted_address;
            onLocationSelect(address);
            toast.success('Location detected successfully');
          } else {
            toast.error('Could not determine your location');
          }
        } catch (error) {
          console.error('Error reverse geocoding:', error);
          toast.error('Failed to get location details');
        } finally {
          setIsDetecting(false);
        }
      },
      (error) => {
        setIsDetecting(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error('Location access denied. Please enable location permissions.');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            toast.error('Location request timed out.');
            break;
          default:
            toast.error('An unknown error occurred while detecting location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  const handlePlaceSelect = async (prediction: PlacePrediction) => {
    try {
      onLocationSelect(prediction.description);
      setSearchQuery('');
      setPredictions([]);
    } catch (error) {
      console.error('Error selecting place:', error);
      toast.error('Failed to select location');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-slate-blue-gray">Select Location</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-light-grayish-blue rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Auto-detect button */}
          <button
            onClick={handleAutoDetect}
            disabled={isDetecting}
            className="w-full flex items-center justify-center space-x-2 p-3 bg-mint-green text-slate-blue-gray font-semibold rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {isDetecting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Navigation className="w-5 h-5" />
            )}
            <span>{isDetecting ? 'Detecting...' : 'Auto-detect my location'}</span>
          </button>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-3 text-sm text-gray-500">OR</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Search input */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for your location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-green focus:border-transparent"
            />
            {isLoading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 animate-spin text-gray-400" />
            )}
          </div>

          {/* Predictions */}
          <div className="max-h-60 overflow-y-auto">
            {predictions.length > 0 ? (
              <div className="space-y-2">
                {predictions.map((prediction) => (
                  <button
                    key={prediction.place_id}
                    onClick={() => handlePlaceSelect(prediction)}
                    className="w-full flex items-start space-x-3 p-3 hover:bg-light-grayish-blue rounded-lg transition-colors text-left"
                  >
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-blue-gray truncate">
                        {prediction.structured_formatting.main_text}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {prediction.structured_formatting.secondary_text}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : searchQuery.trim() && !isLoading ? (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No locations found</p>
                <p className="text-sm">Try searching with a different term</p>
              </div>
            ) : !searchQuery.trim() ? (
              <div className="text-center py-8 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Start typing to search for locations</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;
