import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Star } from 'lucide-react';
import { useGetTestimonials } from '../hooks/useTestimonials';

export default function TestimonialsCarousel() {
  const { data: testimonials = [] } = useGetTestimonials();

  if (testimonials.length === 0) return null;

  return (
    <section className="py-16 bg-secondary/20">
      <div className="container mx-auto px-4">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-12">
          What Our Customers Say
        </h2>
        <Carousel
          opts={{
            align: 'start',
            loop: true
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex mb-3">
                      {Array.from({ length: Number(testimonial.rating) }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-4">
                      "{testimonial.content}"
                    </p>
                    <p className="text-sm font-semibold">{testimonial.author}</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
