import { betterAuth } from 'better-auth';
import { decodeJwt, SignJWT, importPKCS8 } from 'jose';
import type { JWTHeaderParameters } from 'jose';
import type { MicrosoftEntraIDProfile } from '@better-auth/core/social-providers';

// Entra-specific values
const ENTRA_CLIENT_ID = process.env.ENTRA_CLIENT_ID!;
const ENTRA_TENANT_ID = process.env.ENTRA_TENANT_ID!;
const ENTRA_CERT_THUMBPRINT = process.env.ENTRA_CERT_THUMBPRINT!;

/**
 * Reads the Entra private key only when Microsoft exchanges an authorization
 * code. `auth.ts` is referenced by a server-action manifest for grouping
 * pages, so static imports of Node built-ins here would also be resolved by
 * that browser-oriented compilation.
 */
function getPrivateKeyPem(): string {
    const fs = process.getBuiltinModule('fs');
    const os = process.getBuiltinModule('os');
    const path = process.getBuiltinModule('path');

    if (!fs || !os || !path) {
        throw new Error('The Entra client assertion can only run in the Node.js runtime.');
    }

    const keyPath = path.join(
        os.homedir(),
        `.${os.userInfo().username}-conf`,
        'entra-oidc-uh-groupings-localhost-private-key.pem'
    );

    return fs.readFileSync(keyPath, 'utf8');
}

/**
 * Builds the private_key_jwt client assertion Entra expects.
 *
 * clientId: The Entra app's client ID.
 * tokenEndpoint: The Entra token endpoint URL.
 */
async function entraClientAssertion({
    clientId,
    tokenEndpoint,
}: {
    clientId: string;
    tokenEndpoint: string;
}): Promise<string> {
    const key = await importPKCS8(getPrivateKeyPem(), 'PS256');

    const header: JWTHeaderParameters = {
        alg: 'PS256',
        typ: 'JWT',
        // This login-only value must not be derived while merely resolving
        // an existing session during SSR.
        'x5t#S256': ENTRA_CERT_THUMBPRINT,
    } as JWTHeaderParameters;

    return new SignJWT({})
        .setProtectedHeader(header)
        .setIssuer(clientId)
        .setSubject(clientId)
        .setAudience(tokenEndpoint)
        .setIssuedAt()
        .setExpirationTime('2m')
        .setJti(crypto.randomUUID())
        .sign(key);
}

/**
 * Gets the signed-in person's profile with their delegated Graph token.
 * This deliberately makes one Graph request, to `/me`; it never requests an
 * app-only token or reads another directory user.
 */
async function getMicrosoftUserInfo(tokens: { accessToken?: string; idToken?: string }) {
    if (!tokens.accessToken || !tokens.idToken) {
        return null;
    }

    const res = await fetch(
        'https://graph.microsoft.com/v1.0/me?$select=employeeId,mailNickname,givenName,surname,displayName,mail',
        { headers: { Authorization: `Bearer ${tokens.accessToken}` } }
    );

    if (!res.ok) {
        throw new Error(
            `Graph /me lookup failed: ${res.status} ${await res.text()}`
        );
    }

    const { employeeId, mailNickname, givenName, surname, displayName, mail } =
        (await res.json()) as {
            employeeId: string;
            mailNickname: string;
            givenName?: string;
            surname?: string;
            displayName?: string;
            mail?: string;
        };

    const profile = decodeJwt(tokens.idToken) as MicrosoftEntraIDProfile;

    const email =
        profile.email ??
        mail ??
        profile.preferred_username ??
        `${profile.oid}@no-email.uhgroupings.local`;

    return {
        user: {
            uhUuid: employeeId ?? '',
            uid: mailNickname ?? '',
            firstName: givenName ?? '',
            lastName: surname ?? '',
            email,
            emailVerified: profile.email_verified ?? false,
            name: displayName ?? profile.name ?? '',
        },

        data: profile,
    };
}

export const auth = betterAuth({
    basePath: '/uhgroupings/api/auth',
    baseURL: process.env.BETTER_AUTH_URL, // e.g. http://localhost:8080 locally

    user: {
        additionalFields: {
            uhUuid: { type: 'string' },
            uid: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
        },
    },

    socialProviders: {
        microsoft: {
            clientId: ENTRA_CLIENT_ID,
            tenantId: ENTRA_TENANT_ID,
            clientAssertion: entraClientAssertion,
            getUserInfo: getMicrosoftUserInfo,
        },
    },
});
