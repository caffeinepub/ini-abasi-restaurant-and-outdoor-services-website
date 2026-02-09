import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert, AlertCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useAssignUserRole, useGetCallerUserRole } from '../../hooks/useAuthz';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Principal } from '@dfinity/principal';
import { UserRole } from '../../backend';

export default function AdminAdminsPage() {
  const assignUserRole = useAssignUserRole();
  const { data: currentRole } = useGetCallerUserRole();
  const { identity } = useInternetIdentity();
  const [principalId, setPrincipalId] = useState('');

  const isOwner = currentRole === UserRole.admin; // In this system, admin role has owner privileges

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!principalId.trim()) {
      toast.error('Please enter a principal ID');
      return;
    }

    try {
      const principal = Principal.fromText(principalId.trim());
      await assignUserRole.mutateAsync({ user: principal, role: UserRole.admin });
      toast.success('Admin added successfully');
      setPrincipalId('');
    } catch (error: any) {
      console.error('Add admin error:', error);
      
      // Provide more specific error messages
      if (error.message?.includes('Unauthorized') || error.message?.includes('Only owner')) {
        toast.error('Only the owner can add admins. You do not have permission.');
      } else if (error.message?.includes('Invalid principal')) {
        toast.error('Invalid principal ID format. Please check and try again.');
      } else {
        toast.error('Failed to add admin. Please check the principal ID and try again.');
      }
    }
  };

  const handleRemoveAdmin = async () => {
    if (!principalId.trim()) {
      toast.error('Please enter a principal ID');
      return;
    }

    if (!confirm('Are you sure you want to remove this admin? They will lose all admin privileges.')) {
      return;
    }

    try {
      const principal = Principal.fromText(principalId.trim());
      await assignUserRole.mutateAsync({ user: principal, role: UserRole.user });
      toast.success('Admin removed successfully');
      setPrincipalId('');
    } catch (error: any) {
      console.error('Remove admin error:', error);
      
      // Provide more specific error messages
      if (error.message?.includes('Unauthorized') || error.message?.includes('Only owner')) {
        toast.error('Only the owner can remove admins. You do not have permission.');
      } else if (error.message?.includes('Invalid principal')) {
        toast.error('Invalid principal ID format. Please check and try again.');
      } else {
        toast.error('Failed to remove admin. Please check the principal ID and try again.');
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">Admin Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Owner Privileges Required</AlertTitle>
          <AlertDescription>
            Only the website owner can add or remove admin users. Be careful when managing admin access.
          </AlertDescription>
        </Alert>

        {identity && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Your Principal ID</AlertTitle>
            <AlertDescription className="font-mono text-xs break-all">
              {identity.getPrincipal().toString()}
            </AlertDescription>
          </Alert>
        )}

        {!isOwner && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Limited Access</AlertTitle>
            <AlertDescription>
              You are logged in as an admin, but only the owner can manage other admins.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleAddAdmin} className="space-y-4">
          <div>
            <Label htmlFor="principal">Principal ID</Label>
            <Input
              id="principal"
              value={principalId}
              onChange={(e) => setPrincipalId(e.target.value)}
              placeholder="xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-xxx"
              required
              disabled={!isOwner}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter the Internet Identity principal of the user you want to manage
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              type="submit" 
              disabled={assignUserRole.isPending || !isOwner}
            >
              {assignUserRole.isPending ? 'Processing...' : 'Add as Admin'}
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleRemoveAdmin} 
              disabled={assignUserRole.isPending || !isOwner}
            >
              {assignUserRole.isPending ? 'Processing...' : 'Remove Admin'}
            </Button>
          </div>
        </form>

        <div className="pt-4 border-t">
          <h3 className="font-semibold mb-2">How to find a user's Principal ID:</h3>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Ask the user to log in to the website</li>
            <li>They can find their Principal ID in their profile or account settings</li>
            <li>Copy and paste the Principal ID into the field above</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
