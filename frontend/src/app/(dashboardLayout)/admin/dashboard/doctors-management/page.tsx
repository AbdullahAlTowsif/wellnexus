import DoctorsTable from "@/components/modules/Admin/DoctorsManagement/DoctorsTable";
import { getDoctors } from "@/services/doctor.services";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { connection } from "next/server";

const DoctorsManagementPage = async () => {
    await connection();
    const queryClient = new QueryClient();

    await queryClient.query({
        queryKey: ["doctors"],
        queryFn: getDoctors,
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 6, // 1 hour
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <DoctorsTable />
        </HydrationBoundary>
    );
}

export default DoctorsManagementPage;
