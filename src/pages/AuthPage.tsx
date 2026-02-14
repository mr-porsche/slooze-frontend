import { useForm } from 'react-hook-form';
import Logo from '../assets/FFFFFF-1.png';
import { useState } from 'react';
import { AlertCircle, Container, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

type LoginFormData = {
  email: string;
  password: string;
};

type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'Manager' | 'Store Keeper' | 'Admin';
};

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { login, register: registerUser } = useAuth();
  const navigate = useNavigate();

  const loginForm = useForm<LoginFormData>();
  const registerForm = useForm<RegisterFormData>({
    defaultValues: {
      role: 'Store Keeper',
    },
  });

  const onLogin = (data: LoginFormData) => {
    setErrorMessage('');
    setSuccessMessage('');

    const result = login(data.email, data.password);
    if (result.success) {
      setSuccessMessage('Login successful!');
      // Redirecting to the Inventory page
      setTimeout(() => {
        navigate('/inventory');
      }, 500);
    } else {
      setErrorMessage(result.message);
    }
  };

  const onRegister = (data: RegisterFormData) => {
    setErrorMessage('');
    setSuccessMessage('');

    const result = registerUser(
      data.firstName,
      data.lastName,
      data.email,
      data.password,
      data.role
    );
    if (result.success) {
      setSuccessMessage('Account created successfully!');
      // Redirecting to the Inventory page
      setTimeout(() => {
        navigate('/inventory');
      }, 500);
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        {/* Logo */}
        <div className='flex justify-center mb-8'>
          <img src={Logo} alt='Slooze' className='h-16' />
        </div>

        {/* Deployment Badge */}
        <div className='flex justify-center mb-6'>
          <div className='flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted-foreground text-sm backdrop-blur-sm'>
            <Container size={16} className='text-blue-500' />
            <span>Deployed via Automated CI/CD Pipeline (Docker + GitHub Actions)</span>
          </div>
        </div>

        {/* Auth Card */}
        <Card>
          <CardHeader className='p-8 pb-4'>
            {/* Toggle Tabs */}
            <div className='flex gap-2 mb-6 p-1 bg-muted rounded-lg'>
              <button
                onClick={() => {
                  setIsLogin(true);
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`flex-1 py-2.5 px-4 rounded-md transition-all ${
                  isLogin
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsLogin(false);
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`flex-1 py-2.5 px-4 rounded-md transition-all ${
                  !isLogin
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Register
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700'>
                <AlertCircle size={18} />
                <span className='text-sm'>{errorMessage}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className='mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700'>
                <span className='text-sm'>{successMessage}</span>
              </div>
            )}
          </CardHeader>

          {/* Scrollable Form Container */}
          <CardContent
            className={!isLogin ? 'overflow-y-auto' : ''}
            style={!isLogin ? { maxHeight: 'calc(100vh - 400px)' } : undefined}
          >
            {/* Login Form */}
            {isLogin ? (
              <form onSubmit={loginForm.handleSubmit(onLogin)} className='space-y-5'>
                <h2 className='text-center text-foreground mb-6'>Welcome Back</h2>

                <div>
                  <label htmlFor='login-email' className='block text-foreground mb-2'>
                    Email
                  </label>
                  <input
                    id='login-email'
                    type='email'
                    {...loginForm.register('email', { required: 'Email is required' })}
                    className='w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='Enter your email'
                  />
                  {loginForm.formState.errors.email && (
                    <p className='mt-1 text-sm text-destructive'>
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor='login-password' className='block text-foreground mb-2'>
                    Password
                  </label>
                  <div className='relative'>
                    <input
                      id='login-password'
                      type={showPassword ? 'text' : 'password'}
                      {...loginForm.register('password', { required: 'Password is required' })}
                      className='w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12'
                      placeholder='Enter your password'
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className='mt-1 text-sm text-destructive'>
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type='submit'
                  className='w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition-colors'
                >
                  Login
                </button>

                <p className='text-center text-sm text-muted-foreground mt-4'>
                  Default admin: <span className='text-foreground'>admin@slooze.com</span> /{' '}
                  <span className='text-foreground'>admin123</span>
                </p>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={registerForm.handleSubmit(onRegister)} className='space-y-5'>
                <h2 className='text-center text-foreground mb-6'>Create Account</h2>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label htmlFor='firstName' className='block text-foreground mb-2'>
                      First Name
                    </label>
                    <input
                      id='firstName'
                      type='text'
                      {...registerForm.register('firstName', {
                        required: 'First name is required',
                      })}
                      className='w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      placeholder='John'
                    />
                    {registerForm.formState.errors.firstName && (
                      <p className='mt-1 text-sm text-destructive'>
                        {registerForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor='lastName' className='block text-foreground mb-2'>
                      Last Name
                    </label>
                    <input
                      id='lastName'
                      type='text'
                      {...registerForm.register('lastName', { required: 'Last name is required' })}
                      className='w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      placeholder='Doe'
                    />
                    {registerForm.formState.errors.lastName && (
                      <p className='mt-1 text-sm text-destructive'>
                        {registerForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor='register-email' className='block text-foreground mb-2'>
                    Email
                  </label>
                  <input
                    id='register-email'
                    type='email'
                    {...registerForm.register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    className='w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='john.doe@example.com'
                  />
                  {registerForm.formState.errors.email && (
                    <p className='mt-1 text-sm text-destructive'>
                      {registerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor='register-password' className='block text-foreground mb-2'>
                    Password
                  </label>
                  <div className='relative'>
                    <input
                      id='register-password'
                      type={showPassword ? 'text' : 'password'}
                      {...registerForm.register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters',
                        },
                      })}
                      className='w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12'
                      placeholder='Create a password'
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-slate-600'
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {registerForm.formState.errors.password && (
                    <p className='mt-1 text-sm text-destructive'>
                      {registerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor='role' className='block text-foreground mb-2'>
                    Role
                  </label>
                  <select
                    id='role'
                    {...registerForm.register('role', { required: 'Role is required' })}
                    className='w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background'
                  >
                    <option value='Manager'>Manager</option>
                    <option value='Store Keeper'>Store Keeper</option>
                  </select>
                  {registerForm.formState.errors.role && (
                    <p className='mt-1 text-sm text-red-600'>
                      {registerForm.formState.errors.role.message}
                    </p>
                  )}
                </div>

                <button
                  type='submit'
                  className='w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition-colors'
                >
                  Create Account
                </button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Footer Note */}
        <p className='text-center mt-6 text-sm text-muted-foreground'>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
