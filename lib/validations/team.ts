import * as z from "zod";

export const CreateTeamSchema = z.object({
  name: z.string().min(2),
  type: z.string().optional(),
  bio: z.string().optional(),

  homePitchId: z.string().optional(),
  trainingPitchId: z.string().optional(),
  sameAsHome: z.boolean().optional(),
});

export type CreateTeamRequest = z.infer<typeof CreateTeamSchema>;
