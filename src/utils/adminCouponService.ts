import { supabase } from '@/integrations/supabase/client';

interface CreateCouponData {
  code: string;
  discount_type: 'percent' | 'amount';
  discount_value: number;
  allowed_plans: string[];
  expire_at?: string;
  usage_limit?: number;
  assigned_user_email?: string;
  notes?: string;
  is_active: boolean;
  created_by?: string;
}

interface UpdateCouponData extends CreateCouponData {
  id: string;
}

export const adminCouponService = {
  async createCoupon(couponData: CreateCouponData) {
    try {
      console.log('Creating coupon with admin service:', couponData);

      // Validate required fields
      if (!couponData.code || !couponData.discount_type || !couponData.discount_value) {
        throw new Error('נתונים חסרים ליצירת קופון');
      }

      // Validate discount value
      if (couponData.discount_value <= 0) {
        throw new Error('ערך ההנחה חייב להיות גדול מאפס');
      }

      if (couponData.discount_type === 'percent' && couponData.discount_value > 100) {
        throw new Error('אחוז הנחה לא יכול להיות גדול מ-100%');
      }

      // Check if coupon code already exists
      const { data: existingCoupon } = await supabase
        .from('coupons')
        .select('id')
        .eq('code', couponData.code.toUpperCase())
        .single();

      if (existingCoupon) {
        throw new Error('קוד קופון זה כבר קיים במערכת');
      }

      // Create coupon
      const newCoupon = {
        ...couponData,
        code: couponData.code.toUpperCase(),
        used_count: 0
      };

      const { data, error } = await supabase
        .from('coupons')
        .insert(newCoupon)
        .select()
        .single();

      if (error) {
        console.error('Database error creating coupon:', error);
        
        // Enhanced error handling for RLS policy violations
        if (error.message?.includes('row-level security policy') || error.code === '42501') {
          throw new Error('אין לך הרשאות ליצור קופונים. רק מנהלי המערכת יכולים ליצור קופונים.');
        }
        
        // Check for specific error types
        if (error.message?.includes('duplicate key')) {
          throw new Error('קוד קופון זה כבר קיים במערכת');
        }
        
        if (error.message?.includes('violates check constraint')) {
          throw new Error('הנתונים שהוזנו אינם תקינים');
        }
        
        throw new Error(`שגיאה ביצירת קופון: ${error.message}`);
      }

      console.log('Coupon created successfully:', data);
      return { success: true, coupon: data };

    } catch (error) {
      console.error('Error in createCoupon:', error);
      const message = error instanceof Error ? error.message : 'שגיאה לא ידועה';
      return { success: false, error: message };
    }
  },

  async updateCoupon(couponData: UpdateCouponData) {
    try {
      console.log('Updating coupon with admin service:', couponData);

      // Validate required fields
      if (!couponData.id || !couponData.code || !couponData.discount_type || !couponData.discount_value) {
        throw new Error('נתונים חסרים לעדכון קופון');
      }

      // Validate discount value
      if (couponData.discount_value <= 0) {
        throw new Error('ערך ההנחה חייב להיות גדול מאפס');
      }

      if (couponData.discount_type === 'percent' && couponData.discount_value > 100) {
        throw new Error('אחוז הנחה לא יכול להיות גדול מ-100%');
      }

      // Check if coupon exists
      const { data: existingCoupon, error: fetchError } = await supabase
        .from('coupons')
        .select('*')
        .eq('id', couponData.id)
        .single();

      if (fetchError || !existingCoupon) {
        throw new Error('קופון לא נמצא');
      }

      // Check if code is being changed and if the new code already exists
      if (couponData.code.toUpperCase() !== existingCoupon.code) {
        const { data: duplicateCoupon } = await supabase
          .from('coupons')
          .select('id')
          .eq('code', couponData.code.toUpperCase())
          .neq('id', couponData.id)
          .single();

        if (duplicateCoupon) {
          throw new Error('קוד קופון זה כבר קיים במערכת');
        }
      }

      // Update coupon
      const { id, created_by, ...updateData } = couponData;
      const finalUpdateData = {
        ...updateData,
        code: couponData.code.toUpperCase()
      };

      const { data, error } = await supabase
        .from('coupons')
        .update(finalUpdateData)
        .eq('id', couponData.id)
        .select()
        .single();

      if (error) {
        console.error('Database error updating coupon:', error);
        
        // Enhanced error handling for RLS policy violations
        if (error.message?.includes('row-level security policy') || error.code === '42501') {
          throw new Error('אין לך הרשאות לעדכן קופונים. רק מנהלי המערכת יכולים לעדכן קופונים.');
        }
        
        // Check for specific error types
        if (error.message?.includes('duplicate key')) {
          throw new Error('קוד קופון זה כבר קיים במערכת');
        }
        
        if (error.message?.includes('violates check constraint')) {
          throw new Error('הנתונים שהוזנו אינם תקינים');
        }
        
        throw new Error(`שגיאה בעדכון קופון: ${error.message}`);
      }

      console.log('Coupon updated successfully:', data);
      return { success: true, coupon: data };

    } catch (error) {
      console.error('Error in updateCoupon:', error);
      const message = error instanceof Error ? error.message : 'שגיאה לא ידועה';
      return { success: false, error: message };
    }
  },

  async deleteCoupon(couponId: string) {
    try {
      console.log('Deleting coupon with admin service:', couponId);

      if (!couponId) {
        throw new Error('נדרש מזהה קופון למחיקה');
      }

      // Check if coupon exists
      const { data: existingCoupon, error: fetchError } = await supabase
        .from('coupons')
        .select('id, code, used_count')
        .eq('id', couponId)
        .single();

      if (fetchError || !existingCoupon) {
        throw new Error('קופון לא נמצא');
      }

      // Delete coupon
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', couponId);

      if (error) {
        console.error('Database error deleting coupon:', error);
        
        // Enhanced error handling for RLS policy violations
        if (error.message?.includes('row-level security policy') || error.code === '42501') {
          throw new Error('אין לך הרשאות למחוק קופונים. רק מנהלי המערכת יכולים למחוק קופונים.');
        }
        
        throw new Error(`שגיאה במחיקת קופון: ${error.message}`);
      }

      console.log('Coupon deleted successfully:', couponId);
      return { success: true };

    } catch (error) {
      console.error('Error in deleteCoupon:', error);
      const message = error instanceof Error ? error.message : 'שגיאה לא ידועה';
      return { success: false, error: message };
    }
  }
};