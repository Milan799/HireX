import SeekerHome from "@/components/home/SeekerHome";
import EmployerHome from "@/components/home/EmployerHome";

export default function RootPage() {
  const appType = process.env.APP_TYPE || "seeker";

  if (appType === "employer") {
    return <EmployerHome />;
  }

  return <SeekerHome />;
}
