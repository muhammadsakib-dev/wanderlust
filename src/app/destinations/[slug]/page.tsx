import { DestinationDetails } from "@/components/destination-details";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug).replace(/-/g, " ");
  const capitalized = decoded.charAt(0).toUpperCase() + decoded.slice(1);

  return {
    title: `${capitalized} - Wanderlust`,
    description: `Explore travel details, highlights, and book packages for ${capitalized}.`,
  };
}

export default async function DestinationSlugPage({ params }: PageProps) {
  const { slug } = await params;
  return <DestinationDetails slug={slug} />;
}

