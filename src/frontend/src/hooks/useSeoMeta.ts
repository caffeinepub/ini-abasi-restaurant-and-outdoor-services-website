import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { SeoMeta } from '../backend';

export function useGetSeoMeta(page: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SeoMeta | null>({
    queryKey: ['seoMeta', page],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSeoMeta(page);
    },
    enabled: !!actor && !actorFetching
  });
}

export function useUpdateSeoMeta() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ page, meta }: { page: string; meta: SeoMeta }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateSeoMeta(page, meta);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['seoMeta', variables.page] });
    }
  });
}
