import { SidebarTrigger } from "./ui/sidebar";


export const AppHeader = () => {
    return (
        <header className="flex items-center h-14 shrink-0 gap-2 border-b px-4 bg-background">
            <SidebarTrigger/>
        </header>
    )
}