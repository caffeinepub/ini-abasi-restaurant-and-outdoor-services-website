import { Link } from '@tanstack/react-router';
import { Phone, Mail, MapPin, Heart } from 'lucide-react';
import { SiFacebook, SiInstagram, SiX } from 'react-icons/si';
import { useGetContactInfo } from '../hooks/useContactInfo';

export default function Footer() {
  const { data: contactInfo } = useGetContactInfo();

  return (
    <footer className="bg-secondary/30 border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4">Ini-Abasi Restaurant</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Authentic African & continental cuisine. Women-owned, community-focused.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <SiFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <SiInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <SiX className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/menu" className="text-muted-foreground hover:text-primary transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-muted-foreground hover:text-primary transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/order-reserve" className="text-muted-foreground hover:text-primary transition-colors">
                  Order & Reserve
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              {contactInfo?.phone && (
                <li className="flex items-start space-x-2">
                  <Phone className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                  <a href={`tel:${contactInfo.phone}`} className="text-muted-foreground hover:text-primary transition-colors">
                    {contactInfo.phone}
                  </a>
                </li>
              )}
              {contactInfo?.email && (
                <li className="flex items-start space-x-2">
                  <Mail className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                  <a href={`mailto:${contactInfo.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                    {contactInfo.email}
                  </a>
                </li>
              )}
              {contactInfo?.address && (
                <li className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{contactInfo.address}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4">Opening Hours</h3>
            {contactInfo?.hours ? (
              <p className="text-sm text-muted-foreground whitespace-pre-line">{contactInfo.hours}</p>
            ) : (
              <p className="text-sm text-muted-foreground">Contact us for hours</p>
            )}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>
            © 2026. Built with <Heart className="inline h-4 w-4 text-accent" /> using{' '}
            <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
