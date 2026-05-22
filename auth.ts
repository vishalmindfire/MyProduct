import NextAuth, { CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

declare module 'next-auth' {
  interface User {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
  }
  interface Session {
    accessToken: string;
    error?: string;
  }
}


class InvalidCredentials extends CredentialsSignin {
  code = 'invalid_credentials';
}


async function refreshAccessToken(token: any) {
  try {
    const res = await fetch(
      `${process.env.STRAPI_URL}/api/auth/refresh`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: token.refreshToken,
        }),
      }
    );

    const refreshed = await res.json();

    if (!res.ok) {
      throw refreshed;
    }

    return {
      ...token,
      accessToken: refreshed.accessToken,
      accessTokenExpires:
        Date.now() +
        refreshed.expiresIn * 1000,
      refreshToken:
        refreshed.refreshToken ??
        token.refreshToken,
    };
  } catch {
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
  session: {
    strategy: 'jwt',
  },

  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        const res = await fetch(
          `${process.env.STRAPI_URL}/api/auth/local`,
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              identifier:
                credentials.email,
              password:
                credentials.password,
            }),
          }
        );

        const data = await res.json();

        if (!res.ok || !data.jwt) {
          throw new InvalidCredentials(
            data.error?.message ??
              'Invalid credentials'
          );
        }
        
        return {
          id: data.user.id.toString(),
          name: data.user.username,
          email: data.user.email,

          accessToken: data.jwt,

          refreshToken:
            data.refreshToken,

          accessTokenExpires:
            Date.now() + 15 * 60 * 1000,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          accessToken:
            user.accessToken,
          refreshToken:
            user.refreshToken,
          accessTokenExpires:
            user.accessTokenExpires,
        };
      }

      if (
        Date.now() <
        (token.accessTokenExpires as number)
      ) {
        return token;
      }

      return refreshAccessToken(token);
    },

    async session({
      session,
      token,
    }) {
      if (session.user) {
        session.user.id = token.sub!;
      }

      session.accessToken =
        token.accessToken as string;

      session.error =
        token.error as string | undefined;

      return session;
    },
  },
   events: {
    async signOut(message) {
      try {
        const token =
          message.token;

        if (
          token?.refreshToken
        ) {
          await fetch(
            `${process.env.STRAPI_URL}/api/token/revoke`,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body: JSON.stringify({
                refreshToken:
                  token.refreshToken,
              }),
            }
          );
        }
      } catch (error) {
        console.error(
          'Signout revoke failed:',
          error
        );
      }
    },
  },
  pages: {
    signIn: '/login', 
  },

  secret: process.env.AUTH_SECRET,
});