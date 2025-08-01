import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Download, Search, Calendar, Mail, Users } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";

interface CouponUsageData {
  id: string;
  coupon_code: string;
  user_id: string;
  user_email: string | null;
  display_name: string | null;
  used_at: string;
  plan_type: string;
  original_amount: number;
  discount_amount: number;
  final_amount: number;
}

export const CouponUsageManagement = () => {
  const [usageData, setUsageData] = useState<CouponUsageData[]>([]);
  const [filteredData, setFilteredData] = useState<CouponUsageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalUsage: 0,
    totalRevenueLost: 0,
    uniqueUsers: 0,
    mostUsedCoupon: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    loadCouponUsage();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchTerm, usageData]);

  const loadCouponUsage = async () => {
    try {
      const { data, error } = await supabase
        .from('coupon_usage')
        .select(`
          id,
          coupon_id,
          user_id,
          used_at,
          plan_type,
          original_amount,
          discount_amount,
          final_amount,
          coupons!inner(code)
        `)
        .order('used_at', { ascending: false });

      if (error) throw error;

      // Get user emails separately due to RLS restrictions
      const userIds = [...new Set((data || []).map(item => item.user_id))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, email, display_name')
        .in('user_id', userIds);

      const profilesMap = new Map(
        (profilesData || []).map(profile => [profile.user_id, profile])
      );

      const formattedData: CouponUsageData[] = (data || []).map(item => {
        const profile = profilesMap.get(item.user_id);
        return {
          id: item.id,
          coupon_code: item.coupons?.code || 'Unknown',
          user_id: item.user_id,
          user_email: profile?.email || null,
          display_name: profile?.display_name || null,
          used_at: item.used_at,
          plan_type: item.plan_type,
          original_amount: item.original_amount,
          discount_amount: item.discount_amount,
          final_amount: item.final_amount
        };
      });

      setUsageData(formattedData);
      calculateStats(formattedData);
    } catch (error) {
      console.error('Error loading coupon usage:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בטעינת נתוני שימוש בקופונים",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: CouponUsageData[]) => {
    const totalUsage = data.length;
    const totalRevenueLost = data.reduce((sum, item) => sum + item.discount_amount, 0);
    const uniqueUsers = new Set(data.map(item => item.user_id)).size;
    
    const couponCounts = data.reduce((acc, item) => {
      acc[item.coupon_code] = (acc[item.coupon_code] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostUsedCoupon = Object.keys(couponCounts).reduce((a, b) => 
      couponCounts[a] > couponCounts[b] ? a : b, ''
    );

    setStats({
      totalUsage,
      totalRevenueLost,
      uniqueUsers,
      mostUsedCoupon
    });
  };

  const filterData = () => {
    if (!searchTerm) {
      setFilteredData(usageData);
      return;
    }

    const filtered = usageData.filter(item =>
      item.coupon_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.plan_type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredData(filtered);
  };

  const exportToCSV = () => {
    const headers = [
      'קוד קופון',
      'מייל משתמש',
      'שם משתמש',
      'תאריך שימוש',
      'סוג תכנית',
      'סכום מקורי',
      'הנחה',
      'סכום סופי'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredData.map(item => [
        item.coupon_code,
        item.user_email || 'לא זמין',
        item.display_name || 'לא זמין',
        format(new Date(item.used_at), 'dd/MM/yyyy HH:mm'),
        item.plan_type,
        item.original_amount,
        item.discount_amount,
        item.final_amount
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `coupon_usage_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "הצלחה",
      description: "הקובץ יוצא בהצלחה"
    });
  };

  const getPlanTypeLabel = (planType: string) => {
    const labels = {
      daily: 'יומי',
      weekly: 'שבועי',
      monthly: 'חודשי',
      quarterly: 'רבעוני'
    };
    return labels[planType as keyof typeof labels] || planType;
  };

  if (loading) {
    return <div className="p-6">טוען נתוני שימוש...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">שימוש בקופונים</h1>
        <Button onClick={exportToCSV} className="gap-2">
          <Download className="h-4 w-4" />
          ייצוא לCSV
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">סה״כ שימושים</p>
                <p className="text-2xl font-bold">{stats.totalUsage}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">משתמשים ייחודיים</p>
                <p className="text-2xl font-bold">{stats.uniqueUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">סה״כ הנחות ניתנו</p>
                <p className="text-2xl font-bold">{stats.totalRevenueLost} ₪</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">קופון פופולרי</p>
              <p className="text-lg font-bold">{stats.mostUsedCoupon}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>חיפוס וסינון</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="חפש לפי קופון, מייל, שם או סוג תכנית..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>היסטוריית שימוש</CardTitle>
          <CardDescription>
            מציג {filteredData.length} מתוך {usageData.length} שימושים
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                לא נמצאו נתונים עבור החיפוש
              </div>
            ) : (
              filteredData.map((usage) => (
                <div
                  key={usage.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="font-mono">
                          {usage.coupon_code}
                        </Badge>
                        <Badge variant="secondary">
                          {getPlanTypeLabel(usage.plan_type)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">משתמש:</span>
                          <br />
                          <span className="text-muted-foreground">
                            {usage.display_name || 'לא זמין'}
                          </span>
                          <br />
                          <span className="text-muted-foreground">
                            {usage.user_email || 'מייל לא זמין'}
                          </span>
                        </div>
                        
                        <div>
                          <span className="font-medium">פרטי תשלום:</span>
                          <br />
                          <span className="text-muted-foreground">
                            מקורי: {usage.original_amount} ₪
                          </span>
                          <br />
                          <span className="text-muted-foreground">
                            הנחה: {usage.discount_amount} ₪
                          </span>
                          <br />
                          <span className="text-muted-foreground">
                            סופי: {usage.final_amount} ₪
                          </span>
                        </div>
                        
                        <div>
                          <span className="font-medium">תאריך שימוש:</span>
                          <br />
                          <span className="text-muted-foreground">
                            {format(new Date(usage.used_at), 'dd/MM/yyyy', { locale: he })}
                          </span>
                          <br />
                          <span className="text-muted-foreground">
                            {format(new Date(usage.used_at), 'HH:mm', { locale: he })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CouponUsageManagement;