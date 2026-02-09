import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useGetAllOrders, useUpdateOrderStatus } from '../../hooks/useOrders';
import type { Order } from '../../backend';

export default function AdminOrdersPage() {
  const { data: orders = [] } = useGetAllOrders();
  const updateOrderStatus = useUpdateOrderStatus();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter((order) => order.status === filterStatus);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus.mutateAsync({ id: orderId, status: newStatus });
      toast.success('Order status updated');
    } catch (error) {
      toast.error('Failed to update order status');
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'default';
      case 'confirmed': return 'secondary';
      case 'completed': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  const isAnonymousOrder = (order: Order) => {
    return order.customerPrincipal === 'anonymous' || order.customerPrincipal === '2vxsx-fae';
  };

  const getCustomerName = (order: Order) => {
    // Customer name is stored in contactInfo.hours field
    return order.contactInfo?.hours || 'N/A';
  };

  const getCustomerPhone = (order: Order) => {
    return order.contactInfo?.phone || 'N/A';
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-serif">Orders & Reservations</CardTitle>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">{order.id.slice(0, 12)}...</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {order.items.length > 0 ? 'Order' : 'Reservation'}
                      {isAnonymousOrder(order) && (
                        <Badge variant="outline" className="text-xs">Public</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{getCustomerName(order)}</div>
                      <div className="text-muted-foreground text-xs">{getCustomerPhone(order)}</div>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(Number(order.timestamp) / 1_000_000).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-serif">Order Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold mb-1">Order ID</p>
                <p className="text-sm text-muted-foreground font-mono">{selectedOrder.id}</p>
              </div>
              
              <div>
                <p className="text-sm font-semibold mb-1">Customer Information</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{getCustomerName(selectedOrder)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-medium">{getCustomerPhone(selectedOrder)}</span>
                  </div>
                  {selectedOrder.contactInfo?.email && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{selectedOrder.contactInfo.email}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span>
                      {isAnonymousOrder(selectedOrder) ? (
                        <Badge variant="outline" className="text-xs">Public Order</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Authenticated</Badge>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold mb-1">Status</p>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(value) => handleStatusChange(selectedOrder.id, value)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {selectedOrder.items.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2">Items</p>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span>₦{item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedOrder.deliveryDetails && (
                <div>
                  <p className="text-sm font-semibold mb-1">Delivery Details</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{selectedOrder.deliveryDetails}</p>
                </div>
              )}
              
              {selectedOrder.tableBookingDetails && (
                <div>
                  <p className="text-sm font-semibold mb-1">Reservation Details</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{selectedOrder.tableBookingDetails}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
