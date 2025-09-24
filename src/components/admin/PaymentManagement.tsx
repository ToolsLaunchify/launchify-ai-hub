import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CreditCard, DollarSign, Users, Settings, Plus, Edit } from 'lucide-react';
import { usePaymentConfigs, useToolPurchases, useCreatePaymentConfig, useUpdatePaymentConfig } from '@/hooks/usePaymentConfigs';
import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export const PaymentManagement = () => {
  const { data: paymentConfigs = [], isLoading: loadingConfigs } = usePaymentConfigs();
  const { data: purchases = [], isLoading: loadingPurchases } = useToolPurchases();
  const { data: products = [] } = useProducts();
  const createConfig = useCreatePaymentConfig();
  const updateConfig = useUpdatePaymentConfig();
  const { toast } = useToast();

  const [selectedConfig, setSelectedConfig] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    product_id: '',
    is_payment_enabled: false,
    payment_type: 'one_time',
    price: '',
    currency: 'USD',
    payment_page_url: '',
    razorpay_plan_id: '',
    stripe_price_id: '',
    collect_email: true,
    collect_phone: false,
    collect_company: false,
    terms_url: '',
    refund_policy_url: '',
    trial_period_days: 0,
    setup_fee: 0,
  });

  const totalRevenue = purchases
    .filter(p => p.payment_status === 'completed')
    .reduce((sum, p) => sum + (p.amount_paid || 0), 0);

  const activeSubscriptions = purchases.filter(
    p => p.subscription_status === 'active'
  ).length;

  const handleSaveConfig = async () => {
    try {
      const configData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
        trial_period_days: parseInt(formData.trial_period_days.toString()) || 0,
        setup_fee: parseFloat(formData.setup_fee.toString()) || 0,
      };

      if (selectedConfig) {
        await updateConfig.mutateAsync({
          id: selectedConfig.id,
          config: configData,
        });
        toast({
          title: 'Payment Configuration Updated',
          description: 'The payment settings have been updated successfully.',
        });
      } else {
        await createConfig.mutateAsync(configData);
        toast({
          title: 'Payment Configuration Created',
          description: 'New payment configuration has been created.',
        });
      }

      setIsEditing(false);
      setSelectedConfig(null);
      resetForm();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save payment configuration.',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      product_id: '',
      is_payment_enabled: false,
      payment_type: 'one_time',
      price: '',
      currency: 'USD',
      payment_page_url: '',
      razorpay_plan_id: '',
      stripe_price_id: '',
      collect_email: true,
      collect_phone: false,
      collect_company: false,
      terms_url: '',
      refund_policy_url: '',
      trial_period_days: 0,
      setup_fee: 0,
    });
  };

  const handleEditConfig = (config: any) => {
    setSelectedConfig(config);
    setFormData({
      product_id: config.product_id,
      is_payment_enabled: config.is_payment_enabled,
      payment_type: config.payment_type,
      price: config.price?.toString() || '',
      currency: config.currency,
      payment_page_url: config.payment_page_url || '',
      razorpay_plan_id: config.razorpay_plan_id || '',
      stripe_price_id: config.stripe_price_id || '',
      collect_email: config.collect_email,
      collect_phone: config.collect_phone,
      collect_company: config.collect_company,
      terms_url: config.terms_url || '',
      refund_policy_url: config.refund_policy_url || '',
      trial_period_days: config.trial_period_days || 0,
      setup_fee: config.setup_fee || 0,
    });
    setIsEditing(true);
  };

  // Get products that don't have payment configs yet
  const availableProducts = products.filter(
    p => !paymentConfigs.some(c => c.product_id === p.id) && p.product_type === 'paid_tools'
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payment Management</h2>
          <p className="text-muted-foreground">
            Configure payment settings for your tools and track customer purchases
          </p>
        </div>
        
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setSelectedConfig(null); }}>
              <Plus className="h-4 w-4 mr-2" />
              Configure Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedConfig ? 'Edit Payment Configuration' : 'Create Payment Configuration'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="product">Select Tool</Label>
                  <Select 
                    value={formData.product_id} 
                    onValueChange={(value) => setFormData({ ...formData, product_id: value })}
                    disabled={!!selectedConfig}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a tool" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedConfig && selectedConfig.products && (
                        <SelectItem value={selectedConfig.product_id}>
                          {selectedConfig.products.name}
                        </SelectItem>
                      )}
                      {availableProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="payment-enabled"
                    checked={formData.is_payment_enabled}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_payment_enabled: checked })}
                  />
                  <Label htmlFor="payment-enabled">Enable Payment</Label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="payment-type">Payment Type</Label>
                  <Select 
                    value={formData.payment_type} 
                    onValueChange={(value) => setFormData({ ...formData, payment_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one_time">One Time</SelectItem>
                      <SelectItem value="monthly">Monthly Subscription</SelectItem>
                      <SelectItem value="yearly">Yearly Subscription</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select 
                    value={formData.currency} 
                    onValueChange={(value) => setFormData({ ...formData, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="INR">INR</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="trial-days">Trial Period (Days)</Label>
                  <Input
                    id="trial-days"
                    type="number"
                    value={formData.trial_period_days}
                    onChange={(e) => setFormData({ ...formData, trial_period_days: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="payment-url">Payment Page URL</Label>
                <Input
                  id="payment-url"
                  type="url"
                  value={formData.payment_page_url}
                  onChange={(e) => setFormData({ ...formData, payment_page_url: e.target.value })}
                  placeholder="https://your-payment-page.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="razorpay-plan">Razorpay Plan ID</Label>
                  <Input
                    id="razorpay-plan"
                    value={formData.razorpay_plan_id}
                    onChange={(e) => setFormData({ ...formData, razorpay_plan_id: e.target.value })}
                    placeholder="plan_xxxxxxxxxx"
                  />
                </div>
                <div>
                  <Label htmlFor="stripe-price">Stripe Price ID</Label>
                  <Input
                    id="stripe-price"
                    value={formData.stripe_price_id}
                    onChange={(e) => setFormData({ ...formData, stripe_price_id: e.target.value })}
                    placeholder="price_xxxxxxxxxx"
                  />
                </div>
              </div>

              <div>
                <Label>Customer Information to Collect</Label>
                <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="collect-email"
                      checked={formData.collect_email}
                      onCheckedChange={(checked) => setFormData({ ...formData, collect_email: checked })}
                    />
                    <Label htmlFor="collect-email">Email</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="collect-phone"
                      checked={formData.collect_phone}
                      onCheckedChange={(checked) => setFormData({ ...formData, collect_phone: checked })}
                    />
                    <Label htmlFor="collect-phone">Phone</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="collect-company"
                      checked={formData.collect_company}
                      onCheckedChange={(checked) => setFormData({ ...formData, collect_company: checked })}
                    />
                    <Label htmlFor="collect-company">Company</Label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="terms-url">Terms & Conditions URL</Label>
                  <Input
                    id="terms-url"
                    type="url"
                    value={formData.terms_url}
                    onChange={(e) => setFormData({ ...formData, terms_url: e.target.value })}
                    placeholder="https://your-site.com/terms"
                  />
                </div>
                <div>
                  <Label htmlFor="refund-url">Refund Policy URL</Label>
                  <Input
                    id="refund-url"
                    type="url"
                    value={formData.refund_policy_url}
                    onChange={(e) => setFormData({ ...formData, refund_policy_url: e.target.value })}
                    placeholder="https://your-site.com/refund"
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button onClick={handleSaveConfig} className="flex-1">
                  {selectedConfig ? 'Update Configuration' : 'Create Configuration'}
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From completed purchases
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Configs</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paymentConfigs.length}</div>
            <p className="text-xs text-muted-foreground">
              Tools with payment enabled
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{purchases.length}</div>
            <p className="text-xs text-muted-foreground">
              Purchase records
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="configurations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="configurations">Payment Configurations</TabsTrigger>
          <TabsTrigger value="purchases">Customer Purchases</TabsTrigger>
        </TabsList>

        <TabsContent value="configurations" className="space-y-4">
          {loadingConfigs ? (
            <div>Loading payment configurations...</div>
          ) : paymentConfigs.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  No payment configurations yet. Start by configuring payment for your paid tools.
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {paymentConfigs.map((config) => (
                <Card key={config.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-lg">
                          {config.products?.name || 'Unknown Tool'}
                        </CardTitle>
                        <Badge variant={config.is_payment_enabled ? 'default' : 'secondary'}>
                          {config.is_payment_enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                        <Badge variant="outline">{config.payment_type}</Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditConfig(config)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <strong>Price:</strong> {config.price ? `${config.currency} ${config.price}` : 'Not set'}
                      </div>
                      <div>
                        <strong>Type:</strong> {config.payment_type}
                      </div>
                      <div>
                        <strong>Trial:</strong> {config.trial_period_days || 0} days
                      </div>
                      <div>
                        <strong>Setup Fee:</strong> {config.currency} {config.setup_fee || 0}
                      </div>
                    </div>
                    {config.payment_page_url && (
                      <div className="mt-2">
                        <strong>Payment URL:</strong>{' '}
                        <a href={config.payment_page_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {config.payment_page_url}
                        </a>
                      </div>
                    )}
                    <div className="mt-2">
                      <strong>Collecting:</strong>{' '}
                      {[
                        config.collect_email && 'Email',
                        config.collect_phone && 'Phone',
                        config.collect_company && 'Company',
                      ].filter(Boolean).join(', ') || 'Email only'}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="purchases" className="space-y-4">
          {loadingPurchases ? (
            <div>Loading purchases...</div>
          ) : purchases.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  No purchases yet. Customers will appear here when they make purchases.
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {purchases.map((purchase) => (
                <Card key={purchase.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-lg">{purchase.customer_name}</CardTitle>
                        <Badge variant={
                          purchase.payment_status === 'completed' ? 'default' :
                          purchase.payment_status === 'pending' ? 'secondary' :
                          'destructive'
                        }>
                          {purchase.payment_status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">
                          {purchase.currency} {purchase.amount_paid || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {purchase.payment_date ? new Date(purchase.payment_date).toLocaleDateString() : 'No date'}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <strong>Tool:</strong> {purchase.products?.name || 'Unknown'}
                      </div>
                      <div>
                        <strong>Email:</strong> {purchase.customer_email}
                      </div>
                      <div>
                        <strong>Type:</strong> {purchase.payment_type || 'N/A'}
                      </div>
                      <div>
                        <strong>Gateway:</strong> {purchase.payment_gateway || 'N/A'}
                      </div>
                    </div>
                    {purchase.customer_phone && (
                      <div className="mt-2 text-sm">
                        <strong>Phone:</strong> {purchase.customer_phone}
                      </div>
                    )}
                    {purchase.customer_company && (
                      <div className="mt-2 text-sm">
                        <strong>Company:</strong> {purchase.customer_company}
                      </div>
                    )}
                    {purchase.transaction_id && (
                      <div className="mt-2 text-sm">
                        <strong>Transaction ID:</strong> {purchase.transaction_id}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};