"use client";

import { Meal } from "@prisma/client";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { CarrotIcon, Loader2Icon } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { ChangeEvent, useState, useTransition } from "react";
import { addFoodItem } from "@/actions/meals";

export type AddFoodItemFormType = {
  name: string;
  portion: string;
  calories: number;
  proteins: number;
  carbs: number;
  fat: number;
};

const defaultAddFoodItemFormData: AddFoodItemFormType = {
  name: "",
  portion: "",
  calories: 0,
  proteins: 0,
  carbs: 0,
  fat: 0,
};

export const AddFoodItemDialog = ({
  meal,
  onComplete,
}: {
  meal: Meal;
  onComplete: () => void;
}) => {
  const [isOpen, setOpen] = useState(false);
  const [isLoading, startTransition] = useTransition();

  const [data, setData] = useState<AddFoodItemFormType>(
    defaultAddFoodItemFormData
  );

  const handleCancel = () => {
    if (isLoading) return;
    setOpen(false);
  };

  const handleSave = async () => {
    startTransition(async () => {
      const res = await addFoodItem(meal.id, data);
      if (res) {
        setData(defaultAddFoodItemFormData);
        setOpen(false);
        onComplete();
      }
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]:
        e.target.type === "number" ? parseInt(e.target.value) : e.target.value,
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (isLoading) return;
        setOpen(v);
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-full" size={"sm"} variant={"outline"}>
          <CarrotIcon /> Add Food Item
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader className="mb-2">
          <DialogTitle className="flex items-center gap-2">
            <CarrotIcon /> Add Food Item ({meal.name})
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor={`FoodName${meal.id}`}>Food Name</Label>
            <Input
              id={`FoodName${meal.id}`}
              disabled={isLoading}
              value={data.name}
              name="name"
              onChange={handleChange}
              placeholder="Example: Carrots"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`Portion${meal.id}`}>Portion</Label>
            <Input
              id={`Portion${meal.id}`}
              disabled={isLoading}
              value={data.portion}
              name="portion"
              onChange={handleChange}
              placeholder="Example: 150g"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`Calories${meal.id}`}>Calories</Label>
            <Input
              id={`Calories${meal.id}`}
              type="number"
              disabled={isLoading}
              value={data.calories}
              name="calories"
              onChange={handleChange}
              placeholder="Example: 170"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-2">
              <Label htmlFor={`Protein${meal.id}`}>Protein (g)</Label>
              <Input
                id={`Protein${meal.id}`}
                type="number"
                disabled={isLoading}
                value={data.proteins}
                name="proteins"
                onChange={handleChange}
                placeholder="Example: 25"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`Carbs${meal.id}`}>Carbs (g)</Label>
              <Input
                id={`Carbs${meal.id}`}
                type="number"
                disabled={isLoading}
                value={data.carbs}
                name="carbs"
                onChange={handleChange}
                placeholder="Example: 42"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`Fat${meal.id}`}>Fat (g)</Label>
              <Input
                id={`Fat${meal.id}`}
                type="number"
                disabled={isLoading}
                value={data.fat}
                name="fat"
                onChange={handleChange}
                placeholder="Example: 15"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            className="cursor-pointer"
            variant={"secondary"}
            disabled={isLoading}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            className="cursor-pointer"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2Icon className="w-4 h-4 animate-spin" /> Saving
              </>
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
