import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Briefcase, Menu, X, Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { authApi } from '@/lib/api/auth';
import { useAppDispatch, useAppSelector } from '@/store';
import { initNotificationsSocket } from '@/lib/socket/notifications';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = authApi.isAuthenticated();
  const user = authApi.getCurrentUser();
  const dispatch = useAppDispatch();
  const unread = useAppSelector((s) => s.notifications.unreadCount);

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    initNotificationsSocket(dispatch);
  }, [isAuthenticated, user?.role]);

  const handleLogout = async () => {
    await authApi.logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">LabourHire</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
          <Link to="/how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            How It Works
          </Link>
          <Link to="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate(user?.role === 'CONTRACTOR' ? '/contractor/dashboard' : '/user/dashboard')}
              >
                Dashboard
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate(user?.role === 'CONTRACTOR' ? '/contractor/notifications' : '/user/notifications')}
                className="relative"
              >
                <Bell className="h-4 w-4" />
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-destructive text-white text-[10px] flex items-center justify-center">
                    {unread}
                  </span>
                )}
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button onClick={() => navigate('/register')}>
                Get Started
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-card p-4 space-y-4 animate-fade-in">
          <Link
            to="/about"
            className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/how-it-works"
            className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            onClick={() => setMobileMenuOpen(false)}
          >
            How It Works
          </Link>
          <Link
            to="/contact"
            className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </Link>
          <div className="pt-4 border-t space-y-2">
            {isAuthenticated ? (
              <>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => {
                    navigate(user?.role === 'CONTRACTOR' ? '/contractor/dashboard' : '/user/dashboard');
                    setMobileMenuOpen(false);
                  }}
                >
                  Dashboard
                </Button>
                <Button
                  className="w-full"
                  variant="ghost"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                >
                  Login
                </Button>
                <Button
                  className="w-full"
                  onClick={() => {
                    navigate('/register');
                    setMobileMenuOpen(false);
                  }}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
