"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please enter your email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/admin/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Invalid email or password",
        );
      }

      localStorage.setItem("admin_access_token", data.access_token);
      localStorage.setItem("admin_user", JSON.stringify(data.admin));

      toast.success("Authentication successful");

      router.push("/admin/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to login",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-page-gradient px-6 py-10">
      <div className="flex w-full max-w-[290px] flex-col items-center">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <Image
            src="/logo.jpg"
            alt="Sissifier GPT logo"
            width={448}
            height={448}
            priority
            className="size-[62px] rounded-xl shadow-glow-logo"
          />

          <h1 className="mt-6 font-title text-[22px] font-semibold text-brand-soft">
            Admin Login
          </h1>

          <p className="mt-3 max-w-[220px] text-[12px] leading-relaxed text-copy-soft">
            Access the Sissifier GPT administration control center.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-purple-400/15 bg-purple-400/[0.05] px-3 py-1.5">
            <ShieldCheck className="size-3 text-purple-300" />

            <span className="text-[8px] uppercase tracking-[0.2em] text-purple-300">
              Administrator Access
            </span>
          </div>
        </div>

        {/* Login Form */}
        <div className="mt-7 w-full">
          <div className="mb-6 rounded-xl border border-purple-400/10 bg-purple-400/[0.04] p-3">
            <div className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-purple-300" />

              <p className="text-[10px] leading-relaxed text-copy-soft">
                This portal is restricted to authorized administrators only.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3"
            noValidate
          >
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="px-2 text-[11px] font-medium text-copy-soft"
              >
                Administrator Email
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="admin@yourdomain.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={loading}
                className="h-11 w-full rounded-xl border border-ink/10 bg-ink/[0.03] px-4 text-sm text-foreground placeholder:text-copy-muted transition-all focus:border-brand/50 disabled:opacity-60"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="px-2 text-[11px] font-medium text-copy-soft"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={loading}
                  className="h-11 w-full rounded-xl border border-ink/10 bg-ink/[0.03] px-4 pr-12 text-sm text-foreground placeholder:text-copy-muted transition-all focus:border-brand/50 disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-copy-muted transition hover:text-brand-soft"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 h-11 w-full rounded-full bg-brand font-title text-[13px] font-medium text-brand-foreground transition-colors hover:bg-brand-hover disabled:pointer-events-none disabled:opacity-60"
            >
              {loading ? "Authenticating..." : "Access Admin Portal"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-col items-center gap-5">
          <p className="text-[12px] text-copy-soft">
            New administrator?{" "}
            <Link
              href="/admin/signup"
              className="inline-flex items-center gap-1 font-semibold text-brand-soft transition hover:text-brand-hover"
            >
              Create account
              <ArrowRight className="size-3" />
            </Link>
          </p>

          <div className="flex gap-5 text-[7px] uppercase tracking-[0.2em] text-copy-faint">
            <span>Secure Access</span>
            <span>Admin Only</span>
          </div>
        </div>
      </div>

      {/* Bottom glow */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-linear-to-r from-transparent via-brand/40 to-transparent" />
    </main>
  );
}