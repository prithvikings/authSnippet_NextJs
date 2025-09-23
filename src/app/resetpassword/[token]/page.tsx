'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const NewPassword = () => {
  // const { token } = params;
  const param=useParams(); // ✅ dynamic route we use this way too in client component
  const token=param.token;
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error('Invalid or missing token');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/users/resetpassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success('Password reset successful! Please login');
      router.push('/login');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-[#0a0a0a]">
      <form
        onSubmit={handleResetPassword}
        className="flex flex-col gap-6 p-10 rounded-md shadow-2xl w-96 bg-[#171717] text-white"
      >
        <h2 className="text-2xl font-bold text-center">Set New Password</h2>

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Enter new password"
          className="p-3 bg-[#0a0a0a] text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />

        <button
          type="submit"
          disabled={loading || !password}
          className={`py-3 font-semibold shadow-lg transition-all ${
            !password
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
          }`}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default NewPassword;
