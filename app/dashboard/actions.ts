"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import {
  generatedSlugSeed,
  type LinkInput,
  linkInputSchema,
  normalizeCustomSlug,
  normalizeDestinationUrl,
  randomSlugSuffix,
} from "@/lib/link-validation";
import { prisma } from "@/lib/prisma";

export type LinkActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function createLinkAction(
  _previousState: LinkActionState,
  formData: FormData,
): Promise<LinkActionState> {
  const userId = await getCurrentUserId();

  if (!userId) {
    return { status: "error", message: "Sign in before creating links." };
  }

  const parsed = linkInputSchema.safeParse(formDataToLinkInput(formData));

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Check the form fields." };
  }

  const prepared = await prepareLinkPayload(parsed.data, userId);

  if (!prepared.ok) {
    return { status: "error", message: prepared.error };
  }

  const linkPayload = prepared.data;

  await prisma.link.create({
    data: {
      userId,
      slug: linkPayload.slug,
      destinationUrl: linkPayload.destinationUrl,
      title: linkPayload.title,
      description: linkPayload.description,
    },
  });

  revalidatePath("/dashboard");

  return { status: "success", message: "Short link created." };
}

export async function createQuickLinkAction(
  _previousState: LinkActionState,
  formData: FormData,
): Promise<LinkActionState> {
  const destinationUrl = String(formData.get("destinationUrl") ?? "");
  const customSlug = String(formData.get("customSlug") ?? "");
  const title = buildTitleFromUrl(destinationUrl);
  const quickFormData = new FormData();

  quickFormData.set("destinationUrl", destinationUrl);
  quickFormData.set("customSlug", customSlug);
  quickFormData.set("title", title);
  quickFormData.set("description", "");

  const result = await createLinkAction(_previousState, quickFormData);

  if (result.status === "success") {
    return { status: "success", message: "Created. Open the dashboard to manage it." };
  }

  return result;
}

export async function deleteLinkAction(formData: FormData) {
  const userId = await getCurrentUserId();
  const linkId = String(formData.get("linkId") ?? "");

  if (!userId || !linkId) {
    return;
  }

  await prisma.link.deleteMany({
    where: {
      id: linkId,
      userId,
    },
  });

  revalidatePath("/dashboard");
}

type PreparedLinkPayload = {
  slug: string;
  destinationUrl: string;
  title: string;
  description: string | null;
};

async function prepareLinkPayload(
  input: LinkInput,
  userId: string,
): Promise<{ ok: true; data: PreparedLinkPayload } | { ok: false; error: string }> {
  const normalizedDestination = normalizeDestinationUrl(input.destinationUrl);

  if (!normalizedDestination.ok) {
    return { ok: false, error: normalizedDestination.error };
  }

  const customSlug = normalizeCustomSlug(input.customSlug);

  if (!customSlug.ok) {
    return { ok: false, error: customSlug.error };
  }

  const slug = customSlug.slug
    ? await assertUniqueSlug(customSlug.slug, userId)
    : await buildGeneratedSlug(input.title, normalizedDestination.url);

  if (typeof slug !== "string") {
    return { ok: false, error: slug.error };
  }

  return {
    ok: true,
    data: {
      slug,
      destinationUrl: normalizedDestination.url,
      title: input.title,
      description: input.description || null,
    },
  };
}

async function assertUniqueSlug(slug: string, userId: string) {
  const existing = await prisma.link.findFirst({
    where: {
      slug,
      NOT: {
        userId,
      },
    },
    select: {
      id: true,
    },
  });

  const userExisting = await prisma.link.findFirst({
    where: {
      slug,
      userId,
    },
    select: {
      id: true,
    },
  });

  if (existing || userExisting) {
    return { error: "That slug is already taken." };
  }

  return slug;
}

async function buildGeneratedSlug(title: string, destinationUrl: string) {
  const seed = generatedSlugSeed(title, destinationUrl);
  const candidates = [seed, `${seed}-${randomSlugSuffix()}`, randomSlugSuffix()];

  for (const candidate of candidates) {
    const existing = await prisma.link.findFirst({
      where: {
        slug: candidate,
      },
      select: {
        id: true,
      },
    });

    if (!existing) {
      return candidate;
    }
  }

  return randomSlugSuffix();
}

async function getCurrentUserId() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user.id ?? null;
}

function formDataToLinkInput(formData: FormData) {
  return {
    destinationUrl: String(formData.get("destinationUrl") ?? ""),
    customSlug: String(formData.get("customSlug") ?? ""),
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
  };
}

function buildTitleFromUrl(value: string) {
  try {
    const url = new URL(value);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return "Untitled link";
  }
}
