import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { userProfileApi } from '@/lib/api/user';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/lib/api/auth';

const Security = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    try {
      await userProfileApi.changePassword({ currentPassword, newPassword });
      toast({ title: 'Password changed' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e: any) {
      toast({ title: 'Failed to change password', description: e?.response?.data?.message, variant: 'destructive' });
    }
  };

  const deleteAccount = async () => {
    const ok = confirm('This will permanently delete your account. Continue?');
    if (!ok) return;
    try {
      await userProfileApi.deleteAccount();
      toast({ title: 'Account deleted' });
      await authApi.logout();
      navigate('/');
    } catch (e: any) {
      toast({ title: 'Failed to delete', description: e?.response?.data?.message, variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container py-8 space-y-6">
          <Card className="max-w-2xl mx-auto border-0 shadow-md">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Current Password</Label>
                  <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>New Password</Label>
                    <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  </div>
                  <div>
                    <Label>Confirm Password</Label>
                    <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </div>
                </div>
                <Button onClick={changePassword}>Update Password</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="max-w-2xl mx-auto border-0 shadow-md">
            <CardHeader>
              <CardTitle>Delete Account</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Permanently remove your account and data.</p>
                <Button variant="destructive" onClick={deleteAccount}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Security;


