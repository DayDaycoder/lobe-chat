'use client';
import { signIn } from 'next-auth/react';
import { useEffect } from 'react';

const parseCookies = () => {
  if (typeof document === 'undefined') return {};
  const cookies: Record<string, string> = {};
  document.cookie
    .split('; ')
    .filter(item => item.trim() !== '')
    .forEach(item => {
      const [key, value] = item.split('=');
      cookies[key] = decodeURIComponent(value || '');
    });
  return cookies;
};

// 将登录函数提升到组件外部
const loginHexin = async () => {
  const cookieObj = parseCookies();
  console.log('cookieStore', document.cookie);
  
  await signIn('hexin', {
    callbackUrl: '/',
    chatToken: cookieObj.chatToken,
    credentials: 'same-origin',
    redirect: true,
  });
};

const Page = () => {
  useEffect(() => {
    const cookieObj = parseCookies();
    if (cookieObj.chatToken) {
      loginHexin();
    }
  }, []);

  return <div>和信自动登陆中</div>;
};

export default Page;
