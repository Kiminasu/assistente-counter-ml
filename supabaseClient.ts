import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ====================================================================================
// AÇÃO NECESSÁRIA: Substitua os valores abaixo pelas suas credenciais do Supabase.
// Você pode encontrá-las nas configurações do seu projeto Supabase em:
// Configurações do Projeto > API
// ====================================================================================

const supabaseUrl = 'https://kuniwzaomcwixlnhachs.supabase.co'; // Ex: https://exemplo.supabase.co
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1bml3emFvbWN3aXhsbmhhY2hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2MDMwMTIsImV4cCI6MjA3NTE3OTAxMn0.IOS2Tv7xzPPKYGUfLrEvGRK4OJzZKKy0GwUncLk5q40'; // A chave 'anon' 'public'

// ====================================================================================

// Verifica se os valores de placeholder ainda estão sendo usados.
const isPlaceholder = supabaseUrl.includes('URL_DO_SEU_PROJETO_SUPABASE') || supabaseAnonKey.includes('SUA_CHAVE_ANON_SUPABASE');

if (isPlaceholder) {
    console.warn("As credenciais do Supabase não foram configuradas. Por favor, edite o arquivo 'supabaseClient.ts'. A aplicação exibirá uma tela de instruções.");
}

// Inicializa o cliente apenas se as credenciais forem reais. Caso contrário, exporta nulo.
export const supabase: SupabaseClient | null = isPlaceholder
    ? null
    : createClient(supabaseUrl, supabaseAnonKey);