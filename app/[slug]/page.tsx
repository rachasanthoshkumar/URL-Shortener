import { redirect } from "next/navigation";
import { LinkFallback } from "@/components/link-fallback";
import { prisma } from "@/lib/prisma";

type ShortLinkPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ShortLinkPage({ params }: ShortLinkPageProps) {
  const { slug } = await params;
  const link = await prisma.link.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      destinationUrl: true,
      deletedAt: true,
    },
  });

  if (!link || link.deletedAt) {
    return (
      <LinkFallback
        title="Link not found"
        message="This short link does not exist or may have been deleted by its owner."
      />
    );
  }

  await prisma.click.create({
    data: {
      linkId: link.id,
    },
  });

  redirect(link.destinationUrl);
}
