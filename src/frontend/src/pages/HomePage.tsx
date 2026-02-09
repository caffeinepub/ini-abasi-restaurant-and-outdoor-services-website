import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UtensilsCrossed, Cake, Coffee, Users, Award, Shield } from 'lucide-react';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import SeoHead from '../seo/SeoHead';
import { useGetSeoMeta } from '../hooks/useSeoMeta';
import { useGetContactInfo } from '../hooks/useContactInfo';
import { useGetMenuItems } from '../hooks/useMenu';
import { useGetPromotions } from '../hooks/usePromotions';

export default function HomePage() {
  const { data: seoMeta } = useGetSeoMeta('home');
  const { data: contactInfo } = useGetContactInfo();
  const { data: menuItems } = useGetMenuItems();
  const { data: promotions } = useGetPromotions();

  const highlights = [
    {
      icon: UtensilsCrossed,
      title: 'Authentic Dishes',
      description: 'Traditional African & continental cuisine prepared with love and authentic recipes.'
    },
    {
      icon: Cake,
      title: 'Fresh Pastries',
      description: 'Delicious pastries baked fresh daily using quality ingredients.'
    },
    {
      icon: Coffee,
      title: 'Natural Drinks',
      description: 'Refreshing natural drinks made from fresh, local ingredients.'
    },
    {
      icon: Users,
      title: 'Event Catering',
      description: 'Professional catering services for your special occasions and outdoor events.'
    }
  ];

  return (
    <>
      <SeoHead
        pageKey="home"
        seoMeta={seoMeta}
        contactInfo={contactInfo}
        menuItems={menuItems}
        promotions={promotions}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-secondary/20 to-background overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Authentic African & Continental Cuisine
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Experience the rich flavors of Africa and beyond at Ini-Abasi Restaurant. 
                Women-owned, community-focused, and committed to quality.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/order-reserve">
                  <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-lg">
                    Order Now
                  </Button>
                </Link>
                <Link to="/menu">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg">
                    View Menu
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/generated/iniabasi-hero.dim_1920x1080.png"
                alt="Delicious African and continental dishes"
                className="rounded-lg shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-12">
            What We Offer
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((highlight, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <highlight.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-bold mb-2">{highlight.title}</h3>
                  <p className="text-sm text-muted-foreground">{highlight.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quality & Hygiene Section */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
              Quality & Hygiene First
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              At Ini-Abasi Restaurant, we prioritize food safety and quality in everything we do. 
              Our kitchen maintains the highest hygiene standards, and we use only fresh, quality ingredients 
              to ensure every meal is safe, delicious, and memorable.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center space-x-2">
                <Award className="h-6 w-6 text-accent" />
                <span className="font-medium">Fresh Ingredients</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-accent" />
                <span className="font-medium">Hygiene Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-accent" />
                <span className="font-medium">Trained Staff</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsCarousel />

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience Authentic Flavors?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Visit us today or place an order for delivery. We're here to serve you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/order-reserve">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto text-lg">
                Order & Reserve
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
