'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetAdminsQuery, useCreateAdminMutation } from '@/lib/store';
import { UserPlus, Shield, Settings, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

// Type definitions
type AdminRole = 'super_admin' | 'admin' | 'moderator';
type AdminStatus = 'active' | 'inactive';

interface Admin {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  createdDate: string;
  status: AdminStatus;
  lastLogin: string;
  avatar: string;
}

interface FormData {
  name: string;
  email: string;
  role: string;
  password: string;
}

interface Column {
  key: string;
  header: string;
  className: string;
  render?: (value: any, admin: Admin) => React.ReactNode;
}

interface RoleColors {
  [key: string]: string;
}

interface StatusColors {
  [key: string]: string;
}

// Mock admin data
const mockAdmins: Admin[] = [
  {
    id: 'A001',
    name: 'John Smith',
    email: 'john.smith@admin.com',
    role: 'super_admin',
    createdDate: '2023-01-15',
    status: 'active',
    lastLogin: '2024-01-18T10:30:00',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 'A002',
    name: 'Jane Doe',
    email: 'jane.doe@admin.com',
    role: 'admin',
    createdDate: '2023-06-20',
    status: 'active',
    lastLogin: '2024-01-17T14:15:00',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 'A003',
    name: 'Mike Johnson',
    email: 'mike.johnson@admin.com',
    role: 'moderator',
    createdDate: '2023-11-10',
    status: 'inactive',
    lastLogin: '2024-01-10T09:45:00',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?w=100&h=100&fit=crop&crop=face'
  }
];

const roleColors: RoleColors = {
  super_admin: 'bg-purple-100 text-purple-800',
  admin: 'bg-blue-100 text-blue-800',
  moderator: 'bg-green-100 text-green-800'
};

const statusColors: StatusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800'
};

export default function CreateAdminPage() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    role: '',
    password: ''
  });
  const [error, setError] = useState<string>('');
  
  // const { data: admins, isLoading } = useGetAdminsQuery();
  const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();

  const columns: Column[] = [
    {
      key: 'admin',
      header: 'Admin',
      className: '',
      render: (value: any, admin: Admin) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={admin.avatar} alt={admin.name} />
            <AvatarFallback>
              {admin.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-gray-900">{admin.name}</p>
            <p className="text-sm text-gray-500">{admin.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      header: 'Role',
      className: '',
      render: (value: AdminRole) => (
        <div className="flex items-center space-x-2">
          {value === 'super_admin' && <Shield className="h-4 w-4 text-purple-500" />}
          {value === 'admin' && <Settings className="h-4 w-4 text-blue-500" />}
          {value === 'moderator' && <Eye className="h-4 w-4 text-green-500" />}
          <Badge className={roleColors[value] || 'bg-gray-100 text-gray-800'}>
            {value.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
      )
    },
    {
      key: 'createdDate',
      header: 'Created Date',
      className: '',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'lastLogin',
      header: 'Last Login',
      className: '',
      render: (value: string) => value ? new Date(value).toLocaleDateString() : 'Never'
    },
    {
      key: 'status',
      header: 'Status',
      className: '',
      render: (value: AdminStatus) => (
        <Badge className={statusColors[value] || 'bg-gray-100 text-gray-800'}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      )
    }
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.role || !formData.password) {
      setError('All fields are required');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      await createAdmin(formData).unwrap();
      toast.success('Admin created successfully!');
      setIsDialogOpen(false);
      setFormData({ name: '', email: '', role: '', password: '' });
    } catch (err: any) {
      setError(err.data?.message || 'Failed to create admin');
      toast.error('Failed to create admin');
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
            <p className="text-gray-600">Manage administrator accounts and permissions</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#CD671C] hover:bg-[#B85A18] text-white">
                <UserPlus className="mr-2 h-4 w-4" />
                Add New Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              {/* <DialogHeader>
                <DialogTitle>Create New Administrator</DialogTitle>
                <DialogDescription>
                  Add a new admin user to the system with specific role permissions.
                </DialogDescription>
              </DialogHeader> */}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      {/* <SelectItem value="moderator">Moderator</SelectItem> */}
                      {/* <SelectItem value="super_admin">Super Admin</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password (min 8 characters)"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#CD671C] hover:bg-[#B85A18] text-white"
                    disabled={isCreating}
                  >
                    {isCreating ? 'Creating...' : 'Create Admin'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Admin Stats */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {mockAdmins.length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {mockAdmins.filter(a => a.status === 'active').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Super Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {mockAdmins.filter(a => a.role === 'super_admin').length}
              </div>
            </CardContent>
          </Card>
        </div> */}

        <Card>
          <CardHeader>
            <CardTitle>All Administrators</CardTitle>
            <CardDescription>
              Manage all administrator accounts and their permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={mockAdmins}
              searchKey="name"
              itemsPerPage={10}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}