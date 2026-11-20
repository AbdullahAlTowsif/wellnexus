import DoctorsList from "@/components/modules/Consultation/DoctorsList";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getDoctors } from "./_actions";

const ConsultationPage = async () => {
    const queryClient = new QueryClient();

    // queryClient.prefetchQuery is deprecated, so we use queryClient.query instead. It will prefetch the data and store it in the cache.
    await queryClient.query({
        queryKey: ["doctors"],
        queryFn: getDoctors,
    });
    return (
        // Neat! Serialization is now as easy as passing props.
        // HydrationBoundary is a Client Component, so hydration will happen there.
        <HydrationBoundary state={dehydrate(queryClient)}>
            <DoctorsList />
        </HydrationBoundary>
    );
}

export default ConsultationPage;


/**
Server (Next.js)
────────────────
1. ConsultationPage runs
2. queryClient.query() → calls getDoctors()
3. API is hit → data stored in cache
4. dehydrate() → convert cache to plain object
5. Send HTML + dehydrated state to browser

Client (Browser)
────────────────
6. HydrationBoundary receives the state
7. Puts data into the client QueryClient
8. DoctorsList mounts
9. useQuery finds the data in cache → instant render

* Prefetch in TanStack Query means fetching data ahead of time and storing it in the cache before the component that needs it actually mounts.The goal is to make the data available instantly when the user needs it, so they don’t see a loading state.
 */
