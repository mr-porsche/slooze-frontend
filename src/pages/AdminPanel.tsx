import { Users, Settings, Shield } from 'lucide-react';

export default function AdminPanel() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='mb-8'>
          <div className='flex items-center gap-3 mb-2'>
            <Shield className='w-8 h-8 text-blue-600' />
            <h1 className='text-foreground'>Admin Panel</h1>
          </div>
          <p className='text-muted-foreground'>Manage users, roles, and system settings</p>
        </div>

        {/* Placeholder Cards */}
        <div className='grid md:grid-cols-2 gap-6'>
          {/* User Management Card */}
          <div className='bg-background rounded-lg border border-border p-6 shadow-sm'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center'>
                <Users className='w-6 h-6 text-blue-600' />
              </div>
              <div>
                <h3 className='text-foreground'>User Management</h3>
                <p className='text-sm text-muted-foreground'>View and manage all users</p>
              </div>
            </div>
            <p className='text-muted-foreground text-sm mb-4'>
              This feature will allow you to view all registered users, update their roles, and
              manage access permissions.
            </p>
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
              <p className='text-sm text-blue-700'>
                <strong>Coming Soon:</strong> User list with role management capabilities
              </p>
            </div>
          </div>

          {/* System Settings Card */}
          <div className='bg-background rounded-lg border border-border p-6 shadow-sm'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center'>
                <Settings className='w-6 h-6 text-indigo-600' />
              </div>
              <div>
                <h3 className='text-foreground'>System Settings</h3>
                <p className='text-sm text-muted-foreground'>Configure system preferences</p>
              </div>
            </div>
            <p className='text-muted-foreground text-sm mb-4'>
              Configure global system settings, manage categories, and customize the application
              behavior.
            </p>
            <div className='bg-indigo-50 border border-indigo-200 rounded-lg p-4'>
              <p className='text-sm text-indigo-700'>
                <strong>Coming Soon:</strong> System configuration options
              </p>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className='mt-8 bg-background border border-border rounded-lg p-6'>
          <h4 className='text-foreground mb-2'>Development Notice</h4>
          <p className='text-muted-foreground text-sm'>
            This Admin Panel is currently under development. Features will be added step by step to
            provide comprehensive system management capabilities.
          </p>
        </div>
      </div>
    </div>
  );
}
