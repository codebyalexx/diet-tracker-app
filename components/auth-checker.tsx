"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderIcon } from "lucide-react";

const AuthChecker = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      signIn("google"); // Lance l'authentification si non authentifié
    } else {
      setLoading(false); // Si l'utilisateur est authentifié, on continue de charger
    }
  }, [status, session]);

  if (status === "loading" || loading) {
    return (
      <div className="w-full flex items-center justify-center">
        <LoaderIcon className="animate-spin" />
      </div>
    ); // Affiche un message de chargement pendant que la session est vérifiée
  }

  if (!session?.user) {
    router.push("/auth/signin"); // Redirige si l'utilisateur n'est pas authentifié
    return null;
  }

  return <>{children}</>; // Affiche les enfants (la page) si l'utilisateur est authentifié
};

export default AuthChecker;
