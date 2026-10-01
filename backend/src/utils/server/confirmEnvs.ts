export default function confirmEnvs() {
  const requiredEnvs = {
    PORT: process.env.PORT,
    ENVIRONMENT: process.env.ENVIRONMENT,
    MONGO_USER: encodeURIComponent(process.env.MONGO_USER ?? ""),
    MONGO_PASSWORD: encodeURIComponent(process.env.MONGO_PASSWORD ?? ""),
    MONGO_HOST: process.env.MONGO_HOST,
    MONGO_DB: process.env.MONGO_DB,
    X_API_KEY: process.env.X_API_KEY,

    // Auth
    JWT_SECRET: process.env.JWT_SECRET,
    SALT_ROUNDS: process.env.SALT_ROUNDS,
  };

  const missingEnvs: Array<[string, string | undefined]> = [];

  for (const [key, value] of Object.entries(requiredEnvs)) {
    if (value === undefined || value.length === 0) {
      missingEnvs.push([key, value]);
    }
  }

  if (missingEnvs.length > 0) {
    const missingEnvList = missingEnvs.map(([key]) => `- ${key}`).join("\n");

    // Fail fast instead of booting a broken server (e.g. jsonwebtoken signing
    // with an empty secret, or a malformed Mongo connection string) that would
    // only surface cryptic errors on the first request.
    throw new Error(`Missing environment variables:\n${missingEnvList}`);
  }

  return { ...requiredEnvs };
}