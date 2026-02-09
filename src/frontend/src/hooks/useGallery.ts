import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { GalleryImage } from '../backend';

export function useGetGalleryImages() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<GalleryImage[]>({
    queryKey: ['galleryImages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGalleryImages();
    },
    enabled: !!actor && !actorFetching
  });
}

export function useAddGalleryImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (image: GalleryImage) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addGalleryImage(image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
    }
  });
}

export function useRemoveGalleryImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeGalleryImage(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
    }
  });
}
