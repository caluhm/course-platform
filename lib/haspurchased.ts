import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function hasPurchased() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session?.user?.hasPurchased === false) {
    redirect("/");
  }
}
