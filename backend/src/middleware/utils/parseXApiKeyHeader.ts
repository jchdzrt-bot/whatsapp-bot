import { type IncomingHttpHeaders } from "http";

export default function parseXApiKeyHeader(headers: IncomingHttpHeaders) {
  return {
    xApiKey: (headers["x-api-key"] as string) ?? "",
  };
}