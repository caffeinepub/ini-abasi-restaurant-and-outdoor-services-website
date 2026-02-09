import { Card, CardContent } from '@/components/ui/card';
import { Heart, Users, Award, Shield } from 'lucide-react';
import SeoHead from '../seo/SeoHead';
import { useGetSeoMeta } from '../hooks/useSeoMeta';
import { useGetContactInfo } from '../hooks/useContactInfo';

export default function AboutPage() {
  const { data: seoMeta } = useGetSeoMeta('about');
  const { data: contactInfo } = useGetContactInfo();

  return (
    <>
      <SeoHead
        pageKey="about"
        defaultTitle="About Us - Ini-Abasi Restaurant"
        defaultDescription="Learn about Ini-Abasi Restaurant, a women-owned establishment serving authentic African and continental cuisine in Maje, Suleja."
        seoMeta={seoMeta}
        contactInfo={contactInfo}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">About Us</h1>
            <p className="text-lg text-muted-foreground">
              Authentic cuisine, community values, and a commitment to excellence.
            </p>
          </div>

          {/* Heritage Section */}
          <section className="mb-16">
            <div className="flex items-center mb-6">
              <Heart className="h-8 w-8 text-accent mr-3" />
              <h2 className="font-serif text-3xl font-bold">Our Heritage</h2>
            </div>
            <Card>
              <CardContent className="p-8">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Ini-Abasi Restaurant and Outdoor Services brings the rich culinary traditions of Africa 
                  to the heart of Maje, Suleja. Our name, "Ini-Abasi," reflects our commitment to serving 
                  food with love and authenticity, honoring the recipes and cooking methods passed down 
                  through generations.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We blend traditional African flavors with continental cuisine to create a unique dining 
                  experience that celebrates our heritage while embracing diversity. Every dish tells a story, 
                  and every meal is prepared with care and respect for our culinary roots.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Women-Owned Section */}
          <section className="mb-16">
            <div className="flex items-center mb-6">
              <Users className="h-8 w-8 text-primary mr-3" />
              <h2 className="font-serif text-3xl font-bold">Women-Owned & Proud</h2>
            </div>
            <Card>
              <CardContent className="p-8">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Ini-Abasi Restaurant is proudly women-owned and operated. We believe in empowering women 
                  in our community and creating opportunities for growth and success. Our leadership team 
                  brings passion, dedication, and a deep understanding of hospitality to everything we do.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  As a women-led business, we're committed to fostering an inclusive environment where 
                  everyone feels welcome. We support local women entrepreneurs and work to create a positive 
                  impact in our community through employment, mentorship, and collaboration.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Community Focus Section */}
          <section className="mb-16">
            <div className="flex items-center mb-6">
              <Award className="h-8 w-8 text-primary mr-3" />
              <h2 className="font-serif text-3xl font-bold">Community-Focused Values</h2>
            </div>
            <Card>
              <CardContent className="p-8">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  At Ini-Abasi, we're more than just a restaurant—we're a gathering place for families, 
                  friends, and neighbors. We believe in building strong community connections and supporting 
                  local families through quality food, excellent service, and genuine hospitality.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Whether you're celebrating a special occasion, hosting an outdoor event, or simply enjoying 
                  a meal with loved ones, we're here to make your experience memorable. We source ingredients 
                  locally whenever possible and work with community partners to create positive change.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Hygiene & Quality Section */}
          <section className="mb-16">
            <div className="flex items-center mb-6">
              <Shield className="h-8 w-8 text-accent mr-3" />
              <h2 className="font-serif text-3xl font-bold">Hygiene & Quality First</h2>
            </div>
            <Card>
              <CardContent className="p-8">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Food safety and quality are our top priorities. We maintain the highest hygiene standards 
                  in our kitchen and dining areas, ensuring that every meal we serve meets strict safety 
                  protocols. Our team is trained in proper food handling, storage, and preparation techniques.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use only fresh, quality ingredients sourced from trusted suppliers. Our kitchen is 
                  regularly inspected and cleaned, and we follow best practices for food safety at every 
                  step of the cooking process.
                </p>
                <div className="grid sm:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-secondary/20 rounded-lg">
                    <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="font-semibold">Certified Clean</p>
                  </div>
                  <div className="text-center p-4 bg-secondary/20 rounded-lg">
                    <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="font-semibold">Quality Ingredients</p>
                  </div>
                  <div className="text-center p-4 bg-secondary/20 rounded-lg">
                    <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="font-semibold">Trained Staff</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </>
  );
}
