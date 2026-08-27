import { prisma } from "@/lib/prisma";

interface CreateMediaInput {
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
}

export function createMedia(input: CreateMediaInput) {
  return prisma.media.create({ data: input });
}
