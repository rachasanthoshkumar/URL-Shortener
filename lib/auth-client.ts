import { createAuthClient } from "better-auth/react";

const configuredBaseURL = process.env.NEXT_PUBLIC_APP_URL;
const isLocalBaseURL =
  configuredBaseURL?.includes("localhost") ||
  configuredBaseURL?.includes("127.0.0.1");

export const authClient = createAuthClient(
  configuredBaseURL && !isLocalBaseURL
    ? {
        baseURL: configuredBaseURL,
      }
    : undefined,
);
