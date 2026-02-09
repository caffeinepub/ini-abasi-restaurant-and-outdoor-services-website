import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ContactInfo } from '../backend';

export function useGetContactInfo() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ContactInfo | null>({
    queryKey: ['contactInfo'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getContactInfo();
    },
    enabled: !!actor && !actorFetching
  });
}

export function useUpdateContactInfo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (info: ContactInfo) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateContactInfo(info);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactInfo'] });
    }
  });
}
