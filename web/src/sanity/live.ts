import { createClient } from "next-sanity";
import { defineLive, type DefinedFetchType } from "next-sanity/live";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "kqneikcb";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

type FetchFn = <T = unknown>(opts: { query: string; params?: Record<string, unknown> }) => Promise<{ data: T; sourceMap: unknown; tags: string[] }>;

const noopFetch: FetchFn = async <T = unknown>(_opts: { query: string; params?: Record<string, unknown> }): Promise<{ data: T; sourceMap: unknown; tags: string[] }> => {
  return { data: [] as unknown as T, sourceMap: null, tags: [] };
};

const token = process.env.SANITY_API_READ_TOKEN;

const standardClient = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: "2025-01-01",
      useCdn: false,
      perspective: "published",
      stega: {
        studioUrl: "/admin",
      },
    })
  : null;

export type SanityFetchFn = <T = any>(opts: {
  query: string;
  params?: Record<string, unknown>;
}) => Promise<{ data: T; sourceMap: unknown; tags: string[] }>;

const liveInstance = (projectId && token)
  ? defineLive({
      client: createClient({
        projectId,
        dataset,
        apiVersion: "2025-01-01",
        useCdn: false,
        perspective: "previewDrafts",
        token: token,
        stega: { enabled: true, studioUrl: "/admin" },
      }),
      serverToken: token,
      browserToken: process.env.NEXT_PUBLIC_SANITY_API_READ_TOKEN,
    })
  : null;

export const sanityFetch: SanityFetchFn = async <T = any>({
  query,
  params,
}: {
  query: string;
  params?: Record<string, unknown>;
}): Promise<{ data: T; sourceMap: unknown; tags: string[] }> => {
  if (liveInstance) {
    return (liveInstance.sanityFetch as any)({ query, params });
  }
  if (!standardClient) {
    return { data: [] as unknown as T, sourceMap: null, tags: [] };
  }
  const data = await standardClient.fetch(query, params || {});
  return { data, sourceMap: null, tags: [] };
};