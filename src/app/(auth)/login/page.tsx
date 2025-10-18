import { LoginForm } from "@/features/auth/components/login-form"
import { noRequireAuth } from "@/lib/auth-utils"
import Link from "next/link";
import Image from "next/image";

const Page = async () => {
    await noRequireAuth();

    return <LoginForm/>

}
export default Page