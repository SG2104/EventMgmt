import { useEffect, useState } from "react";
import CreateEventForm from "./components/createEvent/createEventForm";
import EventCards from "./components/eventCards";
import { Category, EventCategoryType } from "./types";
import { useGet } from "@/hooks/useFetch";
import Select from "react-select";
import { Button } from "@/components/ui/button";
const EventComponent = () => {
  const [event, setEvent] = useState<EventCategoryType | null>(null);
  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);
  const [filterCategory, setFilterCategory] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [eventToDelete, setEventToDelete] = useState<string | undefined>();

  const { fetchData: getCategories, loading } = useGet<{
    data: { id: string; name: string }[];
  }>("/api/events/categories");

  const getCategory = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = await getCategories();
    if (res?.data) {
      setCategories(
        res?.data?.map((category: Category) => ({
          value: category.id,
          label: category.name,
        }))
      );
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  useEffect(() => {
    if (event) {
      setIsModalOpen(true);
    }
  }, [event]);

  return (
    <div className="flex flex-col h-[calc(100dvh-100px)] overflow-auto px-4 py-6 md:px-8">
      {/* Header: Filter + Create Button */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        {/* Category Filter */}
        <div className="w-full md:w-2/3">
          <Select
            isClearable
            isMulti
            isLoading={loading}
            options={categories}
            onChange={(selectedOptions) =>
              setFilterCategory(
                selectedOptions ? selectedOptions.map((opt) => opt.value) : []
              )
            }
            placeholder="Filter by category"
            value={categories.filter((category) =>
              filterCategory.includes(category.value)
            )}
            className="react-select-container"
            classNamePrefix="select"
          />
        </div>
  
        {/* Create Event Button */}
        <Button
          variant="default"
          className="w-full md:w-auto min-w-[140px] bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
          onClick={() => setIsModalOpen((prev) => !prev)}
        >
          Create Event
        </Button>
      </div>
  
      {/* Event Cards */}
      <EventCards
        setEventToDelete={setEventToDelete}
        eventToDelete={eventToDelete}
        filterCategory={filterCategory}
        setEvent={setEvent}
        isModalOpen={isModalOpen}
      />
  
      {/* Event Form Modal */}
      {isModalOpen && (
        <CreateEventForm
          isModalOpen={isModalOpen}
          event={event}
          setEvent={setEvent}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
  
};

export default EventComponent;
