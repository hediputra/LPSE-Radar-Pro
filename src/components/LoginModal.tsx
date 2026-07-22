import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  KeyRound,
  UserCheck
} from 'lucide-react';
import { Tenant, MOCK_TENANTS } from '../data/mockTenants';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
  onLoginSuccess: (tenant: Tenant, email: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToSignUp,
  onLoginSuccess
}) => {
  const [email, setEmail] = useState('admin@kontraktorjaya.co.id');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState('tenant-001');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const tenant = MOCK_TENANTS.find((t) => t.id === selectedTenantId) || MOCK_TENANTS[0];
      onLoginSuccess(tenant, email);
    }, 800);
  };

  const handleDemoLogin = (tenantId: string, demoEmail: string) => {
    const tenant = MOCK_TENANTS.find((t) => t.id === tenantId) || MOCK_TENANTS[0];
    setSelectedTenantId(tenantId);
    setEmail(demoEmail);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(tenant, demoEmail);
    }, 600);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header decoration */}
        <div className="h-2 bg-gradient-to-r from-emerald-500 via-rose-500 to-indigo-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Header Info */}
          <div className="space-y-2 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs font-bold text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>PORTAL MASUK B2B LPSE RADAR</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {isForgotMode ? 'Pulihkan Kata Sandi' : 'Masuk ke Akun Anda'}
            </h2>
            <p className="text-xs text-slate-400">
              {isForgotMode
                ? 'Masukkan email perusahaan Anda untuk tautan reset password'
                : 'Akses sistem pemantauan tender, analisis HPS & kompetitor LPSE'}
            </p>
          </div>

          {!isForgotMode ? (
            <form onSubmit={handleLogin} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
                  {errorMessage}
                </div>
              )}

              {/* Subdomain / Tenant Picker */}
              <div className="space-y-1.5 text-left">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Pilih Subdomain / Perusahaan (Tenant)
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <select
                    value={selectedTenantId}
                    onChange={(e) => setSelectedTenantId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
                  >
                    {MOCK_TENANTS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.branding.subdomain}.ptfas.co.id) • [{t.tier}]
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5 text-left">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Email Perusahaan / User ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@perusahaan.co.id"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Kata Sandi
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotMode(true)}
                    className="text-[11px] text-emerald-400 hover:underline cursor-pointer"
                  >
                    Lupa kata sandi?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg hover:shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Otentikasi Akun...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk Aplikasi PRO</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Quick Demo Logins */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block text-center">
                  Akses Cepat Mode Demo (Instan)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('tenant-001', 'admin@kontraktorjaya.co.id')}
                    className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[11px] font-bold text-white group-hover:text-emerald-400">
                        Kontraktor Jaya
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono block">Business Pro</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin('tenant-002', 'tender@adhikarya.co.id')}
                    className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[11px] font-bold text-white group-hover:text-amber-400">
                        Adhi Karya
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono block">Enterprise Tier</span>
                  </button>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center pt-2 text-xs text-slate-400">
                Belum punya akun?{' '}
                <button
                  type="button"
                  onClick={onSwitchToSignUp}
                  className="font-bold text-rose-400 hover:text-rose-300 hover:underline cursor-pointer"
                >
                  Daftar Akun / Coba Paket Free
                </button>
              </div>
            </form>
          ) : (
            /* Forgot Password Form */
            <div className="space-y-4">
              {forgotPasswordSent ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h3 className="font-bold text-white text-sm">Email Instruksi Terkirim!</h3>
                  <p className="text-xs text-slate-300">
                    Kami telah mengirimkan tautan pemulihan kata sandi ke <strong className="text-emerald-400">{email}</strong>. Silakan periksa inbox atau kotak spam Anda.
                  </p>
                  <button
                    onClick={() => {
                      setForgotPasswordSent(false);
                      setIsForgotMode(false);
                    }}
                    className="mt-3 text-xs font-bold text-emerald-400 hover:underline cursor-pointer"
                  >
                    &larr; Kembali ke Halaman Masuk
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                      Email Akun Perusahaan
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@perusahaan.co.id"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
                  >
                    Kirim Tautan Pemulihan
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsForgotMode(false)}
                    className="w-full py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
                  >
                    Kembali ke Masuk
                  </button>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
