'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

const VerifyEmailPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'info' | 'success' | 'error'>('info');
  const [message, setMessage] = useState<string>(
    'We have sent a verification link to your email. Please check your inbox.'
  );

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) return; // No token, just show info message

    // If token exists, start verification
    setLoading(true);
    const verifyEmail = async () => {
      try {
        const res = await fetch('/api/users/verifyemail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setStatus('success');
        setMessage('Email verified successfully! Redirecting to login...');
        toast.success('Email verified!');
        setTimeout(() => router.push('/login'), 2000); // redirect after 2s
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message || 'Verification failed. Please try again.');
        toast.error(err.message || 'Verification failed');
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  // Colors based on status
  const bgColor =
    status === 'success'
      ? 'bg-green-600'
      : status === 'error'
      ? 'bg-red-600'
      : 'bg-[#171717]';

  return (
    <div className="w-full h-screen flex justify-center items-center bg-[#0a0a0a] text-white">
      <div className={`flex flex-col gap-6 p-8 rounded-2xl shadow-2xl w-96 text-center ${bgColor}`}>
        <h2 className="text-2xl font-bold">
          {status === 'info'
            ? 'Verify Your Email'
            : status === 'success'
            ? 'Success!'
            : 'Error'}
        </h2>
        <p>{message}</p>
        {status === 'info' && (
          <p className="text-gray-400">
            Already verified?{' '}
            <Link href="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        )}
        {loading && <p>Processing...</p>}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
