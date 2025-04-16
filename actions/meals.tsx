"use server";

import { auth } from "@/auth";
import { AddFoodItemFormType } from "@/components/diet-dialogs";
import { normalizeDateToDay } from "@/lib/date";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type MealWithFullItems = Prisma.MealGetPayload<{
  include: {
    items: {
      include: {
        done: true;
      };
    };
  };
}>;

export type FullFoodItem = Prisma.FoodItemGetPayload<{
  include: {
    done: true;
  };
}>;

export async function getMeals(): Promise<MealWithFullItems[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const meals = await prisma.meal.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      items: {
        include: {
          done: true,
        },
      },
    },
  });

  return meals;
}

export async function setDone(itemId: string, done: boolean, day: Date) {
  const session = await auth();
  if (!session?.user?.id) return false;

  const foodItem = await prisma.foodItem.findFirst({ where: { id: itemId } });
  if (!foodItem) return false;

  const normalizedDay = normalizeDateToDay(day);

  if (done) {
    await prisma.foodItemDone.create({
      data: {
        foodItemId: itemId,
        date: normalizedDay,
      },
    });
  } else {
    await prisma.foodItemDone.deleteMany({
      where: {
        foodItemId: itemId,
        date: normalizedDay,
      },
    });
  }

  return true;
}

export async function addFoodItem(mealId: string, data: AddFoodItemFormType) {
  const session = await auth();
  if (!session?.user?.id) return false;

  const meal = await prisma.meal.findFirst({ where: { id: mealId } });
  if (!meal) return false;

  await prisma.foodItem.create({
    data: {
      ...data,
      mealId,
    },
  });

  return true;
}
