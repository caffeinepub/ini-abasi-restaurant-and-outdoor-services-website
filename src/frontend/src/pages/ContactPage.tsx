import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetContactInfo } from '../hooks/useContactInfo';
import SeoHead from '../seo/SeoHead';
import { useGetSeoMeta } from '../hooks/useSeoMeta';

export default function ContactPage() {
  const { data: contactInfo } = useGetContactInfo();
  const { data: seoMeta } = useGetSeoMeta('contact');

  return (
    <>
      <SeoHead
        pageKey="contact"
        defaultTitle="Contact Us - Ini-Abasi Restaurant"
        defaultDescription="Get in touch with Ini-Abasi Restaurant. Visit us, call, or send a message."
        seoMeta={seoMeta}
        contactInfo={contactInfo}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-muted-foreground">
              We'd love to hear from you. Visit us or get in touch!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Get In Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactInfo?.address && (
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold mb-1">Address</p>
                        <p className="text-muted-foreground">{contactInfo.address}</p>
                      </div>
                    </div>
                  )}

                  {contactInfo?.phone && (
                    <div className="flex items-start space-x-3">
                      <Phone className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold mb-1">Phone</p>
                        <a
                          href={`tel:${contactInfo.phone}`}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {contactInfo.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {contactInfo?.whatsapp && (
                    <div className="flex items-start space-x-3">
                      <MessageCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold mb-1">WhatsApp</p>
                        <a
                          href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {contactInfo.whatsapp}
                        </a>
                      </div>
                    </div>
                  )}

                  {contactInfo?.email && (
                    <div className="flex items-start space-x-3">
                      <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold mb-1">Email</p>
                        <a
                          href={`mailto:${contactInfo.email}`}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {contactInfo.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {contactInfo?.hours && (
                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold mb-1">Opening Hours</p>
                        <p className="text-muted-foreground whitespace-pre-line">{contactInfo.hours}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {contactInfo?.phone && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <a href={`tel:${contactInfo.phone}`}>
                        <Phone className="mr-2 h-4 w-4" />
                        Call Us
                      </a>
                    </Button>
                  )}
                  {contactInfo?.whatsapp && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <a
                        href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        WhatsApp Us
                      </a>
                    </Button>
                  )}
                  {contactInfo?.email && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <a href={`mailto:${contactInfo.email}`}>
                        <Mail className="mr-2 h-4 w-4" />
                        Email Us
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Map */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Find Us</CardTitle>
              </CardHeader>
              <CardContent>
                {contactInfo?.mapUrl ? (
                  <div className="aspect-video w-full rounded-lg overflow-hidden">
                    <iframe
                      src={contactInfo.mapUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Ini-Abasi Restaurant Location"
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">Map not available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
