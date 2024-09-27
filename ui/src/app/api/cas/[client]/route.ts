import { loadUser } from '@/lib/access/user';
import { ValidatorProtocol } from 'next-cas-client';
import { handleAuth } from 'next-cas-client/app';

export const GET = handleAuth({ loadUser, validator: ValidatorProtocol.SAML11 });
