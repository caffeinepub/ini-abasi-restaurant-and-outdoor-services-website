import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import GalleryPage from './pages/GalleryPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import OrderReservePage from './pages/OrderReservePage';
import CustomPage from './pages/CustomPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminMenuPage from './pages/admin/AdminMenuPage';
import AdminGalleryPage from './pages/admin/AdminGalleryPage';
import AdminContactPage from './pages/admin/AdminContactPage';
import AdminSeoPage from './pages/admin/AdminSeoPage';
import AdminTestimonialsPage from './pages/admin/AdminTestimonialsPage';
import AdminPromotionsPage from './pages/admin/AdminPromotionsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminAdminsPage from './pages/admin/AdminAdminsPage';
import AdminExportPage from './pages/admin/AdminExportPage';
import AdminPagesPage from './pages/admin/AdminPagesPage';
import SiteLayout from './components/SiteLayout';
import AdminGuard from './components/auth/AdminGuard';

const rootRoute = createRootRoute({
  component: SiteLayout
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage
});

const menuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/menu',
  component: MenuPage
});

const galleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/gallery',
  component: GalleryPage
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage
});

const orderReserveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/order-reserve',
  component: OrderReservePage
});

const customPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/page/$slug',
  component: CustomPage
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <AdminGuard>
      <AdminLayout />
    </AdminGuard>
  )
});

const adminMenuRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/menu',
  component: AdminMenuPage
});

const adminGalleryRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/gallery',
  component: AdminGalleryPage
});

const adminContactRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/contact',
  component: AdminContactPage
});

const adminSeoRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/seo',
  component: AdminSeoPage
});

const adminTestimonialsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/testimonials',
  component: AdminTestimonialsPage
});

const adminPromotionsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/promotions',
  component: AdminPromotionsPage
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/orders',
  component: AdminOrdersPage
});

const adminAdminsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/admins',
  component: AdminAdminsPage
});

const adminExportRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/export',
  component: AdminExportPage
});

const adminPagesRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/pages',
  component: AdminPagesPage
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  menuRoute,
  galleryRoute,
  aboutRoute,
  contactRoute,
  orderReserveRoute,
  customPageRoute,
  adminRoute.addChildren([
    adminMenuRoute,
    adminGalleryRoute,
    adminContactRoute,
    adminSeoRoute,
    adminTestimonialsRoute,
    adminPromotionsRoute,
    adminOrdersRoute,
    adminAdminsRoute,
    adminExportRoute,
    adminPagesRoute
  ])
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
