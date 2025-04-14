"use server";

import { auth } from "@/auth";
import { normalizeDateToDay } from "@/lib/date";
import { prisma } from "@/lib/prisma";

export async function getMeals() {
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
