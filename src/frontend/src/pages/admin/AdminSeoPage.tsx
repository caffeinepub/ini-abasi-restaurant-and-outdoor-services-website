import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useGetSeoMeta, useUpdateSeoMeta } from '../../hooks/useSeoMeta';

const pages = [
  { key: 'home', label: 'Home' },
  { key: 'menu', label: 'Menu' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'about', label: 'About' },
  { key: 'contact', label: 'Contact' },
  { key: 'order-reserve', label: 'Order & Reserve' }
];

export default function AdminSeoPage() {
  const updateSeoMeta = useUpdateSeoMeta();
  const [selectedPage, setSelectedPage] = useState('home');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">SEO Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedPage} onValueChange={setSelectedPage}>
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 mb-6">
            {pages.map((page) => (
              <TabsTrigger key={page.key} value={page.key}>
                {page.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {pages.map((page) => (
            <TabsContent key={page.key} value={page.key}>
              <SeoForm pageKey={page.key} pageLabel={page.label} updateSeoMeta={updateSeoMeta} />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

function SeoForm({ pageKey, pageLabel, updateSeoMeta }: any) {
  const { data: seoMeta } = useGetSeoMeta(pageKey);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    keywords: ''
  });

  useState(() => {
    if (seoMeta) {
      setFormData({
        title: seoMeta.title,
        description: seoMeta.description,
        keywords: seoMeta.keywords
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateSeoMeta.mutateAsync({
        page: pageKey,
        meta: {
          title: formData.title.trim(),
          description: formData.description.trim(),
          keywords: formData.keywords.trim()
        }
      });
      toast.success(`SEO updated for ${pageLabel}`);
    } catch (error) {
      toast.error('Failed to update SEO');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Meta Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder={`${pageLabel} - Ini-Abasi Restaurant`}
          required
        />
        <p className="text-xs text-muted-foreground mt-1">Recommended: 50-60 characters</p>
      </div>
      <div>
        <Label htmlFor="description">Meta Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description for search engines..."
          rows={3}
          required
        />
        <p className="text-xs text-muted-foreground mt-1">Recommended: 150-160 characters</p>
      </div>
      <div>
        <Label htmlFor="keywords">Keywords *</Label>
        <Input
          id="keywords"
          value={formData.keywords}
          onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
          placeholder="african restaurant, suleja, nigerian food"
          required
        />
        <p className="text-xs text-muted-foreground mt-1">Comma-separated keywords</p>
      </div>
      <Button type="submit" className="w-full" disabled={updateSeoMeta.isPending}>
        {updateSeoMeta.isPending ? 'Saving...' : 'Save SEO Settings'}
      </Button>
    </form>
  );
}
