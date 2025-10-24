import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { TeamData, TeamMember, UserProfile } from '../types';
import { Session } from '@supabase/supabase-js';

// Subcomponente para a tela de carregamento
const LoadingState: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full py-16">
        <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-sky-400"></div>
        <p className="mt-4 text-lg text-gray-300">A carregar dados da equipa...</p>
    </div>
);

// Subcomponente para exibir erros
const ErrorState: React.FC<{ error: string }> = ({ error }) => (
    <div className="text-center text-red-400 p-6 bg-red-900/20 rounded-xl">
        <p className="font-bold">Ocorreu um erro</p>
        <p className="text-sm mt-1">{error}</p>
    </div>
);

interface TeamsScreenProps {
    session: Session | null;
    userProfile: UserProfile | null;
    onUpgradeClick: () => void;
}

const TeamsScreen: React.FC<TeamsScreenProps> = ({ session, userProfile, onUpgradeClick }) => {
    const [loading, setLoading] = useState(true);
    const [team, setTeam] = useState<TeamData | null>(null);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [invitation, setInvitation] = useState<(TeamMember & { teams: TeamData }) | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [teamName, setTeamName] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    
    const [inviteEmail, setInviteEmail] = useState('');

    const [isEditingLogo, setIsEditingLogo] = useState(false);
    const [newLogoUrl, setNewLogoUrl] = useState('');


    const fetchData = useCallback(async () => {
        setError(null);
    
        if (!session?.user?.id || !session.user.email || !supabase) {
            throw new Error("Usuário não autenticado.");
        }
    
        const userId = session.user.id;
        
        const { data: inviteData, error: rpcError } = await supabase.rpc('get_my_invitation');

        if (rpcError) {
            if (rpcError.message.includes('function get_my_invitation() does not exist')) {
                throw new Error("Ação necessária: A função de busca de convites não foi encontrada no backend. Por favor, peça ao administrador para criar a função 'get_my_invitation' no Editor SQL do Supabase.");
            }
            throw rpcError;
        }

        const inviteRecord = inviteData && Array.isArray(inviteData) && inviteData.length > 0 ? inviteData[0] : null;

        if (inviteRecord) {
            const fullInvitation = {
                id: inviteRecord.id,
                team_id: inviteRecord.team_id,
                invited_email: inviteRecord.invited_email,
                status: 'pending',
                user_id: null,
                teams: {
                    id: inviteRecord.team_id,
                    name: inviteRecord.team_name,
                    logo_url: inviteRecord.team_logo_url,
                    created_at: new Date().toISOString(), 
                    owner_id: ''
                }
            };
            setInvitation(fullInvitation as (TeamMember & { teams: TeamData }));
            setTeam(null);
            return;
        }
    
        const { data: memberRecord, error: memberError } = await supabase
            .from('team_members')
            .select('team_id')
            .eq('user_id', userId)
            .eq('status', 'accepted')
            .maybeSingle();
    
        if (memberError) throw memberError;
    
        if (memberRecord?.team_id) {
            const teamId = memberRecord.team_id;
    
            const [teamResult, membersResult] = await Promise.all([
                supabase.from('teams').select('*').eq('id', teamId).single(),
                supabase.from('team_members').select('*, profiles(username)').eq('team_id', teamId)
            ]);
    
            const { data: teamData, error: teamError } = teamResult;
            if (teamError) throw teamError;
    
            const { data: membersData, error: membersError } = membersResult;
            if (membersError) {
                if (membersError.message.includes('infinite recursion')) {
                    throw new Error('Erro de Configuração Detectado: Ocorreu uma recursão infinita ao buscar os perfis dos membros. Isso é geralmente causado por uma configuração incorreta das Políticas de Segurança (RLS) no Supabase. Por favor, revise suas políticas para corrigir o problema.');
                }
                throw membersError;
            }
            
            setTeam(teamData);
            setMembers(membersData as TeamMember[]);
            setInvitation(null);
        } else {
            setTeam(null);
            setMembers([]);
            setInvitation(null);
        }
    }, [session]);
    
    useEffect(() => {
        const initialLoad = async () => {
            setLoading(true);
            try {
                await fetchData();
            } catch (err: any) {
                console.error("Erro ao buscar dados da equipe:", err.message);
                const errorMessage = `Falha ao carregar dados da equipe. Verifique as políticas de segurança (RLS). (Erro: ${err.message})`;
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };
        initialLoad();
    }, [fetchData]);

    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user?.email || !teamName || !supabase) return;
        setLoading(true);
        setError(null);
    
        try {
            const { data: teamData, error: insertError } = await supabase
                .from('teams')
                .insert({ name: teamName, logo_url: logoUrl, owner_id: session.user.id })
                .select()
                .single();
    
            if (insertError) throw insertError;
            if (!teamData) throw new Error("Falha ao obter dados da equipe recém-criada.");
    
            const { error: memberError } = await supabase
                .from('team_members')
                .insert({
                    team_id: teamData.id,
                    user_id: session.user.id,
                    invited_email: session.user.email,
                    status: 'accepted'
                });
            
            if (memberError) {
                await supabase.from('teams').delete().eq('id', teamData.id);
                throw memberError;
            }
    
            setIsCreateModalOpen(false);
            setTeamName('');
            setLogoUrl('');
            await fetchData();
    
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInviteMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!team || !inviteEmail || members.length >= 6 || !supabase) {
            setError(members.length >= 6 ? 'Limite de 6 membros atingido.' : 'Email inválido.');
            return;
        }
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const { error: inviteError } = await supabase
                .from('team_members')
                .insert({ team_id: team.id, invited_email: inviteEmail });

            if (inviteError) throw inviteError;
            
            setSuccessMessage(`Convite enviado para ${inviteEmail}!`);
            setInviteEmail('');
            await fetchData();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch(err: any) {
             setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveMember = async (memberId: number) => {
        if (!window.confirm("Tem a certeza que quer remover este membro?") || !supabase) return;
        setLoading(true);
        try {
            const { error: deleteError } = await supabase
                .from('team_members')
                .delete()
                .eq('id', memberId);

            if (deleteError) throw deleteError;
            
            await fetchData();
        } catch(err: any) {
             setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptInvite = async () => {
        const currentInvitation = invitation; // Captura os dados do convite atual
        if (!currentInvitation || !session?.user || !supabase) return;
        setLoading(true);
        setError(null);
    
        try {
            // Chama a função no backend para aceitar o convite
            const { error: rpcError } = await supabase.rpc('accept_my_invitation');
            if (rpcError) throw rpcError;
    
            // ATUALIZAÇÃO OTIMISTA: Assume que a operação foi bem-sucedida e atualiza a UI imediatamente.
            // Usa os dados da equipe que já estavam no objeto do convite.
            setInvitation(null);
            setTeam(currentInvitation.teams);
            setLoading(false); // Para o carregamento principal, a UI já está correta.
    
            // Em segundo plano, busca a lista completa e atualizada de membros.
            const { data: membersData, error: membersError } = await supabase
                .from('team_members')
                .select('*, profiles(username)')
                .eq('team_id', currentInvitation.teams.id);
            
            if (membersError) {
                // Se a busca de membros falhar, exibe um erro não bloqueante.
                console.error("Falha ao buscar membros da equipe após aceitar convite:", membersError.message);
                setError("Não foi possível carregar a lista de membros da equipe. Por favor, atualize a página.");
            } else {
                setMembers(membersData as TeamMember[]);
            }
    
        } catch (err: any) {
            let friendlyError = err.message;
            if (err.message?.includes('function accept_my_invitation() does not exist')) {
                friendlyError = "Ação necessária: A função para aceitar convites não foi encontrada. Peça ao administrador para criar a função 'accept_my_invitation' no Editor SQL do Supabase.";
            }
            setError(friendlyError);
            setLoading(false); // Garante que o carregamento pare em caso de erro.
        }
    };
    
    const handleDeclineInvite = async () => {
        if (!invitation || !supabase) return;
        setLoading(true);
        setError(null);
    
        try {
            const { error: rpcError } = await supabase.rpc('decline_my_invitation');
            if (rpcError) throw rpcError;
            
            // O convite foi removido no backend. Apenas limpa o estado local para refletir isso.
            setInvitation(null);
    
        } catch (err: any) {
            let friendlyError = err.message;
            if (err.message?.includes('function decline_my_invitation() does not exist')) {
                friendlyError = "Ação necessária: A função para recusar convites não foi encontrada. Peça ao administrador para criar a função 'decline_my_invitation' no Editor SQL do Supabase.";
            }
            setError(friendlyError);
        } finally {
            setLoading(false);
        }
    };

     const handleUpdateLogo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!team || !supabase) return;
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const { error: updateError } = await supabase
                .from('teams')
                .update({ logo_url: newLogoUrl })
                .eq('id', team.id);

            if (updateError) throw updateError;
            
            setSuccessMessage("Logo atualizado com sucesso!");
            setIsEditingLogo(false);
            await fetchData();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // --- LÓGICA DE RENDERIZAÇÃO ---

    if (loading) {
        return <LoadingState />;
    }

    if (error) {
        return <ErrorState error={error} />;
    }
    
    // 1. Prioridade máxima: Mostrar convite pendente.
    if (invitation) {
        return (
            <div className="w-full max-w-2xl mx-auto glassmorphism p-6 rounded-2xl border-2 panel-glow-primary text-center">
                <h2 className="text-2xl font-bold text-amber-300">Você foi convidado!</h2>
                <p className="mt-2 text-slate-300">Você recebeu um convite para se juntar à equipe <strong className="text-white">{invitation.teams.name}</strong>.</p>
                <div className="mt-6 flex justify-center gap-4">
                    <button onClick={handleAcceptInvite} className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-lg transition-colors">Aceitar</button>
                    <button onClick={handleDeclineInvite} className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-6 rounded-lg transition-colors">Recusar</button>
                </div>
            </div>
        );
    }

    // 2. Se não houver convite, mostrar a equipe atual do usuário.
    if (team) {
        const isOwner = team.owner_id === session?.user?.id;
        const ownerProfile = members.find(m => m.user_id === team.owner_id);
        const ownerUsername = ownerProfile?.profiles?.username || session?.user?.email;
        return (
            <>
                <div className="w-full max-w-4xl mx-auto space-y-8">
                    <div className="flex flex-col items-center justify-center text-center pt-4">
                        <div className="relative w-32 h-32">
                            {team.logo_url ? (
                                <img
                                    src={team.logo_url}
                                    alt="Logo da Equipe"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-slate-600 shadow-lg"
                                    style={{ filter: 'drop-shadow(0 0 15px rgba(56, 182, 255, 0.3))' }}
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full border-4 border-dashed border-slate-600 bg-slate-800/50 flex items-center justify-center text-center p-2">
                                    <span className="text-xs text-slate-400">Sem imagem de equipe</span>
                                </div>
                            )}

                            {isOwner && (
                                <button
                                    onClick={() => { setIsEditingLogo(true); setNewLogoUrl(team.logo_url || ''); }}
                                    className="absolute -bottom-2 -right-2 bg-slate-800/80 p-2 rounded-full hover:bg-sky-500 transition-colors border border-slate-600"
                                    aria-label="Editar logo"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                </button>
                            )}
                        </div>
                        <h1 className="text-3xl font-bold text-white mt-4">{team.name}</h1>
                    </div>

                    <div className="glassmorphism p-6 rounded-2xl border-2 panel-glow-secondary">
                        <h2 className="text-xl font-bold text-center mb-4 text-amber-300">Membros da Equipe ({members.length}/6)</h2>
                        {successMessage && <p className="bg-green-500/30 text-green-300 text-center p-2 rounded-lg mb-4 text-sm">{successMessage}</p>}
                        <ul className="space-y-3">
                            <li className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold bg-amber-500 text-black px-2 py-0.5 rounded-full">TÉCNICO</span>
                                    <span className="font-semibold text-white">{ownerUsername}</span>
                                </div>
                            </li>
                            {members.filter(m => m.user_id !== team.owner_id).map(member => (
                                <li key={member.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${member.status === 'accepted' ? 'bg-green-500/80 text-black' : 'bg-yellow-500/80 text-black'}`}>{member.status === 'accepted' ? 'MEMBRO' : member.status.toUpperCase()}</span>
                                        <span className="text-slate-300">{member.profiles?.username || member.invited_email}</span>
                                    </div>
                                    {isOwner && (
                                        <button onClick={() => handleRemoveMember(member.id)} className="text-red-400 hover:text-red-300 text-xs font-semibold">REMOVER</button>
                                    )}
                                </li>
                            ))}
                        </ul>

                        {isOwner && members.length < 6 && (
                            <form onSubmit={handleInviteMember} className="mt-6 border-t border-slate-700 pt-4 flex flex-col sm:flex-row gap-3">
                                <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="Email do novo membro" required className="flex-grow bg-slate-800/50 border border-slate-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500" />
                                <button type="submit" className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-5 rounded-lg transition-colors">Convidar</button>
                            </form>
                        )}
                        {isOwner && members.length >= 6 && (
                            <p className="text-center text-sm text-yellow-400 mt-4">Você atingiu o limite de 6 membros na equipe.</p>
                        )}
                    </div>
                </div>

                {isEditingLogo && (
                     <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
                        <div className="glassmorphism rounded-2xl shadow-xl max-w-md w-full flex flex-col border border-sky-500 modal-animation">
                            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                                <h2 className="text-xl font-bold">Editar Logo da Equipe</h2>
                                <button onClick={() => setIsEditingLogo(false)} className="text-3xl text-gray-400 hover:text-white">&times;</button>
                            </div>
                            <form onSubmit={handleUpdateLogo} className="p-6 space-y-4">
                                <div>
                                    <label htmlFor="newLogoUrl" className="block text-sm font-medium text-gray-300">Nova URL do Logo</label>
                                    <input id="newLogoUrl" type="url" value={newLogoUrl} onChange={e => setNewLogoUrl(e.target.value)} placeholder="https://exemplo.com/logo.png" required className="mt-1 block w-full bg-slate-800/50 border border-slate-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500" />
                                </div>
                                <div className="flex justify-end gap-4 pt-4">
                                    <button type="button" onClick={() => setIsEditingLogo(false)} className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-semibold">Cancelar</button>
                                    <button type="submit" disabled={loading} className="py-2 px-4 bg-sky-600 hover:bg-sky-500 rounded-lg text-white font-semibold disabled:opacity-50">
                                        {loading ? 'Salvando...' : 'Salvar'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </>
        );
    }
    
    // 3. Se não tiver convite nem time, verifique o plano para permitir a criação.
    const isGloryPlan = userProfile?.plan_id === 'monthly_glory';
    if (isGloryPlan) {
        return (
            <>
                <div className="w-full max-w-2xl mx-auto glassmorphism p-8 rounded-2xl border-2 panel-glow-primary text-center">
                    <h2 className="text-2xl font-bold text-amber-300">Crie sua Equipe</h2>
                    <p className="mt-2 text-slate-300">Você ainda não faz parte de uma equipe. Crie a sua para começar a analisar estratégias em grupo!</p>
                    <button onClick={() => setIsCreateModalOpen(true)} className="mt-6 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold py-3 px-8 rounded-xl text-lg hover:from-sky-400 hover:to-cyan-400 transition-all duration-300 shadow-lg shadow-sky-500/40 transform hover:scale-105">
                        Criar minha Equipe
                    </button>
                </div>

                {isCreateModalOpen && (
                     <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
                        <div className="glassmorphism rounded-2xl shadow-xl max-w-md w-full flex flex-col border border-sky-500 modal-animation">
                            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                                <h2 className="text-xl font-bold">Criar Nova Equipe</h2>
                                <button onClick={() => setIsCreateModalOpen(false)} className="text-3xl text-gray-400 hover:text-white">&times;</button>
                            </div>
                            <form onSubmit={handleCreateTeam} className="p-6 space-y-4">
                                <div>
                                    <label htmlFor="teamName" className="block text-sm font-medium text-gray-300">Nome da Equipe</label>
                                    <input id="teamName" type="text" value={teamName} onChange={e => setTeamName(e.target.value)} required className="mt-1 block w-full bg-slate-800/50 border border-slate-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500" />
                                </div>
                                <div>
                                    <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-300">URL do Logo (Opcional)</label>
                                    <input id="logoUrl" type="url" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="https://exemplo.com/logo.png" className="mt-1 block w-full bg-slate-800/50 border border-slate-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500" />
                                </div>
                                <div className="flex justify-end gap-4 pt-4">
                                    <button type="button" onClick={() => setIsCreateModalOpen(false)} className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-semibold">Cancelar</button>
                                    <button type="submit" disabled={loading} className="py-2 px-4 bg-sky-600 hover:bg-sky-500 rounded-lg text-white font-semibold disabled:opacity-50">
                                        {loading ? 'A criar...' : 'Criar Equipe'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </>
        );
    }

    // 4. Fallback final: Se não for do plano Glória, mostrar a tela de upgrade.
    return (
        <div className="w-full max-w-2xl mx-auto glassmorphism p-8 rounded-2xl border-2 border-purple-400 text-center animated-entry" style={{boxShadow: '0 0 30px rgba(192, 132, 252, 0.4)'}}>
            <h2 className="text-2xl font-bold text-purple-300 mb-4 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                Recurso Glória Imortal
            </h2>
            <p className="text-slate-200 mb-6">A criação e gerenciamento de equipes é um recurso exclusivo para assinantes do plano Glória Imortal. Faça o upgrade para colaborar com sua equipe e dominar o meta!</p>
            <button 
                onClick={onUpgradeClick}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 px-6 rounded-xl text-lg hover:from-purple-400 hover:to-indigo-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30"
            >
                Ver Planos
            </button>
        </div>
    );
};

export default TeamsScreen;