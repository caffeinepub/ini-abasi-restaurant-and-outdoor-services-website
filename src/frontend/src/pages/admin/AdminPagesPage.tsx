import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useGetAllPages, useAddPage, useUpdatePage, useRemovePage } from '../../hooks/usePages';
import type { Page } from '../../backend';

export default function AdminPagesPage() {
  const { data: pages = [] } = useGetAllPages();
  const addPage = useAddPage();
  const updatePage = useUpdatePage();
  const removePage = useRemovePage();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
  });

  const resetForm = () => {
    setFormData({ title: '', slug: '', content: '', seoTitle: '', seoDescription: '', seoKeywords: '' });
    setEditingPage(null);
  };

  const handleEdit = (page: Page) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      seoTitle: page.seoMeta.title,
      seoDescription: page.seoMeta.description,
      seoKeywords: page.seoMeta.keywords
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const page: Page = {
      id: editingPage?.id || `page-${Date.now()}`,
      title: formData.title.trim(),
      slug: formData.slug.trim().toLowerCase().replace(/\s+/g, '-'),
      content: formData.content.trim(),
      seoMeta: {
        title: formData.seoTitle.trim(),
        description: formData.seoDescription.trim(),
        keywords: formData.seoKeywords.trim()
      }
    };

    try {
      if (editingPage) {
        await updatePage.mutateAsync({ id: editingPage.id, page });
        toast.success('Page updated');
      } else {
        await addPage.mutateAsync(page);
        toast.success('Page added');
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save page');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      await removePage.mutateAsync(id);
      toast.success('Page deleted');
    } catch (error) {
      toast.error('Failed to delete page');
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-serif">Pages Management</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Page
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif">
                  {editingPage ? 'Edit Page' : 'Add Page'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Page Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="about-us"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Will appear as: /page/{formData.slug || 'your-slug'}
                  </p>
                </div>
                <div>
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={8}
                    placeholder="Page content (HTML supported)"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="seoTitle">SEO Title *</Label>
                  <Input
                    id="seoTitle"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="seoDescription">SEO Description *</Label>
                  <Textarea
                    id="seoDescription"
                    value={formData.seoDescription}
                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                    rows={2}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="seoKeywords">SEO Keywords *</Label>
                  <Input
                    id="seoKeywords"
                    value={formData.seoKeywords}
                    onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={addPage.isPending || updatePage.isPending}>
                  {editingPage ? 'Update Page' : 'Add Page'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((page) => (
              <TableRow key={page.id}>
                <TableCell className="font-medium">{page.title}</TableCell>
                <TableCell className="font-mono text-sm">/page/{page.slug}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(page)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(page.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
