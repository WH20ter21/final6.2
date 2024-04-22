import { getServerSession } from "next-auth";
import { UserInfo } from "@/models/UserInfo";

// Optional: Define a type for the session object
interface Session {
  user?: {
    email?: string;
  };
}

export async function isAdmin(): Promise<boolean> {
  try {
    const session = await getServerSession();
    const userEmail = (session?.user as Session?.user)?.email; // Type-safe access

    if (!userEmail) {
      return false;
    }

    const userInfo = await UserInfo.findOne({ email: userEmail });
    if (!userInfo) {
      return false;
    }

    return userInfo.admin;
  } catch (error) {
    console.error("Error checking admin status:", error);
    // Handle the error (e.g., throw an error or return a default value)
    return false; // Or return a more appropriate default value
  }
}
