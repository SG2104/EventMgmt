import { Event } from "@/modules/events/types";
import { Meteors } from "../ui/meteors";
import { format } from "date-fns";

export function MeteorCards({ eventToView }: { eventToView: Event | null }) {
  return (
    <div className="flex w-full mx-auto self-center">
      <div className=" w-full relative">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] bg-red-500 rounded-full blur-3xl" />
        <div className="relative shadow-xl bg-gray-800 border border-gray-800  px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col justify-end items-start">
          <h1 className="font-bold text-xl text-white mb-4 relative z-50">
            {eventToView?.name}
          </h1>

          <p className="font-normal text-base text-slate-300 mb-4 relative z-50">
            {eventToView?.description}
          </p>

          <div className="flex flex-col space-y-3 mt-5">
            <span className="text-xs md:text-lg font-bold text-white capitalize">
              Timings:
            </span>
            {eventToView?.startDateTime && (
              <span className="text-xs md:text-lg font-bold text-white capitalize">
                {format(
                  new Date(eventToView?.startDateTime),
                  "dd MMMM yyyy, hh:mm a"
                )}
              </span>
            )}
            <span className="text-base text-white">To</span>
            {eventToView?.startDateTime && (
              <span className="text-xs md:text-lg font-bold text-white capitalize">
                {format(
                  new Date(eventToView?.endDateTime),
                  "dd MMMM yyyy, hh:mm a"
                )}
              </span>
            )}
          </div>
          <div className="flex flex-wrap justify-start gap-4 mt-10">
            {eventToView?.categories?.map(({ category }) => (
              <span
                key={category?.id}
                className=" bg-primary/80 border-4 px-4 py-1 rounded-lg  border-white text-white font-bold"
              >
                {category?.name}
              </span>
            ))}
          </div>
          {/* Meaty part - Meteor effect */}
          <Meteors number={20} />
        </div>
      </div>
    </div>
  );
}
