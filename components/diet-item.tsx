"use client";

import { isSameDay } from "date-fns";
import { Checkbox } from "./ui/checkbox";
import { Check, Loader2Icon, LoaderIcon } from "lucide-react";
import { FullFoodItem } from "@/actions/meals";
import { useTransition } from "react";

export const isItemCompleted = (item: FullFoodItem, currentDate: Date) => {
  return item.done.some((d) => isSameDay(d.date, currentDate));
};

export const DietItem = ({
  item,
  toggleFoodItem,
  currentDate,
}: {
  item: FullFoodItem;
  toggleFoodItem: (item: FullFoodItem) => Promise<boolean>;
  currentDate: Date;
}) => {
  const [isLoading, startTransition] = useTransition();

  const handleToggle = async () => {
    if (isLoading) return;
    startTransition(async () => {
      await toggleFoodItem(item);
    });
  };

  return (
    <li key={item.id} className="flex items-center space-x-2">
      {isLoading ? (
        <Loader2Icon className="w-4 h-4 animate-spin" />
      ) : (
        <Checkbox
          disabled={isLoading}
          id={`${item.mealId}-${item.id}`}
          checked={isItemCompleted(item, currentDate)}
          onCheckedChange={handleToggle}
        />
      )}
      <label
        htmlFor={`${item.mealId}-${item.id}`}
        className={`flex-grow cursor-pointer ${
          isItemCompleted(item, currentDate)
            ? "line-through text-muted-foreground"
            : ""
        } ${isLoading ? "text-muted-foreground" : ""}`}
      >
        {item.name}
      </label>
      {isItemCompleted(item, currentDate) && (
        <Check className="h-4 w-4 text-green-500" />
      )}
    </li>
  );
};
