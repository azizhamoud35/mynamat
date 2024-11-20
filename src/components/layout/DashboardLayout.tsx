import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Target, 
  Users, 
  Video, 
  GraduationCap,
  Gift,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard/customer', icon: LayoutDashboard },
  { name: 'Habit Tracking', href: '/habits', icon: Target },
  { name: 'Support Groups', href: '/support', icon: Users },
  { name: 'Coaching Sessions', href: '/coaching', icon: Video },
  { name: 'Mini Courses', href: '/education', icon: GraduationCap },
  { name: 'Points & Rewards', href: '/points', icon: Gift },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src="/namatclinic.png" 
                alt="Namat Logo" 
                className="h-8 w-auto"
              />
            </div>
            
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            {/* Desktop user info */}
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {currentUser?.email}
              </span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation menu below header */}
      <div className="border-b bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="hidden md:flex h-12 items-center gap-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors",
                    isActive 
                      ? "text-[#7dda55]" 
                      : "text-muted-foreground hover:text-[#7dda55]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile navigation */}
      <div
        className={cn(
          "md:hidden border-b bg-background",
          mobileMenuOpen ? "block" : "hidden"
        )}
      >
        <div className="space-y-1 px-4 py-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-2 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "text-[#7dda55]" 
                    : "text-muted-foreground hover:text-[#7dda55]"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
          <div className="border-t mt-3 pt-3">
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">
                {currentUser?.email}
              </span>
              <Button variant="outline" onClick={handleLogout} className="w-full">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8 lg:py-10">
        {children}
      </main>
    </div>
  );
}