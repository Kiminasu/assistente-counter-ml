
import React from 'react';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
            <div className="glassmorphism rounded-2xl shadow-xl max-w-md w-full flex flex-col border-2 border-amber-400 modal-animation" style={{boxShadow: '0 0 30px rgba(251, 191, 36, 0.3)'}}>
                <div className="p-4 border-b border-amber-400/30 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-amber-300 flex items-center gap-2">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Desbloqueie o Acesso Premium
                    </h2>
                    <button onClick={onClose} className="text-3xl text-gray-400 hover:text-white">&times;</button>
                </div>
                <div className="p-6 text-center">
                    <p className="text-lg text-slate-200">
                        Você atingiu o limite de análises ou está tentando acessar um recurso <strong className="text-amber-300">PRO</strong>.
                    </p>
                    <div className="my-6 bg-black/20 p-4 rounded-lg">
                        <h3 className="font-bold text-slate-200 mb-3">Vantagens da Conta Premium:</h3>
                        <ul className="text-left space-y-2 text-slate-300 text-sm">
                            <li className="flex items-start gap-2"><span className="text-green-400 mt-1">✓</span><span><strong className="text-white">Análises de IA Ilimitadas:</strong> Use o poder da IA sem restrições diárias.</span></li>
                            <li className="flex items-start gap-2"><span className="text-green-400 mt-1">✓</span><span><strong className="text-white">Acesso ao Draft 5vs5:</strong> Planeje drafts completos com análise em tempo real.</span></li>
                            <li className="flex items-start gap-2"><span className="text-green-400 mt-1">✓</span><span><strong className="text-white">Novos Recursos Antecipados:</strong> Tenha acesso a futuras ferramentas premium primeiro.</span></li>
                        </ul>
                    </div>
                    
                    <div className="mt-6">
                        <button 
                            className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold py-3 px-4 rounded-xl text-lg hover:from-amber-300 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-yellow-500/20"
                        >
                            Fazer Upgrade Agora (Em Breve)
                        </button>
                        <button 
                            onClick={onClose}
                            className="mt-3 text-sm text-slate-400 hover:text-white"
                        >
                            Talvez mais tarde
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpgradeModal;
