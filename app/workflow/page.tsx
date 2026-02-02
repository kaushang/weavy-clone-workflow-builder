import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import WorkflowLayout from "@/components/WorkflowLayout";
import LeftSidebar from "@/components/sidebar/LeftSidebar";
import WorkflowCanvas from "@/components/canvas/WorkflowCanvas";
import HistoryPanel from "@/components/history/HistoryPanel";
import Navbar from "@/components/Navbar";
import AutoSaveWrapper from "@/components/AutoSaveWrapper";
import ErrorBoundary from "@/components/ErrorBoundary";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";

export default async function WorkflowPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <ErrorBoundary>
      <AutoSaveWrapper>
        <KeyboardShortcuts />
        <div className="relative h-screen w-full">
          {/* Top Navbar */}
          <Navbar />

          {/* Main Layout (with top padding for navbar) */}
          <div className="pt-16 h-full">
            <WorkflowLayout
              sidebar={<LeftSidebar />}
              canvas={<WorkflowCanvas />}
              history={<HistoryPanel />}
            />
          </div>
        </div>
      </AutoSaveWrapper>
    </ErrorBoundary>
  );
}