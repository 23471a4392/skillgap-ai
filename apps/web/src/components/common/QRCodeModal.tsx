import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { useNavigate } from 'react-router-dom';
import {
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  RefreshCw,
  CheckCircle2,
  Sparkles,
  Github,
  Linkedin,
  FileText,
  Clock,
  Wifi,
  ArrowRight,
} from 'lucide-react';
import { Modal } from './Modal';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user, refreshUserData } = useAuth();
  const navigate = useNavigate();

  const [token, setToken] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [fullUrl, setFullUrl] = useState<string>('');
  const [lanIp, setLanIp] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Status: waiting, synced, expired, error
  const [syncStatus, setSyncStatus] = useState<'waiting' | 'synced' | 'expired' | 'error'>('waiting');
  const [syncedDetails, setSyncedDetails] = useState<any>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(600); // 10 minutes default

  const pollIntervalRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);

  // Generate QR Token when modal opens or user requests regenerate
  const generateCode = async () => {
    setLoading(true);
    setSyncStatus('waiting');
    setSyncedDetails(null);
    setSecondsLeft(600);

    try {
      const res = await api.resume.getQrToken();
      const generatedToken = res.token;
      setToken(generatedToken);
      setLanIp(res.lanIp || '');

      // Use the LAN-aware mobileUrl from backend, fallback to window.location
      const targetUrl =
        res.mobileUrl || `${window.location.origin}/mobile-upload/${generatedToken}`;
      setFullUrl(targetUrl);

      // Generate visual QR Code
      const dataUrl = await QRCode.toDataURL(targetUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#B94F38', // Brand Terracotta
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
      });
      setQrDataUrl(dataUrl);

      // Calculate timer if backend returned expiresAt
      if (res.expiresAt) {
        const remaining = Math.max(
          0,
          Math.floor((new Date(res.expiresAt).getTime() - Date.now()) / 1000)
        );
        setSecondsLeft(remaining > 0 ? remaining : 600);
      }
    } catch (err) {
      console.error('Failed to generate QR token:', err);
      setSyncStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // Open modal -> trigger code generation
  useEffect(() => {
    if (isOpen) {
      generateCode();
    } else {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isOpen]);

  // Countdown timer for 10-minute expiry
  useEffect(() => {
    if (!isOpen || syncStatus !== 'waiting') {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    timerIntervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          setSyncStatus('expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isOpen, syncStatus]);

  // Polling for mobile submission
  useEffect(() => {
    if (!token || !isOpen || syncStatus !== 'waiting') return;

    pollIntervalRef.current = setInterval(async () => {
      try {
        const res = await api.resume.getQrStatus(token);

        if (res.status === 'EXPIRED') {
          setSyncStatus('expired');
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          return;
        }

        if (res.completed) {
          setSyncStatus('synced');
          setSyncedDetails(res.data);
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

          // Update desktop user context immediately
          await refreshUserData();
          if (onSuccess) {
            onSuccess();
          }
        }
      } catch (err) {
        // Polling errors handled silently
      }
    }, 1500);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [token, isOpen, syncStatus, refreshUserData, onSuccess]);

  // Copy link helper
  const handleCopyLink = () => {
    if (!fullUrl) return;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Format seconds into MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleContinueToAnalysis = () => {
    onClose();
    navigate('/job-analysis');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Continue from your phone"
      subtitle="Scan this QR code with your phone to continue."
      maxWidth="md"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        {/* State 1: Expired State */}
        {syncStatus === 'expired' ? (
          <div className="w-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
              <Clock className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                This upload session has expired.
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                For security, QR codes expire after 10 minutes. Click below to generate a fresh QR code.
              </p>
            </div>

            <button
              type="button"
              onClick={generateCode}
              className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl shadow-sm transition flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Generate New QR</span>
            </button>
          </div>
        ) : syncStatus === 'synced' ? (
          /* State 2: Synced State */
          <div className="w-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full">
                Phone Sync Detected
              </span>
              <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-1.5">
                Information received from your phone!
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                Your profile has been updated and is ready for Skill Gap Analysis.
              </p>
            </div>

            {syncedDetails && (
              <div className="text-left bg-white dark:bg-zinc-900 p-3.5 rounded-xl border border-emerald-100 dark:border-emerald-900/60 space-y-2 text-xs">
                {syncedDetails.githubUrl && (
                  <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 truncate">
                    <Github className="w-4 h-4 text-zinc-500 shrink-0" />
                    <span className="truncate">{syncedDetails.githubUrl}</span>
                  </div>
                )}
                {syncedDetails.linkedinUrl && (
                  <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 truncate">
                    <Linkedin className="w-4 h-4 text-brand-600 shrink-0" />
                    <span className="truncate">{syncedDetails.linkedinUrl}</span>
                  </div>
                )}
                {syncedDetails.skillsSynced > 0 && (
                  <div className="flex items-center gap-2 text-brand-700 dark:text-brand-400 font-medium">
                    <Sparkles className="w-4 h-4 text-brand-500 shrink-0" />
                    <span>{syncedDetails.skillsSynced} skills extracted & added to your profile</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-3 text-xs font-semibold rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleContinueToAnalysis}
                className="flex-2 py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
              >
                <span>Continue to Job Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* State 3: Active QR Code */
          <>
            {/* QR Card Container */}
            <div className="relative p-4 rounded-2xl bg-white dark:bg-zinc-950 border-2 border-brand-200 dark:border-brand-900/60 shadow-lg group">
              {loading || !qrDataUrl ? (
                <div className="w-64 h-64 flex flex-col items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-full border-2 border-brand-600 border-t-transparent animate-spin" />
                  <span className="text-xs text-zinc-500">Generating secure QR code...</span>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={qrDataUrl}
                    alt="Scan to continue from phone"
                    className="w-64 h-64 rounded-lg mx-auto"
                  />
                  {/* Center Brand Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border-2 border-brand-600 shadow-md flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-brand-600" />
                    </div>
                  </div>
                </div>
              )}

              {/* Live Status and Countdown Pill */}
              <div className="mt-3 flex items-center justify-between text-xs px-2 text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[11px] font-medium">Waiting for phone scan...</span>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-900">
                  <Clock className="w-3 h-3" />
                  <span>Expires in {formatTime(secondsLeft)}</span>
                </div>
              </div>
            </div>

            {/* Network / LAN Helper Callout */}
            <div className="text-left bg-zinc-50 dark:bg-zinc-900 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 w-full space-y-1.5 text-xs">
              <div className="flex items-center justify-between font-medium text-zinc-900 dark:text-zinc-100">
                <span className="flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>How it works:</span>
                </span>
                {lanIp && (
                  <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                    <Wifi className="w-3 h-3 text-emerald-600" />
                    LAN: {lanIp}
                  </span>
                )}
              </div>

              <ol className="list-decimal list-inside space-y-1 text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                <li>Point your phone camera at the QR code above.</li>
                <li>Tap the link to open the mobile upload screen.</li>
                <li>Upload your Resume or enter your GitHub and LinkedIn.</li>
                <li>Once submitted, this desktop screen will update automatically.</li>
              </ol>

              <div className="pt-1 text-[11px] text-zinc-500 border-t border-zinc-200 dark:border-zinc-800">
                <span>⚠️ Note: Phone and computer must be connected to the same Wi-Fi network.</span>
              </div>
            </div>

            {/* Direct Link Controls */}
            <div className="w-full flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied URL!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Mobile Link</span>
                  </>
                )}
              </button>

              <a
                href={fullUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Test in New Tab</span>
              </a>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
