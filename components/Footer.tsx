import React, { useState } from 'react';

const licenseText = `
Licença BSD de 3 cláusulas
Copyright (c) 2025, ridwaanhall

Redistribuição e uso em formatos de origem e binários, com ou sem
modificação, são permitidas desde que as seguintes condições sejam atendidas:

1. As redistribuições do código-fonte devem manter o aviso de direitos autorais acima, esta
   lista de condições e a seguinte isenção de responsabilidade.

2. As redistribuições em formato binário devem reproduzir o aviso de direitos autorais acima,
   esta lista de condições e a seguinte isenção de responsabilidade na documentação
   e/ou outros materiais fornecidos com a distribuição.

3. Nem o nome do detentor dos direitos autorais nem os nomes de seus
   Os colaboradores podem ser usados ​​para endossar ou promover produtos derivados de
   este software sem permissão prévia por escrito específica.

ESTE SOFTWARE É FORNECIDO PELOS TITULARES DOS DIREITOS AUTORAIS E COLABORADORES "NO ESTADO EM QUE SE ENCONTRA"
E QUAISQUER GARANTIAS EXPRESSAS OU IMPLÍCITAS, INCLUINDO, MAS NÃO SE LIMITANDO A,
GARANTIAS IMPLÍCITAS DE COMERCIALIZAÇÃO E ADEQUAÇÃO A UM DETERMINADO FIM SÃO
ISENTO DE RESPONSABILIDADE. EM NENHUMA HIPÓTESE O TITULAR DOS DIREITOS AUTORAIS OU OS COLABORADORES SERÃO RESPONSÁVEIS
POR QUALQUER DANO DIRETO, INDIRETO, INCIDENTAL, ESPECIAL, EXEMPLAR OU CONSEQUENCIAL
DANOS (INCLUINDO, MAS NÃO SE LIMITANDO A, AQUISIÇÃO DE BENS SUBSTITUTOS OU
SERVIÇOS; PERDA DE USO, DADOS OU LUCROS; OU INTERRUPÇÃO DE NEGÓCIOS) NO ENTANTO
CAUSADO E SOB QUALQUER TEORIA DE RESPONSABILIDADE, SEJA EM CONTRATO, RESPONSABILIDADE OBJETIVA,
OU ATO ILÍCITO (INCLUINDO NEGLIGÊNCIA OU OUTRO) DECORRENTE DE QUALQUER FORMA DO USO
DESTE SOFTWARE, MESMO QUE AVISADO DA POSSIBILIDADE DE TAIS DANOS.
`;

// SVG Icons for social links
const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
);


const Footer: React.FC = () => {
    const [isLicenseVisible, setIsLicenseVisible] = useState(false);

    return (
        <footer className="w-full max-w-7xl mx-auto text-gray-400 text-sm mt-auto px-4 sm:px-0">
            <div 
                className="glassmorphism rounded-t-2xl p-6 relative"
            >
                {/* Top glow effect */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-sky-500 to-transparent" style={{ filter: 'blur(10px)' }}></div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
                    {/* Logo & Title */}
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="flex items-center gap-3">
                            <img src="https://i.postimg.cc/ZK4nFyHG/mitica-logo-Photoroom.png" alt="Logo" className="h-12 w-12" />
                            <div>
                                <h4 className="font-bold text-white text-base">Mítica Estratégia MLBB</h4>
                                <p className="text-xs text-slate-400">Análises de IA para Mobile Legends</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-5">
                            <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-sky-400 transition-colors" aria-label="Instagram">
                                <InstagramIcon />
                            </a>
                             <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-sky-400 transition-colors" aria-label="Facebook">
                                <FacebookIcon />
                            </a>
                        </div>
                    </div>

                    {/* Credits */}
                    <div className="flex flex-col items-center gap-2">
                        <p>
                            Desenvolvido por <a href="https://github.com/Kiminasu" target="_blank" rel="noopener noreferrer" className="font-semibold text-amber-400 hover:underline">Lucas Kimi</a>
                        </p>
                        <p>
                            Dados da API por{' '}
                            <a href="https://github.com/ridwaanhall" target="_blank" rel="noopener noreferrer" className="font-semibold text-amber-400 hover:underline">
                                ridwaanhall
                            </a>
                        </p>
                    </div>

                    {/* Legal */}
                    <div className="flex flex-col items-center md:items-end gap-2">
                        <button 
                            onClick={() => setIsLicenseVisible(!isLicenseVisible)}
                            className="font-semibold text-slate-300 hover:text-white transition-colors"
                        >
                            {isLicenseVisible ? 'Ocultar Licença da API' : 'Ver Licença da API'}
                        </button>
                    </div>
                </div>

                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isLicenseVisible ? 'max-h-96 mt-6' : 'max-h-0'}`}>
                    <pre className="text-left bg-black/30 p-3 rounded-md overflow-x-auto whitespace-pre-wrap text-xs text-gray-500">
                        {licenseText.trim()}
                    </pre>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-700/50 text-center text-xs text-gray-500 space-y-2">
                     <p>Mítica Estratégia é um projeto de fã e não é afiliado, endossado ou patrocinado pela Moonton. Mobile Legends: Bang Bang e todos os ativos relacionados são marcas comerciais e direitos autorais da Moonton.</p>
                    <p>&copy; {new Date().getFullYear()} Mítica Estratégia. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;