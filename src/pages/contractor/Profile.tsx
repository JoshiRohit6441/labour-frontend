import { useState, useEffect } from "react";
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

// 🗺️ React Leaflet for Map
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationPicker = ({ lat, lng, setLat, setLng }: any) => {
  useMapEvents({
    click(e) {
      setLat(e.latlng.lat);
      setLng(e.latlng.lng);
    },
  });

  return lat && lng ? <Marker position={[lat, lng]} /> : null;
};

const ContractorProfile = () => {
  const { toast } = useToast();

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
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          businessLatitude: pos.coords.latitude,
          businessLongitude: pos.coords.longitude,
        }));
      },
      () => {
        toast({
          title: "Location access denied",
          description: "You can still pick a location manually on the map.",
        });
      }
    );
  }, []);

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
                      setLat={(lat: number) =>
                        setForm((f) => ({ ...f, businessLatitude: lat }))
                      }
                      setLng={(lng: number) =>
                        setForm((f) => ({ ...f, businessLongitude: lng }))
                      }
                    />
                  </MapContainer>
                  <div className="flex gap-2">
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
