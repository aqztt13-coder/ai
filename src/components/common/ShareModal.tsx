import React, { useState } from 'react';
import { X, Check, Copy, MessageCircle, Send, Share2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url?: string;
  text?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title,
  url = window.location.href,
  text = ''
}) => {
  const { language } = useApp();
  const isAr = language === 'ar';
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${title} - ${text}`);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${title}\n${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      link: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'bg-sky-500 hover:bg-sky-600 text-white',
      link: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`
    },
    {
      name: 'X (Twitter)',
      icon: Share2,
      color: 'bg-stone-900 hover:bg-stone-800 text-white',
      link: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
    },
    {
      name: 'Facebook',
      icon: Share2,
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-stone-900 text-base">
              {isAr ? 'مشاركة هذا المعلم' : 'Share Place'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="mt-3 text-stone-600 text-xs sm:text-sm line-clamp-2 font-medium">
          {title}
        </p>

        {/* Share buttons grid */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          {shareOptions.map(option => (
            <a
              key={option.name}
              href={option.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold shadow-sm transition ${option.color}`}
            >
              <option.icon className="w-4 h-4" />
              <span>{option.name}</span>
            </a>
          ))}
        </div>

        {/* Copy Link Bar */}
        <div className="mt-5 pt-4 border-t border-stone-100">
          <label className="block text-xs font-medium text-stone-500 mb-1.5">
            {isAr ? 'رابط الصفحة المباشر' : 'Direct Link'}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={url}
              className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-600 select-all"
            />
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ الرابط' : 'Copy')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
