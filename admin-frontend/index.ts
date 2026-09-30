import axios from "axios";
import setupBusiness from "./setupBusiness/index.js";
import createUser from "./createUser.ts/index.js";

// Bootstraps the data needed by the frontend: the business (with its location
// and workers) and a user that can log into the frontend, linked to the
// business.
async function main() {
  await setupBusiness();
  await createUser();
}

main().catch((error: unknown) => {
  console.error("\n❌ Setup failed:");

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