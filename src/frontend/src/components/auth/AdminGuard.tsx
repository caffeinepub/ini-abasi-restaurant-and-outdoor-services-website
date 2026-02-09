import { ReactNode } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../../hooks/useAuthz';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Loader2, AlertCircle } from 'lucide-react';
import LoginButton from './LoginButton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading, isError: adminError, error } = useIsCallerAdmin();

  const isAuthenticated = !!identity;

  // Show loading state while initializing or checking admin status
  if (isInitializing || (adminLoading && isAuthenticated)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading admin access...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/20">
        <div className="max-w-md w-full mx-4">
          <div className="bg-card rounded-lg shadow-lg p-8 text-center">
            <ShieldAlert className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="font-serif text-2xl font-bold mb-2">Admin Access Required</h1>
            <p className="text-muted-foreground mb-6">
              Please log in to access the admin area.
            </p>
            <LoginButton />
          </div>
        </div>
      </div>
    );
  }

  // Handle error state - show helpful message
  if (adminError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/20">
        <div className="max-w-md w-full mx-4">
          <div className="bg-card rounded-lg shadow-lg p-8">
            <AlertCircle className="h-16 w-16 text-warning mx-auto mb-4" />
            <h1 className="font-serif text-2xl font-bold mb-4 text-center">Configuration Issue</h1>
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Unable to verify admin access</AlertTitle>
              <AlertDescription>
                There was an error checking your admin permissions. This may happen if:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>The admin system is not yet configured</li>
                  <li>There's a network connectivity issue</li>
                  <li>The backend is being updated</li>
                </ul>
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Button 
                variant="default" 
                className="w-full"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = '/'}
              >
                Go to Home
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              If this issue persists, please contact the website administrator.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/20">
        <div className="max-w-md w-full mx-4">
          <div className="bg-card rounded-lg shadow-lg p-8 text-center">
            <ShieldAlert className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h1 className="font-serif text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-6">
              You do not have permission to access the admin area. Only authorized administrators can access this section.
            </p>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = '/'}
              >
                Go to Home
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Your Principal ID: <code className="text-xs bg-muted px-1 py-0.5 rounded">{identity?.getPrincipal().toString()}</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated and is admin - render children
  return <>{children}</>;
}
