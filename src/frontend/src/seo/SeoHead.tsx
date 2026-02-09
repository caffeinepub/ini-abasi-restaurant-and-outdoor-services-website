import { useEffect } from 'react';
import type { SeoMeta, ContactInfo, MenuItem, Promotion } from '../backend';

interface SeoHeadProps {
  pageKey: string;
  defaultTitle?: string;
  defaultDescription?: string;
  seoMeta?: SeoMeta | null;
  contactInfo?: ContactInfo | null;
  menuItems?: MenuItem[];
  promotions?: Promotion[];
}

export default function SeoHead({
  pageKey,
  defaultTitle = 'Ini-Abasi Restaurant and Outdoor Services',
  defaultDescription = 'Authentic African & continental cuisine in Maje, Suleja. Women-owned restaurant offering catering, pastries, and natural drinks.',
  seoMeta,
  contactInfo,
  menuItems,
  promotions
}: SeoHeadProps) {
  useEffect(() => {
    const title = seoMeta?.title || defaultTitle;
    const description = seoMeta?.description || defaultDescription;
    const keywords = seoMeta?.keywords || 'African restaurant, continental cuisine, Suleja restaurant, Nigerian food, catering services';

    document.title = title;

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords);

    // Remove existing JSON-LD scripts
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach((script) => script.remove());

    // Add LocalBusiness structured data
    if (contactInfo) {
      const localBusinessData = {
        '@context': 'https://schema.org',
        '@type': 'Restaurant',
        name: 'Ini-Abasi Restaurant and Outdoor Services',
        description: description,
        address: {
          '@type': 'PostalAddress',
          streetAddress: contactInfo.address,
          addressLocality: 'Maje, Suleja',
          addressCountry: 'NG'
        },
        telephone: contactInfo.phone,
        email: contactInfo.email,
        openingHours: contactInfo.hours,
        servesCuisine: ['African', 'Continental'],
        priceRange: '$$'
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(localBusinessData);
      document.head.appendChild(script);
    }

    // Add Menu structured data
    if (menuItems && menuItems.length > 0 && pageKey === 'menu') {
      const menuData = {
        '@context': 'https://schema.org',
        '@type': 'Menu',
        hasMenuSection: menuItems.map((item) => ({
          '@type': 'MenuSection',
          name: item.category,
          hasMenuItem: {
            '@type': 'MenuItem',
            name: item.name,
            description: item.description,
            offers: {
              '@type': 'Offer',
              price: item.price,
              priceCurrency: 'NGN'
            }
          }
        }))
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(menuData);
      document.head.appendChild(script);
    }

    // Add Event structured data for promotions
    if (promotions && promotions.length > 0) {
      promotions.forEach((promo) => {
        const eventData = {
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: promo.title,
          description: promo.description,
          startDate: new Date(Number(promo.startDate) / 1_000_000).toISOString(),
          endDate: new Date(Number(promo.endDate) / 1_000_000).toISOString(),
          location: {
            '@type': 'Place',
            name: 'Ini-Abasi Restaurant and Outdoor Services',
            address: contactInfo?.address || 'Beside Suleja NNPC Depot Main Gate, Maje, Suleja'
          }
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(eventData);
        document.head.appendChild(script);
      });
    }
  }, [pageKey, defaultTitle, defaultDescription, seoMeta, contactInfo, menuItems, promotions]);

  return null;
}
