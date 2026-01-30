import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { getUserWorkflows } from "@/lib/db/workflows";

export default async function WorkflowPage() {
  const user = await currentUser();
  
  if (!user) {
    return null;
  }

  // Test database connection
  const workflows = await getUserWorkflows(user.id);
  
  return (
    <div className="min-h-screen bg-weavy-dark text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Workflow Builder</h1>
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
      
      <div className="bg-weavy-gray rounded-lg p-6">
        <p>Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}!</p>
        <p className="mt-4">You have {workflows.length} saved workflows.</p>
        <p className="mt-2 text-sm text-gray-400">Database connection: ✅ Working</p>
      </div>
    </div>
  );
}