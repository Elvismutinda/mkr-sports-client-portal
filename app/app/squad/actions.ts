"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db/db";
import { team, teamMember } from "@/lib/db/schema";
import { CreateTeamSchema, CreateTeamRequest } from "@/lib/validations/team";

export const createTeam = async (values: CreateTeamRequest) => {
  const validatedFields = CreateTeamSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name, type, bio, homePitchId, trainingPitchId, sameAsHome } =
    validatedFields.data;

  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const userId = session.user.id;

  const existingMembership = await db.query.teamMember.findFirst({
    where: (tm, { eq }) => eq(tm.playerId, userId),
  });

  if (existingMembership) {
    return { error: "You already belong to a team." };
  }

  const badgeFallback = name.trim().slice(0, 2).toUpperCase();

  const [newTeam] = await db
    .insert(team)
    .values({
      name,
      type,
      bio,
      badgeFallback,
      captainId: userId,
      homePitchId: homePitchId || null,
      trainingPitchId: sameAsHome ? homePitchId : trainingPitchId || null,
    })
    .returning();

  await db.insert(teamMember).values({
    teamId: newTeam.id,
    playerId: userId,
    isActive: true,
  });

  return { success: "Team created!", team: newTeam };
};
