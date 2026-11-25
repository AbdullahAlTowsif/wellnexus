import AdminDashboardContent from "@/components/modules/Dashboard/AdminDashboardContent";
import { getDashboardData } from "@/services/dashboard.services";
import { ApiResponse } from "@/types/api.types";
import { IAdminDashboardData } from "@/types/dashboard.types";
import { connection } from "next/server";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

/**
 * How React Query handles stale data (staleTime: 5s):
 * 1. Data enters cache at time 0s -> marked as "fresh"
 * 2. Until 5s passes -> data is considered fresh (stale = false)
 * 3. You switch tabs at 3s and return at 4s -> data is still fresh, no refetch
 * 4. You switch tabs at 3s and returns at 6s -> data is stale, refetch occurs
 */

const AdminDashboardPage = async () => {
  await connection();

  const queryClient = new QueryClient();

  await queryClient.query({
    queryKey: ["admin-dashboard-data"],
    queryFn: getDashboardData,
    staleTime: 30 * 1000, // 30 seconds - data stays fresh if this data is accessed again within 30 seconds, it will use the cached data instead of making a new request
    gcTime: 5 * 60 * 1000, // 5 minutes - garbage collection time, after this time the cached data will be removed from memory if it's not used
  });


  const dashboardData = queryClient.getQueryData(["admin-dashboard-data"]) as ApiResponse<IAdminDashboardData>;

  console.log(dashboardData.data, "Dashboard Data from Page Component");

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminDashboardContent />
    </HydrationBoundary>
  )
}

export default AdminDashboardPage;

/**
 * 1. Dashboard Data Interface
 * 2. Server action (Axios Data Fetching)
 * 3. Server Action Call in Page File using TanStack Query Prefetching
 * 4. Passing the data as props to the client component
 * 5. Using the micro components in the client component to display the data
 */
