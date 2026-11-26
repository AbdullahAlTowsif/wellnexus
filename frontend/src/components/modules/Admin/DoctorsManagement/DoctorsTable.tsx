"use client";

import DataTable from "@/components/shared/table/DataTable";
import { getDoctors } from "@/services/doctor.services";
import { IDoctor } from "@/types/doctor.types";
import { useQuery } from "@tanstack/react-query";
import { doctorColumns } from "./doctorsColumns";

const DoctorsTable = () => {
    const { data: doctorDataResponse, isLoading } = useQuery({
        queryKey: ["doctors"],
        queryFn: getDoctors,
    });

    const doctors = doctorDataResponse?.data ?? [];

    const handleView = (doctor: IDoctor) => {
        console.log("View doctor", doctor);
    };

    const handleEdit = (doctor: IDoctor) => {
        console.log("Edit doctor", doctor);
    };

    const handleDelete = (doctor: IDoctor) => {
        console.log("Delete doctor", doctor);
    };

    return (
        <DataTable
            data={doctors}
            columns={doctorColumns}
            isLoading={isLoading}
            emptyMessage="No doctors found."
            actions={{
                onView: handleView,
                onEdit: handleEdit,
                onDelete: handleDelete,
            }}
        />
    );
};

export default DoctorsTable;
