import { authEnv } from '@/config/auth';
import { CommonProviderConfig } from './sso.config';
import type { Provider } from 'next-auth/providers';

// @ts-ignore
const provider = {
  id: 'hy4a',
  provider: {
    ...CommonProviderConfig,
    authorization: {
      // MaxKey 令牌端点
      params: {
        // response_type: "code",
        // redirect_uri: "http://10.111.14.64:3010",/
        // scope: '',
        scope: "", // 按需调整权限范围
        // redirect_uri: "http://10.111.14.64:3010/api/auth/callback/hy4a",
      },
      // url: "https://idmuat.hyhospital.com/sign/authz/oauth/v20/authorize", // 授权端点
      url: `${process.env.AUTH_HY4A_ISSUER}/sign/authz/oauth/v20/authorize`, // 请求的权限范围
    },
    checks: [],
    clientId: authEnv.HY4A_CLIENT_ID ?? process.env.AUTH_HY4A_ID,
    clientSecret: authEnv.HY4A_CLIENT_SECRET ?? process.env.AUTH_HY4A_SECRET,
    id: 'hy4a',
    name: 'Hy4a',
    // issuer: authEnv.HY4A_ISSUER ?? process.env.AUTH_HY4A_ISSUER,
    profile(profile: any) {
      console.log('LobeHy4aProvider profile', profile);
      return {
        email: `${profile.uid}@hyhospital.com`,
        emailVerified: profile.emailVerified ? new Date() : null,
        id: profile.uid,
        image: profile.avatar,
        name: profile.displayName ?? profile.firstName ?? profile.lastName,
        providerAccountId: profile.uid,
      };
    },

    token: {
      // MaxKey 令牌端点
      async request(context: any) {
        // console.log('LobeHy4aProvider request before', context.provider.token);
        // 自定义请求逻辑
        const response = await fetch(context.provider.token.url, {
          body: new URLSearchParams({
            client_id: context.provider.clientId,
            client_secret: context.provider.clientSecret,
            code: context.params.code,
            grant_type: 'authorization_code',
            redirect_uri: context.provider.callbackUrl,
          }),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          method: 'POST',
        });

        const data = await response.json();
        // console.log('LobeHy4aProvider request data', data);
        // 确保 access_token 是字符串
        if (typeof data.access_token !== 'string') {
          throw new Error('Invalid access_token format');
        }

        return {
          tokens: {
            access_token: data.access_token,
            expires_in: data.expires_in,
            refresh_token: data.refresh_token,
          },
        };
      },
      url: `${process.env.AUTH_HY4A_ISSUER}/sign/authz/oauth/v20/token`,
    },

    type: 'oauth',
    userinfo: {
      url: `${process.env.AUTH_HY4A_ISSUER}/sign/api/oauth/v20/me`, // MaxKey 用户信息端点
    },
  } as Provider,
};

// console.log('LobeHy4aProvider', provider);

// 调试信息：打印 issuer URL
// console.log('Issuer URL:', authEnv.HY4A_ISSUER ?? process.env.AUTH_HY4A_ISSUER);

export default provider;
