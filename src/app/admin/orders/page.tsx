import OrdersManagementClient from '@/app/admin/orders/OrdersManagementClient';

export const metadata = {
  title: 'Order Management | Admin Panel',
  description: 'Manage and track customer orders.',
};

export default function OrdersPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Order Management</h1>
        <p className="text-sm text-gray-500">
          View and manage all customer orders, update delivery status, and provide tracking details.
        </p>
      </div>
      
      <OrdersManagementClient />
    </div>
  );
}
