'use client';

import { useState } from 'react';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';

export default function ContactPage() {
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!values.name || !values.email || !values.message) {
      setStatus('error');
      return;
    }
    setStatus('success');
    setValues({ name: '', email: '', message: '' });
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <section className="relative overflow-hidden pt-28 pb-20">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">
          <h1 className="text-4xl font-bold text-white mb-4">Contact</h1>
          <p className="text-lg text-slate-300 mb-8">Let's build your next collaboration hub together.</p>

          <div className="mt-12 grid gap-10 lg:grid-cols-[0.9fr_0.7fr]">
            <div className="glass-panel rounded-[2rem] border border-white/10 p-10 shadow-soft">
              <p className="text-lg font-semibold text-white">Ready to transform your marketing and product pages?</p>
              <p className="mt-4 leading-7 text-slate-300">
                Tell us about your project, and we’ll help map the content experience, service pages, and launch narrative.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="glass-panel rounded-[2rem] border border-white/10 p-10 shadow-soft">
              <div className="space-y-6">
                <label className="block text-sm font-medium text-slate-200">
                  Name
                  <input
                    value={values.name}
                    onChange={(event) => handleChange('name', event.target.value)}
                    className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-sky-400"
                    placeholder="Jane Doe"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-200">
                  Email
                  <input
                    type="email"
                    value={values.email}
                    onChange={(event) => handleChange('email', event.target.value)}
                    className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-sky-400"
                    placeholder="jane@company.com"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-200">
                  Message
                  <textarea
                    value={values.message}
                    onChange={(event) => handleChange('message', event.target.value)}
                    className="mt-3 min-h-[180px] w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-sky-400"
                    placeholder="Tell us about your upcoming launch..."
                  />
                </label>

                <button type="submit" className="inline-flex w-full items-center justify-center rounded-3xl bg-sky-400 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-sky-300">
                  Send message
                </button>

                {status === 'error' && <p className="text-sm text-rose-400">Please complete all fields before submitting.</p>}
                {status === 'success' && <p className="text-sm text-emerald-300">Thanks! Your message is ready to be reviewed.</p>}
              </div>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
