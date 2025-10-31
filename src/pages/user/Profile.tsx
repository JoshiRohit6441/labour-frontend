import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { userProfileApi } from '@/lib/api/user';
import { useToast } from '@/hooks/use-toast';

const UserProfile = () => {
  const { toast } = useToast();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    userProfileApi.get().then((r) => {
      const u = r.data as any;
      if (!u) return;
      setFirstName(u.firstName || '');
      setLastName(u.lastName || '');
      setEmail(u.email || '');
    }).catch(() => {});
  }, []);

  const save = async () => {
    try {
      await userProfileApi.update({ firstName, lastName, email });
      toast({ title: 'Profile updated' });
    } catch (e: any) {
      toast({ title: 'Failed to update', description: e?.response?.data?.message, variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <Card className="max-w-2xl mx-auto border-0 shadow-md">
            <CardHeader>
              <CardTitle>My Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
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

export default UserProfile;


