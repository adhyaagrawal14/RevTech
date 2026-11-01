import React, { useState } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { RevTechLogo } from '../components/RevTechLogo';

interface LoginPageProps {
  onPreview: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onPreview }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice('Authentication is not connected yet. Your sign-in will be enabled when the backend is integrated.');
  };

  return (
    <main className="min-h-screen bg-[#F5F8F4] text-[#18372D] flex flex-col">
      <header className="w-full px-6 sm:px-10 py-5">
        <RevTechLogo size="lg" variant="full" />
      </header>

      <section className="flex-1 flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-[440px]">
          <div className="bg-white border border-[#E0E9E1] rounded-3xl shadow-[0_18px_60px_rgba(16,56,45,0.08)] p-7 sm:p-10">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF3EC] text-[#23734D] flex items-center justify-center mb-6">
              <LockKeyhole size={23} />
            </div>
            <p className="text-xs font-bold tracking-[0.16em] uppercase text-[#39805B] mb-2">Welcome to RevTech</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#10382D]">Sign in to your account</h1>
            <p className="text-sm leading-6 text-[#68776E] mt-2 mb-8">Access your devices, repair insights and electronics ownership tools in one place.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#29483B] mb-2">Email address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#819188]" />
                  <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full h-12 pl-11 pr-4 rounded-xl border border-[#DCE6DD] bg-[#FCFDFC] text-sm outline-none focus:border-[#39805B] focus:ring-4 focus:ring-[#39805B]/10" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-[#29483B] mb-2">Password</label>
                <div className="relative">
                  <LockKeyhole size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#819188]" />
                  <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full h-12 pl-11 pr-12 rounded-xl border border-[#DCE6DD] bg-[#FCFDFC] text-sm outline-none focus:border-[#39805B] focus:ring-4 focus:ring-[#39805B]/10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[#819188] hover:text-[#174C3C]">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <span className="text-xs font-medium text-[#8A978F]">Forgot password? Available after backend integration</span>
              </div>

              <button type="submit" className="w-full h-12 rounded-xl bg-[#174C3C] hover:bg-[#10382D] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-colors">
                Sign in <ArrowRight size={17} />
              </button>
            </form>

            {notice && <p role="status" className="mt-4 rounded-xl bg-[#FFF8E8] border border-[#F0E2B9] px-4 py-3 text-xs leading-5 text-[#765B1D]">{notice}</p>}

            <div className="relative my-7">
              <div className="border-t border-[#E8EEE8]" />
              <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 px-3 bg-white text-[11px] text-[#98A39B]">SECURE ACCESS</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-[#718078]">
              <ShieldCheck size={16} className="text-[#39805B]" />
              Your account security will be handled by RevTech authentication services.
            </div>
          </div>

          <p className="text-center text-xs text-[#78867D] mt-6">
            Setting up the frontend?{' '}
            <button onClick={onPreview} className="font-bold text-[#23734D] hover:text-[#10382D] underline underline-offset-4">Preview the application</button>
          </p>
          <p className="text-center text-[10px] text-[#9AA59D] mt-5">© {new Date().getFullYear()} RevTech. All rights reserved.</p>
        </div>
      </section>
    </main>
  );
};
