import { notFound } from "next/navigation";
import ComingSoon from "@/components/layout/ComingSoon";
import { SECTIONS } from "@/lib/constants";

// Only /home, /edit and /library exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(SECTIONS).map((section) => ({ section }));
}

export async function generateMetadata({ params }) {
  const { section } = await params;
  return { title: SECTIONS[section]?.title };
}

export default async function SectionPage({ params }) {
  const { section } = await params;
  const content = SECTIONS[section];
  if (!content) notFound();
  return <ComingSoon id={section} message={content.message} />;
}
