'use client';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/users/forgotpassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success('Password reset link sent to your email');
      setEmail('');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-[#0a0a0a]">
      <form onSubmit={handleReset} className="flex flex-col gap-6 p-10 rounded-md shadow-2xl w-96 bg-[#171717] text-white">
        <h2 className="text-2xl font-bold text-center">Reset Password</h2>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Enter your email"
          className="p-3 bg-[#0a0a0a] text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />

        <button
          type="submit"
          disabled={loading || !email}
          className={`py-3 font-semibold shadow-lg transition-all ${
            !email ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
          }`}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
