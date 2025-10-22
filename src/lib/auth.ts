import {checkout, polar ,portal} from "@polar-sh/better-auth"
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { PrismaClient } from "@/generated/prisma";
import { polarClient } from "./polar";

const prisma = new PrismaClient();
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: { 
    enabled: true, 
    autoSignIn: true,
  }, 
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp :true,
      use:[
        checkout({
          products:[
            {
              productId: "59dd70fd-0468-460a-8d18-023746a42fe0",
              slug: "Wireflow"
            }
          ],
          successUrl: process.env.POLAR_SUCCESS_URL || "http://localhost:3000",
          authenticatedUsersOnly: true,
        }),
        
        portal(),
      ]
      
    }),
  ],
});