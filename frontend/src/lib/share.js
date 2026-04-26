const FALLBACK_SHARE_BASE_URL = 'https://myapp.com';

const trimTrailingSlash = (value = '') => value.replace(/\/+$/, '');

export const getShareBaseUrl = (baseUrl) => {
  if (baseUrl) {
    return trimTrailingSlash(baseUrl);
  }

  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SHARE_BASE_URL) {
    return trimTrailingSlash(import.meta.env.VITE_SHARE_BASE_URL);
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return trimTrailingSlash(window.location.origin);
  }

  return FALLBACK_SHARE_BASE_URL;
};

export const buildBookShareUrl = (bookId, baseUrl) => {
  const safeBookId = encodeURIComponent(String(bookId ?? 'unknown-book'));
  return `${getShareBaseUrl(baseUrl)}/book/${safeBookId}`;
};

export const buildBookShareText = ({ title, author, match, reason }) => {
  const segments = [
    `Check out "${title}" by ${author} on ReadTogether.`,
    typeof match === 'number' ? `Match: ${match}%.` : null,
    reason ? `Why it was recommended: ${reason}` : null,
  ];

  return segments.filter(Boolean).join(' ');
};

export const getBookSharePayload = (book, baseUrl) => {
  const id = book?.id ?? book?._id;
  const url = buildBookShareUrl(id, baseUrl);
  const text = buildBookShareText(book ?? {});

  return {
    title: `${book?.title ?? 'Book'} | ReadTogether`,
    text,
    url,
  };
};

export const createShareLinks = (payload) => {
  const combinedText = `${payload.text} ${payload.url}`.trim();

  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(combinedText)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(payload.text)}&url=${encodeURIComponent(payload.url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(payload.url)}`,
  };
};

export const supportsNativeShare = () =>
  typeof navigator !== 'undefined' && typeof navigator.share === 'function';

export const copyTextToClipboard = async (text) => {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  if (typeof document === 'undefined') {
    throw new Error('Clipboard not available');
  }

  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.setAttribute('readonly', '');
  textArea.style.position = 'absolute';
  textArea.style.left = '-9999px';

  document.body.appendChild(textArea);
  textArea.select();

  const copied = document.execCommand('copy');
  document.body.removeChild(textArea);

  if (!copied) {
    throw new Error('Copy command failed');
  }
};
