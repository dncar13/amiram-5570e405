import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Receipt, Download, Calendar, CreditCard, CheckCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { he } from "date-fns/locale";

interface Transaction {
  id: string;
  transaction_id: string;
  amount: number;
  original_amount: number | null;
  discount_amount: number | null;
  currency: string;
  payment_method: string;
  status: string;
  coupon_code: string | null;
  transaction_date: string;
  subscription_id: string | null;
  card_last_four: string | null;
  auth_number: string | null;
  voucher_number: string | null;
  subscription?: {
    plan_type: string;
    start_date: string;
    end_date: string;
    status: string;
  };
}

const PurchaseHistoryTab = () => {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('payment_transactions')
          .select(`
            *,
            subscription:subscriptions(
              plan_type,
              start_date,
              end_date,
              status
            )
          `)
          .eq('user_id', currentUser.id)
          .order('transaction_date', { ascending: false });

        if (error) throw error;
        setTransactions(data || []);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('שגיאה בטעינת היסטוריית הרכישות');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentUser]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: 'הושלם', variant: 'success' as const, icon: CheckCircle },
      pending: { label: 'בהמתנה', variant: 'warning' as const, icon: Clock },
      failed: { label: 'נכשל', variant: 'destructive' as const, icon: AlertCircle },
      cancelled: { label: 'בוטל', variant: 'secondary' as const, icon: AlertCircle },
      refunded: { label: 'הוחזר', variant: 'outline' as const, icon: AlertCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getPlanDisplayName = (planType: string): string => {
    const displayNames: Record<string, string> = {
      'daily': 'יום אחד',
      'weekly': 'שבוע אחד',
      'monthly': 'חודש אחד',
      'quarterly': '3 חודשים'
    };
    return displayNames[planType] || planType;
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: he });
  };

  const downloadReceipt = (transactionId: string) => {
    // This would generate and download a receipt
    console.log('Downloading receipt for transaction:', transactionId);
    // Implementation would depend on your receipt generation system
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            היסטוריית רכישות
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">טוען היסטוריית רכישות...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            היסטוריית רכישות
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
            >
              נסה שוב
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            היסטוריית רכישות
          </CardTitle>
          <CardDescription>
            כל הרכישות שלך יופיעו כאן
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">עדיין לא ביצעת רכישות</p>
            <Button 
              onClick={() => window.location.href = '/premium'} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              לדף הפרימיום
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          היסטוריית רכישות
        </CardTitle>
        <CardDescription>
          סה"כ {transactions.length} רכישות
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <Card key={transaction.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">
                        {transaction.subscription 
                          ? `גישה פרימיום - ${getPlanDisplayName(transaction.subscription.plan_type)}`
                          : 'רכישה'
                        }
                      </h3>
                      {getStatusBadge(transaction.status)}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(transaction.transaction_date)}
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-bold text-green-600">
                      {transaction.amount} ₪
                    </p>
                    {transaction.original_amount && transaction.discount_amount && (
                      <div className="text-sm text-gray-500">
                        <span className="line-through">{transaction.original_amount} ₪</span>
                        <span className="text-green-600 mr-2">
                          (-{transaction.discount_amount} ₪)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {/* Payment Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">אמצעי תשלום:</span>
                      <span className="capitalize">{transaction.payment_method}</span>
                    </div>
                    {transaction.card_last_four && (
                      <div className="flex items-center gap-2 mr-6">
                        <span className="text-gray-600">כרטיס:</span>
                        <span>****{transaction.card_last_four}</span>
                      </div>
                    )}
                    {transaction.coupon_code && (
                      <div className="flex items-center gap-2 mr-6">
                        <span className="text-gray-600">קופון:</span>
                        <Badge variant="outline">{transaction.coupon_code}</Badge>
                      </div>
                    )}
                  </div>

                  {/* Transaction Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">מספר עסקה:</span>
                      <span className="font-mono text-xs">{transaction.transaction_id}</span>
                    </div>
                    {transaction.auth_number && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">מספר אישור:</span>
                        <span className="font-mono text-xs">{transaction.auth_number}</span>
                      </div>
                    )}
                    {transaction.voucher_number && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">מספר קבלה:</span>
                        <span className="font-mono text-xs">{transaction.voucher_number}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subscription Details */}
                {transaction.subscription && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">תאריך התחלה:</span>
                        <div className="font-medium">
                          {format(new Date(transaction.subscription.start_date), 'dd/MM/yyyy', { locale: he })}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">תאריך סיום:</span>
                        <div className="font-medium">
                          {format(new Date(transaction.subscription.end_date), 'dd/MM/yyyy', { locale: he })}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">סטטוס מנוי:</span>
                        <div className="font-medium capitalize">
                          {transaction.subscription.status === 'active' ? 'פעיל' : 
                           transaction.subscription.status === 'expired' ? 'פג תוקף' : 
                           transaction.subscription.status === 'cancelled' ? 'בוטל' : 
                           transaction.subscription.status}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadReceipt(transaction.transaction_id)}
                    className="flex items-center gap-1"
                  >
                    <Download className="h-4 w-4" />
                    הורד קבלה
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PurchaseHistoryTab;