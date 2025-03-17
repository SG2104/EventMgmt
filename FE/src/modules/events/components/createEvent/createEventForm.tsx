import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import addEventSchema from "./validation-schema";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import {
  combineDateAndTime,
  formatSelectedDateWithTime,
  HHArray,
  MMArray,
} from "./helper";
import { useGet } from "@/hooks/useFetch";
import { EventCategoryType } from "../../types";
import { useAddEventPostApi, useUpdateEventApi } from "../../hooks/useEvent";
import Select from "react-select";

interface CreateEventFormProps {
  event: EventCategoryType | null;
  setEvent: React.Dispatch<React.SetStateAction<EventCategoryType | null>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isModalOpen: boolean;
}
const CreateEventForm = ({
  event,
  setEvent,
  setIsModalOpen,
  isModalOpen,
}: CreateEventFormProps) => {
  // =============================== API HOOKS ==========================================
  const {
    fetchData: getCategories,
    loading: isCategoryLoading,
    data,
  } = useGet<{ data: { id: string; name: string }[] }>("/events/categories");

  const { addEventApi } = useAddEventPostApi();
  const { updateEventApi } = useUpdateEventApi(event?.id);

  // =============================== HOOKS ==========================================

  const [category, setCategories] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);

  // Fetch categories on component mount
  useEffect(() => {
    getCategories();
  }, []);

  // Populate form with event data if available
  useEffect(() => {
    if (event) {
      form.reset({
        description: event.description,
        endDateTime: new Date(event.endDateTime),
        startDateTime: new Date(event.startDateTime),
        name: event.name,
        categories: event.categories?.map(({ category }) => ({
          label: category.name,
          value: category.id,
        })),
      });
    }
  }, [event]);

  // Update category state when data is available
  useEffect(() => {
    if (!data) return;
    const { data: response } = data;
    if (response?.length) {
      const categories = response.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      setCategories(categories);
    }
  }, [data]);

  // =============================== FORM SETUP ==========================================
  const form = useForm<z.infer<typeof addEventSchema>>({
    resolver: zodResolver(addEventSchema),
    defaultValues: {
      description: "",
      endDateTime: addDays(new Date(), 1),
      name: "",
      startDateTime: new Date(),
    },
    reValidateMode: "onChange",
  });

  // =============================== FORM SUBMISSION ==========================================
  const onSubmit = async (formData: z.infer<typeof addEventSchema>) => {
    const { categories, description, endDateTime, name, startDateTime } =
      formData;
    const createEventPayload = {
      id: event?.id,
      description,
      endDateTime: new Date(endDateTime),
      name,
      startDateTime: new Date(startDateTime),
      categories: categories?.map(({ value }) => value),
    };

    if (event) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await updateEventApi(createEventPayload);
      if (res?.data?.success) {
        setIsModalOpen(false);
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await addEventApi(createEventPayload);
      if (res?.data?.success) {
        setIsModalOpen(false);
      }
    }
  };

  // =============================== HELPER FUNCTIONS ==========================================
  // Handle modal toggle and reset form
  const handleToggle = () => {
    setEvent(null);
    setIsModalOpen((prev) => !prev);
    form.reset();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleToggle}>
      <DialogContent className="max-h-[calc(100dvh_-_200px)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create an event</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Event name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Please enter event name"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This is your event display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Description <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief about the event"
                          className="resize-y"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startDateTime"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        Start date <span className="text-red-500">*</span>
                      </FormLabel>
                      <Popover modal>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPPP hh:mm")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <div className="flex ">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(selectedDate) =>
                                field.onChange(
                                  formatSelectedDateWithTime(
                                    selectedDate,
                                    field.value
                                  )
                                )
                              }
                              disabled={(date) => date <= new Date()}
                              initialFocus
                            />
                            <ScrollArea
                              className="h-72 w-24  border text-center"
                              type="scroll"
                            >
                              <div className="p-4 relative">
                                <h4 className="mb-4 text-sm font-medium leading-none ">
                                  HH
                                </h4>
                                {HHArray.map((tag) => (
                                  <>
                                    <Button
                                      onClick={() =>
                                        combineDateAndTime({
                                          time: tag,
                                          label: "startDateTime",
                                          timeVariable: "HH",
                                          form,
                                        })
                                      }
                                      variant={
                                        form
                                          .watch("startDateTime")
                                          ?.getHours() === tag
                                          ? "default"
                                          : "outline"
                                      }
                                      key={tag}
                                      className="text-sm my-4 px-5"
                                    >
                                      {tag / 10 < 1 ? `0${tag}` : tag}
                                    </Button>
                                  </>
                                ))}
                              </div>
                            </ScrollArea>
                            <ScrollArea
                              className="h-72 w-24  border text-center"
                              type="hover"
                            >
                              <div className="p-4">
                                <h4 className="mb-4 text-sm font-medium leading-none">
                                  MM
                                </h4>
                                {MMArray.map((tag) => (
                                  <>
                                    <Button
                                      onClick={() =>
                                        combineDateAndTime({
                                          time: tag,
                                          label: "startDateTime",
                                          timeVariable: "MM",
                                          form,
                                        })
                                      }
                                      variant={
                                        form
                                          .watch("startDateTime")
                                          ?.getMinutes() === tag
                                          ? "default"
                                          : "outline"
                                      }
                                      key={tag}
                                      className="text-sm my-4 px-5"
                                    >
                                      {tag / 10 < 1 ? `0${tag}` : tag}
                                    </Button>
                                  </>
                                ))}
                              </div>
                            </ScrollArea>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Please select start time of event.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDateTime"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        End date <span className="text-red-500">*</span>
                      </FormLabel>
                      <Popover modal>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPPP hh:mm")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <div className="flex ">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(selectedDate) =>
                                field.onChange(
                                  formatSelectedDateWithTime(
                                    selectedDate,
                                    field.value
                                  )
                                )
                              }
                              disabled={(date) =>
                                date.getDate() <=
                                form.watch("startDateTime").getDate()
                              }
                              initialFocus
                            />
                            <ScrollArea
                              className="h-72 w-24  border text-center"
                              type="scroll"
                            >
                              <div className="p-4 relative">
                                <h4 className="mb-4 text-sm font-medium leading-none ">
                                  HH
                                </h4>
                                {HHArray.map((tag) => (
                                  <Button
                                    onClick={() =>
                                      combineDateAndTime({
                                        time: tag,
                                        label: "endDateTime",
                                        timeVariable: "HH",
                                        form,
                                      })
                                    }
                                    variant={
                                      form.watch("endDateTime")?.getHours() ===
                                      tag
                                        ? "default"
                                        : "outline"
                                    }
                                    key={tag}
                                    className="text-sm my-4 px-5"
                                  >
                                    {tag < 10 ? `0${tag}` : tag}
                                  </Button>
                                ))}{" "}
                              </div>
                              <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                            <ScrollArea
                              className="h-72 w-24  border text-center"
                              type="hover"
                            >
                              <div className="p-4">
                                <h4 className="mb-4 text-sm font-medium leading-none">
                                  MM
                                </h4>
                                {MMArray.map((tag) => (
                                  <>
                                    <Button
                                      onClick={() =>
                                        combineDateAndTime({
                                          time: tag,
                                          label: "endDateTime",
                                          timeVariable: "MM",
                                          form,
                                        })
                                      }
                                      variant={
                                        form
                                          .watch("endDateTime")
                                          ?.getMinutes() === tag
                                          ? "default"
                                          : "outline"
                                      }
                                      key={tag}
                                      className="text-sm my-4 px-5"
                                    >
                                      {tag / 10 < 1 ? `0${tag}` : tag}
                                    </Button>
                                  </>
                                ))}
                              </div>
                            </ScrollArea>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Please select end time of event.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Controller
                  name="categories"
                  control={form.control}
                  render={({ field: { onChange, value } }) => (
                    <div className=" w-full">
                      <FormLabel>
                        Event Category<span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        isClearable
                        options={category}
                        onChange={(selectedOption) => {
                          onChange(selectedOption || "");
                        }}
                        placeholder="Assign Category"
                        isMulti
                        isLoading={isCategoryLoading}
                        onMenuOpen={() => getCategories()}
                        value={value}
                        className="react-select"
                        classNamePrefix="select"
                      />

                      {form.formState.errors.categories && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.formState.errors.categories.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <Button type="submit" className="flex w-full items-center">
                  Submit
                </Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventForm;
