import { NextResponse } from 'next/server';

type ConnectCtaPayload = {
  email?: string;
  source?: string;
  recaptchaToken?: string;
};

async function verifyRecaptcha(token: string) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    return process.env.NODE_ENV === 'development';
  }

  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret,
      response: token,
    }),
  });

  const result = (await response.json()) as {
    success?: boolean;
    score?: number;
    'error-codes'?: string[];
  };

  if (!result.success) {
    console.error('reCAPTCHA verification failed:', result['error-codes']);
    return false;
  }

  if (typeof result.score === 'number' && result.score < 0.5) {
    return false;
  }

  return true;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ConnectCtaPayload;
    const email = body.email?.trim();
    const source = body.source?.trim() ?? '';
    const recaptchaToken = body.recaptchaToken?.trim();

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    if (!source) {
      return NextResponse.json({ error: 'Source URL is required.' }, { status: 400 });
    }

    const isValidSource =
      source.startsWith('/') ||
      /^https?:\/\//i.test(source);

    if (!isValidSource || source.length > 2048) {
      return NextResponse.json({ error: 'Invalid source URL.' }, { status: 400 });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!recaptchaToken) {
      return NextResponse.json(
        { error: 'Please complete the reCAPTCHA verification.' },
        { status: 400 }
      );
    }

    const skipRecaptcha =
      process.env.NODE_ENV === 'development' && !process.env.RECAPTCHA_SECRET_KEY;

    if (!skipRecaptcha) {
      const recaptchaValid = await verifyRecaptcha(recaptchaToken);
      if (!recaptchaValid) {
        return NextResponse.json(
          { error: 'reCAPTCHA verification failed. Please try again.' },
          { status: 400 }
        );
      }
    }

    const strapiUrl =
      process.env.STRAPI_API_URL ||
      process.env.NEXT_PUBLIC_STRAPI_API_URL ||
      'http://localhost:1337';
    const strapiToken = process.env.STRAPI_API_TOKEN;

    if (!strapiToken) {
      console.error('STRAPI_API_TOKEN is not configured');
      return NextResponse.json(
        { error: 'Signup is temporarily unavailable.' },
        { status: 503 }
      );
    }

    const strapiResponse = await fetch(`${strapiUrl}/api/connect-cta-submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${strapiToken}`,
      },
      body: JSON.stringify({
        data: {
          Email: email,
          Source: source,
        },
      }),
    });

    if (!strapiResponse.ok) {
      const errorBody = await strapiResponse.text();
      console.error('Failed to save connect CTA submission:', errorBody);
      return NextResponse.json(
        { error: 'Failed to save your email. Please try again.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Connect CTA submission error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
