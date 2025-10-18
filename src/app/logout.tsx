"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/client-auth";
import { useRouter } from "next/navigation";

export const LogoutButton = () => {
      const router = useRouter();


    return (
        <Button onClick={ ()=> {
            console.log('Signing out');
             authClient.signOut({
                fetchOptions : {
                   onSuccess : () => {
                   router.push('/login');
                  },
                  onError: (error) => {
                  console.error("Logout failed:", error);
                 }
            }
             })}}>Sign Out</Button>
    )

}