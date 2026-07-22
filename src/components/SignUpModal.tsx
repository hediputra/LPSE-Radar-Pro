import React, { useState } from 'react';
import {
  X,
  Building2,
  Mail,
  Lock,
  Phone,
  User,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Eye,
  EyeOff,
  Tag
} from 'lucide-react';
import { SubscriptionTier, SUBSCRIPTION_TIERS, Tenant } from '../data/mockTenants';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onSignUpSuccess: (tenant: Tenant) => void;
  initialTier?: SubscriptionTier;
}

export const SignUpModal: React.FC<SignUpModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
  onSignUpSuccess,
  initialTier = 'FREE'
}) => {
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(initialTier);
  const [companyName, setCompanyName] = useState('');
  const [npwp, setNpwp] = useState('');
  const [sector, setSector] = useState('Konstruksi & Infrastruktur');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1); // Step 1: Select Plan, Step 2: Form Details

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      const planInfo = SUBSCRIPTION_TIERS.find((p) => p.tier === selectedTier) || SUBSCRIPTION_TIERS[0];
      const subdomainClean = (companyName || 'vendorbarupip')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');

      // Build new registered tenant object
      const newTenant: Tenant = {
        id: `tenant-${Date.now()}`,
        name: companyName || 'PT Vendor Indonesia Mandiri',
        npwp: npwp || '01.999.888.7-012.000',
        sector: sector,
        tier: selectedTier,
        status: 'active',
        userCount: 1,
        maxUsers: planInfo.maxUsers,
        branding: {
          companyName: companyName || 'Vendor Portal',
          primaryColor: selectedTier === 'FREE' ? '#38bdf8' : '#10b981',
          subdomain: subdomainClean || 'vendorbaru',
        },
        users: [
          {
            id: `usr-${Date.now()}`,
            name: fullName || 'Admin Vendor',
            email: email || 'admin@vendor.co.id',
            role: 'tenant_admin',
            lastActive: 'Baru saja'
          }
        ],
        apiKeys: [],
        webhooks: [],
        mrrAmount: planInfo.priceIdr,
        joinedDate: new Date().toISOString().split('T')[0],
        expiresAt: '2027-12-31',
        trackedTendersCount: 0,
        apiRequestsCount24h: 12,
        lastSyncAt: 'Baru saja',
        lastSyncStatus: 'SUCCESS',
        syncedRecordsCount: 50
      };

      onSignUpSuccess(newTenant);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header decoration */}
        <div className="h-2 bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Top Title */}
          <div className="space-y-1.5 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 border border-rose-500/30 rounded-full text-xs font-bold text-rose-300">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>PENDAFTARAN AKUN VENDOR LPSE</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Mulai Pakai LPSE Radar PRO
            </h2>
            <p className="text-xs text-slate-400">
              Daftar akun gratis atau pilih paket sesuai kebutuhan pemantauan tender perusahaan Anda
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-4 text-xs font-bold">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`flex items-center gap-2 pb-1 border-b-2 transition-all cursor-pointer ${
                step === 1
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">
                1
              </span>
              <span>Pilih Paket Layanan</span>
            </button>

            <span className="text-slate-700">&rarr;</span>

            <button
              type="button"
              onClick={() => setStep(2)}
              className={`flex items-center gap-2 pb-1 border-b-2 transition-all cursor-pointer ${
                step === 2
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">
                2
              </span>
              <span>Data Perusahaan & User</span>
            </button>
          </div>

          {/* STEP 1: PLAN SELECTION */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SUBSCRIPTION_TIERS.map((tier) => {
                  const isSelected = selectedTier === tier.tier;
                  const isFree = tier.tier === 'FREE';

                  return (
                    <div
                      key={tier.tier}
                      onClick={() => setSelectedTier(tier.tier)}
                      className={`relative p-4 rounded-xl border transition-all cursor-pointer text-left space-y-2.5 ${
                        isSelected
                          ? isFree
                            ? 'bg-sky-950/40 border-sky-400 ring-2 ring-sky-400/30'
                            : 'bg-emerald-950/40 border-emerald-400 ring-2 ring-emerald-400/30'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {isFree && (
                        <span className="absolute top-3 right-3 px-2 py-0.5 bg-sky-500/20 text-sky-300 border border-sky-500/40 rounded-full text-[10px] font-black uppercase">
                          GRATIS SELAMANYA
                        </span>
                      )}

                      {!isFree && tier.tier === 'BUSINESS' && (
                        <span className="absolute top-3 right-3 px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-[10px] font-black uppercase">
                          PALING POPULER
                        </span>
                      )}

                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-emerald-400 bg-emerald-400 text-slate-950'
                              : 'border-slate-700'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <h3 className="font-extrabold text-white text-sm">{tier.name}</h3>
                      </div>

                      <div>
                        <span className="text-base font-black text-emerald-400 block">
                          {tier.priceLabel}
                        </span>
                        <span className="text-[10px] text-slate-400 block">{tier.target}</span>
                      </div>

                      <ul className="space-y-1 pt-1 border-t border-slate-800/80 text-[11px] text-slate-300">
                        {tier.features.slice(0, 3).map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="truncate">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Lanjutkan Isi Data Perusahaan &rarr;</span>
              </button>
            </div>
          )}

          {/* STEP 2: COMPANY & USER FORM */}
          {step === 2 && (
            <form onSubmit={handleRegister} className="space-y-4 text-left">
              
              {/* Selected Tier Banner */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-300 font-medium">Paket Terpilih:</span>
                  <strong className="text-emerald-400 font-extrabold">
                    {SUBSCRIPTION_TIERS.find((t) => t.tier === selectedTier)?.name}
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-slate-400 hover:text-white underline cursor-pointer text-[11px]"
                >
                  Ubah Paket
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Nama Perusahaan */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    Nama Perusahaan / PT / CV
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="PT Wira Nusa Karya"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* NPWP Perusahaan */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    NPWP Kontraktor / Perusahaan
                  </label>
                  <input
                    type="text"
                    required
                    value={npwp}
                    onChange={(e) => setNpwp(e.target.value)}
                    placeholder="01.234.567.8-012.000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Sektor Bidang Usaha */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    Sektor / Bidang Pengadaan Utama
                  </label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Konstruksi & Infrastruktur">Konstruksi & Infrastruktur Sipil</option>
                    <option value="Pengadaan Alat Kesehatan & Farmasi">Pengadaan Alat Kesehatan & Farmasi (Alkes)</option>
                    <option value="Teknologi Informasi & Telekomunikasi">Teknologi Informasi, Software & IT</option>
                    <option value="Jasa Konsultansi & Perencanaan">Jasa Konsultansi & Perencanaan Teknis</option>
                    <option value="Pengadaan Barang Umum & Supplier">Pengadaan Barang Umum & Supplier</option>
                  </select>
                </div>

                {/* Nama Lengkap Admin */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    Nama Penanggung Jawab
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ir. Bambang Wijaya"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Email Perusahaan */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    Email Perusahaan
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@perusahaan.co.id"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* WhatsApp Phone */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    Nomor WhatsApp Notifikasi
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="081234567890"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Buat kata sandi aman"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-10 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
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
              </div>

              {/* Checkbox agreement */}
              <div className="flex items-start gap-2 pt-2">
                <input
                  type="checkbox"
                  id="agreedTerms"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="agreedTerms" className="text-[11px] text-slate-400 cursor-pointer">
                  Saya menyetujui Ketentuan Layanan & Kebijakan Privasi PT Fas Technology Solutions serta pemantauan data publik LPSE RI.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !agreedTerms}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg hover:shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Mendaftarkan Akun & Tenant...</span>
                  </>
                ) : (
                  <>
                    <span>Selesaikan Pendaftaran & Masuk</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Back to Login */}
              <div className="text-center pt-2 text-xs text-slate-400">
                Sudah memiliki akun?{' '}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="font-bold text-emerald-400 hover:underline cursor-pointer"
                >
                  Masuk di sini
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
