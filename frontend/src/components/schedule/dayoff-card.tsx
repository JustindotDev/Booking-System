import { useState } from "react";
import { useAdminScheduleStore } from "@/store/useAdminScheduleStore";
import { getWeekDays } from "@/lib/weekdays";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const DayOffCard = () => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { dayOffSchedule, fetchSchedule, setDayOff, isFetching } =
    useAdminScheduleStore();

  const weekDays = getWeekDays;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    try {
      await setDayOff({ day: selectedDays });
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setLoading(false);
    }

    fetchSchedule();
    setSelectedDays([]);
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const removeDay = (dayToRemove: string) => {
    setSelectedDays((prev) => prev.filter((d) => d !== dayToRemove));
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Day Off Schedule</CardTitle>
        <CardDescription>
          You can select multiple day as your day off
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isFetching ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        ) : dayOffSchedule.length > 0 ? (
          dayOffSchedule.map((day) => (
            <div key={day.id} className="flex flex-wrap gap-2">
              {day.day_off?.map((dayName) => (
                <div key={dayName} className="border px-4 py-1 rounded-lg">
                  {dayName}
                </div>
              ))}
            </div>
          ))
        ) : (
          <blockquote className="mt-6 pl-6 italic text-gray-600">
            No scheduled day off.
          </blockquote>
        )}
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className=" min-w-[260px] w-fit justify-start h-auto "
                >
                  {selectedDays.length > 0
                    ? selectedDays.map((day) => (
                        <div
                          key={day}
                          className="relative border px-2 py-1 rounded-lg group"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeDay(day);
                            }}
                            className="absolute -right-1 -top-1 text-gray-400 bg-white rounded-full  opacity-0 group-hover:opacity-100 transition-opacity "
                          >
                            <CircleX size={14} />
                          </button>
                          {day}
                        </div>
                      ))
                    : "Select days"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[260px]">
                <div className="grid gap-2">
                  {weekDays.map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={day}
                        checked={selectedDays.includes(day)}
                        onCheckedChange={() => toggleDay(day)}
                      />
                      <Label htmlFor={day}>{day}</Label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <Button type="submit" className="w-1/2" disabled={loading}>
              {loading && (
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              )}
              Set Day Off
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
};

export default DayOffCard;
