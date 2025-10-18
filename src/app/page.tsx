import { caller, getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { Suspense } from "react"
import { Client } from "./client"



const Page =  async () => {
    //const users =  await caller.getUsers()
    const queryClient = getQueryClient()
    const users =  queryClient.prefetchQuery(trpc.getUsers.queryOptions())

    return <div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<div>Loading...</div>}>
          <Client/>
        </Suspense>
        
        </HydrationBoundary>
      
    </div>
}

export default Page 