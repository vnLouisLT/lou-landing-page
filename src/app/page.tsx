import { HomeScreen } from "@/components/home/home-screen";

type HomeProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { billing } = await searchParams;
  return <HomeScreen initialAnnual={billing === "true"} />;
}
