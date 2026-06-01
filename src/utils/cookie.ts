/**
 * 轻量 cookie 读写工具。不依赖第三方库。
 * 仅在浏览器环境工作；SSR/无 document 场景会安静返回。
 */

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const target = `${encodeURIComponent(name)}=`;
  const parts = document.cookie ? document.cookie.split(';') : [];
  for (const raw of parts) {
    const part = raw.trim();
    if (part.startsWith(target)) {
      return decodeURIComponent(part.slice(target.length));
    }
  }
  return null;
}

export interface SetCookieOptions {
  /** 有效期（天）。不传则会话 cookie */
  days?: number;
  path?: string;
  sameSite?: 'Lax' | 'Strict' | 'None';
  secure?: boolean;
}

export function setCookie(
  name: string,
  value: string,
  options: SetCookieOptions = {}
): void {
  if (typeof document === 'undefined') return;
  const { days, path = '/', sameSite = 'Lax', secure } = options;
  let str = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=${path}; SameSite=${sameSite}`;
  if (days != null) {
    const exp = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    str += `; Expires=${exp.toUTCString()}`;
  }
  if (secure || sameSite === 'None') {
    str += '; Secure';
  }
  document.cookie = str;
}

export function deleteCookie(name: string, path = '/'): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${encodeURIComponent(name)}=; Path=${path}; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
