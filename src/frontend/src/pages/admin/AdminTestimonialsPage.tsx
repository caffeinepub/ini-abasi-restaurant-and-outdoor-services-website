import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useGetTestimonials, useAddTestimonial, useRemoveTestimonial } from '../../hooks/useTestimonials';

export default function AdminTestimonialsPage() {
  const { data: testimonials = [] } = useGetTestimonials();
  const addTestimonial = useAddTestimonial();
  const removeTestimonial = useRemoveTestimonial();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    author: '',
    content: '',
    rating: '5'
  });

  const resetForm = () => {
    setFormData({ author: '', content: '', rating: '5' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addTestimonial.mutateAsync({
        id: `testimonial-${Date.now()}`,
        author: formData.author.trim(),
        content: formData.content.trim(),
        rating: BigInt(formData.rating),
        timestamp: BigInt(Date.now() * 1_000_000)
      });
      toast.success('Testimonial added');
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to add testimonial');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      await removeTestimonial.mutateAsync(id);
      toast.success('Testimonial deleted');
    } catch (error) {
      toast.error('Failed to delete testimonial');
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-serif">Testimonials Management</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Testimonial
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-serif">Add Testimonial</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="author">Author Name *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="content">Testimonial *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="rating">Rating *</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={addTestimonial.isPending}>
                  Add Testimonial
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
              <TableHead>Author</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.map((testimonial) => (
              <TableRow key={testimonial.id}>
                <TableCell className="font-medium">{testimonial.author}</TableCell>
                <TableCell className="max-w-md truncate">{testimonial.content}</TableCell>
                <TableCell>
                  <div className="flex">
                    {Array.from({ length: Number(testimonial.rating) }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(testimonial.id)}>
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
