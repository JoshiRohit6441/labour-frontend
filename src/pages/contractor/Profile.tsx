import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { contractorProfileApi } from "@/lib/api/contractor";
import { useToast } from "@/hooks/use-toast";
import useGoogleMaps from '@/hooks/useGoogleMaps';

// 🗺️ React Leaflet for Map
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationPicker = ({ lat, lng, setForm, google }: any) => {
  const map = useMap();
  useMapEvents({
    click(e) {
      setForm((f: any) => ({
        ...f,
        businessLatitude: e.latlng.lat,
        businessLongitude: e.latlng.lng,
      }));
      if (google) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: e.latlng }, (results: any, status: any) => {
          if (status === 'OK' && results[0]) {
            const place = results[0];
            let businessAddress = place.formatted_address || '';
            let businessCity = '';
            let businessState = '';
            let businessPincode = '';

            for (const component of place.address_components || []) {
              const componentType = component.types[0];
              switch (componentType) {
                case 'locality':
                  businessCity = component.long_name;
                  break;
                case 'administrative_area_level_1':
                  businessState = component.long_name;
                  break;
                case 'postal_code':
                  businessPincode = component.long_name;
                  break;
              }
            }
            setForm((f: any) => ({
              ...f,
              businessAddress,
              businessCity,
              businessState,
              businessPincode,
            }));
            map.setView(e.latlng, map.getZoom());
          }
        });
      }
    },
  });

  return lat && lng ? <Marker position={[lat, lng]} /> : null;
};

const ContractorProfile = () => {
  const { toast } = useToast();
  const { isLoaded, google } = useGoogleMaps();
  const addressInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    businessName: "",
    businessType: "",
    gstNumber: "",
    panNumber: "",
    businessAddress: "",
    businessCity: "",
    businessState: "",
    businessPincode: "",
    businessLatitude: 0,
    businessLongitude: 0,
    coverageRadius: 20,
    bankAccountNumber: "",
    bankIfscCode: "",
    bankAccountName: "",
  });

  const [isExisting, setIsExisting] = useState(false);
  const [loading, setLoading] = useState(true);

  // 📍 Get current location once (prefill map)
  useEffect(() => {
    if ('geolocation' in navigator && isLoaded && google) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setForm((f) => ({
            ...f,
            businessLatitude: lat,
            businessLongitude: lng,
          }));

          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
            if (status === 'OK' && results[0]) {
              const place = results[0];
              let businessAddress = place.formatted_address || '';
              let businessCity = '';
              let businessState = '';
              let businessPincode = '';

              for (const component of place.address_components || []) {
                const componentType = component.types[0];
                switch (componentType) {
                  case 'locality':
                    businessCity = component.long_name;
                    break;
                  case 'administrative_area_level_1':
                    businessState = component.long_name;
                    break;
                  case 'postal_code':
                    businessPincode = component.long_name;
                    break;
                }
              }
              setForm((f) => ({
                ...f,
                businessAddress,
                businessCity,
                businessState,
                businessPincode,
              }));
            }
          });
        },
        () => {
          toast({
            title: "Location access denied",
            description: "You can still pick a location manually on the map.",
          });
        }
      );
    }
  }, [isLoaded, google]);

  // 🔹 Fetch profile on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await contractorProfileApi.get();
        console.log("res : ", res)
        const p = res?.contractor;
        if (p) {
          setForm((f) => ({ ...f, ...p }));
          setIsExisting(true);
        }
      } catch {
        setIsExisting(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (isLoaded && google && addressInputRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(addressInputRef.current, {
        types: ['address'],
        componentRestrictions: { country: "in" }, // Restrict to India for better relevance, can be removed
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          let businessAddress = place.formatted_address || '';
          let businessCity = '';
          let businessState = '';
          let businessPincode = '';

          for (const component of place.address_components || []) {
            const componentType = component.types[0];
            switch (componentType) {
              case 'locality':
                businessCity = component.long_name;
                break;
              case 'administrative_area_level_1':
                businessState = component.long_name;
                break;
              case 'postal_code':
                businessPincode = component.long_name;
                break;
            }
          }
          setForm((f) => ({
            ...f,
            businessAddress,
            businessCity,
            businessState,
            businessPincode,
            businessLatitude: place.geometry?.location?.lat() || 0,
            businessLongitude: place.geometry?.location?.lng() || 0,
          }));
        } else {
          toast({
            title: 'Address not found',
            description: 'Please select a valid address from the suggestions.',
            variant: 'destructive',
          });
        }
      });
    }
  }, [isLoaded, google]);

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setForm((f) => ({ ...f, [id]: value }));
  };

  // 💾 Save profile (create or update)
  const save = async () => {
    try {
      if (isExisting) {
        await contractorProfileApi.update(form);
        toast({ title: "Profile updated successfully" });
      } else {
        await contractorProfileApi.create(form);
        toast({ title: "Profile created successfully" });
        setIsExisting(true);
      }
    } catch (e: any) {
      toast({
        title: "Failed to save",
        description: e?.response?.data?.message || e.message,
        variant: "destructive",
      });
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading profile...</p>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <Card className="max-w-3xl mx-auto border-0 shadow-md">
            <CardHeader>
              <CardTitle>
                {isExisting ? "Edit Business Profile" : "Create Business Profile"}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries({
                  businessName: "Business Name",
                  businessType: "Business Type",
                  gstNumber: "GST Number",
                  panNumber: "PAN Number",
                  businessAddress: "Business Address",
                  businessCity: "City",
                  businessState: "State",
                  businessPincode: "Pincode",
                  bankAccountName: "Bank Account Name",
                  bankAccountNumber: "Bank Account Number",
                  bankIfscCode: "IFSC Code",
                  coverageRadius: "Coverage Radius (km)",
                }).map(([key, label]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key}>{label}</Label>
                    <Input
                      id={key}
                      value={(form as any)[key]}
                      onChange={handleChange}
                      type={key === "coverageRadius" ? "number" : "text"}
                      ref={key === "businessAddress" ? addressInputRef : null}
                    />
                  </div>
                ))}

                {/* 🗺️ Map Selector */}
                <div className="col-span-2 space-y-2">
                  <Label>Business Location (Click to select)</Label>
                  <MapContainer
                    center={[
                      form.businessLatitude || 20.5937,
                      form.businessLongitude || 78.9629,
                    ]}
                    zoom={13}
                    className="h-64 rounded-lg"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationPicker
                      lat={form.businessLatitude}
                      lng={form.businessLongitude}
                      setForm={setForm}
                      google={google}
                    />
                  </MapContainer>
                  <div className="flex gap-2 hidden"> {/* Hidden lat/long inputs */}
                    <Input
                      id="businessLatitude"
                      value={form.businessLatitude}
                      onChange={handleChange}
                      type="number"
                      readOnly
                    />
                    <Input
                      id="businessLongitude"
                      value={form.businessLongitude}
                      onChange={handleChange}
                      type="number"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Button onClick={save}>Save</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContractorProfile;
