import { serverDB } from '@/database/server';
import { NextResponse } from 'next/server';
import { LobeNextAuthDbAdapter } from '@/libs/next-auth/adapter/index';
import type { AdapterUser } from '@auth/core/adapters';

interface HexinProfile {
  attributes?: {
    cn?: string;
    departmentName?: string;
  };
  id: string;
  uid?: string;
}

export const POST = async (req: Request) => {
  try {
    let token: string | null = null;
    const adapter = await LobeNextAuthDbAdapter(serverDB);
    // 添加适配器存在性检查
    if (!adapter?.getUserByEmail || !adapter?.createUser) {
      throw new Error('Auth adapter 初始化失败');
    }
    try {
      const body = await req.json();
      token = body.token;
    } catch {
      const url = new URL(req.url);
      token = url.searchParams.get('token');
    }

    if (!token) {
      return NextResponse.json(
        { error: '缺少 Token 参数', success: false },
        { status: 400 }
      );
    }

    const encodedToken = encodeURIComponent(token);
    const reqUrl = `https://idm.hyhospital.com/api/hy-sso/data/oauth2.0/profile?access_token=${encodedToken}`;

    const apiResponse = await fetch(reqUrl);

    if (!apiResponse.ok) {
      throw new Error(`SSO API 响应异常，状态码：${apiResponse.status}`);
    }

    const data: HexinProfile = await apiResponse.json();
    const userId = data.id || data.uid;
    if (!userId) {
      return NextResponse.json(
        { error: '无效的用户数据', success: false },
        { status: 401 }
      );
    }

    const userEmail = `${userId}@hyhospital.com`;
    const userData = {
      attributes: data.attributes,
      department: data?.attributes?.departmentName || '',
      email: userEmail,
      id: data.id || data.uid,
      name: data?.attributes?.cn || '',
    };

    let user = await adapter.getUserByEmail(userEmail);

    if (!user) {
      try {
        const insertuser: AdapterUser = {
          email: userEmail,
          emailVerified: new Date(),
          id: userId,
          image: '',
          name: userData.name,
        };
        user = await adapter.createUser(insertuser);
      } catch (error) {
        return NextResponse.json(
          { error, success: false },
          { status: 409 }
        );
      }
    }

    return NextResponse.json({
      data: userData,
      success: true,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error
      ? error.message
      : '未知服务器错误';

    console.error('[Hexin 登录失败]', error);

    return NextResponse.json(
      { error: errorMessage, success: false },
      { status: 500 }
    );
  }
};
