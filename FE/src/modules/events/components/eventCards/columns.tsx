"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Category, Event } from "../../types";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Edit2, EyeIcon, Trash2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want. name, number, monthlySalary, perDaySalary, managerId
export const getEventColumns = ({
  setEvent,
  setEventToView,
  setEventToDelete,
}: {
  setEvent: Dispatch<SetStateAction<Event | null>>;
  setEventToView: Dispatch<SetStateAction<Event | null>>;
  setEventToDelete: Dispatch<SetStateAction<string | undefined>>;
}): ColumnDef<Event>[] => [
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => (
      <span
        onClick={() => setEventToView(row.original)}
        className="underline hover:cursor-pointer text-xs md:text-lg font-bold text-slate-700 capitalize"
      >
        {row.getValue("name")}
      </span>
    ),
  },
  {
    header: "Start Date",
    accessorKey: "startDateTime",
    cell: ({ row }) => (
      <span className="text-xs md:text-lg font-bold text-slate-700 capitalize">
        {format(
          new Date(row.getValue("startDateTime")),
          "dd MMMM yyyy, hh:mm a"
        )}
      </span>
    ),
  },
  {
    header: "End Date",
    accessorKey: "endDateTime",
    cell: ({ row }) => (
      <span className="text-xs md:text-lg font-bold text-slate-700 capitalize">
        {format(new Date(row.getValue("endDateTime")), "dd MMMM yyyy, hh:mm a")}
      </span>
    ),
  },
  {
    header: "Created At",
    accessorKey: "createdAt",
    cell: ({ row }) => (
      <span className="text-xs md:text-lg font-bold text-slate-700 capitalize">
        {format(new Date(row.getValue("createdAt")), "dd MMMM yyyy, hh:mm a")}
      </span>
    ),
  },
  {
    header: "Categories",
    accessorKey: "categories",
    cell: ({ row }) => {
      const rowData = row.getValue("categories") as [];
      return (
        <span className="text-xs md:text-lg font-bold text-slate-700 capitalize">
          {rowData?.slice(0, 2)?.map(({ category }) => (
            <div> {(category as Category).name}</div>
          ))}
          {rowData?.length > 2 && <span>+ {rowData?.length - 2}</span>}
        </span>
      );
    },
  },
  {
    header: "Actions",
    accessorKey: "",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col md:flex-row gap-5 justify-start w-full">
          <Button
            onClick={() => {
              setEvent({ ...row?.original });
              setEventToView(null);
              setEventToDelete(undefined);
            }}
            className="w-5 "
          >
            <Edit2 />
          </Button>
          <Button
            className="w-5 "
            onClick={() => {
              setEvent(null);
              setEventToDelete(undefined);
              setEventToView({ ...row?.original });
            }}
          >
            <EyeIcon />
          </Button>
          <Button
            className="w-5 "
            onClick={() => {
              setEvent(null);
              setEventToView(null);
              setEventToDelete(row?.original?.id);
            }}
          >
            <Trash2 />
          </Button>
        </div>
      );
    },
  },
];
