"use client";

import { useState } from "react";
import { format, addDays, subDays, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { normalizeDateToDay } from "@/lib/date";
import { getMeals, setDone } from "@/actions/meals";

export function DailyDietTracker({ initialMeals }: { initialMeals: any[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [meals, setMeals] = useState<any[]>(initialMeals);

  console.log(meals);

  // Navigate to previous day
  const goToPreviousDay = () => {
    setCurrentDate((prevDate) => subDays(prevDate, 1));
  };

  // Navigate to next day
  const goToNextDay = () => {
    setCurrentDate((prevDate) => addDays(prevDate, 1));
  };

  // Toggle completion status of a food item
  const toggleFoodItem = async (item: any) => {
    if (item.done.some((d) => isSameDay(d.date, currentDate))) {
      await setDone(item.id, false, currentDate);
    } else {
      await setDone(item.id, true, currentDate);
    }
    const newMeals = await getMeals();
    setMeals(newMeals);
  };

  // Calculate overall progress
  const calculateProgress = () => {
    const totalItems = meals.reduce((acc, meal) => acc + meal.items.length, 0);
    const completedItems = meals.reduce(
      (acc, meal) =>
        acc +
        meal.items.filter((item) =>
          item.done.some((d) => isSameDay(d.date, currentDate))
        ).length,
      0
    );
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  const progress = calculateProgress();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPreviousDay}
          aria-label="Previous day"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">
          {format(currentDate, "EEEE, MMMM d")}
        </h2>
        <Button
          variant="outline"
          size="icon"
          onClick={goToNextDay}
          aria-label="Next day"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex justify-between items-center">
            <span>Daily Progress</span>
            <span className="text-sm font-normal">{progress}% Complete</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      <div className="space-y-3">
        {meals.map((meal) => (
          <Card key={meal.id}>
            <Collapsible open={true}>
              <CollapsibleTrigger asChild>
                <CardHeader className="pb-2 cursor-pointer">
                  <CardTitle className="text-lg flex justify-between items-center">
                    <span>{meal.name}</span>
                    <span className="text-sm font-normal">
                      {
                        meal.items.filter((item: any) =>
                          item.done.some(
                            (done: any) =>
                              done.date.getTime() ===
                              normalizeDateToDay(currentDate)
                          )
                        ).length
                      }
                      /{meal.items.length}
                    </span>
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {meal.items.map((item) => (
                      <li key={item.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${meal.id}-${item.id}`}
                          checked={item.done.some((d) =>
                            isSameDay(d.date, currentDate)
                          )}
                          onCheckedChange={() => toggleFoodItem(item)}
                        />
                        <label
                          htmlFor={`${meal.id}-${item.id}`}
                          className={`flex-grow cursor-pointer ${
                            item.completed
                              ? "line-through text-muted-foreground"
                              : ""
                          }`}
                        >
                          {item.name}
                        </label>
                        {item.done.some((d) =>
                          isSameDay(d.date, currentDate)
                        ) && <Check className="h-4 w-4 text-green-500" />}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  );
}
