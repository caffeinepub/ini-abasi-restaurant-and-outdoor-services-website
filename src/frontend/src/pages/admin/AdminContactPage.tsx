import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useGetContactInfo, useUpdateContactInfo } from '../../hooks/useContactInfo';

export default function AdminContactPage() {
  const { data: contactInfo } = useGetContactInfo();
  const updateContactInfo = useUpdateContactInfo();

  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    whatsapp: '',
    email: '',
    hours: '',
    mapUrl: ''
  });

  useEffect(() => {
    if (contactInfo) {
      setFormData({
        address: contactInfo.address,
        phone: contactInfo.phone,
        whatsapp: contactInfo.whatsapp,
        email: contactInfo.email,
        hours: contactInfo.hours,
        mapUrl: contactInfo.mapUrl
      });
    }
  }, [contactInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateContactInfo.mutateAsync({
        address: formData.address.trim(),
        phone: formData.phone.trim(),
        whatsapp: formData.whatsapp.trim(),
        email: formData.email.trim(),
        hours: formData.hours.trim(),
        mapUrl: formData.mapUrl.trim()
      });
      toast.success('Contact information updated');
    } catch (error) {
      toast.error('Failed to update contact information');
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">Contact & Hours Management</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Beside Suleja NNPC Depot Main Gate, Maje, Suleja"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+234..."
              required
            />
          </div>
          <div>
            <Label htmlFor="whatsapp">WhatsApp *</Label>
            <Input
              id="whatsapp"
              type="tel"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              placeholder="+234..."
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="info@iniabasi.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="hours">Opening Hours *</Label>
            <Textarea
              id="hours"
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
              placeholder="Mon-Fri: 9am-9pm&#10;Sat-Sun: 10am-10pm"
              rows={4}
              required
            />
          </div>
          <div>
            <Label htmlFor="mapUrl">Google Maps Embed URL *</Label>
            <Input
              id="mapUrl"
              value={formData.mapUrl}
              onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
              placeholder="https://www.google.com/maps/embed?pb=..."
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Get embed URL from Google Maps → Share → Embed a map
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={updateContactInfo.isPending}>
            {updateContactInfo.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
