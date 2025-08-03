const { default: NextAuth } = require("next-auth");

const handler = NextAuth({});

export { handler as GET, handler as POST };
