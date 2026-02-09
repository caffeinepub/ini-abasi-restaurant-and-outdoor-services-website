import { Outlet } from '@tanstack/react-router';
import HeaderNav from './HeaderNav';
import Footer from './Footer';
import AnnouncementBar from './AnnouncementBar';
import ProfileSetupModal from './auth/ProfileSetupModal';
import { Toaster } from '@/components/ui/sonner';

export default function SiteLayout() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="fixed inset-0 pattern-bg pointer-events-none z-0" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <AnnouncementBar />
        <HeaderNav />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      <ProfileSetupModal />
      <Toaster />
    </div>
  );
}
