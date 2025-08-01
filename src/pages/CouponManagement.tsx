import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { adminCouponService } from "@/utils/adminCouponService";
import { Plus, Edit, Trash2, Copy, Users, Calendar, Percent, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";

interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  allowed_plans: string[];
  expire_at: string | null;
  usage_limit: number | null;
  used_count: number;
  is_active: boolean;
  assigned_user_id: string | null;
  assigned_user_email: string | null;
  created_at: string;
  notes: string | null;
}

interface CouponUsage {
  id: string;
  user_id: string;
  used_at: string;
  plan_type: string;
  original_amount: number;
  discount_amount: number;
  final_amount: number;
  profiles?: {
    email: string;
    display_name: string | null;
  } | null;
}

export const CouponManagement = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [usageData, setUsageData] = useState<CouponUsage[]>([]);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percent' as string,
    discount_value: 0,
    allowed_plans: ['daily', 'weekly', 'monthly', 'quarterly'],
    expire_at: '',
    usage_limit: '',
    assigned_user_email: '',
    notes: '',
    is_active: true
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  useEffect(() => {
    if (selectedCoupon) {
      loadUsageData(selectedCoupon.id);
    }
  }, [selectedCoupon]);

  const loadCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoupons(data || []);
    } catch (error) {
      console.error('Error loading coupons:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בטעינת קופונים",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUsageData = async (couponId: string) => {
    try {
      const { data, error } = await supabase
        .from('coupon_usage')
        .select('*')
        .eq('coupon_id', couponId)
        .order('used_at', { ascending: false });

      if (error) throw error;
      setUsageData(data || []);
    } catch (error) {
      console.error('Error loading usage data:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בטעינת נתוני שימוש",
        variant: "destructive"
      });
    }
  };

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code: result });
  };

  const handleSubmit = async () => {
    try {
      const couponData = {
        ...formData,
        discount_value: Number(formData.discount_value),
        usage_limit: formData.usage_limit ? Number(formData.usage_limit) : null,
        expire_at: formData.expire_at ? new Date(formData.expire_at).toISOString() : null,
        assigned_user_email: formData.assigned_user_email || null
      };

      console.log('Attempting to save coupon:', couponData);

      if (isCreateMode) {
        // Use the admin coupon service to bypass RLS issues
        const result = await adminCouponService.createCoupon({
          ...couponData,
          discount_type: couponData.discount_type as 'percent' | 'amount',
          created_by: currentUser?.id
        });

        if (!result.success) {
          console.error('Coupon creation failed:', result.error);
          throw new Error(result.error || 'שגיאה ביצירת קופון');
        }
        
        console.log('Coupon created successfully:', result.coupon);
        
        toast({
          title: "הצלחה",
          description: "קופון נוצר בהצלחה"
        });
      } else if (selectedCoupon) {
        // Use the admin coupon service to ensure consistent permissions
        const result = await adminCouponService.updateCoupon({
          id: selectedCoupon.id,
          ...couponData,
          discount_type: couponData.discount_type as 'percent' | 'amount'
        });

        if (!result.success) {
          console.error('Coupon update failed:', result.error);
          throw new Error(result.error || 'שגיאה בעדכון קופון');
        }
        
        console.log('Coupon updated successfully:', result.coupon);
        
        toast({
          title: "הצלחה",
          description: "קופון עודכן בהצלחה"
        });
      }

      resetForm();
      loadCoupons();
    } catch (error) {
      console.error('Error saving coupon:', error);
      const errorMessage = error instanceof Error ? error.message : 'שגיאה לא ידועה';
      toast({
        title: "שגיאה",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discount_type: 'percent',
      discount_value: 0,
      allowed_plans: ['daily', 'weekly', 'monthly', 'quarterly'],
      expire_at: '',
      usage_limit: '',
      assigned_user_email: '',
      notes: '',
      is_active: true
    });
    setIsCreateMode(false);
    setSelectedCoupon(null);
  };

  const editCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setFormData({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      allowed_plans: coupon.allowed_plans,
      expire_at: coupon.expire_at ? format(new Date(coupon.expire_at), 'yyyy-MM-dd') : '',
      usage_limit: coupon.usage_limit?.toString() || '',
      assigned_user_email: coupon.assigned_user_email || '',
      notes: coupon.notes || '',
      is_active: coupon.is_active
    });
    setIsCreateMode(false);
  };

  const deleteCoupon = async (couponId: string) => {
    try {
      // Use the admin coupon service to ensure consistent permissions
      const result = await adminCouponService.deleteCoupon(couponId);

      if (!result.success) {
        console.error('Coupon deletion failed:', result.error);
        throw new Error(result.error || 'שגיאה במחיקת קופון');
      }
      
      toast({
        title: "הצלחה",
        description: "קופון נמחק בהצלחה"
      });
      
      loadCoupons();
      if (selectedCoupon?.id === couponId) {
        resetForm();
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      const errorMessage = error instanceof Error ? error.message : 'שגיאה לא ידועה';
      toast({
        title: "שגיאה",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "הועתק",
      description: "קוד הקופון הועתק ללוח"
    });
  };

  if (loading) {
    return <div className="p-6">טוען...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">ניהול קופונים</h1>
        <div className="flex gap-2">
          <Button onClick={() => { resetForm(); setIsCreateMode(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            קופון חדש
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.open('/admin/coupons/usage', '_blank')}
          >
            צפה בשימושים
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coupons List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>קופונים קיימים</CardTitle>
              <CardDescription>רשימת כל הקופונים במערכת</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {coupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedCoupon?.id === coupon.id ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedCoupon(coupon)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                            {coupon.code}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(coupon.code);
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          {!coupon.is_active && (
                            <Badge variant="secondary">לא פעיל</Badge>
                          )}
                          {coupon.assigned_user_email && (
                            <Badge variant="outline">אישי</Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            {coupon.discount_type === 'percent' ? (
                              <Percent className="h-3 w-3" />
                            ) : (
                              <DollarSign className="h-3 w-3" />
                            )}
                            {coupon.discount_value}{coupon.discount_type === 'percent' ? '%' : ' ₪'}
                          </span>
                          
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {coupon.used_count}
                            {coupon.usage_limit && `/${coupon.usage_limit}`}
                          </span>
                          
                          {coupon.expire_at && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(coupon.expire_at), 'dd/MM/yyyy', { locale: he })}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            editCoupon(coupon);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCoupon(coupon.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form & Usage Details */}
        <div className="space-y-6">
          {/* Create/Edit Form */}
          {(isCreateMode || selectedCoupon) && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {isCreateMode ? 'יצירת קופון חדש' : 'עריכת קופון'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="code">קוד קופון</Label>
                  <div className="flex gap-2">
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="הזן קוד"
                    />
                    <Button variant="outline" onClick={generateCouponCode}>
                      יצירה
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="discount_type">סוג הנחה</Label>
                  <Select
                    value={formData.discount_type}
                    onValueChange={(value: 'percent' | 'amount') => 
                      setFormData({ ...formData, discount_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percent">אחוז</SelectItem>
                      <SelectItem value="amount">סכום קבוע</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="discount_value">
                    ערך הנחה {formData.discount_type === 'percent' ? '(%)' : '(₪)'}
                  </Label>
                  <Input
                    id="discount_value"
                    type="number"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <Label htmlFor="expire_at">תאריך תפוגה</Label>
                  <Input
                    id="expire_at"
                    type="date"
                    value={formData.expire_at}
                    onChange={(e) => setFormData({ ...formData, expire_at: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="usage_limit">מגבלת שימוש</Label>
                  <Input
                    id="usage_limit"
                    type="number"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                    placeholder="ללא מגבלה"
                  />
                </div>

                <div>
                  <Label htmlFor="assigned_user_email">קופון אישי (אימייל)</Label>
                  <Input
                    id="assigned_user_email"
                    type="email"
                    value={formData.assigned_user_email}
                    onChange={(e) => setFormData({ ...formData, assigned_user_email: e.target.value })}
                    placeholder="השאר ריק לקופון כללי"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">הערות</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="הערות אדמין"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">קופון פעיל</Label>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSubmit} className="flex-1">
                    {isCreateMode ? 'צור קופון' : 'עדכן קופון'}
                  </Button>
                  <Button variant="outline" onClick={resetForm}>
                    בטל
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Usage Statistics */}
          {selectedCoupon && usageData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>היסטוריית שימוש</CardTitle>
                <CardDescription>
                  שימושים בקופון {selectedCoupon.code}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {usageData.map((usage) => (
                    <div key={usage.id} className="p-3 border rounded-lg text-sm">
                      <div className="font-medium">
                        {usage.profiles?.display_name || usage.profiles?.email}
                      </div>
                      <div className="text-gray-600">
                        {usage.plan_type} • {usage.original_amount} ₪ → {usage.final_amount} ₪
                      </div>
                      <div className="text-gray-500 text-xs">
                        {format(new Date(usage.used_at), 'dd/MM/yyyy HH:mm', { locale: he })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponManagement;