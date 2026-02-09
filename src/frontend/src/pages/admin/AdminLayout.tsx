import { Outlet, Link, useLocation } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import LoginButton from '../../components/auth/LoginButton';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Image, 
  MapPin, 
  Search, 
  MessageSquare, 
  Megaphone, 
  ShoppingCart, 
  Users, 
  Download,
  FileText,
  Home
} from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();

  const navItems = [
    { path: '/admin/menu', label: 'Menu', icon: UtensilsCrossed },
    { path: '/admin/gallery', label: 'Gallery', icon: Image },
    { path: '/admin/contact', label: 'Contact & Hours', icon: MapPin },
    { path: '/admin/seo', label: 'SEO', icon: Search },
    { path: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
    { path: '/admin/promotions', label: 'Promotions', icon: Megaphone },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/admin/pages', label: 'Pages', icon: FileText },
    { path: '/admin/admins', label: 'Admins', icon: Users },
    { path: '/admin/export', label: 'Export/Backup', icon: Download }
  ];

  return (
    <div className="min-h-screen bg-secondary/10">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-2xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-3">
              <LoginButton />
              <Link to="/">
                <Button variant="outline" size="sm">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Site
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-card rounded-lg border p-4 sticky top-24">
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link key={item.path} to={item.path}>
                      <Button
                        variant={isActive ? 'default' : 'ghost'}
                        className="w-full justify-start"
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
