"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminSignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupSecret, setSignupSecret] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !password || !signupSecret) {
      toast.error("Please complete all fields");
      return;
    }

    if (name.trim().length < 2) {
      toast.error("Name must contain at least 2 characters");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must contain at least 8 characters");
      return;
    }

    if (new TextEncoder().encode(password).length > 72) {
      toast.error("Password cannot exceed 72 bytes");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/admin/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          signup_secret: signupSecret,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Unable to create administrator account",
        );
      }

      localStorage.setItem("admin_access_token", data.access_token);
      localStorage.setItem("admin_user", JSON.stringify(data.admin));

      toast.success("Administrator account created successfully");

      router.push("/admin/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Signup failed",
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
            Create Admin Account
          </h1>

          <p className="mt-3 max-w-[220px] text-[12px] leading-relaxed text-copy-soft">
            Create an authorized account for the Sissifier GPT administration portal.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-purple-400/15 bg-purple-400/[0.05] px-3 py-1.5">
            <ShieldCheck className="size-3 text-purple-300" />

            <span className="text-[8px] uppercase tracking-[0.2em] text-purple-300">
              Restricted Registration
            </span>
          </div>
        </div>

        {/* Signup Form */}
        <div className="mt-7 w-full">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3"
            noValidate
          >
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="name"
                className="px-2 text-[11px] font-medium text-copy-soft"
              >
                Name
              </label>

              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Administrator name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={loading}
                className="h-11 w-full rounded-xl border border-ink/10 bg-ink/[0.03] px-4 text-sm text-foreground placeholder:text-copy-muted transition-all focus:border-brand/50 disabled:opacity-60"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="px-2 text-[11px] font-medium text-copy-soft"
              >
                Email
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
                  autoComplete="new-password"
                  placeholder="Create a password"
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

              <p className="px-2 text-[9px] text-copy-muted">
                Minimum 8 characters
              </p>
            </div>

            {/* Signup Secret */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="signup-secret"
                className="px-2 text-[11px] font-medium text-copy-soft"
              >
                Administrator Signup Secret
              </label>

              <div className="relative">
                <input
                  id="signup-secret"
                  type={showSecret ? "text" : "password"}
                  autoComplete="off"
                  placeholder="Enter signup secret"
                  value={signupSecret}
                  onChange={(event) => setSignupSecret(event.target.value)}
                  disabled={loading}
                  className="h-11 w-full rounded-xl border border-ink/10 bg-ink/[0.03] px-4 pr-12 text-sm text-foreground placeholder:text-copy-muted transition-all focus:border-brand/50 disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => setShowSecret((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-copy-muted transition hover:text-brand-soft"
                  aria-label={showSecret ? "Hide secret" : "Show secret"}
                >
                  {showSecret ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>

              <p className="px-2 text-[9px] text-copy-muted">
                Required to authorize administrator registration.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 h-11 w-full rounded-full bg-brand font-title text-[13px] font-medium text-brand-foreground transition-colors hover:bg-brand-hover disabled:pointer-events-none disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create Administrator"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-col items-center gap-5">
          <p className="text-[12px] text-copy-soft">
            Already registered?{" "}
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1 font-semibold text-brand-soft transition hover:text-brand-hover"
            >
              Login
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