import React from "react";
import { Room, RoomType, type BreadcrumbItem } from "@/types";
import AppLayout from "@/layouts/app-layout";
import { Head, router, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { BedDouble, CornerDownRight, List } from 'lucide-react';
import { ColumnDef, ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState, } from "@tanstack/react-table"
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import TableToolbar from '@/components/table/TableToolbar';
import CreateRoomDialog from "./Components/CreateRoomDialog";
import RoomTable from "@/components/table/RoomTable";
import { getRoomColumns } from "./Components/roomColumns";
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern";
import Heading from "@/components/heading";


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Rooms",
        href: "/rooms",
    },
];

type Props = {
    rooms: Room[];
    allRooms: Room[];
    roomTypes:RoomType[];
    /** list of column keys or IDs you want visible (e.g. ['id','name']) */
    columnsToShow?: Array<string>
};


const RoomIndex = ({allRooms, rooms, roomTypes,columnsToShow, }: Props) => {

    const { delete: destroy, processing } = useForm();
    const handleDelete = (id: number) => {
        destroy(route('rooms.destroy', id), {
            onSuccess: () => {
                toast.success("Row deleted successfully!");
            },
            onError: () => {
                toast.error("Failed to delete row.");
            }
        });
    };

    const fullColumns = getRoomColumns({allRooms, roomTypes, rooms, handleDelete })

    const columns: ColumnDef<Room>[] = columnsToShow
        ? fullColumns.filter(col => {
            // check accessorKey or explicit id
            const key = (col as any).accessorKey ?? col.id
            return key && columnsToShow.includes(key.toString())
        })
        : fullColumns
        
    const [sorting, setSorting] = React.useState<SortingState>([{ id: "id", desc: false }])
    const [pagination, setPagination] = React.useState({pageIndex: 0,pageSize: 100,});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [globalFilter, setGlobalFilter] = React.useState("");
    const table = useReactTable({
        data: rooms,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,

        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
            globalFilter,
        },

        onGlobalFilterChange: setGlobalFilter,

        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });


    const handleDeleteSelected = () => {
        const selectedIds = table.getSelectedRowModel().rows.map(row => row.original.id);

        if (selectedIds.length === 0) {
            alert("No items selected.");
            return;
        }

        router.post(route("rooms.bulkDelete"), {
        ids: selectedIds,
        });

        toast.success("Selected Rows Deleted Succesfully!");
    };

    return (
        <div className="container">
            <Head title="Rooms" />
            <Toaster position="top-center" />

            <Heading title="Room Management" description="Create new rooms, view details, and update existing records with ease." icon={BedDouble} />

            <div className='relative border-y py-2 my-4'>
                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />        
            </div>

            <div className="flex items-center justify-between px-4 mb-4">
                <div className="flex items-center gap-2">
                    <List className="text-muted-foreground" size={18} />
                    <h2 className="text-md font-semibold">List of all room entries.</h2>
                </div>
                <CreateRoomDialog allRooms={allRooms} roomTypes={roomTypes} />
            </div>

            <Card className="p-0 gap-0 overflow-hidden">
                <CardHeader className="px-0">
                    <TableToolbar
                        table={table}
                        onDeleteSelected={handleDeleteSelected}
                        useGlobalFilter
                    />
                </CardHeader>
                <Separator />
                <CardContent className="px-0">
                    <RoomTable table={table} columnsLength={columns.length} />               
                </CardContent>
            </Card>
        </div>
    );
};

RoomIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

export default RoomIndex;
