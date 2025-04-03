import { Event } from "@/modules/events/types";
import { Meteors } from "../ui/meteors";
import { format } from "date-fns";

export function MeteorCards({ eventToView }: { eventToView: Event | null }) {
  if (!eventToView) return null;

  return (
    <div className="flex justify-center items-center w-full mx-auto px-4 py-10">
      <div className="relative w-full max-w-4xl">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 opacity-40 blur-2xl rounded-3xl scale-105" />

        <div className="relative z-10 bg-[#0f0f0f] border border-[#1f1f1f] text-white rounded-2xl shadow-2xl p-8 md:p-12 overflow-hidden">
          <Meteors number={20} />

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-orange-400 mb-4 tracking-tight leading-snug">
            {eventToView.name}
          </h1>

          {/* Description */}
          <p className="text-base md:text-lg text-gray-300 mb-6 leading-relaxed">
            {eventToView.description}
          </p>

          {/* Timings */}
          <div className="mb-6 space-y-1">
            <h3 className="text-sm uppercase text-gray-500 tracking-wider">
              Timings
            </h3>
            <p className="text-sm md:text-base font-medium text-gray-200">
              {format(new Date(eventToView.startDateTime), "dd MMM yyyy, hh:mm a")}
            </p>
            <p className="text-xs text-gray-400">to</p>
            <p className="text-sm md:text-base font-medium text-gray-200">
              {format(new Date(eventToView.endDateTime), "dd MMM yyyy, hh:mm a")}
            </p>
          </div>

          {/* Categories */}
          {eventToView.categories?.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-6">
              {eventToView.categories.map(({ category }) => (
                <span
                  key={category?.id}
                  className="bg-orange-700 text-white text-xs font-semibold px-4 py-1 rounded-lg border border-orange-400 hover:scale-105 transition-all"
                >
                  {category?.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
