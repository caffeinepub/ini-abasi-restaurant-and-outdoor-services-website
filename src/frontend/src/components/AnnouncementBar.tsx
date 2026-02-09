import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { useGetPromotions } from '../hooks/usePromotions';

export default function AnnouncementBar() {
  const { data: promotions = [] } = useGetPromotions();
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('dismissed-promotions');
    if (stored) {
      setDismissed(JSON.parse(stored));
    }
  }, []);

  const activePromotions = promotions.filter((promo) => {
    const now = Date.now();
    const start = Number(promo.startDate) / 1_000_000;
    const end = Number(promo.endDate) / 1_000_000;
    return now >= start && now <= end && !dismissed.includes(promo.id);
  });

  const handleDismiss = (id: string) => {
    const newDismissed = [...dismissed, id];
    setDismissed(newDismissed);
    localStorage.setItem('dismissed-promotions', JSON.stringify(newDismissed));
  };

  if (activePromotions.length === 0) return null;

  const promo = activePromotions[0];

  return (
    <div className="bg-accent text-accent-foreground py-2 px-4 relative">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-1 text-center">
          {promo.link ? (
            <Link to={promo.link} className="text-sm font-medium hover:underline">
              {promo.title} - {promo.description}
            </Link>
          ) : (
            <p className="text-sm font-medium">
              {promo.title} - {promo.description}
            </p>
          )}
        </div>
        <button
          onClick={() => handleDismiss(promo.id)}
          className="ml-4 p-1 hover:bg-accent-foreground/10 rounded transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
