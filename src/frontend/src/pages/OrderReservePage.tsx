import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useGetMenuItems } from '../hooks/useMenu';
import { usePlaceOrder } from '../hooks/useOrders';
import OrderCart from '../components/OrderCart';
import SeoHead from '../seo/SeoHead';
import { useGetSeoMeta } from '../hooks/useSeoMeta';
import { useGetContactInfo } from '../hooks/useContactInfo';
import type { MenuItem } from '../backend';

interface CartItem extends MenuItem {
  quantity: number;
}

export default function OrderReservePage() {
  const navigate = useNavigate();
  const { data: menuItems = [] } = useGetMenuItems();
  const { data: seoMeta } = useGetSeoMeta('order-reserve');
  const { data: contactInfo } = useGetContactInfo();
  const placeOrder = usePlaceOrder();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [deliveryDetails, setDeliveryDetails] = useState('');
  const [tableBookingDetails, setTableBookingDetails] = useState('');
  
  // Customer contact fields for anonymous orders
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  
  // Reservation contact fields
  const [reservationName, setReservationName] = useState('');
  const [reservationPhone, setReservationPhone] = useState('');
  const [reservationEmail, setReservationEmail] = useState('');

  const addToCart = (item: MenuItem) => {
    const existing = cartItems.find((ci) => ci.id === item.id);
    if (existing) {
      setCartItems(cartItems.map((ci) => (ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci)));
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
    toast.success(`${item.name} added to cart`);
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems(cartItems.map((ci) => (ci.id === id ? { ...ci, quantity } : ci)));
  };

  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter((ci) => ci.id !== id));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error('Please add items to your cart');
      return;
    }

    if (!customerName.trim()) {
      toast.error('Please provide your name');
      return;
    }

    if (!customerPhone.trim()) {
      toast.error('Please provide your phone number');
      return;
    }

    if (!deliveryDetails.trim()) {
      toast.error('Please provide delivery details');
      return;
    }

    try {
      await placeOrder.mutateAsync({
        id: `order-${Date.now()}`,
        customerPrincipal: 'anonymous',
        items: cartItems,
        deliveryDetails: deliveryDetails.trim(),
        tableBookingDetails: '',
        timestamp: BigInt(Date.now() * 1_000_000),
        status: 'new',
        contactInfo: {
          address: deliveryDetails.trim(),
          phone: customerPhone.trim(),
          whatsapp: customerPhone.trim(),
          email: customerEmail.trim(),
          hours: customerName.trim(),
          mapUrl: ''
        }
      });

      toast.success('Order placed successfully!');
      setCartItems([]);
      setDeliveryDetails('');
      setCustomerName('');
      setCustomerPhone('');
      setCustomerEmail('');
      navigate({ to: '/' });
    } catch (error) {
      toast.error('Failed to place order');
      console.error(error);
    }
  };

  const handleSubmitReservation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reservationName.trim()) {
      toast.error('Please provide your name');
      return;
    }

    if (!reservationPhone.trim()) {
      toast.error('Please provide your phone number');
      return;
    }

    if (!tableBookingDetails.trim()) {
      toast.error('Please provide reservation details');
      return;
    }

    try {
      await placeOrder.mutateAsync({
        id: `reservation-${Date.now()}`,
        customerPrincipal: 'anonymous',
        items: [],
        deliveryDetails: '',
        tableBookingDetails: tableBookingDetails.trim(),
        timestamp: BigInt(Date.now() * 1_000_000),
        status: 'new',
        contactInfo: {
          address: '',
          phone: reservationPhone.trim(),
          whatsapp: reservationPhone.trim(),
          email: reservationEmail.trim(),
          hours: reservationName.trim(),
          mapUrl: ''
        }
      });

      toast.success('Reservation submitted successfully!');
      setTableBookingDetails('');
      setReservationName('');
      setReservationPhone('');
      setReservationEmail('');
      navigate({ to: '/' });
    } catch (error) {
      toast.error('Failed to submit reservation');
      console.error(error);
    }
  };

  return (
    <>
      <SeoHead
        pageKey="order-reserve"
        defaultTitle="Order & Reserve - Ini-Abasi Restaurant"
        defaultDescription="Place an order for delivery or reserve a table at Ini-Abasi Restaurant."
        seoMeta={seoMeta}
        contactInfo={contactInfo}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Order & Reserve</h1>
            <p className="text-lg text-muted-foreground">
              Place an order for delivery or reserve a table for your visit.
            </p>
          </div>

          <Tabs defaultValue="order" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="order">Order for Delivery</TabsTrigger>
              <TabsTrigger value="reserve">Reserve a Table</TabsTrigger>
            </TabsList>

            {/* Order Tab */}
            <TabsContent value="order">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-serif">Select Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {menuItems.map((item) => (
                          <div key={item.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold">{item.name}</h4>
                              {item.special && <Badge variant="destructive" className="bg-accent">Special</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-primary">₦{item.price.toFixed(2)}</span>
                              <Button size="sm" onClick={() => addToCart(item)}>
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <OrderCart items={cartItems} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} />

                  <Card>
                    <CardHeader>
                      <CardTitle className="font-serif">Your Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmitOrder} className="space-y-4">
                        <div>
                          <Label htmlFor="customerName">Name *</Label>
                          <Input
                            id="customerName"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Your full name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="customerPhone">Phone Number *</Label>
                          <Input
                            id="customerPhone"
                            type="tel"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="+234..."
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="customerEmail">Email (optional)</Label>
                          <Input
                            id="customerEmail"
                            type="email"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            placeholder="your@email.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="delivery">Delivery Address & Instructions *</Label>
                          <Textarea
                            id="delivery"
                            value={deliveryDetails}
                            onChange={(e) => setDeliveryDetails(e.target.value)}
                            placeholder="Full address and any special delivery instructions..."
                            rows={4}
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full" disabled={placeOrder.isPending}>
                          {placeOrder.isPending ? 'Placing Order...' : 'Place Order'}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Reserve Tab */}
            <TabsContent value="reserve">
              <div className="max-w-2xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">Table Reservation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitReservation} className="space-y-4">
                      <div>
                        <Label htmlFor="reservationName">Name *</Label>
                        <Input
                          id="reservationName"
                          value={reservationName}
                          onChange={(e) => setReservationName(e.target.value)}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="reservationPhone">Phone Number *</Label>
                        <Input
                          id="reservationPhone"
                          type="tel"
                          value={reservationPhone}
                          onChange={(e) => setReservationPhone(e.target.value)}
                          placeholder="+234..."
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="reservationEmail">Email (optional)</Label>
                        <Input
                          id="reservationEmail"
                          type="email"
                          value={reservationEmail}
                          onChange={(e) => setReservationEmail(e.target.value)}
                          placeholder="your@email.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="booking">Reservation Details *</Label>
                        <Textarea
                          id="booking"
                          value={tableBookingDetails}
                          onChange={(e) => setTableBookingDetails(e.target.value)}
                          placeholder="Date, time, number of guests, and any special requests..."
                          rows={5}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={placeOrder.isPending}>
                        {placeOrder.isPending ? 'Submitting...' : 'Submit Reservation'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
