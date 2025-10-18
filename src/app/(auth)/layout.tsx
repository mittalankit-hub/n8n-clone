import Link from "next/link"
import Image from "next/image"


const Layout = ({children}: {children: React.ReactNode}) => {

    return(
        <div className="bg-muted flex flex-col min-h-svh justify-center gap-6 p-6 md:p-10 items-center">
        <div className="flex w-full max-w-sm flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 self-center font-medium">
                <Image src="/logos/logo.svg" alt="Wireflow" width={30} height={30}/>
                WireFlow
            </Link>
            {children}
            </div>
            </div>
    )
}
export default Layout