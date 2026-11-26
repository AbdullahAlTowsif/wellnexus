"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDoctors } from "@/services/doctor.services";
import { IDoctor } from "@/types/doctor.types";
import { useQuery } from "@tanstack/react-query";
import { tableFeatures, useTable } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";

// No extra table features yet (core row model is built in)
const features = tableFeatures({});

const doctorColumns: Array<ColumnDef<typeof features, IDoctor>> = [
    { accessorKey: "name", header: "Name" },
    // { accessorKey: "specialization", header: "Specialization" },
    { accessorKey: "experience", header: "Experience" },
    // { accessorKey: "rating", header: "Rating" },
];


const DoctorsTable = () => {
    const { data: doctorDataResponse } = useQuery({
        queryKey: ["doctors"],
        queryFn: getDoctors,
    });

    const doctors = doctorDataResponse?.data ?? [];

    const table = useTable({
        key: "doctors-table", // for devtools; safe to omit
        features,
        columns: doctorColumns,
        data: doctors,
    });

    return (
        <Table>
            <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <TableHead key={header.id}>
                                {header.isPlaceholder ? null : (
                                    <table.FlexRender header={header} />
                                )}
                            </TableHead>
                        ))}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                        {row.getAllCells().map((cell) => (
                            <TableCell key={cell.id}>
                                <table.FlexRender cell={cell} />
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default DoctorsTable;
