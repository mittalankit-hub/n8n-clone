import { EditorHeader } from "@/features/editor/components/editor-header";
import { Editor, EditorError, EditorLoading } from "@/features/editor/components/editor";
import { prefetchSingleWorkflow } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface PageProps {
    params: Promise<{workflowId: string}>;
}

const Page = async ({params}:PageProps) => {
    await requireAuth()
    const {workflowId} = await params;
    prefetchSingleWorkflow(workflowId)
  
    return (
        <div className="flex flex-col">  
            
              <HydrateClient>
                <ErrorBoundary fallback={<EditorError/>}>
                    <Suspense fallback={<EditorLoading/>}>
                     <EditorHeader workflowId={workflowId}/>
                     <main className="flex-1">
                        <Editor workflowId={workflowId}/>
                      </main>
                    </Suspense>
                </ErrorBoundary>
              </HydrateClient>
        </div>
    )
}

export default Page;