import 'server-only';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  parseRequestContextHeaders,
  type WorkspaceRequestContext,
} from '@/lib/auth/requestContext';

export async function getWorkspaceRequestContext(): Promise<WorkspaceRequestContext | null> {
  return parseRequestContextHeaders(await headers());
}

export async function requireWorkspaceRequestContext(
  nextPath: string,
): Promise<WorkspaceRequestContext> {
  const context = await getWorkspaceRequestContext();
  if (!context) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  return context;
}
