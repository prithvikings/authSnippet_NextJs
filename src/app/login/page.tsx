'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // Enable button only if both fields are filled
  useEffect(() => {
    const { email, password } = user;
    setIsButtonDisabled(!(email && password));
  }, [user]);

  const onLogin = async (e: any) => {
    e.preventDefault();
    if (isButtonDisabled) return;

    setLoading(true);
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success('Login Successful!');
      setUser({ email: '', password: '' });
      router.push('/me'); // redirect after login
    } catch (err: any) {
      toast.error(err.message);
      setError(err.message);
      setUser({ email: '', password: '' });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/resetpassword');
  }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-[#0a0a0a]">
      <form className="flex flex-col gap-6 p-10 rounded-md shadow-2xl w-96 bg-[#171717] text-white">
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <input
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          type="email"
          placeholder="Email"
          className="p-3 bg-[#0a0a0a] text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />

        <input
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          type="password"
          placeholder="Password"
          className="p-3 bg-[#0a0a0a] text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />

        <button 
        type='button'
        onClick={handleForgotPassword}
        className='text-sm text-gray-300 cursor-pointer flex items-start hover:text-gray-400'>Forgot Password</button>

        <button
          onClick={onLogin}
          type="submit"
          disabled={isButtonDisabled || loading}
          className={`py-3 font-semibold shadow-lg transition-all ${
            isButtonDisabled
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
          }`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p className="text-red-600 text-center">{error}</p>}

        <p className="text-gray-400 text-center">
          I do not have an account?{' '}
          <Link href="/signup" className="text-blue-500 hover:underline cursor-pointer">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
