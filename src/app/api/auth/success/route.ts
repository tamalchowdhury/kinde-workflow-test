import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user == null || !user.id)
    throw new Error("something went wrong with authentication" + user);

  let { data: dbUser } = await supabase
    .from("profiles")
    .select("*")
    .eq("kinde_id", user.id);

  // write the user to the database if it doesn't exist
  if (dbUser && dbUser.length > 0) {
    dbUser = dbUser[0];
  } else {
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        kinde_id: user.id,
      })
      .select("*");
    if (error) {
      console.error("Error inserting user into database:", error);
    }
  }

  return NextResponse.redirect("http://localhost:3000");
}
