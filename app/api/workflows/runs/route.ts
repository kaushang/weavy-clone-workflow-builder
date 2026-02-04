import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { saveWorkflowRun, getUserWorkflowRuns } from '@/lib/db/workflows';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { workflowId, status, duration, nodeResults } = body;

    const run = await saveWorkflowRun(
      workflowId,
      userId,
      status,
      'full',
      duration,
      nodeResults
    );

    return NextResponse.json({ run });
  } catch (error) {
    console.error('Error saving workflow run:', error);
    return NextResponse.json(
      { error: 'Failed to save workflow run' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const workflowId = searchParams.get('workflowId');

    const runs = await getUserWorkflowRuns(userId, workflowId || undefined);

    return NextResponse.json({ runs });
  } catch (error) {
    console.error('Error fetching workflow runs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workflow runs' },
      { status: 500 }
    ); 
  }
}