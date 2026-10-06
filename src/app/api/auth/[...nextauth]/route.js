import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

const rawGoogleId = process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID;
const rawGoogleSecret = process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET;

const googleClientId = rawGoogleId ? rawGoogleId.trim().replace(/^["']|["']$/g, "") : "";
const googleClientSecret = rawGoogleSecret ? rawGoogleSecret.trim().replace(/^["']|["']$/g, "") : "";

const providers = [
  Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
      isGoogleDemo: { label: "GoogleDemo", type: "text" },
    },
    authorize: async (credentials) => {
      // If triggered as Google Demo login
      if (credentials?.isGoogleDemo === "true" || credentials?.email === "google.demo@ticketbari.com") {
        return {
          id: "u-google-demo",
          name: "Google Explorer",
          email: "google.demo@ticketbari.com",
          role: "user",
          image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
        };
      }

      if (!credentials?.email || !credentials?.password) return null;

      const email = String(credentials.email).toLowerCase();
      const demoUsers = {
        "admin@ticketbari.com": {
          id: "u-admin",
          name: "System Admin",
          email: "admin@ticketbari.com",
          role: "admin",
          image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
        },
        "vendor@ticketbari.com": {
          id: "u-vendor",
          name: "Green Line Paribahan",
          email: "vendor@ticketbari.com",
          role: "vendor",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        },
        "user@ticketbari.com": {
          id: "u-user",
          name: "Tanvir Ahmed",
          email: "user@ticketbari.com",
          role: "user",
          image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop",
        },
      };

      const demo = demoUsers[email];
      if (demo) {
        return demo;
      }

      // Try backend login
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });
        const data = await res.json();
        if (res.ok && data?.user) {
          return {
            ...data.user,
            accessToken: data.token,
          };
        }
      } catch {
        // Fallback user if backend is offline
        return {
          id: "user-" + Date.now(),
          name: email.split("@")[0],
          email: credentials.email,
          role: "user",
        };
      }

      return null;
    },
  }),
];

// Add Google OAuth provider if configured in .env.local
if (googleClientId && googleClientSecret) {
  providers.push(
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

const config = {
  providers,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account && account.provider === "google") {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data?.user) {
              user.id = data.user.id || data.user._id;
              user.role = data.user.role || "user";
              user.accessToken = data.token;
            }
          }
        } catch (err) {
          console.warn("Backend google sync error:", err.message);
        }
      }
      return true;
    },
    jwt({ token, user, account }) {
      if (user) {
        token.id = user.id || token.sub;
        token.role = user.role || "user";
        token.accessToken = user.accessToken || "mock_token_" + (user.id || token.sub);
      }
      if (account && account.provider === "google") {
        if (!token.role) token.role = "user";
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role || "user";
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "ticketbari_nextauth_secret_key_2026",
  pages: {
    signIn: "/login",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
export const { GET, POST } = handlers;
