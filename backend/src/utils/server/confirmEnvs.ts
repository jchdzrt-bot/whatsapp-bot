export default function confirmEnvs() {
  const requiredEnvs = {
    PORT: process.env.Port,
    ENVIROMENT: process.env.ENVIROMENT,
    MONGO_USER: encodeURIComponent(process.env.MONGO_USER ?? ""),
    MONGO_PASSWORD: encodeURIComponent(process.env.MONGO_PASSWORD ?? ""),
    MONGO_HOST: process.env.MONGO_HOST,
    MONGO_PORT: process.env.MONGO_PORT,
  }

  const missingEnvs = [];

  for (const [key, value] of Object.entries(requiredEnvs)) {
    if (value === undefined || value.length === 0) {
      const missingEnv = [key, value];
      missingEnvs.push(missingEnv);
    }
  }

  if (missingEnvs.length > 0) {
    console.error("Missing environment variables:");
    
    for (const [key, value] of missingEnvs) {
      console.error(`- ${key} = ${value}`);
    }
  }

  return { ...requiredEnvs };
}