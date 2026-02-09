import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GalleryLightboxProps {
  images: Array<{ url: string; caption: string }>;
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function GalleryLightbox({ images, currentIndex, onClose, onNext, onPrev }: GalleryLightboxProps) {
  if (currentIndex < 0 || currentIndex >= images.length) return null;

  const current = images[currentIndex];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full p-0 bg-black/95">
        <div className="relative w-full h-[90vh] flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
            onClick={onPrev}
            disabled={images.length <= 1}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <img
            src={current.url}
            alt={current.caption}
            className="max-w-full max-h-full object-contain"
          />

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
            onClick={onNext}
            disabled={images.length <= 1}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          {current.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 text-center">
              <p className="text-sm">{current.caption}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
