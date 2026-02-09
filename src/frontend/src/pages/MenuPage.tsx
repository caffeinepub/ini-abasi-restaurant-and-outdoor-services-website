import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star } from 'lucide-react';
import { useGetMenuItems } from '../hooks/useMenu';
import SeoHead from '../seo/SeoHead';
import { useGetSeoMeta } from '../hooks/useSeoMeta';
import { useGetContactInfo } from '../hooks/useContactInfo';

export default function MenuPage() {
  const { data: menuItems = [] } = useGetMenuItems();
  const { data: seoMeta } = useGetSeoMeta('menu');
  const { data: contactInfo } = useGetContactInfo();

  const categories = useMemo(() => {
    const cats = new Set(menuItems.map((item) => item.category));
    return ['All', ...Array.from(cats)];
  }, [menuItems]);

  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return menuItems;
    return menuItems.filter((item) => item.category === selectedCategory);
  }, [menuItems, selectedCategory]);

  const specialItems = menuItems.filter((item) => item.special);

  return (
    <>
      <SeoHead
        pageKey="menu"
        defaultTitle="Menu - Ini-Abasi Restaurant"
        defaultDescription="Explore our menu of authentic African and continental dishes, fresh pastries, and natural drinks."
        seoMeta={seoMeta}
        contactInfo={contactInfo}
        menuItems={menuItems}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Our Menu</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our selection of authentic African and continental cuisine, 
              prepared fresh daily with quality ingredients.
            </p>
          </div>

          {/* Daily Specials */}
          {specialItems.length > 0 && (
            <div className="mb-12">
              <h2 className="font-serif text-2xl md:text-3xl font-bold mb-6 flex items-center">
                <Star className="h-6 w-6 text-accent mr-2 fill-accent" />
                Today's Specials
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {specialItems.map((item) => (
                  <Card key={item.id} className="border-accent">
                    <CardHeader>
                      <CardTitle className="font-serif flex items-start justify-between">
                        <span>{item.name}</span>
                        <Badge variant="destructive" className="ml-2 bg-accent">Special</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                      <p className="text-xl font-bold text-primary">₦{item.price.toFixed(2)}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Menu Categories */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="px-6">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-8">
              {filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No items in this category yet.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item) => (
                    <Card key={item.id}>
                      <CardHeader>
                        <CardTitle className="font-serif">{item.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xl font-bold text-primary">₦{item.price.toFixed(2)}</p>
                          {item.special && (
                            <Badge variant="outline" className="border-accent text-accent">
                              Special
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
