/**
 * Answer Submission API Endpoints
 * 
 * Handles answer submission and session completion:
 * - Submitting individual answers
 * - Completing simulation sessions
 * - Getting question explanations
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SimulationService } from '@/services/adaptiveQuestions/simulationService';
import { SubmitAnswerRequest, SubmitAnswerResponse } from '@/services/adaptiveQuestions/types';

const simulationService = new SimulationService();

/**
 * POST /api/adaptive-questions/answers/submit
 * Submit an answer for a question in a session
 */
export async function submitAnswer(request: NextRequest): Promise<NextResponse> {
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
    const requestData: SubmitAnswerRequest = await request.json();

    // Validate request data
    const validationError = validateSubmitAnswerRequest(requestData);
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    // Submit the answer
    const response: SubmitAnswerResponse = await simulationService.submitAnswer(
      userId,
      requestData
    );

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Error submitting answer:', error);
    
    // Return specific error messages for common issues
    if (error instanceof Error) {
      if (error.message.includes('Invalid session')) {
        return NextResponse.json(
          { error: 'Session not found or expired' },
          { status: 404 }
        );
      }
      if (error.message.includes('already completed')) {
        return NextResponse.json(
          { error: 'Session has already been completed' },
          { status: 409 }
        );
      }
      if (error.message.includes('Question not found')) {
        return NextResponse.json(
          { error: 'Question not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to submit answer' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/adaptive-questions/sessions/{sessionId}/complete
 * Complete a simulation session
 */
export async function completeSession(
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

    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid session ID' },
        { status: 400 }
      );
    }

    const completionResult = await simulationService.completeSession(userId, sessionId);

    return NextResponse.json({
      message: 'Session completed successfully',
      result: completionResult
    }, { status: 200 });

  } catch (error) {
    console.error('Error completing session:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Invalid session')) {
        return NextResponse.json(
          { error: 'Session not found or expired' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to complete session' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/adaptive-questions/questions/{questionId}/explanation
 * Get detailed explanation for a question
 */
export async function getQuestionExplanation(
  request: NextRequest,
  { params }: { params: { questionId: string } }
): Promise<NextResponse> {
  try {
    const userId = await getUserIdFromAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { questionId } = params;
    const questionIdNum = parseInt(questionId);

    if (isNaN(questionIdNum)) {
      return NextResponse.json(
        { error: 'Invalid question ID' },
        { status: 400 }
      );
    }

    // Get question details from database
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: question, error } = await supabase
      .from('questions')
      .select('*')
      .eq('id', questionIdNum)
      .single();

    if (error || !question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // Get user's interaction with this question if it exists
    const { data: userInteraction } = await supabase
      .from('user_question_history')
      .select('*')
      .eq('user_id', userId)
      .eq('question_id', questionIdNum)
      .order('last_seen_at', { ascending: false })
      .limit(1)
      .single();

    const response = {
      question: {
        id: question.id,
        text: question.text,
        options: question.options,
        correctAnswer: question.correct_answer,
        explanation: question.explanation,
        difficulty: question.difficulty,
        type: question.type,
        passageText: question.passage_text,
        passageTitle: question.passage_title
      },
      userInteraction: userInteraction ? {
        answerSelected: userInteraction.answer_selected,
        isCorrect: userInteraction.is_correct,
        timeSpent: userInteraction.time_spent_seconds,
        flagged: userInteraction.flagged,
        notes: userInteraction.notes,
        lastSeenAt: userInteraction.last_seen_at
      } : null
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Error getting question explanation:', error);
    return NextResponse.json(
      { error: 'Failed to get question explanation' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/adaptive-questions/questions/{questionId}/flag
 * Flag/unflag a question for review
 */
export async function toggleQuestionFlag(
  request: NextRequest,
  { params }: { params: { questionId: string } }
): Promise<NextResponse> {
  try {
    const userId = await getUserIdFromAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { questionId } = params;
    const questionIdNum = parseInt(questionId);

    if (isNaN(questionIdNum)) {
      return NextResponse.json(
        { error: 'Invalid question ID' },
        { status: 400 }
      );
    }

    const { flagged, notes } = await request.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Update the most recent interaction with this question
    const { error } = await supabase
      .from('user_question_history')
      .update({
        flagged: flagged,
        notes: notes || null
      })
      .eq('user_id', userId)
      .eq('question_id', questionIdNum);

    if (error) {
      throw new Error(`Failed to update flag: ${error.message}`);
    }

    return NextResponse.json({
      message: flagged ? 'Question flagged for review' : 'Question unflagged',
      flagged,
      notes
    }, { status: 200 });

  } catch (error) {
    console.error('Error toggling question flag:', error);
    return NextResponse.json(
      { error: 'Failed to update question flag' },
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

function validateSubmitAnswerRequest(request: SubmitAnswerRequest): string | null {
  if (!request.sessionId || typeof request.sessionId !== 'string') {
    return 'Session ID is required';
  }

  if (typeof request.questionId !== 'number' || request.questionId <= 0) {
    return 'Valid question ID is required';
  }

  if (typeof request.answerSelected !== 'number' || request.answerSelected < 0) {
    return 'Valid answer selection is required';
  }

  if (typeof request.timeSpentSeconds !== 'number' || request.timeSpentSeconds < 0) {
    return 'Valid time spent is required';
  }

  return null;
}

/**
 * Route Handler Exports for Next.js App Router
 */

// POST /api/adaptive-questions/answers/submit
export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path.endsWith('/submit')) {
    return submitAnswer(request);
  }

  return NextResponse.json(
    { error: 'Endpoint not found' },
    { status: 404 }
  );
}