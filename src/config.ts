/** Runtime configuration, overridable via environment variables. */
export const config = {
  port: Number(process.env.PORT) || 3000,
  /** Max upload size in bytes (default 15 MB). */
  maxUploadBytes: Number(process.env.MAX_UPLOAD_BYTES) || 15 * 1024 * 1024,
  /** HTTP Basic Auth credentials guarding the API. Override via env in production. */
  auth: {
    username: process.env.BASIC_AUTH_USER || 'vnsport',
    password: process.env.BASIC_AUTH_PASSWORD || '0VVoOtTnhqEvQn0f3VyelKyx',
  },
};
