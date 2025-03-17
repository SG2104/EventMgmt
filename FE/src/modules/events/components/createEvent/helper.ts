import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import addEventSchema from "./validation-schema";

export const HHArray = Array.from({ length: 24 }).map((_, i) => i);
export const MMArray = Array.from({ length: 60 }).map((_, i) => i);
export const combineDateAndTime = (payload: {
  time: number;
  label: "startDateTime" | "endDateTime";
  timeVariable: "HH" | "MM";
  form: UseFormReturn<
    z.infer<typeof addEventSchema>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    undefined
  >;
}) => {
  const { label, time, timeVariable, form } = payload;
  if (label === "startDateTime") {
    const resultDate = new Date(form.watch("startDateTime"));
    if (timeVariable === "HH") {
      resultDate.setHours(Number(time));
      form.setValue("startDateTime", resultDate);
    } else {
      resultDate.setMinutes(Number(time));
      form.setValue("startDateTime", resultDate);
    }
  }
  if (label === "endDateTime") {
    const resultDate = new Date(form.watch("endDateTime"));
    if (timeVariable === "HH") {
      resultDate.setHours(Number(time));
      form.setValue("endDateTime", resultDate);
    } else {
      resultDate.setMinutes(Number(time));
      form.setValue("endDateTime", resultDate);
    }
  }
};

export const formatSelectedDateWithTime = (
  selectedDate: Date = new Date(),
  currentSelectedDate: Date
) => {
  const hours = currentSelectedDate.getHours();
  const minutes = currentSelectedDate.getMinutes();
  selectedDate?.setHours(hours, minutes, 0, 0);
  return selectedDate;
};
