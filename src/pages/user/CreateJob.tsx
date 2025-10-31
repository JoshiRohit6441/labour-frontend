import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { userJobsApi } from '@/lib/api/user';
import { useToast } from '@/hooks/use-toast';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
// Map support
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const CreateJob = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [jobType, setJobType] = useState<'IMMEDIATE' | 'SCHEDULED' | 'BIDDING'>('IMMEDIATE');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState<string>('');
  const [numberOfWorkers, setNumberOfWorkers] = useState<string>('1');
  const [skillsCsv, setSkillsCsv] = useState('');
  const [budget, setBudget] = useState<string>('');

  // Leaflet default marker icon
  const DefaultIcon = L.icon({ iconUrl, shadowUrl: iconShadow });
  (L.Marker.prototype as any).options.icon = DefaultIcon;

  const LocationPicker = ({ setLat, setLng }: any) => {
    useMapEvents({
      click(e) {
        setLat(e.latlng.lat);
        setLng(e.latlng.lng);
      },
    });
    return latitude && longitude ? <Marker position={[latitude, longitude]} /> : null;
  };

  // Prefill current geolocation if permitted
  useState(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
        },
        () => {}
      );
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title,
        description,
        jobType,
        address,
        city,
        state,
        pincode,
        latitude: Number(latitude),
        longitude: Number(longitude),
        scheduledDate: jobType === 'SCHEDULED' ? scheduledDate || undefined : undefined,
        scheduledTime: jobType === 'SCHEDULED' ? scheduledTime || undefined : undefined,
        estimatedDuration: estimatedDuration ? Number(estimatedDuration) : undefined,
        numberOfWorkers: Number(numberOfWorkers || '1'),
        requiredSkills: skillsCsv
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        budget: budget ? Number(budget) : undefined,
      } as const;
      await userJobsApi.create(payload as any);
      toast({ title: 'Job created' });
      navigate('/user/jobs');
    } catch (err: any) {
      toast({ title: 'Failed to create job', description: err?.response?.data?.message, variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <Card className="max-w-2xl mx-auto border-0 shadow-md">
            <CardHeader>
              <CardTitle>Create Job</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Job Type</Label>
                    <select className="border rounded h-10 px-3" value={jobType} onChange={(e) => setJobType(e.target.value as any)}>
                      <option value="IMMEDIATE">Immediate</option>
                      <option value="SCHEDULED">Scheduled</option>
                      <option value="BIDDING">Bidding</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numberOfWorkers">Number of Workers</Label>
                    <Input id="numberOfWorkers" type="number" min={1} max={20} value={numberOfWorkers} onChange={(e) => setNumberOfWorkers(e.target.value)} required />
                  </div>
                  {jobType === 'SCHEDULED' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="scheduledDate">Scheduled Date</Label>
                        <Input id="scheduledDate" type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="scheduledTime">Scheduled Time</Label>
                        <Input id="scheduledTime" type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} />
                      </div>
                    </>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="estimatedDuration">Estimated Duration (hrs)</Label>
                    <Input id="estimatedDuration" type="number" min={1} max={24} value={estimatedDuration} onChange={(e) => setEstimatedDuration(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget (INR)</Label>
                    <Input id="budget" type="number" min={0} value={budget} onChange={(e) => setBudget(e.target.value)} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="skills">Required Skills (comma separated)</Label>
                    <Input id="skills" placeholder="e.g. plumbing, electrical" value={skillsCsv} onChange={(e) => setSkillsCsv(e.target.value)} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" value={state} onChange={(e) => setState(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input id="pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} required />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label>Location (Click map to set)</Label>
                    <MapContainer
                      center={[latitude || 20.5937, longitude || 78.9629]}
                      zoom={13}
                      className="h-64 rounded-lg"
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <LocationPicker setLat={setLatitude} setLng={setLongitude} />
                    </MapContainer>
                    <div className="flex gap-2">
                      <Input id="latitude" type="number" value={latitude} onChange={(e) => setLatitude(Number(e.target.value))} placeholder="Latitude" />
                      <Input id="longitude" type="number" value={longitude} onChange={(e) => setLongitude(Number(e.target.value))} placeholder="Longitude" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                  <Button type="submit">Create</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateJob;


