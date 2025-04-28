"use client";

import { useCallback, useState } from "react";
import { format, addDays, subDays, isSameDay } from "date-fns";
import {
  BrushIcon,
  ChevronLeft,
  ChevronRight,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  FullFoodItem,
  getMeals,
  MealWithFullItems,
  setDone,
} from "@/actions/meals";
import { DietItem } from "./diet-item";
import { cn } from "@/lib/utils";
import { AddFoodItemDialog } from "./diet-dialogs";
import { Badge } from "./ui/badge";
import { isTheSameDay } from "@/lib/date";

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

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex justify-between items-center">
            <span>Daily Nutrition</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-2xl font-semibold">0 kcal</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 bg-muted flex flex-col items-center justify-center rounded-lg">
              <span className="text-sm text-muted-foreground">Proteins</span>
              <p className="font-semibold">0g</p>
            </div>
            <div className="p-2 bg-muted flex flex-col items-center justify-center rounded-lg">
              <span className="text-sm text-muted-foreground">Carbs</span>
              <p className="font-semibold">0g</p>
            </div>
            <div className="p-2 bg-muted flex flex-col items-center justify-center rounded-lg">
              <span className="text-sm text-muted-foreground">Fat</span>
              <p className="font-semibold">0g</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-8">
        {meals.map((meal) => {
          const doneCount = meal.items.filter((item) =>
            item.done.some((d) => isSameDay(d.date, currentDate))
          ).length;

          return (
            <div key={meal.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{meal.name}</h2>
                  {editMode ? (
                    <Button
                      className="w-8 h-8 cursor-pointer"
                      variant={"secondary"}
                    >
                      <Trash2Icon className="w-4 h-4 text-red-400" />
                    </Button>
                  ) : (
                    ""
                  )}
                  <Badge variant={"secondary"}>
                    {meal.items
                      .filter((i) =>
                        i.done.some((d) => isTheSameDay(d.date, currentDate))
                      )
                      .reduce((sum, item) => sum + item.calories, 0)}{" "}
                    /{" "}
                    <span className="text-muted-foreground">
                      {meal.items.reduce((sum, item) => sum + item.calories, 0)}{" "}
                      kcal
                    </span>
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground">
                  {doneCount} / {meal.items.length}
                </span>
              </div>
              <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-2">
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
              </div>
              {editMode && (
                <AddFoodItemDialog meal={meal} onComplete={updateMeals} />
              )}
            </div>
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
