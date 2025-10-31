import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { contractorRateCardsApi } from '@/lib/api/contractor';
import { Label } from '@/components/ui/label';

const RateCards = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['contractor-rate-cards'],
    queryFn: () => contractorRateCardsApi.list(),
  });

  const [skill, setSkill] = useState('');
  const [minHours, setMinHours] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [dailyRate, setDailyRate] = useState('');
  const [travelCharges, setTravelCharges] = useState('');
  const [extraCharges, setExtraCharges] = useState('');

  const add = async () => {
    await contractorRateCardsApi.create({
      skill,
      minHours: Number(minHours || '1'),
      hourlyRate: Number(hourlyRate || '0'),
      dailyRate: dailyRate ? Number(dailyRate) : undefined,
      travelCharges: travelCharges ? Number(travelCharges) : undefined,
      extraCharges: extraCharges ? Number(extraCharges) : undefined,
    } as any);
    setSkill('');
    setMinHours('');
    setHourlyRate('');
    setDailyRate('');
    setTravelCharges('');
    setExtraCharges('');
    qc.invalidateQueries({ queryKey: ['contractor-rate-cards'] });
  };

  const items = data?.data?.items || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container py-8 space-y-6">
          <h1 className="text-3xl font-bold">Rate Cards</h1>
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Add Rate Card</CardTitle>
              <CardDescription>Create a new rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="md:col-span-2">
                  <Label>Skill</Label>
                  <Input placeholder="e.g. electrician" value={skill} onChange={(e) => setSkill(e.target.value)} />
                </div>
                <div>
                  <Label>Min Hours</Label>
                  <Input type="number" min={1} max={24} value={minHours} onChange={(e) => setMinHours(e.target.value)} />
                </div>
                <div>
                  <Label>Hourly Rate (₹)</Label>
                  <Input type="number" min={0} value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} />
                </div>
                <div>
                  <Label>Daily Rate (₹)</Label>
                  <Input type="number" min={0} value={dailyRate} onChange={(e) => setDailyRate(e.target.value)} />
                </div>
                <div>
                  <Label>Travel (₹)</Label>
                  <Input type="number" min={0} value={travelCharges} onChange={(e) => setTravelCharges(e.target.value)} />
                </div>
                <div>
                  <Label>Extra (₹)</Label>
                  <Input type="number" min={0} value={extraCharges} onChange={(e) => setExtraCharges(e.target.value)} />
                </div>
                <div className="md:col-span-6">
                  <Button onClick={add}>Add</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>My Rates</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-muted-foreground">Loading...</div>
              ) : items.length === 0 ? (
                <div className="text-muted-foreground">No rate cards.</div>
              ) : (
                <div className="space-y-3">
                  {items.map((r: any) => (
                    <div key={r.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{r.skill}</p>
                        <p className="text-sm text-muted-foreground">
                          Min {r.minHours}h • ₹{r.hourlyRate}/h{r.dailyRate ? ` • ₹${r.dailyRate}/day` : ''}
                          {r.travelCharges ? ` • Travel ₹${r.travelCharges}` : ''}
                          {r.extraCharges ? ` • Extra ₹${r.extraCharges}` : ''}
                        </p>
                      </div>
                      <Button variant="outline" onClick={async () => {
                        await contractorRateCardsApi.remove(r.id);
                        qc.invalidateQueries({ queryKey: ['contractor-rate-cards'] });
                      }}>Remove</Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RateCards;


