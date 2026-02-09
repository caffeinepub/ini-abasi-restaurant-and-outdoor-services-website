import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useExportData } from '../../hooks/useExport';

export default function AdminExportPage() {
  const exportData = useExportData();

  const handleExport = async () => {
    try {
      await exportData.mutateAsync();
      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">Export & Backup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Export all your website data including menu items, gallery images, contact information, 
            orders, testimonials, promotions, and custom pages. This backup ensures you never lose 
            control of your data.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">What's included in the export:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>All menu items and categories</li>
              <li>Gallery images and metadata</li>
              <li>Contact information and hours</li>
              <li>All orders and reservations</li>
              <li>SEO settings for all pages</li>
              <li>Testimonials and reviews</li>
              <li>Promotions and banners</li>
              <li>Custom pages and content</li>
            </ul>
          </div>

          <Button
            onClick={handleExport}
            disabled={exportData.isPending}
            size="lg"
            className="w-full"
          >
            <Download className="mr-2 h-5 w-5" />
            {exportData.isPending ? 'Exporting...' : 'Export All Data'}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            The export will download as a JSON file with a timestamp. Keep this file safe as a backup.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
