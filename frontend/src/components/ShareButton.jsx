import React, { useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { copyTextToClipboard, getBookSharePayload, supportsNativeShare } from '../lib/share';

const ShareButton = ({ book }) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (!book || isSharing) {
      return;
    }

    setIsSharing(true);

    try {
      const payload = getBookSharePayload(book);

      if (supportsNativeShare()) {
        await navigator.share(payload);
        return;
      }

      await copyTextToClipboard(payload.url);
      toast.success('Share link copied to clipboard.');
    } catch (error) {
      if (error?.name !== 'AbortError') {
        toast.error('Unable to share this recommendation right now.');
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      disabled={isSharing}
      className="inline-flex min-w-[108px] items-center justify-center rounded-full border border-[rgba(166,186,220,0.16)] bg-[rgba(8,16,32,0.92)] px-4 py-2 text-sm font-semibold text-[#e5ecfb] transition-all hover:border-[rgba(111,144,255,0.28)] hover:text-[#f8fbff] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isSharing ? (
        <>
          <LoaderCircle size={14} className="mr-2 animate-spin" />
          Sharing...
        </>
      ) : (
        'Share'
      )}
    </button>
  );
};

export default ShareButton;
