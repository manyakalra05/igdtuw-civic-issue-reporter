import React, { useState, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface MapPin {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  type: 'issue' | 'custom';
}

interface MapComponentProps {
  onLocationSelect?: (lat: number, lng: number, address: string) => void;
  pins?: MapPin[];
  className?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  onLocationSelect, 
  pins = [], 
  className = "" 
}) => {
  const [mapPins, setMapPins] = useState<MapPin[]>(pins);
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [isAddingPin, setIsAddingPin] = useState(false);
  const [newPinData, setNewPinData] = useState({ title: '', description: '' });
  const [clickPosition, setClickPosition] = useState<{ x: number, y: number } | null>(null);
  const { toast } = useToast();

  // IGDTUW Campus approximate coordinates
  const campusCenter = { lat: 28.6692, lng: 77.2265 };
  
  useEffect(() => {
    setMapPins(pins);
  }, [pins]);

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingPin) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    // Convert percentage to approximate coordinates (simplified)
    const lat = campusCenter.lat + (50 - y) * 0.001;
    const lng = campusCenter.lng + (x - 50) * 0.001;
    
    setClickPosition({ x, y });
    
    if (onLocationSelect) {
      onLocationSelect(lat, lng, `Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  };

  const addCustomPin = () => {
    if (!clickPosition || !newPinData.title) {
      toast({
        title: "Missing Information",
        description: "Please provide a title for the pin.",
        variant: "destructive"
      });
      return;
    }

    const lat = campusCenter.lat + (50 - clickPosition.y) * 0.001;
    const lng = campusCenter.lng + (clickPosition.x - 50) * 0.001;

    const newPin: MapPin = {
      id: `custom-${Date.now()}`,
      lat,
      lng,
      title: newPinData.title,
      description: newPinData.description,
      type: 'custom'
    };

    setMapPins(prev => [...prev, newPin]);
    setNewPinData({ title: '', description: '' });
    setClickPosition(null);
    setIsAddingPin(false);
    
    toast({
      title: "Pin Added",
      description: "Location has been marked on the map.",
    });
  };

  const removePin = (pinId: string) => {
    setMapPins(prev => prev.filter(pin => pin.id !== pinId));
    setSelectedPin(null);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="mb-4 flex gap-2">
        <Button
          onClick={() => setIsAddingPin(!isAddingPin)}
          variant={isAddingPin ? "destructive" : "outline"}
          size="sm"
        >
          <MapPin className="h-4 w-4 mr-2" />
          {isAddingPin ? "Cancel Adding Pin" : "Add Pin"}
        </Button>
      </div>

      <div 
        className="relative w-full h-96 bg-gradient-to-br from-green-50 to-yellow-50 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden cursor-pointer"
        onClick={handleMapClick}
        style={{
          backgroundImage: `
            linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #f0fdf4 50%, #fefce8 75%, #fff7ed 100%)
          `
        }}
      >
        {/* Campus Buildings Layout */}
        <div className="absolute inset-0">
          {/* Admin Block - Top Left */}
          <div className="absolute top-4 left-4 w-28 h-20 bg-yellow-200 rounded shadow-sm flex items-center justify-center text-xs font-bold border border-yellow-300">
            <div className="text-center">
              <div>ADMIN</div>
              <div>BLOCK</div>
            </div>
          </div>

          {/* IT Block - Top Right */}
          <div className="absolute top-4 right-4 w-28 h-20 bg-yellow-200 rounded shadow-sm flex items-center justify-center text-xs font-bold border border-yellow-300">
            <div className="text-center">
              <div>IT</div>
              <div>BLOCK</div>
            </div>
          </div>

          {/* Mae Block - Left Side */}
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 w-28 h-20 bg-yellow-200 rounded shadow-sm flex items-center justify-center text-xs font-bold border border-yellow-300">
            <div className="text-center">
              <div>MAE</div>
              <div>BLOCK</div>
            </div>
          </div>

          {/* ECE/CSE Block - Right Side */}
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 w-28 h-20 bg-yellow-200 rounded shadow-sm flex items-center justify-center text-xs font-bold border border-yellow-300">
            <div className="text-center">
              <div>ECE/CSE</div>
              <div>BLOCK</div>
            </div>
          </div>

          {/* Computer Centre Library - Top Center */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-36 h-12 bg-gray-300 rounded shadow-sm flex items-center justify-center text-xs font-bold text-center">
            COMPUTER CENTRE-LIBRARY
          </div>

          {/* Central Main Ground - Much Larger */}
          <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-64 h-48 bg-green-200 rounded shadow-sm flex items-center justify-center text-lg font-bold border border-green-300 z-10">
            <div className="text-center">
              <div>MAIN GROUND</div>
            </div>
          </div>

          {/* Auditorium - Bottom Center, overlapping with main ground */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-48 h-24 bg-purple-200 rounded shadow-sm flex items-center justify-center text-sm font-bold border border-purple-300 z-20">
            AUDITORIUM
          </div>

          {/* Kaveri Hostel - Bottom Left */}
          <div className="absolute bottom-4 left-4 w-28 h-20 bg-blue-200 rounded shadow-sm flex items-center justify-center text-xs font-bold border border-blue-300">
            <div className="text-center">
              <div>KAVERI</div>
              <div>HOSTEL</div>
            </div>
          </div>

          {/* Krishna Hostel - Bottom Right */}
          <div className="absolute bottom-4 right-4 w-28 h-20 bg-blue-200 rounded shadow-sm flex items-center justify-center text-xs font-bold border border-blue-300">
            <div className="text-center">
              <div>KRISHNA</div>
              <div>HOSTEL</div>
            </div>
          </div>

          {/* Entry Gate - Bottom */}
          
        </div>

        {/* Map Pins */}
        {mapPins.map((pin) => {
          // Convert lat/lng back to percentage for display (simplified)
          const x = ((pin.lng - campusCenter.lng) / 0.001 + 50);
          const y = (50 - (pin.lat - campusCenter.lat) / 0.001);
          
          return (
            <div
              key={pin.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30"
              style={{ left: `${x}%`, top: `${y}%` }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPin(pin);
              }}
            >
              <div className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                pin.type === 'issue' ? 'bg-red-500' : 'bg-blue-500'
              }`}>
                <MapPin className="h-3 w-3 text-white" />
              </div>
            </div>
          );
        })}

        {/* Click position indicator */}
        {isAddingPin && clickPosition && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-yellow-500 rounded-full border-2 border-white shadow-lg animate-pulse z-30"
            style={{ left: `${clickPosition.x}%`, top: `${clickPosition.y}%` }}
          />
        )}

        {/* Instructions */}
        <div className="absolute top-0.05 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-gray-600 z-40">
          {isAddingPin ? "Click anywhere to place a pin" : "IGDTUW Campus Map"}
        </div>
      </div>

      {/* Pin Details Modal */}
      {selectedPin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedPin(null)}>
          <Card className="w-96 m-4" onClick={(e) => e.stopPropagation()}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">{selectedPin.title}</CardTitle>
                <CardDescription>
                  {selectedPin.type === 'issue' ? 'Reported Issue' : 'Custom Pin'}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedPin(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{selectedPin.description}</p>
              <div className="text-xs text-gray-500 mb-4">
                Location: {selectedPin.lat.toFixed(4)}, {selectedPin.lng.toFixed(4)}
              </div>
              {selectedPin.type === 'custom' && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removePin(selectedPin.id)}
                >
                  Remove Pin
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Pin Form */}
      {isAddingPin && clickPosition && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Add New Pin</CardTitle>
            <CardDescription>Provide details for the new location pin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <Input
                value={newPinData.title}
                onChange={(e) => setNewPinData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter pin title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Input
                value={newPinData.description}
                onChange={(e) => setNewPinData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter pin description (optional)"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={addCustomPin}>Add Pin</Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setClickPosition(null);
                  setIsAddingPin(false);
                  setNewPinData({ title: '', description: '' });
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MapComponent;
