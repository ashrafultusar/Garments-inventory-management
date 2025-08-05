import connectDB from "@/lib/db";
import User from "@/models/User";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "text", placeholder: "enter email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log(credentials);

        await connectDB();
        const user = await User.findOne({ email: credentials.email });


        if (user) {
          return user;
        }

        return null;
      },
    }),
  ],

  pages: {
    SignIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
