
import { createTRPCRouter } from '../init';

import { workflowRouter } from '@/features/workflows/server/route';


export const appRouter = createTRPCRouter({

workflows:workflowRouter,

});
// export type definition of API
export type AppRouter = typeof appRouter;
