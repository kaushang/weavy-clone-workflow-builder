import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

export default async function WorkflowPage() {
  const user = await currentUser();
  
  return (
    <div className="min-h-screen bg-weavy-dark text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Workflow Builder</h1>
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
      
      <div className="bg-weavy-gray rounded-lg p-6">
        <p>Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}!</p>
        <p className="mt-4">Canvas will go here...</p>
      </div>
    </div>
  );
}