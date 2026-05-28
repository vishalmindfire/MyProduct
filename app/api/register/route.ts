import type { NextRequest } from 'next/server';

interface RegisterBody {
  username: string;
  email: string;
  password: string;
}

interface ValidationError {
  field: string;
  message: string;
}

function validate(body: unknown): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!body || typeof body !== 'object') {
    return [{ field: 'body', message: 'Request body must be a JSON object.' }];
  }

  const { username, email, password } = body as Record<string, unknown>;

  if (!username || typeof username !== 'string' || username.trim().length < 3) {
    errors.push({ field: 'username', message: 'Username must be at least 3 characters.' });
  }

  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({ field: 'email', message: 'A valid email address is required.' });
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    errors.push({ field: 'password', message: 'Password must be at least 8 characters.' });
  }

  return errors;
}

export async function POST(req: NextRequest) {
  const strapiUrl = process.env.STRAPI_URL;

  if (!strapiUrl) {
    return Response.json(
      { error: 'Server is not configured correctly.' },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const validationErrors = validate(body);
  if (validationErrors.length > 0) {
    return Response.json(
      { error: 'Validation failed.', details: validationErrors },
      { status: 422 }
    );
  }

  const { username, email, password } = body as RegisterBody;

  let strapiRes: Response;
  try {
    strapiRes = await fetch(new URL('/api/auth/local/register', strapiUrl), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
      }),
    });
  } catch {
    return Response.json(
      { error: 'Could not reach the authentication server. Please try again.' },
      { status: 502 }
    );
  }

  const data = await strapiRes.json();

  if (!strapiRes.ok) {
    return Response.json(
      {
        error:
          data?.error?.message ??
          data?.message ??
          `Registration failed (${strapiRes.status}).`,
        detail: data?.error,
      },
      { status: strapiRes.status }
    );
  }

  const { user } = data as { user: Record<string, unknown> };

  return Response.json(
    { user: { id: user.id, username: user.username, email: user.email } },
    { status: 201 }
  );
}