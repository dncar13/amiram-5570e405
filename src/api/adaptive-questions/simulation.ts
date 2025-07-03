/**
 * Simulation API Endpoints
 * 
 * Handles simulation session lifecycle:
 * - Starting new simulations
 * - Getting active sessions
 * - Abandoning sessions
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SimulationService } from '@/services/adaptiveQuestions/simulationService';
import { StartSimulationRequest, StartSimulationResponse } from '@/services/adaptiveQuestions/types';

const simulationService = new SimulationService();

/**
 * POST /api/adaptive-questions/simulation/start
 * Start a new simulation session
 */
export async function startSimulation(request: NextRequest): Promise<NextResponse> {
  try {
    // Get user from authentication
    const userId = await getUserIdFromAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const requestData: StartSimulationRequest = await request.json();

    // Validate request data
    const validationError = validateStartSimulationRequest(requestData);
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    // Start the simulation
    const response: StartSimulationResponse = await simulationService.startSimulation(
      userId,
      requestData
    );

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Error starting simulation:', error);
    return NextResponse.json(
      { error: 'Failed to start simulation' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/adaptive-questions/simulation/active
 * Get the active simulation session for the user
 */
export async function getActiveSession(request: NextRequest): Promise<NextResponse> {
  try {
    const userId = await getUserIdFromAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const activeSession = await simulationService.getActiveSession(userId);

    if (!activeSession) {
      return NextResponse.json(
        { message: 'No active session found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ session: activeSession }, { status: 200 });

  } catch (error) {
    console.error('Error getting active session:', error);
    return NextResponse.json(
      { error: 'Failed to get active session' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/adaptive-questions/simulation/{sessionId}/abandon
 * Abandon a simulation session
 */
export async function abandonSession(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
): Promise<NextResponse> {
  try {
    const userId = await getUserIdFromAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { sessionId } = params;

    await simulationService.abandonSession(userId, sessionId);

    return NextResponse.json(
      { message: 'Session abandoned successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error abandoning session:', error);
    return NextResponse.json(
      { error: 'Failed to abandon session' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/adaptive-questions/simulation/history
 * Get simulation session history for the user
 */
export async function getSessionHistory(request: NextRequest): Promise<NextResponse> {
  try {
    const userId = await getUserIdFromAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');

    const history = await simulationService.getSessionHistory(userId, limit);

    return NextResponse.json({ history }, { status: 200 });

  } catch (error) {
    console.error('Error getting session history:', error);
    return NextResponse.json(
      { error: 'Failed to get session history' },
      { status: 500 }
    );
  }
}

/**
 * Helper Functions
 */

async function getUserIdFromAuth(request: NextRequest): Promise<string | null> {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    
    // Verify JWT token with Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return null;
    }

    return user.id;

  } catch (error) {
    console.error('Error extracting user ID from auth:', error);
    return null;
  }
}

function validateStartSimulationRequest(request: StartSimulationRequest): string | null {
  const validSessionTypes = [
    'quick', 'full', 'custom', 'practice', 'review_mistakes', 'unseen_only'
  ];

  if (!validSessionTypes.includes(request.sessionType)) {
    return 'Invalid session type';
  }

  if (request.difficulty && !['easy', 'medium', 'hard'].includes(request.difficulty)) {
    return 'Invalid difficulty level';
  }

  if (request.questionLimit && (request.questionLimit < 1 || request.questionLimit > 100)) {
    return 'Question limit must be between 1 and 100';
  }

  return null;
}

/**
 * Route Handler Exports for Next.js App Router
 */

// POST /api/adaptive-questions/simulation/start
export async function POST(request: NextRequest) {
  return startSimulation(request);
}

// GET /api/adaptive-questions/simulation/active
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path.endsWith('/active')) {
    return getActiveSession(request);
  } else if (path.endsWith('/history')) {
    return getSessionHistory(request);
  }

  return NextResponse.json(
    { error: 'Endpoint not found' },
    { status: 404 }
  );
}