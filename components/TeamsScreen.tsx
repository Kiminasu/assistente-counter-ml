import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { TeamData, TeamMember } from '../types';
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
}

const TeamsScreen: React.FC<TeamsScreenProps> = ({ session }) => {
    const [loading, setLoading] = useState(true);
    const [team, setTeam] = useState<TeamData | null>(null);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [invitation, setInvitation] = useState<(TeamMember & { teams: TeamData }) | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [teamName, setTeamName] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    
    const [inviteEmail, setInviteEmail] = useState('');

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        setTeam(null);
        setMembers([]);
        setInvitation(null);
    
        if (!session?.user?.id || !session.user.email) {
            setError("Usuário não autenticado.");
            setLoading(false);
            return;
        }
    
        try {
            const userId = session.user.id;
            const userEmail = session.user.email;
            let teamId: string | null = null;
    
            // 1. Primeiro, determine o ID da equipe do usuário, se houver.
            // Priorize a propriedade, pois é a associação mais forte.
            const { data: ownedTeamData, error: ownedTeamError } = await supabase
                .from('teams')
                .select('id')
                .eq('owner_id', userId)
                .maybeSingle();
            if (ownedTeamError) throw ownedTeamError;
    
            if (ownedTeamData) {
                teamId = ownedTeamData.id;
            } else {
                // Se não for proprietário, verifique se é um membro aceito.
                const { data: memberRecord, error: memberError } = await supabase
                    .from('team_members')
                    .select('team_id')
                    .eq('user_id', userId)
                    .eq('status', 'accepted')
                    .maybeSingle();
                if (memberError) throw memberError;
    
                if (memberRecord) {
                    teamId = memberRecord.team_id;
                }
            }
    
            // 2. Se um ID de equipe foi encontrado, busque os detalhes completos da equipe e dos membros.
            if (teamId) {
                const { data: teamData, error: teamError } = await supabase
                    .from('teams')
                    .select('*')
                    .eq('id', teamId)
                    .single();
                if (teamError) throw teamError;
    
                const { data: membersData, error: membersError } = await supabase
                    .from('team_members')
                    .select('*, profiles(username)')
                    .eq('team_id', teamId);
                if (membersError) throw membersError;
    
                setTeam(teamData);
                setMembers(membersData as TeamMember[]);
            } else {
                // 3. Se não houver equipe associada, verifique se há convites pendentes.
                const { data: invite, error: inviteError } = await supabase
                    .from('team_members')
                    .select('*, teams(*)')
                    .eq('invited_email', userEmail)
                    .eq('status', 'pending')
                    .maybeSingle();
                if (inviteError) throw inviteError;
    
                if (invite && invite.teams) {
                    setInvitation(invite as TeamMember & { teams: TeamData });
                }
            }
        } catch (err: any) {
            console.error("Erro ao buscar dados da equipe:", err.message);
            const errorMessage = `Falha ao carregar dados da equipe. Verifique as políticas de segurança (RLS) para possíveis recursões. (Erro: ${err.message})`;
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [session]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user || !teamName) return;
        setLoading(true);
        const { error: insertError } = await supabase
            .from('teams')
            .insert({ name: teamName, logo_url: logoUrl, owner_id: session.user.id });

        if (insertError) {
            setError(insertError.message);
        } else {
            setIsCreateModalOpen(false);
            setTeamName('');
            setLogoUrl('');
            await fetchData(); // Refrescar dados
        }
        setLoading(false);
    };

    const handleInviteMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!team || !inviteEmail || members.length >= 6) {
            setError(members.length >= 6 ? 'Limite de 6 membros atingido.' : 'Email inválido.');
            return;
        }
        setLoading(true);

        const { error: inviteError } = await supabase
            .from('team_members')
            .insert({ team_id: team.id, invited_email: inviteEmail });

        if (inviteError) {
            setError(inviteError.message);
        } else {
            setInviteEmail('');
            await fetchData();
        }
        setLoading(false);
    };

    const handleRemoveMember = async (memberId: number) => {
        if (!window.confirm("Tem a certeza que quer remover este membro?")) return;
        setLoading(true);
        const { error: deleteError } = await supabase
            .from('team_members')
            .delete()
            .eq('id', memberId);

        if (deleteError) setError(deleteError.message);
        else await fetchData();
        setLoading(false);
    };

    const handleAcceptInvite = async () => {
        if (!invitation || !session?.user) return;
        setLoading(true);
        const { error: updateError } = await supabase
            .from('team_members')
            .update({ status: 'accepted', user_id: session.user.id })
            .eq('id', invitation.id);

        if (updateError) setError(updateError.message);
        else {
            setInvitation(null);
            await fetchData();
        }
        setLoading(false);
    };
    
    const handleDeclineInvite = async () => {
        if (!invitation) return;
        setLoading(true);
        const { error: deleteError } = await supabase
            .from('team_members')
            .delete()
            .eq('id', invitation.id);
            
        if (deleteError) setError(deleteError.message);
        else {
            setInvitation(null);
            await fetchData();
        }
        setLoading(false);
    };

    const isOwner = team?.owner_id === session?.user?.id;

    if (loading) return <LoadingState />;
    if (error) return <ErrorState error={error} />;

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
    
    if (team) {
        const ownerProfile = members.find(m => m.user_id === team.owner_id);
        const ownerUsername = ownerProfile?.profiles?.username || session?.user?.email;

        return (
            <div className="w-full max-w-4xl mx-auto space-y-8">
                <div className="glassmorphism p-6 rounded-2xl border-2 panel-glow-primary text-center">
                    <img src={team.logo_url || 'https://i.postimg.cc/ZK4nFyHG/mitica-logo-Photoroom.png'} alt="Logo da Equipe" className="w-24 h-24 rounded-full mx-auto border-4 border-slate-600 mb-4" />
                    <h1 className="text-3xl font-bold text-white">{team.name}</h1>
                </div>

                <div className="glassmorphism p-6 rounded-2xl border-2 panel-glow-secondary">
                    <h2 className="text-xl font-bold text-center mb-4 text-amber-300">Membros da Equipe ({members.length}/6)</h2>
                    <ul className="space-y-3">
                        {/* Dono/Técnico */}
                         <li className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-bold bg-amber-500 text-black px-2 py-0.5 rounded-full">TÉCNICO</span>
                                <span className="font-semibold text-white">{ownerUsername}</span>
                            </div>
                        </li>
                        {/* Membros */}
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
        );
    }

    // Se não tem equipe nem convite, mostra a opção de criar
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
};

export default TeamsScreen;