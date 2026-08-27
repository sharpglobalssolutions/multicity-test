import { z } from "zod";

/** Every field optional — a PATCH updates only what's supplied. Length caps
 * follow the usual practical guidance for how much of each Google actually
 * renders in a result snippet, not a hard technical limit. */
export const updateSeoMetadataSchema = z
  .object({
    seoTitle: z.string().trim().max(70, "Meta title should be 70 characters or fewer").optional(),
    metaDescription: z.string().trim().max(320, "Meta description should be 320 characters or fewer").optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdateSeoMetadataInput = z.infer<typeof updateSeoMetadataSchema>;
