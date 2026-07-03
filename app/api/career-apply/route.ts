import { NextResponse } from 'next/server';

type CareerApplyPayload = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  careerTitle?: string;
  careerSlug?: string;
  cvFileName?: string;
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
    const body = (await request.json()) as CareerApplyPayload;
    const name = body.name?.trim();
    const email = body.email?.trim();
    const phone = body.phone?.trim();
    const message = body.message?.trim() ?? '';
    const careerTitle = body.careerTitle?.trim();
    const careerSlug = body.careerSlug?.trim();
    const cvFileName = body.cvFileName?.trim() ?? '';
    const recaptchaToken = body.recaptchaToken?.trim();

    if (!name) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required.' }, { status: 400 });
    }

    if (!careerTitle || !careerSlug) {
      return NextResponse.json({ error: 'Career information is missing.' }, { status: 400 });
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
        { error: 'Applications are temporarily unavailable.' },
        { status: 503 }
      );
    }

    const strapiResponse = await fetch(`${strapiUrl}/api/career-applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${strapiToken}`,
      },
      body: JSON.stringify({
        data: {
          Name: name,
          Email: email,
          Phone: phone,
          Message: message,
          CareerTitle: careerTitle,
          CareerSlug: careerSlug,
          CvFileName: cvFileName || null,
        },
      }),
    });

    if (!strapiResponse.ok) {
      const errorBody = await strapiResponse.text();
      console.error('Failed to save career application:', errorBody);
      return NextResponse.json(
        { error: 'Failed to submit your application. Please try again.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Career application submission error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
