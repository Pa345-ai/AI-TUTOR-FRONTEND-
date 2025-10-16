import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Facebook from "next-auth/providers/facebook";

async function upsertUser({ provider, providerAccountId, email, name, accessToken, refreshToken }: { provider: string; providerAccountId: string; email?: string | null; name?: string | null; accessToken?: string; refreshToken?: string }) {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL!;
    const res = await fetch(`${base}/api/auth/link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, providerAccountId, email, name, accessToken, refreshToken }),
    });
    if (!res.ok) {
      // If conflict: single account per email enforced server-side, surface error to stop sign-in
      const text = await res.text().catch(()=> '');
      throw new Error(text || `link error ${res.status}`);
    }
    const data = await res.json().catch(()=> ({}));
    return data;
  } catch (e) {
    console.error('upsertUser error', e);
    throw e;
  }
}

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHub({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Server-side link/create with Supabase backend
      try {
        await upsertUser({ provider: account?.provider || 'unknown', providerAccountId: account?.providerAccountId || '', email: user?.email || null, name: user?.name || null, accessToken: (account as any)?.access_token, refreshToken: (account as any)?.refresh_token });
        return true;
      } catch {
        return false; // block sign-in if linking fails (e.g., duplicate email with different provider)
      }
    },
    async session({ session, token }) {
      if (token?.sub) (session as any).userId = token.sub;
      // never expose provider tokens client-side
      if ((session as any).accessToken) delete (session as any).accessToken;
      if ((session as any).refreshToken) delete (session as any).refreshToken;
      if ((token as any)?.role) (session as any).role = (token as any).role;
      return session;
    },
    async jwt({ token, account: _account, user }) {
      try {
        const base = process.env.NEXT_PUBLIC_BASE_URL!;
        // After sign-in, ensure role is fetched/attached; refresh periodically otherwise
        const email = (token as any).email || user?.email;
        if (email) {
          const url = new URL(`${base}/api/auth/role`);
          url.searchParams.set('email', String(email));
          const r = await fetch(url.toString());
          if (r.ok) {
            const d = await r.json();
            (token as any).role = d.role || (token as any).role || 'student';
          }
        }
      } catch {}
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret",
});

export { handler as GET, handler as POST };
