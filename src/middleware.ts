import { withAuth } from "next-auth/middleware";

// export { default } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      return (
        unAuthenticatedPaths.includes(req.nextUrl.pathname.toLowerCase()) ||
        !!token
      );
    },
  },
  pages: {
    signIn: "/signin",
    newUser: "/auth/new-user",
  },
});

const unAuthenticatedPaths = ["/signin"];
