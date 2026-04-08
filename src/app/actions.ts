"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export async function login(_prev: unknown, formData: FormData) {
  const password = formData.get("password") as string;

  if (password === process.env.SITE_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set("govai-auth", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
    redirect("/");
  }

  return { error: "Incorrect password" };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("govai-auth");
  redirect("/login");
}

export async function addFellow(_prev: unknown, formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const city = (formData.get("city") as string)?.trim();
  const whatsapp = (formData.get("whatsapp") as string)?.trim();
  const dates = (formData.get("dates") as string)?.trim() || null;

  if (!name || !city || !whatsapp) {
    return { error: "Name, city, and WhatsApp are required." };
  }

  // Geocode the city using Nominatim
  const geoRes = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
    { headers: { "User-Agent": "GovAI-Fellows-Map/1.0" } }
  );
  const geoData = await geoRes.json();

  if (!geoData.length) {
    return { error: `Could not find location "${city}". Try a more specific city name.` };
  }

  const { lat, lon, display_name } = geoData[0];

  const { error } = await supabase.from("fellows").insert({
    name,
    city: display_name.split(",").slice(0, 2).join(",").trim(),
    latitude: parseFloat(lat),
    longitude: parseFloat(lon),
    whatsapp,
    dates,
  });

  if (error) {
    return { error: "Failed to save. Please try again." };
  }

  revalidatePath("/");
  return { success: true };
}

export async function removeFellow(id: string) {
  await supabase.from("fellows").delete().eq("id", id);
  revalidatePath("/");
}
