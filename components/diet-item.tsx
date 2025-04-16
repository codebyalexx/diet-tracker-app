"use client";

import { isSameDay } from "date-fns";
import { useTransition } from "react";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Check, Loader2Icon, Trash2Icon } from "lucide-react";
import { FullFoodItem, MealWithFullItems } from "@/actions/meals";
import { AddFoodItemDialog } from "./diet-dialogs";
import { cn } from "@/lib/utils";

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
    if (!isLoading) {
      startTransition(async () => {
        await toggleFoodItem(item);
      });
    }
  };

  return (
    <li className="flex items-center space-x-2">
      {isLoading ? (
        <Loader2Icon className="w-4 h-4 animate-spin" />
      ) : (
        <Checkbox
          disabled={isLoading}
          id={`${item.mealId}-${item.id}`}
          checked={completed}
          onCheckedChange={handleToggle}
        />
      )}
      <label
        htmlFor={`${item.mealId}-${item.id}`}
        className={cn(
          "flex-grow cursor-pointer",
          completed && "line-through text-muted-foreground",
          isLoading && "text-muted-foreground"
        )}
      >
        {item.name}
      </label>

      {completed && <Check className="h-4 w-4 text-green-500" />}

      {editMode && (
        <div className="flex items-center gap-1">
          <AddFoodItemDialog meal={meal} onComplete={onUpdate} item={item} />
          <Button className="size-8 cursor-pointer" variant="secondary">
            <Trash2Icon className="text-red-400" />
          </Button>
        </div>
      )}
    </li>
  );
};
