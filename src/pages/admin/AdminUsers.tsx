import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  user_id: string;
  email: string;
  display_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      console.log('🔍 [AdminUsers] Loading users from profiles table...');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ [AdminUsers] Error loading users:', error);
        toast({
          title: "Error",
          description: "Failed to load users: " + error.message,
          variant: "destructive"
        });
        return;
      }

      console.log('📊 [AdminUsers] Loaded users:', data);
      setUsers(data || []);
    } catch (error) {
      console.error('❌ [AdminUsers] Exception loading users:', error);
      toast({
        title: "Error", 
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-lg">Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>User Management</span>
            <Badge variant="outline">{users.length} Total Users</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No users found. Profile creation might be broken!
              </p>
              <p className="text-sm text-muted-foreground">
                Check if the <code>handle_new_user()</code> trigger is working properly.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Display Name</th>
                    <th className="text-left p-2">Phone</th>
                    <th className="text-left p-2">Created At</th>
                    <th className="text-left p-2">User ID</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-medium">{user.email}</td>
                      <td className="p-2">{user.display_name || '-'}</td>
                      <td className="p-2">{user.phone || '-'}</td>
                      <td className="p-2 text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-2 font-mono text-xs text-muted-foreground">
                        {user.user_id.slice(0, 8)}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}