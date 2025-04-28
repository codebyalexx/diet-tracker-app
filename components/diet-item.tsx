"use client";

import { isSameDay } from "date-fns";
import { useTransition } from "react";
import { Button } from "./ui/button";
import { Check, Trash2Icon } from "lucide-react";
import { FullFoodItem, MealWithFullItems } from "@/actions/meals";
import { AddFoodItemDialog } from "./diet-dialogs";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

export const isItemCompleted = (item: FullFoodItem, currentDate: Date) =>
  item.done.some((d) => isSameDay(d.date, currentDate));

export const DietItem = ({
  item,
  meal,
  toggleFoodItem,
  currentDate,
  editMode,
  onUpdate,
}: {
  item: FullFoodItem;
  meal: MealWithFullItems;
  toggleFoodItem: (item: FullFoodItem) => void;
  currentDate: Date;
  editMode: boolean;
  onUpdate: () => void;
}) => {
  const [isLoading, startTransition] = useTransition();
  const completed = isItemCompleted(item, currentDate);

  const handleToggle = () => {
    if (!isLoading && !editMode) {
      startTransition(async () => {
        await toggleFoodItem(item);
      });
    }
  };

  return (
    <>
      <li
        className={cn(
          "block p-4 space-y-2 rounded-xl border-2 bg-accent select-none cursor-pointer",
          completed && "border-green-500"
        )}
        onClick={handleToggle}
      >
        <div className="w-full flex items-center justify-between space-x-2">
          <label
            htmlFor={`${item.mealId}-${item.id}`}
            className={cn(
              "flex-grow cursor-pointer",
              (completed || isLoading) && "text-muted-foreground"
            )}
          >
            {item.name}{" "}
            <span className="text-xs text-muted-foreground">
              {item.portion}
            </span>
          </label>

          {completed && <Check className="h-4 w-4 text-green-500" />}

          {editMode && (
            <div className="flex items-center gap-1">
              <AddFoodItemDialog
                meal={meal}
                onComplete={onUpdate}
                item={item}
              />
              <Button className="size-8 cursor-pointer" variant="secondary">
                <Trash2Icon className="text-red-400" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant={"outline"}
            className={completed ? "text-muted-foreground" : ""}
          >
            {item.calories} kcal
          </Badge>
          <Badge
            variant={"outline"}
            className={completed ? "text-muted-foreground" : ""}
          >
            {item.proteins} proteins
          </Badge>
          <Badge
            variant={"outline"}
            className={completed ? "text-muted-foreground" : ""}
          >
            {item.carbs} carbs
          </Badge>
          <Badge
            variant={"outline"}
            className={completed ? "text-muted-foreground" : ""}
          >
            {item.fat} fat
          </Badge>
        </div>
      </li>
    </>
  );
};
