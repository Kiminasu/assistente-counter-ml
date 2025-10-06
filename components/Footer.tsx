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

const Footer: React.FC = () => {
    const [isLicenseVisible, setIsLicenseVisible] = useState(false);

    return (
        <footer className="w-full max-w-7xl mx-auto mt-16 text-gray-400 text-sm">
            <div 
                className="glassmorphism rounded-t-2xl p-6"
                style={{
                    borderTop: '2px solid',
                    borderImageSource: 'linear-gradient(to right, var(--color-primary-accent), var(--color-secondary-accent))',
                    borderImageSlice: 1,
                    borderBottom: 0,
                    borderLeft: 0,
                    borderRight: 0,
                }}
            >
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                    <div className="flex items-center gap-3">
                        <img src="https://i.postimg.cc/ZK4nFyHG/mitica-logo-Photoroom.png" alt="Logo" className="h-12 w-12" />
                        <div>
                            <h4 className="font-bold text-white text-base">Mítica Estratégia MLBB</h4>
                            <p className="text-xs text-slate-400">Análises de IA para Mobile Legends</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                         <p>
                            Desenvolvido por <a href="https://github.com/Kiminasu" target="_blank" rel="noopener noreferrer" className="font-semibold text-amber-400 hover:underline">Lucas Kimi</a>
                        </p>
                        <p>
                            Dados da API por{' '}
                            <a 
                                href="https://github.com/ridwaanhall" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="font-semibold text-amber-400 hover:underline"
                            >
                                ridwaanhall
                            </a>
                        </p>
                    </div>
                     <div>
                        <button 
                            onClick={() => setIsLicenseVisible(!isLicenseVisible)}
                            className="font-semibold text-slate-300 hover:text-white transition-colors"
                        >
                            Ver Licença da API
                        </button>
                    </div>
                </div>

                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isLicenseVisible ? 'max-h-96 mt-6' : 'max-h-0'}`}>
                    <pre className="text-left bg-black/30 p-3 rounded-md overflow-x-auto whitespace-pre-wrap text-xs text-gray-500">
                        {licenseText.trim()}
                    </pre>
                </div>

                <div className="text-center text-xs text-gray-500 mt-6 pt-4 border-t border-slate-700/50">
                    <p>&copy; {new Date().getFullYear()} Mítica Estratégia. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
