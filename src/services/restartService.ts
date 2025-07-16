
import { supabase } from '@/integrations/supabase/client';
import { SetProgressService } from './setProgressService';
import { resetSimulation } from './questions/progress';

export interface RestartOptions {
  userId: string;
  setId?: number;
  setType?: string;
  setDifficulty?: string;
  simulationId?: string;
  clearLocalStorage?: boolean;
}

export class RestartService {
  
  /**
   * Complete restart for set-based simulations
   */
  static async restartSet(options: RestartOptions): Promise<{ success: boolean; error?: string }> {
    const { userId, setId, setType, setDifficulty } = options;
    
    if (!setId || !setType || !setDifficulty) {
      return { success: false, error: 'Missing required set parameters' };
    }

    console.log('🔄 [RestartService] Starting complete set restart:', {
      userId,
      setId,
      setType,
      setDifficulty,
      timestamp: new Date().toISOString()
    });

    try {
      // 1. Clear database progress
      const dbResult = await SetProgressService.resetSetProgress(
        userId,
        setId,
        setType,
        setDifficulty
      );

      if (!dbResult.success) {
        console.error('❌ Database reset failed:', dbResult.error);
        return dbResult;
      }

      // 2. Clear local storage for this set
      this.clearSetLocalStorage(setId, setType, setDifficulty);

      // 3. Clear any simulation progress in localStorage
      if (options.simulationId) {
        resetSimulation(options.simulationId);
      }

      // 4. Clear general simulation progress
      resetSimulation();

      console.log('✅ [RestartService] Complete set restart successful');
      return { success: true };

    } catch (error) {
      console.error('❌ [RestartService] Exception during set restart:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Complete restart for general simulations
   */
  static async restartSimulation(options: RestartOptions): Promise<{ success: boolean; error?: string }> {
    const { userId, simulationId } = options;

    console.log('🔄 [RestartService] Starting simulation restart:', {
      userId,
      simulationId,
      timestamp: new Date().toISOString()
    });

    try {
      // 1. Clear any active simulation sessions
      if (userId) {
        const { error } = await supabase
          .from('simulation_sessions')
          .delete()
          .eq('user_id', userId)
          .eq('session_type', 'practice')
          .eq('is_completed', false);

        if (error) {
          console.error('❌ Failed to clear active sessions:', error);
          return { success: false, error: error.message };
        }
      }

      // 2. Clear local storage
      if (simulationId) {
        resetSimulation(simulationId);
      }
      resetSimulation();

      // 3. Clear all simulation-related localStorage keys
      this.clearAllSimulationStorage();

      console.log('✅ [RestartService] Simulation restart successful');
      return { success: true };

    } catch (error) {
      console.error('❌ [RestartService] Exception during simulation restart:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Clear localStorage for a specific set
   */
  private static clearSetLocalStorage(setId: number, setType: string, setDifficulty: string): void {
    const keysToCheck = [
      `simulation_progress_${setType}_${setDifficulty}_set_${setId}`,
      `simulation_progress_${setType}_${setDifficulty}`,
      `simulation_progress_set_${setId}`,
      `simulation_progress`,
      `set_progress_${setId}_${setType}_${setDifficulty}`,
    ];

    keysToCheck.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`🧹 Cleared localStorage key: ${key}`);
      }
    });
  }

  /**
   * Clear all simulation-related localStorage
   */
  private static clearAllSimulationStorage(): void {
    const allKeys = Object.keys(localStorage);
    const simulationKeys = allKeys.filter(key => 
      key.startsWith('simulation_progress') || 
      key.startsWith('set_progress') ||
      key.includes('session_')
    );

    simulationKeys.forEach(key => {
      localStorage.removeItem(key);
      console.log(`🧹 Cleared localStorage key: ${key}`);
    });
  }

  /**
   * Clear progress for a specific user (admin function)
   */
  static async clearAllUserProgress(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Clear all simulation sessions
      const { error } = await supabase
        .from('simulation_sessions')
        .delete()
        .eq('user_id', userId);

      if (error) {
        return { success: false, error: error.message };
      }

      // Clear local storage
      this.clearAllSimulationStorage();

      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }
}

export default RestartService;
