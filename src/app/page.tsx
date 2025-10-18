
import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import { LogoutButton } from "./logout";



const Page =  async () => {
  await requireAuth();

  const users = await caller.getUsers()
   
   return <div className="flex flex-col gap-y-2">
      protected server components
      <div>
         {JSON.stringify(users,null,2)}
      </div>
      <LogoutButton />
    </div>
}

export default Page 