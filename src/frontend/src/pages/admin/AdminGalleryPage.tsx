import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useGetGalleryImages, useAddGalleryImage, useRemoveGalleryImage } from '../../hooks/useGallery';
import { ExternalBlob } from '../../backend';

export default function AdminGalleryPage() {
  const { data: galleryImages = [] } = useGetGalleryImages();
  const addGalleryImage = useAddGalleryImage();
  const removeGalleryImage = useRemoveGalleryImage();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    caption: '',
    category: '',
    file: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.file) {
      toast.error('Please select an image');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const arrayBuffer = await formData.file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      await addGalleryImage.mutateAsync({
        id: `gallery-${Date.now()}`,
        blob,
        caption: formData.caption.trim(),
        category: formData.category.trim()
      });

      toast.success('Image added to gallery');
      setDialogOpen(false);
      setFormData({ caption: '', category: '', file: null });
    } catch (error) {
      toast.error('Failed to add image');
      console.error(error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      await removeGalleryImage.mutateAsync(id);
      toast.success('Image deleted');
    } catch (error) {
      toast.error('Failed to delete image');
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-serif">Gallery Management</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Image
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-serif">Add Gallery Image</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="file">Image *</Label>
                  <Input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="caption">Caption *</Label>
                  <Input
                    id="caption"
                    value={formData.caption}
                    onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Food, Events, Pastries, Drinks"
                    required
                  />
                </div>
                {uploading && (
                  <div className="space-y-2">
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground text-center">{uploadProgress}%</p>
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Add Image'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map((image) => (
            <div key={image.id} className="relative group">
              <img
                src={image.blob.getDirectURL()}
                alt={image.caption}
                className="w-full aspect-square object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center p-2">
                <p className="text-white text-xs text-center mb-2 line-clamp-2">{image.caption}</p>
                <p className="text-white/80 text-xs mb-2">{image.category}</p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(image.id)}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
