import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  User,
  Building2,
  HelpCircle,
  CornerDownRight,
  Sparkles,
  Bell,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Tender, QAMessage } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface TenderCommunicationViewProps {
  tender: Tender;
  onAddQuestion?: (tenderId: string, question: string, vendorName: string) => void;
  onAnswerQuestion?: (tenderId: string, questionId: string, answer: string, answeredBy: string) => void;
}

export const TenderCommunicationView: React.FC<TenderCommunicationViewProps> = ({
  tender,
  onAddQuestion,
  onAnswerQuestion
}) => {
  const { language } = useLanguage();

  // Local state for initial mock Q&A if tender.qaMessages is empty
  const defaultQA: QAMessage[] = [
    {
      id: 'qa-1',
      tenderId: tender.id,
      senderName: 'PT Karya Utama Mandiri',
      senderRole: 'vendor',
      question: 'Mohon konfirmasi terkait spesifikasi teknis item No. 3, apakah merk setara yang direkomendasikan dapat melampirkan sertifikat TKDN terpisah?',
      askedAt: '2026-07-21 10:15',
      answer: 'Dapat dilampirkan sertifikat TKDN resmi yang masih berlaku dari Kementerian Perindustrian minimal 40%.',
      answeredAt: '2026-07-21 14:30',
      answeredBy: 'Pokja Pemilihan / Buyer',
      status: 'answered'
    },
    {
      id: 'qa-2',
      tenderId: tender.id,
      senderName: 'CV Technomed Banten',
      senderRole: 'vendor',
      question: 'Apakah jadwal pemberian penjelasan (Aanwijzing) lapangan akan dilakukan secara tatap muka atau hybrid melalui Zoom?',
      askedAt: '2026-07-22 08:45',
      status: 'pending'
    }
  ];

  const [messages, setMessages] = useState<QAMessage[]>(
    tender.qaMessages && tender.qaMessages.length > 0 ? tender.qaMessages : defaultQA
  );

  const [newQuestionText, setNewQuestionText] = useState('');
  const [vendorNameText, setVendorNameText] = useState('PT Nusantara Perkasa');
  const [activeRole, setActiveRole] = useState<'vendor' | 'buyer'>('vendor');

  // Answer draft state per question id
  const [answerDrafts, setAnswerDrafts] = useState<{ [key: string]: string }>({});

  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newQA: QAMessage = {
      id: `qa-${Date.now()}`,
      tenderId: tender.id,
      senderName: vendorNameText.trim() || 'Vendor Peserta',
      senderRole: 'vendor',
      question: newQuestionText.trim(),
      askedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending'
    };

    const updated = [newQA, ...messages];
    setMessages(updated);

    if (onAddQuestion) {
      onAddQuestion(tender.id, newQuestionText.trim(), vendorNameText.trim());
    }

    // Trigger Notification Banner Toast for Buyer
    setNotificationToast(
      language === 'id'
        ? `[Notifikasi Buyer Sent] Pertanyaan baru dari ${newQA.senderName} telah dikirim ke Pokja!`
        : `[Buyer Notification Triggered] New question from ${newQA.senderName} sent to Buyer / Pokja!`
    );

    setNewQuestionText('');

    setTimeout(() => {
      setNotificationToast(null);
    }, 4500);
  };

  const handlePostAnswer = (questionId: string) => {
    const draft = answerDrafts[questionId];
    if (!draft || !draft.trim()) return;

    const updated = messages.map((q) => {
      if (q.id === questionId) {
        return {
          ...q,
          answer: draft.trim(),
          answeredAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          answeredBy: 'Pokja Pemilihan / Tim Buyer',
          status: 'answered' as const
        };
      }
      return q;
    });

    setMessages(updated);

    if (onAnswerQuestion) {
      onAnswerQuestion(tender.id, questionId, draft.trim(), 'Pokja Pemilihan');
    }

    setAnswerDrafts({ ...answerDrafts, [questionId]: '' });

    setNotificationToast(
      language === 'id'
        ? 'Jawaban resmi Pokja berhasil dipublikasikan ke seluruh peserta tender!'
        : 'Official response successfully published to all tender participants!'
    );

    setTimeout(() => {
      setNotificationToast(null);
    }, 3500);
  };

  return (
    <div className="space-y-5 text-xs animate-fade-in">
      {/* Toast Notification Alert */}
      {notificationToast && (
        <div className="p-3.5 bg-emerald-950/90 border border-emerald-500/50 rounded-xl text-emerald-300 flex items-center justify-between shadow-lg animate-bounce">
          <div className="flex items-center gap-2 font-bold">
            <Bell className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notificationToast}</span>
          </div>
          <span className="text-[10px] bg-emerald-800 text-emerald-100 px-2 py-0.5 rounded font-mono">LIVE TRIGGER</span>
        </div>
      )}

      {/* Header Info Banner */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-sky-500/20 border border-sky-500/40 rounded-xl text-sky-400 shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
              {language === 'id' ? 'Forum Komunikasi & Pemberian Penjelasan (Aanwijzing)' : 'Communication Forum & Q&A (Aanwijzing)'}
            </h4>
            <p className="text-[11px] text-slate-300 mt-0.5">
              {language === 'id'
                ? 'Wadah resmi tanya-jawab spesifikasi, KAK, dan adendum dokumen tender secara transparan.'
                : 'Official transparent forum for technical specifications, KAK, and tender addendum inquiries.'}
            </p>
          </div>
        </div>

        {/* Role Toggle Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl shrink-0">
          <span className="text-[10px] text-slate-400 font-bold px-2">Mode:</span>
          <button
            onClick={() => setActiveRole('vendor')}
            className={`px-3 py-1 rounded-lg font-extrabold text-[11px] transition-colors cursor-pointer ${
              activeRole === 'vendor'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'id' ? 'Vendor (Ajukan Pertanyaan)' : 'Vendor (Ask Question)'}
          </button>
          <button
            onClick={() => setActiveRole('buyer')}
            className={`px-3 py-1 rounded-lg font-extrabold text-[11px] transition-colors cursor-pointer ${
              activeRole === 'buyer'
                ? 'bg-sky-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'id' ? 'Pokja / Buyer (Jawab)' : 'Pokja / Buyer (Answer)'}
          </button>
        </div>
      </div>

      {/* Post New Question Box (Vendor Mode) */}
      {activeRole === 'vendor' && (
        <form onSubmit={handlePostQuestion} className="bg-slate-950 border border-amber-500/30 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-white text-xs flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              {language === 'id' ? 'Ajukan Pertanyaan Baru ke Pokja' : 'Submit New Inquiry to Buyer'}
            </span>
            <span className="text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded font-mono">
              Direct Notif ke Buyer
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Nama Perusahaan Vendor:</label>
              <input
                type="text"
                value={vendorNameText}
                onChange={(e) => setVendorNameText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Nomor Tender:</label>
              <input
                type="text"
                value={`#${tender.kodeTender}`}
                disabled
                className="w-full bg-slate-900/60 border border-slate-800/80 rounded-xl px-3 py-1.5 text-slate-400 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1">
              {language === 'id' ? 'Isi Pertanyaan / Klarifikasi Spesifikasi:' : 'Inquiry / Technical Clarification:'}
            </label>
            <textarea
              rows={3}
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder={
                language === 'id'
                  ? 'Tuliskan pertanyaan mengenai KAK, BoQ, atau syarat administrasi...'
                  : 'Write your question regarding specs, BoQ, or admin requirements...'
              }
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-slate-950 font-black rounded-xl shadow-lg flex items-center gap-2 cursor-pointer text-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{language === 'id' ? 'Kirim Pertanyaan & Triger Notifikasi Buyer' : 'Submit Question & Trigger Buyer Notif'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Messages Thread List */}
      <div className="space-y-3">
        <h5 className="font-extrabold text-white text-xs flex items-center justify-between">
          <span>{language === 'id' ? 'Daftar Diskusi & Klarifikasi Tender' : 'Discussion & Clarification List'} ({messages.length})</span>
          <span className="text-[10px] text-slate-400 font-normal">Real-time Public Board</span>
        </h5>

        {messages.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-slate-950 rounded-2xl border border-slate-800">
            Belum ada pertanyaan pada forum ini.
          </div>
        ) : (
          messages.map((qa) => (
            <div
              key={qa.id}
              className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 transition-colors hover:border-slate-700"
            >
              {/* Question Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900 pb-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg">
                    <User className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <span className="font-bold text-white text-xs">{qa.senderName}</span>
                    <span className="text-[10px] text-slate-400 block">{qa.askedAt}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  {qa.status === 'answered' ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {language === 'id' ? 'Sudah Dijawab Pokja' : 'Answered by Buyer'}
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-extrabold flex items-center gap-1">
                      <Clock className="w-3 h-3 animate-spin" />
                      {language === 'id' ? 'Menunggu Jawaban Pokja' : 'Pending Buyer Reply'}
                    </span>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <p className="text-slate-200 leading-relaxed font-medium pl-1">
                "{qa.question}"
              </p>

              {/* Answer Box if Answered */}
              {qa.status === 'answered' && qa.answer && (
                <div className="p-3 bg-slate-900/90 border border-sky-500/30 rounded-xl space-y-1.5 ml-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-black text-sky-400 flex items-center gap-1.5">
                      <CornerDownRight className="w-3.5 h-3.5" />
                      {qa.answeredBy || 'Pokja Pemilihan'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{qa.answeredAt}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-xs pl-5">
                    {qa.answer}
                  </p>
                </div>
              )}

              {/* Buyer Answer Form (When Buyer Role Active & Pending Question) */}
              {activeRole === 'buyer' && qa.status === 'pending' && (
                <div className="mt-2 pt-2 border-t border-slate-900 space-y-2 pl-3">
                  <div className="flex items-center gap-1.5 text-sky-400 font-bold text-xs">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{language === 'id' ? 'Tanggapan Resmi Pokja / Buyer:' : 'Official Buyer Response:'}</span>
                  </div>
                  <textarea
                    rows={2}
                    value={answerDrafts[qa.id] || ''}
                    onChange={(e) => setAnswerDrafts({ ...answerDrafts, [qa.id]: e.target.value })}
                    placeholder={
                      language === 'id'
                        ? 'Tuliskan jawaban penjelasan resmi Pokja di sini...'
                        : 'Provide official answer here...'
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-sky-500"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => handlePostAnswer(qa.id)}
                      className="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-lg text-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Send className="w-3 h-3" />
                      <span>{language === 'id' ? 'Publikasikan Jawaban' : 'Publish Answer'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
