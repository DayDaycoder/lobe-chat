'use client';

import { signIn } from 'next-auth/react';
import { useEffect } from 'react';

const parseCookies = () => {
  if (typeof document === 'undefined') return {};
  const cookies: Record<string, string> = {};
  document.cookie
    .split('; ')
    .filter((item) => item.trim() !== '')
    .forEach((item) => {
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

// 将登录函数提升到组件外部
const loginHy4a = async () => {
  // const cookieObj = parseCookies();
  // console.log('cookieStore', document.cookie);

  await signIn('hy4a', {
    callbackUrl: '/',
    // chatToken: cookieObj.chatToken,
    // credentials: 'same-origin',
    redirect: true,
  });
};

const Page = () => {
  useEffect(() => {
    const cookieObj = parseCookies();
    
    if (cookieObj.chatToken) {
      loginHexin();
    } else {
      loginHy4a();
    }
  }, []);
  return (
    <div
      style={{
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        display: 'flex',
        height: '100vh',
        justifyContent: 'center',
        overflow: 'hidden',
        width: '100vw',
      }}
    >
      <h1 style={{ fontSize: '2rem' }}>自动登陆中...</h1>
    </div>
  );
};

export default Page;
