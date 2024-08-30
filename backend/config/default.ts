import helmet from "helmet";

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:8080",
  "https://raffle-zeta-eight.vercel.app",
  "https://raffle-mu.vercel.app",
];

export default {
  port: 8000,
  dbUri: "localhost:27017/",
  baseRoute: "/api",
  logLevel: "debug",
  accessTokenTtl: "15m",
  refreshTokenTtl: "7d",
  accessTokenPrivateKey: "",
  refreshTokenPrivateKey: "",
  uiBaseUrl: "http://localhost:3000",
  smtp: {
    user: "hftwu44la5m4ux7g@ethereal.email",
    pass: "xbXyhfPwyd3RXGdwN3",
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
  },
  allowedOrigins,
  cookieDomain: "localhost",
  helmetConfig: {
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", "'unsafe-inline'"],
      },
    },
  },
  corsConfig: {
    origin: allowedOrigins,
    optionsSuccessStatus: 200,
    credentials: true,
  },
  rateLimitConfig: {
    windowMs: 15 * 60 * 1000,
    max: 100,
  },
};
