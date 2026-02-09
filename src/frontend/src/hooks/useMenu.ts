import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { MenuItem } from '../backend';

export function useGetMenuItems() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<MenuItem[]>({
    queryKey: ['menuItems'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMenuItems();
    },
    enabled: !!actor && !actorFetching
  });
}

export function useAddMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: MenuItem) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMenuItem(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    }
  });
}

export function useUpdateMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, item }: { id: string; item: MenuItem }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateMenuItem(id, item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    }
  });
}

export function useRemoveMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeMenuItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    }
  });
}
