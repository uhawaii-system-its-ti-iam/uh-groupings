import { loadUser } from '@/lib/access/user';
import { ValidatorProtocol } from 'next-cas-client';
import { handleAuth } from 'next-cas-client/app';
import { NextRequest } from 'next/server';

const authHandler = handleAuth({ loadUser, validator: ValidatorProtocol.SAML11 });

export const GET = async (
    request: NextRequest,
    { params }: { params: Promise<{ client: string }> }
) => {
    const { client } = await params;
    return authHandler(request, { params: { client: client as 'login' | 'logout' } });
};
