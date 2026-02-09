import { useParams } from '@tanstack/react-router';
import { useGetAllPages } from '../hooks/usePages';
import SeoHead from '../seo/SeoHead';
import { useGetContactInfo } from '../hooks/useContactInfo';

export default function CustomPage() {
  const { slug } = useParams({ from: '/page/$slug' });
  const { data: pages = [] } = useGetAllPages();
  const { data: contactInfo } = useGetContactInfo();

  const page = pages.find((p) => p.slug === slug);

  if (!page) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-4xl font-bold mb-4">Page Not Found</h1>
          <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SeoHead
        pageKey={`custom-${page.id}`}
        defaultTitle={page.title}
        defaultDescription={page.seoMeta.description}
        seoMeta={page.seoMeta}
        contactInfo={contactInfo}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-8">{page.title}</h1>
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: page.content }} />
          </div>
        </div>
      </div>
    </>
  );
}
