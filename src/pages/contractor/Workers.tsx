import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { contractorWorkersApi } from '@/lib/api/contractor';

const Workers = () => {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // ✅ Fetch workers with pagination
  const { data, isLoading } = useQuery({
    queryKey: ['contractor-workers', page],
    queryFn: () => contractorWorkersApi.list(page, pageSize),
    // keepPreviousData: true,
  });

  const workers = data?.workers ?? [];
  const pagination = data?.pagination ?? {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  };

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [dailyRate, setDailyRate] = useState('');

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setPhone('');
    setEmail('');
    setSkills('');
    setExperience('');
    setHourlyRate('');
    setDailyRate('');
  };

  // ✅ Add Worker
  const addWorker = async () => {
    await contractorWorkersApi.add({
      firstName,
      lastName,
      phone,
      email: email || undefined,
      skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
      experience: experience ? Number(experience) : undefined,
      hourlyRate: hourlyRate ? Number(hourlyRate) : undefined,
      dailyRate: dailyRate ? Number(dailyRate) : undefined,
    });
    resetForm();
    qc.invalidateQueries({ queryKey: ['contractor-workers', page] });
  };

  // ✅ Update Worker
  const updateWorker = async (w: any) => {
    const firstNameNew = prompt('Edit first name', w.firstName);
    if (firstNameNew == null) return;
    await contractorWorkersApi.update(w.id, { firstName: firstNameNew });
    qc.invalidateQueries({ queryKey: ['contractor-workers', page] });
  };

  // ✅ Delete Worker
  const deleteWorker = async (w: any) => {
    const ok = confirm('Delete worker?');
    if (!ok) return;
    await contractorWorkersApi.remove(w.id);
    qc.invalidateQueries({ queryKey: ['contractor-workers', page] });
  };

  // ✅ Toggle Active/Inactive
  const toggleAvailability = async (w: any) => {
    await contractorWorkersApi.update(w.id, { isActive: !w.isActive });
    qc.invalidateQueries({ queryKey: ['contractor-workers', page] });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container py-8 space-y-6">
          <h1 className="text-3xl font-bold">My Workers</h1>

          {/* ---------- Add Worker Form ---------- */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Add Worker</CardTitle>
              <CardDescription>Create a worker profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>First Name</Label>
                  <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Indian mobile" />
                </div>
                <div>
                  <Label>Email (optional)</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <Label>Skills (comma separated)</Label>
                  <Input value={skills} onChange={(e) => setSkills(e.target.value)} />
                </div>
                <div>
                  <Label>Experience (years)</Label>
                  <Input type="number" min={0} max={50} value={experience} onChange={(e) => setExperience(e.target.value)} />
                </div>
                <div>
                  <Label>Hourly Rate (₹)</Label>
                  <Input type="number" min={0} value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} />
                </div>
                <div>
                  <Label>Daily Rate (₹)</Label>
                  <Input type="number" min={0} value={dailyRate} onChange={(e) => setDailyRate(e.target.value)} />
                </div>
              </div>
              <div className="mt-4">
                <Button onClick={addWorker}>Add</Button>
              </div>
            </CardContent>
          </Card>

          {/* ---------- Workers List ---------- */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Workers</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-muted-foreground">Loading...</div>
              ) : workers.length === 0 ? (
                <div className="text-muted-foreground">No workers yet.</div>
              ) : (
                <div className="space-y-3">
                  {workers.map((w: any) => (
                    <div key={w.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">
                          {w.firstName} {w.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {w.skills?.join(', ')} • {w.experience} yrs exp
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ₹{w.dailyRate}/day • ₹{w.hourlyRate}/hr
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => updateWorker(w)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => toggleAvailability(w)}>
                          {w.isActive ? 'Set Inactive' : 'Set Active'}
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteWorker(w)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* ---------- Pagination ---------- */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <p className="text-sm text-muted-foreground">
                Page {pagination.currentPage} of {pagination.totalPages}
              </p>
              <Button
                variant="outline"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Workers;
