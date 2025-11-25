import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectToDatabase();

        // 1. Check if user exists
        const user = await User.findOne({ email: credentials.email }).select("+password");

        if (!user) {
          throw new Error("Invalid email or password");
        }

        // 2. Check password
        const isPasswordMatched = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordMatched) {
          throw new Error("Invalid email or password");
        }

        // 3. CRITICAL: Return the Role here
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role, // <--- This was missing or not being passed correctly
        };
      },
    }),
  ],
  callbacks: {
    // 4. Persist Role to Token
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    // 5. Persist Role to Session (Frontend can see this)
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };