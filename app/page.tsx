import { getMeals } from "@/actions/meals";
import AuthChecker from "@/components/auth-checker";
import { DailyDietTracker } from "@/components/diet-tracker";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function Home() {
  const meals = await getMeals();

  console.log(meals);

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl p-4 py-4 space-y-6">
        <h1 className="font-bold text-2xl flex items-center justify-center gap-2 w-full">
          Diet Tracker <ThemeToggle />
        </h1>
        <AuthChecker>
          <DailyDietTracker initialMeals={meals} />
        </AuthChecker>
      </div>
    </div>
  );
}
