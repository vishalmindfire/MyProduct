'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

interface Field {
  username: string;
  email: string;
  password: string;
  confirm: string;
}

type FieldKey = keyof Field;

interface FieldError {
  username?: string;
  email?: string;
  password?: string;
  confirm?: string;
}

function validate(fields: Field): FieldError {
  const errors: FieldError = {};
  if (!fields.username.trim()) errors.username = 'Username is required.';
  else if (fields.username.trim().length < 3)
    errors.username = 'Username must be at least 3 characters.';

  if (!fields.email.trim()) errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
    errors.email = 'Enter a valid email address.';

  if (!fields.password) errors.password = 'Password is required.';
  else if (fields.password.length < 8)
    errors.password = 'Password must be at least 8 characters.';

  if (!fields.confirm) errors.confirm = 'Please confirm your password.';
  else if (fields.confirm !== fields.password)
    errors.confirm = 'Passwords do not match.';

  return errors;
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="size-4"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="size-4"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  );
}

function InputField({
  label,
  id,
  type,
  value,
  placeholder,
  error,
  autoComplete,
  showToggle,
  visible,
  onToggle,
  onChange,
}: {
  label: string;
  id: FieldKey;
  type: string;
  value: string;
  placeholder: string;
  error?: string;
  autoComplete?: string;
  showToggle?: boolean;
  visible?: boolean;
  onToggle?: () => void;
  onChange: (val: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={showToggle ? (visible ? 'text' : 'password') : type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full rounded-lg border bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-950 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:ring-2 transition
            ${
              error
                ? 'border-red-300 dark:border-red-700 focus:ring-red-500/20'
                : 'border-zinc-200 dark:border-zinc-700 focus:ring-zinc-950/10 dark:focus:ring-zinc-50/10'
            }
            ${showToggle ? 'pr-10' : ''}
          `}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            tabIndex={-1}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            <EyeIcon open={!!visible} />
          </button>
        )}
      </div>

      {error && (
        <p id={`${id}-error`} className="text-xs text-red-500 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

/* ─── main component ─────────────────────────────────────────────────────── */
export default function RegisterForm() {
  const router = useRouter();

  const [fields, setFields] = useState<Field>({
    username: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [fieldErrors, setFieldErrors] = useState<FieldError>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  function set(key: FieldKey) {
    return (val: string) => {
      setFields((prev) => ({ ...prev, [key]: val }));
      // clear that field's error as the user types
      setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
      setServerError('');
    };
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    const errors = validate(fields);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    setServerError('');

    try {
      // 1. Register via Strapi
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: fields.username.trim(),
          email: fields.email.trim(),
          password: fields.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(
          data?.error?.message ?? 'Registration failed. Please try again.'
        );
        return;
      }

      setSuccess(true);

      const result = await signIn('credentials', {
        email: fields.email.trim(),
        password: fields.password,
        redirect: false,
      });

      if (result?.error) {
        router.push('/login?registered=1');
        return;
      }

      router.push('/dashboard');
    } catch {
      setServerError('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Free plan available · No credit card required
        </p>
      </div>

      {/* Card */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-8 flex flex-col gap-4"
      >
        <InputField
          label="Username"
          id="username"
          type="text"
          value={fields.username}
          placeholder="yourname"
          autoComplete="username"
          error={fieldErrors.username}
          onChange={set('username')}
        />

        <InputField
          label="Email"
          id="email"
          type="email"
          value={fields.email}
          placeholder="you@example.com"
          autoComplete="email"
          error={fieldErrors.email}
          onChange={set('email')}
        />

        <InputField
          label="Password"
          id="password"
          type="password"
          value={fields.password}
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          error={fieldErrors.password}
          showToggle
          visible={showPassword}
          onToggle={() => setShowPassword((v) => !v)}
          onChange={set('password')}
        />

        <InputField
          label="Confirm password"
          id="confirm"
          type="password"
          value={fields.confirm}
          placeholder="••••••••"
          autoComplete="new-password"
          error={fieldErrors.confirm}
          showToggle
          visible={showConfirm}
          onToggle={() => setShowConfirm((v) => !v)}
          onChange={set('confirm')}
        />

        {/* Password strength hint */}
        {fields.password.length > 0 && fields.password.length < 8 && (
          <div className="flex items-center gap-2">
            <div className="h-1 flex-1 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-red-400 transition-all"
                style={{ width: `${(fields.password.length / 8) * 100}%` }}
              />
            </div>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 shrink-0">
              Too short
            </span>
          </div>
        )}
        {fields.password.length >= 8 && (
          <div className="flex items-center gap-2">
            <div className="h-1 flex-1 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
              <div className="h-full w-full rounded-full bg-emerald-400" />
            </div>
            <span className="text-xs text-emerald-500 shrink-0">Good</span>
          </div>
        )}

        {/* Server error */}
        {serverError && (
          <div className="flex items-start gap-2 rounded-lg border border-red-100 dark:border-red-900/40 bg-red-50 dark:bg-red-950/30 px-3 py-2.5">
            <svg
              viewBox="0 0 16 16"
              fill="currentColor"
              className="size-4 text-red-500 shrink-0 mt-px"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm0-9.75a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75ZM8 11a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs text-red-600 dark:text-red-400 leading-5">
              {serverError}
            </p>
          </div>
        )}

        {/* Success state */}
        {success && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-2.5">
            <svg
              viewBox="0 0 16 16"
              fill="currentColor"
              className="size-4 text-emerald-500 shrink-0"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-5">
              Account created! Signing you in…
            </p>
          </div>
        )}

        {/* Terms */}
        <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-5">
          By creating an account you agree to our{' '}
          <Link
            href="/terms"
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 underline underline-offset-2 transition-colors"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href="/privacy"
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 underline underline-offset-2 transition-colors"
          >
            Privacy Policy
          </Link>
          .
        </p>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || success}
          className="mt-1 flex h-10 w-full items-center justify-center gap-2 rounded-full bg-zinc-950 dark:bg-zinc-50 text-sm font-medium text-white dark:text-zinc-950 hover:bg-zinc-700 dark:hover:bg-zinc-200 disabled:opacity-50 transition-colors"
        >
          {loading && (
            <svg
              className="size-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z"
              />
            </svg>
          )}
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      {/* Footer link */}
      <p className="mt-5 text-center text-xs text-zinc-400 dark:text-zinc-500">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
