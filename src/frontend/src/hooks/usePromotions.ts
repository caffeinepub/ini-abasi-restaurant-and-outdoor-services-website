import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Promotion } from '../backend';

export function useGetPromotions() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Promotion[]>({
    queryKey: ['promotions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPromotions();
    },
    enabled: !!actor && !actorFetching
  });
}

export function useAddPromotion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (promotion: Promotion) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addPromotion(promotion);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    }
  });
}

export function useRemovePromotion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removePromotion(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    }
  });
}
