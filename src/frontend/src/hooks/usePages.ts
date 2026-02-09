import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Page } from '../backend';

export function useGetAllPages() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Page[]>({
    queryKey: ['pages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPages();
    },
    enabled: !!actor && !actorFetching
  });
}

export function useGetPage(id: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Page | null>({
    queryKey: ['page', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPage(id);
    },
    enabled: !!actor && !actorFetching && !!id
  });
}

export function useAddPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (page: Page) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addPage(page);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    }
  });
}

export function useUpdatePage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, page }: { id: string; page: Page }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePage(id, page);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.invalidateQueries({ queryKey: ['page', variables.id] });
    }
  });
}

export function useRemovePage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removePage(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    }
  });
}
