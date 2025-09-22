"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";

interface User {
  username: string;
  email: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/users/me", {
          method: "GET",
          credentials: "include", // important for cookies
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        setUser(data.user);
      } catch (error: any) {
        toast.error(error.message || "Unauthorized");
        router.push("/login"); // redirect if not logged in
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch("/api/users/logout", { method: "GET" }); // you should create this endpoint to clear cookie
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] text-white">
        <p className="text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] text-white">
      <div className="px-8 py-6 border border-gray-700 rounded-2xl shadow-xl bg-[#171717] w-[380px] flex flex-col items-center">
        {/* Profile Image (placeholder if no image field) */}
        <Image
          src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="profile"
          width={100}
          height={100}
          className="rounded-full object-cover shadow-md"
        />

        {/* Username & Email */}
        <h1 className="text-xl font-bold mt-4">{user?.username}</h1>
        <p className="text-gray-400">{user?.email}</p>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-6 bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-semibold transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
