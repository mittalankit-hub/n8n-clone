import { LoginForm } from "@/features/auth/components/login-form"
import { noRequireAuth } from "@/lib/auth-utils"

const Page = async () => {
    await noRequireAuth();

    return <div>
        <LoginForm/>
    </div>
}
export default Page