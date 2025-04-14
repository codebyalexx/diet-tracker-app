import { getMeals } from "@/actions/meals";
import { auth, signIn } from "@/auth";
import { DailyDietTracker } from "@/components/diet-tracker";

export default async function Home() {
  const session = await auth();
  if (!session?.user?.id) await signIn("google");

  const meals = await getMeals();

  console.log(meals);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl px-2">
        <DailyDietTracker initialMeals={meals} />
      </div>
    </div>
  );
}
