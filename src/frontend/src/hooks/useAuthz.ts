import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { UserProfile, UserRole } from '../backend';
import { Principal } from '@dfinity/principal';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getCallerUserProfile();
      } catch (error: any) {
        // If user doesn't have a profile yet, return null instead of throwing
        if (error.message?.includes('Unauthorized') || error.message?.includes('not found')) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!actor && !!identity && !actorFetching,
    retry: false
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    }
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      if (!identity) return false;
      
      try {
        const result = await actor.isCallerAdmin();
        return result;
      } catch (error: any) {
        console.error('Admin check error:', error);
        // If the method fails (trap, network error, etc.), return false
        // This allows the UI to show "Access Denied" rather than getting stuck
        return false;
      }
    },
    enabled: !!actor && !!identity && !actorFetching,
    retry: false,
    staleTime: 30000 // Cache for 30 seconds to avoid repeated calls
  });
}

export function useGetCallerUserRole() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<UserRole | null>({
    queryKey: ['callerUserRole'],
    queryFn: async () => {
      if (!actor) return null;
      if (!identity) return null;
      
      try {
        const role = await actor.getCallerUserRole();
        return role;
      } catch (error: any) {
        console.error('Role check error:', error);
        // Return null if role check fails
        return null;
      }
    },
    enabled: !!actor && !!identity && !actorFetching,
    retry: false,
    staleTime: 30000
  });
}

export function useAssignUserRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, role }: { user: Principal; role: UserRole }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.assignCallerUserRole(user, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerUserRole'] });
      queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
    },
    onError: (error: any) => {
      console.error('Role assignment error:', error);
      // Error will be handled by the component
    }
  });
}
