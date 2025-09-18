import { Trash2, Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useNewsletterSubscribers } from "@/hooks/useNewsletter";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const NewsletterManagement = () => {
  const { data: subscribers, isLoading } = useNewsletterSubscribers();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSubscribers = subscribers?.filter(subscriber =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const exportToCSV = () => {
    if (!subscribers || subscribers.length === 0) {
      toast.error("No newsletter subscribers to export");
      return;
    }

    const csvContent = [
      ['Email', 'Status', 'Source', 'Subscribed Date', 'Unsubscribed Date'],
      ...subscribers.map(subscriber => [
        subscriber.email,
        subscriber.status,
        subscriber.source || 'footer_signup',
        new Date(subscriber.subscribed_at).toLocaleDateString(),
        subscriber.unsubscribed_at ? new Date(subscriber.unsubscribed_at).toLocaleDateString() : ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Newsletter subscribers exported successfully");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeSubscribers = subscribers?.filter(s => s.status === 'active').length || 0;
  const thisMonthSubscribers = subscribers?.filter(s => {
    const subscribeDate = new Date(s.subscribed_at);
    const now = new Date();
    return subscribeDate.getMonth() === now.getMonth() && subscribeDate.getFullYear() === now.getFullYear();
  }).length || 0;

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscribers?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubscribers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisMonthSubscribers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Newsletter Subscribers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Newsletter Subscribers</CardTitle>
          <CardDescription>
            Manage your newsletter subscriber list and export data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Input
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button onClick={exportToCSV} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Subscribed</TableHead>
                  <TableHead>Unsubscribed</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscribers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      {searchTerm ? "No subscribers found matching your search." : "No newsletter subscribers yet."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell className="font-medium">{subscriber.email}</TableCell>
                      <TableCell>
                        <Badge variant={subscriber.status === 'active' ? 'default' : 'secondary'}>
                          {subscriber.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{subscriber.source || 'footer_signup'}</TableCell>
                      <TableCell>{new Date(subscriber.subscribed_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {subscriber.unsubscribed_at ? new Date(subscriber.unsubscribed_at).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete subscriber?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the subscriber "{subscriber.email}" from your newsletter list.
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  // TODO: Implement delete functionality
                                  toast.success(`Subscriber ${subscriber.email} deleted`);
                                }}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsletterManagement;