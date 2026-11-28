"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaginationMeta } from "@/types/api.types";
import {
    ColumnDef,
    createPaginatedRowModel,
    createSortedRowModel,
    functionalUpdate,
    PaginationState,
    RowData,
    rowPaginationFeature,
    rowSortingFeature,
    sortFn_alphanumeric,
    sortFn_datetime,
    sortFn_text,
    SortingState,
    tableFeatures,
    Updater,
    useTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useSyncExternalStore } from "react";
import DataTableFilters, {
    DataTableFilterConfig,
    DataTableFilterValue,
    DataTableFilterValues,
} from "./DataTableFilters";
import DataTablePagination from "./DataTablePagination";
import DataTableSearch from "./DataTableSearch";

// v9: features are declared once, outside the component, so the reference is stable.
export const dataTableFeatures = tableFeatures({
    rowSortingFeature,
    rowPaginationFeature,
    sortedRowModel: createSortedRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    sortFns: {
        alphanumeric: sortFn_alphanumeric,
        datetime: sortFn_datetime,
        text: sortFn_text,
    },
});

export type DataTableFeatures = typeof dataTableFeatures;

// Use this type in your column files.
export type DataTableColumnDef<TData extends RowData> = ColumnDef<DataTableFeatures, TData>;

// Stable fallback, so a missing `data` prop doesn't create a new array on every render.
// const EMPTY_DATA: never[] = [];

const subscribeToNothing = () => () => { };
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

interface DataTableActions<TData> {
    onView?: (data: TData) => void;
    onEdit?: (data: TData) => void;
    onDelete?: (data: TData) => void;
}

interface DataTableProps<TData extends RowData> {
    data: TData[];
    columns: DataTableColumnDef<TData>[];
    actions?: DataTableActions<TData>;
    toolbarAction?: React.ReactNode;
    emptyMessage?: string;
    isLoading?: boolean;
    sorting?: {
        state: SortingState;
        onSortingChange: (state: SortingState) => void;
    };
    pagination?: {
        state: PaginationState;
        onPaginationChange: (state: PaginationState) => void;
    };
    search?: {
        initialValue?: string;
        placeholder?: string;
        debounceMs?: number;
        onDebouncedChange: (value: string) => void;
    };
    filters?: {
        configs: DataTableFilterConfig[];
        values: DataTableFilterValues;
        onFilterChange: (filterId: string, value: DataTableFilterValue | undefined) => void;
        onClearAll?: () => void;
    };
    meta?: PaginationMeta;
}

const DataTable = <TData extends RowData>({
    data = [] as TData[],
    columns,
    actions,
    toolbarAction,
    emptyMessage,
    isLoading,
    sorting,
    pagination,
    search,
    filters,
    meta,
}: DataTableProps<TData>) => {
    const hasHydrated = useSyncExternalStore(
        subscribeToNothing,
        getClientHydrationSnapshot,
        getServerHydrationSnapshot,
    );

    const showLoadingOverlay = Boolean(isLoading) && hasHydrated;

    const tableColumns: DataTableColumnDef<TData>[] = actions
        ? [
            ...columns,
            // Action column
            {
                id: "actions", // Unique id for the column
                header: "Actions",
                enableSorting: false,
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
        data,
        columns: tableColumns,
        manualSorting: !!sorting,
        manualPagination: !!pagination,
        pageCount: pagination ? Math.max(meta?.totalPages ?? 0, 0) : undefined,
        state: {
            ...(sorting ? { sorting: sorting.state } : {}),
            ...(pagination ? { pagination: pagination.state } : {}),
        },
        // Add the handlers only when controlled. Passing `undefined` would
        // overwrite the table's built-in state updater.
        ...(sorting
            ? {
                onSortingChange: (updater: Updater<SortingState>) =>
                    sorting.onSortingChange(functionalUpdate(updater, sorting.state)),
            }
            : {}),
        ...(pagination
            ? {
                onPaginationChange: (updater: Updater<PaginationState>) =>
                    pagination.onPaginationChange(functionalUpdate(updater, pagination.state)),
            }
            : {}),
    });

    return (
        <div className="relative">
            {showLoadingOverlay && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                        <span className="text-sm text-muted-foreground">Loading...</span>
                    </div>
                </div>
            )}

            {(search || filters || toolbarAction) && (
                <div className="mb-4 flex flex-wrap items-start gap-3">
                    {search && (
                        <DataTableSearch
                            key={search.initialValue ?? ""}
                            initialValue={search.initialValue}
                            placeholder={search.placeholder}
                            debounceMs={search.debounceMs}
                            onDebouncedChange={search.onDebouncedChange}
                            isLoading={isLoading}
                        />
                    )}

                    {filters && (
                        <DataTableFilters
                            filters={filters.configs}
                            values={filters.values}
                            onFilterChange={filters.onFilterChange}
                            onClearAll={filters.onClearAll}
                            isLoading={isLoading}
                        />
                    )}

                    {toolbarAction && (
                        <div className="ml-auto shrink-0">{toolbarAction}</div>
                    )}
                </div>
            )}

            {/* Table */}
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id}>
                                {hg.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : header.column.getCanSort() ? (
                                            <Button
                                                variant={"ghost"}
                                                className="h-auto cursor-pointer p-0 font-semibold hover:bg-transparent hover:text-inherit focus-visible:ring-0"
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                <table.FlexRender header={header} />

                                                {header.column.getIsSorted() === "asc" ? (
                                                    <ArrowUp className="ml-1 h-4 w-4" />
                                                ) : header.column.getIsSorted() === "desc" ? (
                                                    <ArrowDown className="ml-1 h-4 w-4" />
                                                ) : (
                                                    <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
                                                )}
                                            </Button>
                                        ) : (
                                            <table.FlexRender header={header} />
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
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

                {pagination && (
                    <DataTablePagination
                        table={table}
                        totalPages={meta?.totalPages}
                        totalRows={meta?.total}
                        isLoading={isLoading}
                    />
                )}
            </div>
        </div>
    );
};

export default DataTable;
