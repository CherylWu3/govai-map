import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase, type Fellow } from "@/lib/supabase";
import MapClient from "@/components/MapClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("govai-auth");

  if (auth?.value !== "authenticated") {
    redirect("/login");
  }

  const { data: fellows } = await supabase
    .from("fellows")
    .select("*")
    .order("created_at", { ascending: false });

  return <MapClient fellows={(fellows as Fellow[]) ?? []} />;
}
