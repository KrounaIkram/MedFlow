import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {},
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        if (path.startsWith("/patient") && token?.role !== "PATIENT") return false;
        if (path.startsWith("/doctor")  && token?.role !== "DOCTOR") return false;
        if (path.startsWith("/admin")   && token?.role !== "ADMIN") return false;

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/patient/:path*",
    "/doctor/:path*",
    "/admin/:path*",
  ],
};
