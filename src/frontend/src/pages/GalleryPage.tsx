import { useState, useMemo, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GalleryLightbox from '../components/GalleryLightbox';
import { useGetGalleryImages } from '../hooks/useGallery';
import SeoHead from '../seo/SeoHead';
import { useGetSeoMeta } from '../hooks/useSeoMeta';
import { useGetContactInfo } from '../hooks/useContactInfo';

export default function GalleryPage() {
  const { data: galleryImages = [] } = useGetGalleryImages();
  const { data: seoMeta } = useGetSeoMeta('gallery');
  const { data: contactInfo } = useGetContactInfo();

  const categories = useMemo(() => {
    const cats = new Set(galleryImages.map((img) => img.category));
    return ['All', ...Array.from(cats)];
  }, [galleryImages]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const filteredImages = useMemo(() => {
    if (selectedCategory === 'All') return galleryImages;
    return galleryImages.filter((img) => img.category === selectedCategory);
  }, [galleryImages, selectedCategory]);

  const lightboxImages = useMemo(() => {
    return filteredImages.map((img) => ({
      url: img.blob.getDirectURL(),
      caption: img.caption
    }));
  }, [filteredImages]);

  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    imageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [filteredImages]);

  return (
    <>
      <SeoHead
        pageKey="gallery"
        defaultTitle="Gallery - Ini-Abasi Restaurant"
        defaultDescription="Browse our gallery of delicious dishes, events, pastries, and more."
        seoMeta={seoMeta}
        contactInfo={contactInfo}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Gallery</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our collection of mouth-watering dishes, memorable events, and more.
            </p>
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto mb-8">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="px-6">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory}>
              {filteredImages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No images in this category yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredImages.map((image, index) => (
                    <div
                      key={image.id}
                      ref={(el) => { imageRefs.current[index] = el; }}
                      className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer opacity-0"
                      onClick={() => setLightboxIndex(index)}
                    >
                      <img
                        src={image.blob.getDirectURL()}
                        alt={image.caption}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-white text-sm font-medium">{image.caption}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {lightboxIndex >= 0 && (
        <GalleryLightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(-1)}
          onNext={() => setLightboxIndex((lightboxIndex + 1) % lightboxImages.length)}
          onPrev={() => setLightboxIndex((lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length)}
        />
      )}
    </>
  );
}
