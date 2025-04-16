"use client";

import { useCallback, useState } from "react";
import { format, addDays, subDays, isSameDay } from "date-fns";
import { BrushIcon, ChevronLeft, ChevronRight, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  FullFoodItem,
  getMeals,
  MealWithFullItems,
  setDone,
} from "@/actions/meals";
import { DietItem } from "./diet-item";
import { cn } from "@/lib/utils";
import { AddFoodItemDialog } from "./diet-dialogs";

export function DailyDietTracker({
  initialMeals,
}: {
  initialMeals: MealWithFullItems[];
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [meals, setMeals] = useState<MealWithFullItems[]>(initialMeals);
  const [editMode, setEditMode] = useState(false);

  const updateMeals = useCallback(async () => {
    const newMeals = await getMeals();
    setMeals(newMeals);
  }, []);

  const goToPreviousDay = () => setCurrentDate((d) => subDays(d, 1));
  const goToNextDay = () => setCurrentDate((d) => addDays(d, 1));

  const toggleFoodItem = useCallback(
    async (item: FullFoodItem) => {
      const isDoneToday = item.done.some((d) => isSameDay(d.date, currentDate));
      await setDone(item.id, !isDoneToday, currentDate);
      await updateMeals();
    },
    [currentDate, updateMeals]
  );

  const calculateProgress = useCallback(() => {
    const [completed, total] = meals.reduce(
      ([doneCount, totalCount], meal) => {
        const doneToday = meal.items.filter((item) =>
          item.done.some((d) => isSameDay(d.date, currentDate))
        ).length;
        return [doneCount + doneToday, totalCount + meal.items.length];
      },
      [0, 0]
    );
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }, [meals, currentDate]);

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
        {meals.map((meal) => {
          const doneCount = meal.items.filter((item) =>
            item.done.some((d) => isSameDay(d.date, currentDate))
          ).length;

          return (
            <Card key={meal.id}>
              <Collapsible open>
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-2 cursor-pointer">
                    <CardTitle className="text-lg flex justify-between items-center">
                      <span>{meal.name}</span>
                      <span className="text-sm font-normal">
                        {doneCount}/{meal.items.length}
                      </span>
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0 space-y-4">
                    <ul className="space-y-2">
                      {meal.items.map((item) => (
                        <DietItem
                          key={item.id}
                          item={item}
                          meal={meal}
                          currentDate={currentDate}
                          toggleFoodItem={toggleFoodItem}
                          editMode={editMode}
                          onUpdate={updateMeals}
                        />
                      ))}
                    </ul>
                    {editMode && (
                      <AddFoodItemDialog meal={meal} onComplete={updateMeals} />
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <Button
          className={cn(
            "cursor-pointer border-2",
            editMode && "border-green-600"
          )}
          variant="secondary"
          onClick={() => setEditMode((prev) => !prev)}
        >
          <BrushIcon className="mr-2 h-4 w-4" /> Edit Mode
        </Button>
        {editMode && (
          <Button className="cursor-pointer border-2" variant="secondary">
            <PlusIcon className="mr-2 h-4 w-4" /> Create Meal
          </Button>
        )}
      </div>
    </div>
  );
}
