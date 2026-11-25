# TanStack Query: `staleTime` & Next.js Experimental Streaming Guide

A complete reference covering how `staleTime` works under the hood and how to migrate from manual Server Component prefetching to experimental streaming without prefetching in Next.js App Router.

---

## 1. Understanding `staleTime`

`staleTime` defines how long cached data is considered **fresh** (in milliseconds) before TanStack Query marks it as **stale**.

### Key Rules
* **During `staleTime`:** Data is **fresh** (not stale). TanStack Query reads directly from the cache without making a network request.
* **After `staleTime` expires:** Data becomes **stale**, but **no network request fires automatically on a timer**.
* **When refetching actually happens:** TanStack Query refetches stale data in the background only when a **trigger event** occurs (component remount, window focus, network reconnect, or query key change). While refetching, the cached data remains visible so the UI does not flash a loading spinner.
* **Automatic polling:** If you want automatic timer-based fetching regardless of user activity, use `refetchInterval` instead of `staleTime`.
* **Using `initialData`:** If seeding the cache with pre-existing `initialData`, also pass `initialDataUpdatedAt` so TanStack Query knows when the `staleTime` countdown started.

### Analogy & Timeline (`staleTime: 60 * 1000`)
Think of `staleTime` like an expiration date on a carton of milk: while fresh, you drink from the fridge; once expired, you don't run to the store the exact second—you buy more the next time you open the fridge.

```tsx
const { data } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  staleTime: 60 * 1000, // 1 minute
})
```

1. **10:00:00 AM (Initial Mount):** Fetches `['Buy milk']`, stores in cache, and marks it **FRESH** until `10:01:00 AM`.
2. **10:00:30 AM (Navigate Away & Back):** Only 30s elapsed. Data is still **FRESH** $\rightarrow$ served from cache with zero network requests.
3. **10:01:00 AM (Timer Expires):** Data becomes **STALE**. Nothing happens yet on screen.
4. **10:01:15 AM (Window Refocus / Trigger Event):** TanStack Query sees the data is **STALE**, keeps displaying `['Buy milk']` while fetching in the background, and seamlessly swaps in `['Buy milk', 'Walk dog']` once resolved.

---

## 2. Experimental Streaming Without Prefetching in Next.js

Standard Next.js SSR with TanStack Query requires creating a `QueryClient` in a Server Component, awaiting a prefetch, dehydrating state, and wrapping children in `<HydrationBoundary>`.

With `@tanstack/react-query-next-experimental` (`ReactQueryStreamedHydration`), you can skip server-side prefetch boilerplate and call `useSuspenseQuery` directly inside Client Components.

### Step 1: Configure Providers (`app/providers.tsx`)

Wrap your app with `ReactQueryStreamedHydration` inside `QueryClientProvider`. Set `staleTime > 0` so the browser does not immediately refetch data that was just streamed from the server.

```tsx
'use client'

import { QueryClient, QueryClientProvider, environmentManager } from '@tanstack/react-query'
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental'
import * as React from 'react'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Prevent immediate client refetch right after SSR hydration
        staleTime: 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (environmentManager.isServer()) {
    return makeQueryClient()
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>
        {children}
      </ReactQueryStreamedHydration>
    </QueryClientProvider>
  )
}
```

### Step 2: Before vs. After (Doctors Consultation Example)

#### Server Action (`_actions.ts`)
> **Note:** Ensure your server action returns plain serializable JSON data (e.g., `res.data`) rather than a full Axios response instance with non-serializable headers/methods.

```tsx
"use server";

import { httpClient } from "@/lib/axios/httpClient";

export const getDoctors = async () => {
  const doctors = await httpClient.get('/doctors');
  return doctors; // Ensure returned payload is plain serializable data
};
```

#### Page Component (`ConsultationPage`)

**Before (Manual Prefetch + `HydrationBoundary`):**
```tsx
import DoctorsList from "@/components/modules/Consultation/DoctorsList";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getDoctors } from "./_actions";

const ConsultationPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["doctors"],
    queryFn: getDoctors,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DoctorsList />
    </HydrationBoundary>
  );
};

export default ConsultationPage;
```

**After (Experimental Streaming with `<Suspense>`):**
```tsx
import { Suspense } from "react";
import DoctorsList from "@/components/modules/Consultation/DoctorsList";

const ConsultationPage = () => {
  return (
    <Suspense fallback={<div>Loading doctors...</div>}>
      <DoctorsList />
    </Suspense>
  );
};

export default ConsultationPage;
```

#### Client Component (`DoctorsList.tsx`)

**Before (`useQuery`):**
```tsx
"use client";
import { getDoctors } from "@/app/(commonLayout)/consultation/_actions";
import { useQuery } from "@tanstack/react-query";

const DoctorsList = () => {
  const { data } = useQuery({
    queryKey: ["doctors"],
    queryFn: () => getDoctors(),
  });

  return (
    <div>
      {data.data.map((doctor: any) => (
        <div key={doctor.id}>{doctor.name}</div>
      ))}
    </div>
  );
};

export default DoctorsList;
```

**After (`useSuspenseQuery`):**
```tsx
"use client";
import { getDoctors } from "@/app/(commonLayout)/consultation/_actions";
import { useSuspenseQuery } from "@tanstack/react-query";

const DoctorsList = () => {
  const { data } = useSuspenseQuery({
    queryKey: ["doctors"],
    queryFn: () => getDoctors(),
  });

  return (
    <div>
      {data.data.map((doctor: any) => (
        <div key={doctor.id}>{doctor.name}</div>
      ))}
    </div>
  );
};

export default DoctorsList;
```

---

## 3. Architectural Comparison & Trade-offs

| Feature | Manual Prefetch + `HydrationBoundary` | Experimental Streaming (`useSuspenseQuery`) |
| :--- | :--- | :--- |
| **Initial SSR Fetch Location** | Server Component (`ConsultationPage`) before rendering children | Client Component (`DoctorsList`) executed on the server during SSR |
| **Boilerplate Required** | `QueryClient`, `prefetchQuery`, `dehydrate`, `<HydrationBoundary>` | `<Suspense>` boundary + `ReactQueryStreamedHydration` in root providers |
| **Hook Used** | `useQuery` or `useSuspenseQuery` | `useSuspenseQuery` (or `useSuspenseQueries` / `useSuspenseInfiniteQuery`) |
| **Client-Side Navigation** | Avoids request waterfalls by prefetching at the route level | Can cause sequential waterfalls on client navigation (JS bundle downloads $\rightarrow$ data fetch $\rightarrow$ child renders) |

### How Streaming Works Under the Hood
1. **Immediate Shell:** Next.js sends static markup and the `<Suspense>` fallback immediately, protecting Time to First Byte (TTFB).
2. **Server Execution & Stream:** `useSuspenseQuery` runs `getDoctors` on the server. Once resolved, `ReactQueryStreamedHydration` streams the data into the HTML response and swaps out the fallback.
3. **Cache Hand-off:** Because `staleTime` is configured (`60 * 1000`), the browser adopts the streamed result as fresh without firing a duplicate fetch.