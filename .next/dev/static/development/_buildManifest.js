self.__BUILD_MANIFEST = {
  "/doctor/dashboard": [
    "static/chunks/pages/doctor/dashboard.js"
  ],
  "/login": [
    "static/chunks/pages/login.js"
  ],
  "/patient": [
    "static/chunks/pages/patient.js"
  ],
  "__rewrites": {
    "afterFiles": [],
    "beforeFiles": [],
    "fallback": []
  },
  "sortedPages": [
    "/_app",
    "/_error",
    "/api/admin/stats",
    "/api/appointments",
    "/api/appointments/[id]",
    "/api/auth/register",
    "/api/auth/[...nextauth]",
    "/api/consultations",
    "/api/consultations/[id]",
    "/api/invoices",
    "/api/invoices/[id]",
    "/api/patients",
    "/api/patients/[id]",
    "/api/payments/checkout",
    "/api/payments/history",
    "/api/payments/webhook",
    "/api/prescriptions",
    "/api/prescriptions/download/[id]",
    "/api/prescriptions/[id]",
    "/api/prescriptions/[id]/pdf",
    "/api/users",
    "/api/users/doctors",
    "/doctor/dashboard",
    "/login",
    "/patient",
    "/register"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()