import { createClient } from '@/lib/supabase/client'

export async function saveGameScore(
  gameName: string,
  score: number,
  timeTaken?: number,
  difficulty?: string
) {
  try {
    const supabase = createClient()
    
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('game_scores')
      .insert({
        user_id: user.id,
        game_name: gameName,
        score: score,
        time_taken: timeTaken,
        difficulty: difficulty,
      })
      .select()

    if (error) {
      console.error('Error saving game score:', error)
      throw error
    }

    return data?.[0] || null
  } catch (err) {
    console.error('Failed to save game score:', err)
    throw err
  }
}

export async function getGameScores(gameName?: string) {
  try {
    const supabase = createClient()
    
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('User not authenticated')
    }

    let query = supabase
      .from('game_scores')
      .select('*')
      .eq('user_id', user.id)

    if (gameName) {
      query = query.eq('game_name', gameName)
    }

    const { data, error } = await query.order('score', { ascending: false })

    if (error) {
      console.error('Error fetching game scores:', error)
      throw error
    }

    return data || []
  } catch (err) {
    console.error('Failed to fetch game scores:', err)
    throw err
  }
}

export async function getLeaderboard(gameName: string, limit: number = 10) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('game_scores')
      .select('user_id, game_name, score')
      .eq('game_name', gameName)
      .order('score', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching leaderboard:', error)
      throw error
    }

    // Remove duplicates and keep highest score per user
    const uniqueScores: Record<string, any> = {}
    data?.forEach((entry: any) => {
      if (!uniqueScores[entry.user_id] || uniqueScores[entry.user_id].score < entry.score) {
        uniqueScores[entry.user_id] = entry
      }
    })

    return Object.values(uniqueScores).sort((a, b) => b.score - a.score)
  } catch (err) {
    console.error('Failed to fetch leaderboard:', err)
    throw err
  }
}
