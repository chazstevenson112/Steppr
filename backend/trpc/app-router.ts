import { createTRPCRouter } from "./create-context";

// Import activity procedures
import { createActivityProcedure } from "./routes/activities/create";
import { listActivitiesProcedure } from "./routes/activities/list";

// Import challenge procedures
import { createChallengeProcedure } from "./routes/challenges/create";
import { joinChallengeProcedure } from "./routes/challenges/join";
import { listChallengesProcedure } from "./routes/challenges/list";
import { getChallengeProcedure } from "./routes/challenges/get";

// Import user procedures
import { getUserProfileProcedure, updateUserProfileProcedure } from "./routes/user/profile";

export const appRouter = createTRPCRouter({
  activities: createTRPCRouter({
    create: createActivityProcedure,
    list: listActivitiesProcedure,
  }),
  challenges: createTRPCRouter({
    create: createChallengeProcedure,
    join: joinChallengeProcedure,
    list: listChallengesProcedure,
    get: getChallengeProcedure,
  }),
  user: createTRPCRouter({
    getProfile: getUserProfileProcedure,
    updateProfile: updateUserProfileProcedure,
  }),
});

export type AppRouter = typeof appRouter;