import { createFileRoute } from "@tanstack/react-router";
import { Overview } from "@/components/dashboard/overview";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <Overview />;
}
