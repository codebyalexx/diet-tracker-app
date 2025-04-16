"use client";

import { useState } from "react";
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
  const toggleFoodItem = async (item: FullFoodItem) => {
    if (item.done.some((d) => isSameDay(d.date, currentDate))) {
      await setDone(item.id, false, currentDate);
    } else {
      await setDone(item.id, true, currentDate);
    }
    const newMeals = await getMeals();
    setMeals(newMeals);
    return true;
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
                        meal.items.filter((item: FullFoodItem) =>
                          item.done?.some((done) =>
                            isSameDay(done.date, currentDate)
                          )
                        ).length
                      }
                      /{meal.items.length}
                    </span>
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0 space-y-4">
                  <ul className="space-y-2">
                    {meal.items.map((item) => (
                      <DietItem
                        item={item}
                        currentDate={currentDate}
                        toggleFoodItem={toggleFoodItem}
                        key={item.id}
                        editMode={editMode}
                      />
                    ))}
                  </ul>
                  {editMode ? (
                    <AddFoodItemDialog
                      meal={meal}
                      onComplete={async () => {
                        const newMeals = await getMeals();
                        setMeals(newMeals);
                      }}
                    />
                  ) : (
                    ""
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Button
          className={cn(
            "cursor-pointer border-2",
            editMode ? "border-green-600" : ""
          )}
          variant={"secondary"}
          onClick={() => {
            setEditMode(!editMode);
          }}
        >
          <BrushIcon /> Edit Mode
        </Button>
        {editMode ? (
          <Button className={"cursor-pointer border-2"} variant={"secondary"}>
            <PlusIcon /> Create Meal
          </Button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
