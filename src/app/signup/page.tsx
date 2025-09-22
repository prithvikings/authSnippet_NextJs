"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const router = useRouter();

  // Enable button only if all fields are filled
  useEffect(() => {
    const { username, email, password } = user;
    setIsButtonDisabled(!(username && email && password));
  }, [user]);

  const onSignup = async (e: any) => {
    e.preventDefault();
    if (isButtonDisabled) return; // safety check

    setLoading(true);
    try {
      const res = await fetch("/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Signup Successful");
      setUser({ username: "", email: "", password: "" });
      router.push("/verifyemail"); // navigate to verification page
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
      setUser({ username:"", email:"",password: "" }); // clear password field
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-[#0a0a0a]">
      <form className="flex flex-col gap-6 p-10 rounded-md shadow-2xl w-96 bg-[#171717] text-white">
        <h2 className="text-2xl font-bold text-center">SignUp</h2>

        <input
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          type="text"
          placeholder="Username"
          className="p-3 bg-[#0a0a0a] text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />

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
          onClick={onSignup}
          type="submit"
          disabled={isButtonDisabled || loading}
          className={`py-3 font-semibold shadow-lg transition-all ${
            isButtonDisabled
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
          }`}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <p className="text-gray-400 text-center">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
