"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDeleteEventAPi, useGetProductPostApi } from "../../hooks/useEvent";
import { Event } from "../../types";
import { CommonTable } from "@/components/common/commonTable";
import { getEventColumns } from "./columns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MeteorCards } from "@/components/common/meteroCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EventListingProps {
  setEvent: Dispatch<SetStateAction<Event | null>>;
  filterCategory: string[];
  isModalOpen: boolean;
  eventToDelete?: string;
  setEventToDelete: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const EventListing = ({
  setEvent,
  filterCategory,
  eventToDelete,
  setEventToDelete,
  isModalOpen,
}: EventListingProps) => {
  const [events, setEvents] = useState<
    | {
        data: Event[];
        pagination: {
          currentPage: number;
          totalPages: number;
          limit: number;
        };
      }
    | undefined
  >();

  const [eventToView, setEventToView] = useState<Event | null>(null);
  const [page, setPage] = useState<number>(1);

  const { getProductsApi, loading } = useGetProductPostApi();
  const { deleteEventApi } = useDeleteEventAPi(eventToDelete);

  const handleFetchEvents = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = await getProductsApi(9, page, filterCategory);
    if (res) {
      setEvents(res?.data);
    }
  };
  useEffect(() => {
    handleFetchEvents();
  }, [page, isModalOpen, eventToDelete]);

  useEffect(() => {
    setPage(() => 1);
    handleFetchEvents();
  }, [filterCategory]);

  const handleEventToggle = (isOpen: boolean) => {
    if (!isOpen) {
      setEventToView(null);
    }
  };

  const handleDeleteEvent = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = await deleteEventApi();
    if (res?.data?.success) {
      setEventToDelete(undefined);
    }
  };
  return (
    <div>
      <Dialog open={!!eventToView} onOpenChange={handleEventToggle}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle> {eventToView?.name}</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <MeteorCards eventToView={eventToView} />
        </DialogContent>
      </Dialog>
      {events && (
        <CommonTable
          columns={getEventColumns({
            setEvent,
            setEventToView,
            setEventToDelete,
          })}
          data={events}
          isLoading={loading}
          page={page}
          setPage={setPage}
        />
      )}
      <AlertDialog
        open={!!eventToDelete}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setEventToDelete(undefined);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              event
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEvent}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EventListing;
