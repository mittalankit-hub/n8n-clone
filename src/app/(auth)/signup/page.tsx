import { SignUpForm } from "@/features/auth/components/register-form"
import { noRequireAuth } from "@/lib/auth-utils";

const Page = async () => {
    await noRequireAuth();
    return <div>
        <SignUpForm/>
    </div>
}
export default Page