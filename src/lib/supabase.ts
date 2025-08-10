// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types
export interface TipRecord {
  id?: string
  tip_jar_id: string
  amount: number
  message?: string
  supporter_username?: string
  show_name: boolean
  transaction_hash?: string
  status?: 'pending' | 'confirmed' | 'failed'
  created_at?: string
  updated_at?: string
}

// API functions
export const tipAPI = {
  // Record a new tip
  async recordTip(tipData: Omit<TipRecord, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('tips')
      .insert(tipData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Get tips for a tip jar
  async getTipsForJar(tipJarId: string) {
    const { data, error } = await supabase
      .from('tips')
      .select('*')
      .eq('tip_jar_id', tipJarId)
      .eq('status', 'confirmed')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Update tip status (for blockchain confirmation)
  async updateTipStatus(tipId: string, status: 'confirmed' | 'failed', transactionHash?: string) {
    const updateData: any = { status }
    if (transactionHash) updateData.transaction_hash = transactionHash

    const { data, error } = await supabase
      .from('tips')
      .update(updateData)
      .eq('id', tipId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Get tip statistics for a jar
  async getTipStats(tipJarId: string) {
    const { data, error } = await supabase
      .from('tips')
      .select('amount')
      .eq('tip_jar_id', tipJarId)
      .eq('status', 'confirmed')
    
    if (error) throw error
    
    const totalAmount = data.reduce((sum, tip) => sum + Number(tip.amount), 0)
    const supporterCount = data.length
    
    return {
      totalAmount,
      supporterCount,
      tips: data
    }
  }
}