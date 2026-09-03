export default function simpleErrorHandling(
  message: string,
  error: unknown,
  throwing: boolean = true,
): never | undefined {
  console.error(message);

  if (error instanceof Error) {
    console.error(`- ${error.message}`);
  } else console.error(error);

  if (throwing) throw error;
}
