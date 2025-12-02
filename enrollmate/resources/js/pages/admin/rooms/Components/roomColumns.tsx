import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  ArrowDown01,
  ArrowDown10,
  ArrowDownAZ,
  ArrowDownZA,
  Eye,
  Trash2,
} from "lucide-react";
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ColumnDef } from "@tanstack/react-table";
import EditRoomDialog from "./EditRoomDialog";
import { Room } from "@/types";

export const getRoomColumns = ({
  allRooms,
  roomTypes,
  rooms,
  handleDelete,
}: {
  allRooms: any[];
  roomTypes: any[];
  rooms: any[],
  handleDelete: (id: number) => void;
}): ColumnDef<Room>[] => [

  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting()}
          className="w-full flex justify-between items-center"
        >
          <div>ID</div>
          <div className={isSorted ? "" : "opacity-30"}>
            {isSorted === "asc" ? (
              <ArrowDown01 size={12} />
            ) : isSorted === "desc" ? (
              <ArrowDown10 size={12} />
            ) : (
              <ArrowDown01 size={12} />
            )}
          </div>
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="px-4 text-center">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "attachments",
    header: () => <div className="text-center">Image</div>,
    cell: ({ row }) => {
      const attachments = row.getValue("attachments") as { file_path: string }[];

      if (!attachments || attachments.length === 0) {
        return <span className="text-gray-400 italic">No image</span>;
      }

      return (
        <img
          src={attachments[0].file_path}
          alt="Room"
          className="h-20 w-28 object-cover rounded mx-auto"
        />
      );
    },
  },
  {
    accessorKey: "name",
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId)?.toString().toLowerCase() || "";
      const b = rowB.getValue(columnId)?.toString().toLowerCase() || "";
      return a.localeCompare(b);
    },
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting()}
          className="w-full flex justify-between items-center"
        >
          <div>Name</div>
          <div className={isSorted ? "" : "opacity-30"}>
            {isSorted === "asc" ? (
              <ArrowDownAZ size={12} />
            ) : isSorted === "desc" ? (
              <ArrowDownZA size={12} />
            ) : (
              <ArrowDownAZ size={12} />
            )}
          </div>
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="px-4 capitalize font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "room_type_name",
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId)?.toString().toLowerCase() || "";
      const b = rowB.getValue(columnId)?.toString().toLowerCase() || "";
      return a.localeCompare(b);
    },
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting()}
          className="w-full flex justify-between items-center"
        >
          <div>Room Type</div>
          <div className={isSorted ? "" : "opacity-30"}>
            {isSorted === "asc" ? (
              <ArrowDownAZ size={12} />
            ) : isSorted === "desc" ? (
              <ArrowDownZA size={12} />
            ) : (
              <ArrowDownAZ size={12} />
            )}
          </div>
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="px-4 capitalize">
        {row.getValue("room_type_name")}
      </div>
    ),
  },
  {
    accessorKey: "capacity",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting()}
          className="w-full flex justify-between items-center"
        >
          <div>Capacity</div>
          <div className={isSorted ? "" : "opacity-30"}>
            {isSorted === "asc" ? (
              <ArrowDown01 size={12} />
            ) : isSorted === "desc" ? (
              <ArrowDown10 size={12} />
            ) : (
              <ArrowDown01 size={12} />
            )}
          </div>
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="px-4 text-center">{row.getValue("capacity")}</div>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting()}
          className="w-full flex justify-between items-center"
        >
          <div>Price</div>
          <div className={isSorted ? "" : "opacity-30"}>
            {isSorted === "asc" ? (
              <ArrowDown01 size={12} />
            ) : isSorted === "desc" ? (
              <ArrowDown10 size={12} />
            ) : (
              <ArrowDown01 size={12} />
            )}
          </div>
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="px-4 text-center">{row.getValue("price")}</div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    enableHiding: false,
    cell: ({ row }) => {
      const room = row.original;
      return (
        <div className="flex justify-center gap-2">
          <Link href={route("rooms.show", room.id)}>
            <Button variant={"outline"}>
              <Eye />
            </Button>
          </Link>
          <EditRoomDialog allRooms={allRooms} room={room} roomTypes={roomTypes} />
          <AlertDialog>
            <AlertDialogTrigger className="border px-3 rounded-md text-red-600">
              <Trash2 size={16} />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  Deleting this room type will permanently remove it.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>
                  <div
                    onClick={() => handleDelete(room.id)}
                    className="w-full"
                  >
                    Delete
                  </div>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];

