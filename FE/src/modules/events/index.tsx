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
  }>("/events/categories");

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
    <div className="flex  flex-col m-5 h-[calc(100dvh_-_150px)] overflow-auto ">
      <div className="flex flex-col-reverse md:flex-row items-center gap-5 my-5">
        <Select
          isClearable
          options={categories}
          onChange={(selectedOption) => {
            setFilterCategory(selectedOption.map((option) => option.value));
          }}
          placeholder="Filter by category"
          isMulti
          isLoading={loading}
          value={categories?.filter((category) =>
            filterCategory.includes(category.value)
          )}
          className="basic-multi-select flex-1 w-full md:w-32"
          classNamePrefix="select "
        />
        <Button
          variant={"default"}
          className="w-full md:w-32 text-neutral-800"
          onClick={() => setIsModalOpen((prev) => !prev)}
        >
          Create Event
        </Button>
      </div>
      <EventCards
        setEventToDelete={setEventToDelete}
        eventToDelete={eventToDelete}
        filterCategory={filterCategory}
        setEvent={setEvent}
        isModalOpen={isModalOpen}
      />
      {isModalOpen && (
        <CreateEventForm
          isModalOpen={isModalOpen}
          event={event}
          setEvent={setEvent}
          setIsModalOpen={setIsModalOpen}
        />
      )}{" "}
    </div>
  );
};

export default EventComponent;
