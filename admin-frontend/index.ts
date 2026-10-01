import axios from "axios";
import setupBusiness from "./setupBusiness/index.js";

// Bootstraps the data needed by the frontend: the business with its location
// and workers. The admin user that can log into the frontend is created
// separately with `npm run create-user` (see createUser.ts).
async function main() {
  await setupBusiness();
}

main().catch((error: unknown) => {
  console.error("\n❌ Setup failed:");
  console.log(error);
  if (axios.isAxiosError(error)) {
    const { method, url } = error.config ?? {};
    console.error(
      `   ${method?.toUpperCase()} ${url} → HTTP ${error.response?.status ?? "n/a"}`,
    );
    console.error(`   Response: ${JSON.stringify(error.response?.data)}`);
  } else {
    console.error(error);
  }

  process.exit(1);
});