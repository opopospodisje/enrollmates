import { Room, RoomType, type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowDown01, ArrowDown10, ArrowDownAZ, ArrowDownZA, ArrowLeft, CornerDownRight, Eye, FileDown, Layers, Plus, SquarePen, Table2, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import * as React from "react"
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState, } from "@tanstack/react-table"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from '@/components/ui/label';
import TableExportDropdown from '@/components/TableExportDropdown';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import TableToolbar from '@/components/table/TableToolbar';
import RoomIndex from '../rooms';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { getRoomColumns } from '../rooms/Components/roomColumns';
import EditRoomTypeDialog from './Components/EditRoomTypeDialog';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Room Types',
    href: '/roomtypes',
  },
  {
    title: 'Show',
    href: ``,
  },
];

type RoomTypeShowProps = {
  allRooms:Room[];
  roomType: RoomType;
  rooms: Room[];
  roomTypes:RoomType[];
};

const RoomTypeShow = ({allRooms, rooms, roomType, roomTypes }: RoomTypeShowProps) => {

  return (
    <div className="container mx-auto">
      <Head title="Room Types" />
      <Toaster position='top-center' />

      <div className="mb-4">
          <div className='flex justify-between items-center px-2 gap-2 text-md text-muted-foreground border-y w-34 mb-2'>
            <h4>Room id:</h4>
            <div className='bg-accent px-4'>{roomType.id}</div>            
          </div>

          <div className='flex justify-between items-center px-4'> 
            <div className="flex items-center gap-2">
                <Layers className="text-muted-foreground" size={28} />
                <h1 className='text-4xl capitalize font-bold'>{roomType.name}</h1>
            </div>
            
          <div className='flex gap-2'>
              <Link href={route('rooms.index')}>
                <Button className="text-white dark:text-black">
                  <ArrowLeft size={24}/>
                    Back to Room
                </Button>
              </Link>
              <EditRoomTypeDialog roomType={roomType} buttonStyle='withName' />
          </div>

          </div>
          
          <div className="flex items-center px-8 gap-2">
            <CornerDownRight className="text-muted-foreground" size={18} />
            <p className="italic text-muted-foreground">Room Type Name</p>
          </div>
      </div>

      <div className='relative border-y py-2 mb-8'>
        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
      </div>

      <div className='relative p-2 bg-neutral-300 dark:bg-neutral-800 flex items-center rounded-t-lg gap-2'>
        <Table2 size={18} />
        <h3 className='font-medium'>Related Table</h3>
      </div>

      <div className='border rounded-b-lg gap-2 p-4'>
        <RoomIndex
          allRooms={allRooms}
          rooms={rooms}
          roomTypes={roomTypes}
          columnsToShow={['select', 'id', 'image', 'name', 'room_type_name', 'actions']}
        />
      </div>
    </div>
  );
};

RoomTypeShow.layout = (page: React.ReactNode) => (
  <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

export default RoomTypeShow;
