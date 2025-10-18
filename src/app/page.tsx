import prisma from "@/lib/prisma"




const Page = async() => {

    const user = await prisma.user.findMany()

    return <div>

      {JSON.stringify(user)}
    </div>
}

export default Page 