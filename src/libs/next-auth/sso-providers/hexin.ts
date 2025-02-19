import { authEnv } from '@/config/auth';
import { CommonProviderConfig } from './sso.config';
import CredentialsProvider from "next-auth/providers/credentials";
// @ts-ignore
const provider = {
  id: 'hexin',
  provider: CredentialsProvider({
    ...CommonProviderConfig,
    // 不需要前端提交凭证
    async authorize(_: any, req: any) {
      // console.log('req.cookies', req.cookies)

      console.log('authorize _ and req', _, req);
      try {
        console.log('url', authEnv, `${authEnv.APP_URL}/api/hexin/login`);

        // 调用内部接口
        const response = await fetch(`${authEnv.APP_URL}/api/hexin/login`, {
          body: JSON.stringify({
            // token: credentials.token
            token: _.chatToken
            // token: 'AAECAzY3QjNFQ0FCNjdCNDk1NkJmZW5ncXg3cU2ik2w+P3zQBKK2NiP1H65unwQ'
          }),
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST'
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }

        const resdata = await response.json();
        console.log(resdata);

        return resdata.data;
      } catch (error) {
        console.error('[NextAuth] Hexin 登录失败', error);
        return null;
      }
    },

    credentials: {},
    id: 'hexin',
    name: 'Hexin',
    type: 'credentials',
  }),
};

// console.log('LobeHy4aProvider', provider);

// 调试信息：打印 issuer URL
// console.log('Issuer URL:', authEnv.HY4A_ISSUER ?? process.env.AUTH_HY4A_ISSUER);

export default provider;
