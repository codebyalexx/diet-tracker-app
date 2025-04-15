import { isSameDay } from "date-fns";
import { Checkbox } from "./ui/checkbox";
import { Check } from "lucide-react";
import { FullFoodItem } from "@/actions/meals";

export const isItemCompleted = (item: FullFoodItem, currentDate: Date) => {
  return item.done.some((d) => isSameDay(d.date, currentDate));
};

export const DietItem = ({
  item,
  toggleFoodItem,
  currentDate,
}: {
  item: FullFoodItem;
  toggleFoodItem: (item: FullFoodItem) => void;
  currentDate: Date;
}) => {
  return (
    <li key={item.id} className="flex items-center space-x-2">
      <Checkbox
        id={`${item.mealId}-${item.id}`}
        checked={item.done.some((d) => isSameDay(d.date, currentDate))}
        onCheckedChange={() => toggleFoodItem(item)}
      />
      <label
        htmlFor={`${item.mealId}-${item.id}`}
        className={`flex-grow cursor-pointer ${
          isItemCompleted(item, currentDate)
            ? "line-through text-muted-foreground"
            : ""
        }`}
      >
        {item.name}
      </label>
      {isItemCompleted(item, currentDate) && (
        <Check className="h-4 w-4 text-green-500" />
      )}
    </li>
  );
};
