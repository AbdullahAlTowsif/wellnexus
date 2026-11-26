import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { tableFeatures, useTable } from "@tanstack/react-table";
import type { ColumnDef, RowData } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

// No extra table features yet (core row model is built in).
// Exported so consumers can type their column definitions against it.
export const dataTableFeatures = tableFeatures({});
export type DataTableFeatures = typeof dataTableFeatures;

// Convenience alias so callers can write DataTableColumnDef<IDoctor>[]
export type DataTableColumnDef<TData extends RowData> = ColumnDef<DataTableFeatures, TData>;

interface DataTableActions<TData> {
    onView?: (data: TData) => void;
    onEdit?: (data: TData) => void;
    onDelete?: (data: TData) => void;
}

interface DataTableProps<TData extends RowData> {
    data: TData[];
    columns: DataTableColumnDef<TData>[];
    actions?: DataTableActions<TData>;
    emptyMessage?: string;
    isLoading?: boolean;
}

const DataTable = <TData extends RowData>({ data, columns, actions, emptyMessage, isLoading }: DataTableProps<TData>) => {
    const tableColumns: DataTableColumnDef<TData>[] = actions
        ? [
            ...columns,

            // Action column
            {
                id: "actions", // Unique id for the column
                header: "Actions",
                cell: ({ row }) => {
                    const rowData = row.original;

                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                render={
                                    <Button variant={"ghost"} className="h-8 w-8 p-0">
                                        <span className="sr-only">Open Menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                }
                            />

                            <DropdownMenuContent align="end">
                                {actions.onView && (
                                    <DropdownMenuItem onClick={() => actions.onView?.(rowData)}>
                                        View
                                    </DropdownMenuItem>
                                )}

                                {actions.onEdit && (
                                    <DropdownMenuItem onClick={() => actions.onEdit?.(rowData)}>
                                        Edit
                                    </DropdownMenuItem>
                                )}

                                {actions.onDelete && (
                                    <DropdownMenuItem onClick={() => actions.onDelete?.(rowData)}>
                                        Delete
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            },
        ]
        : columns;

    const table = useTable({
        features: dataTableFeatures,
        columns: tableColumns,
        data,
    });

    const rows = table.getRowModel().rows;

    return (
        <div className="relative">
            {isLoading && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                        <span className="text-sm text-muted-foreground">Loading...</span>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="rounded-lg border">
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
                        {rows.length ? (
                            rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getAllCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            <table.FlexRender cell={cell} />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={tableColumns.length} className="h-24 text-center">
                                    {emptyMessage || "No data available."}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default DataTable;
