import { sign } from 'jsonwebtoken';
import { getUser } from './access/user';

const JWT_SECRET = process.env.JWT_SECRET_KEY as string;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION_SECONDS as string;

/**
 * Decodes the BASE64-encoded JWT secret.
 * @returns Buffer containing the decoded secret key
 */
const getSecretKeyBuffer = (): Buffer => {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET_KEY environment variable is not set');
    }
    // Decode BASE64 secret
    return Buffer.from(JWT_SECRET, 'base64');
};

/**
 * Generates a fresh JWT token for the current user.
 *
 * @param user - The authenticated user object containing uid and roles
 * @returns A signed JWT token string with expiration based on environment variable
 * @throws Error if JWT_SECRET or JWT_EXPIRATION_SECONDS environment variable is not set
 */
export const generateJWT = async (): Promise<string> => {

    const user = await getUser();

    const secretBuffer = getSecretKeyBuffer();

    if (!JWT_EXPIRATION) {
        throw new Error('JWT_EXPIRATION_SECONDS environment variable is not set');
    }
    const expirationSeconds = parseInt(JWT_EXPIRATION, 10);

    const payload = {
        sub: user.uid,
        roles: user.roles,
    };

    return sign(payload, secretBuffer, {
        algorithm: 'HS256',
        expiresIn: expirationSeconds
    });
};

