import React from 'react';

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
    return (
        <footer className="w-full max-w-7xl mx-auto mt-8 text-center text-gray-500">
            <div className="bg-black bg-opacity-20 p-4 rounded-lg">
                <p className="text-sm mb-2">
                    Desenvolvido por <a href="https://github.com/Kiminasu" target="_blank" rel="noopener noreferrer" className="font-bold text-amber-400 hover:underline">Lucas Kimi</a>
                </p>
                <p className="text-sm">
                    Os dados estatísticos dos heróis são fornecidos através da API MLBB-Stats, criada por{' '}
                    <a 
                        href="https://github.com/ridwaanhall" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:underline"
                    >
                        ridwaanhall
                    </a>
                    .
                </p>
                <details className="mt-2 text-xs cursor-pointer">
                    <summary className="hover:text-gray-300">Ver Licença da API</summary>
                    <pre className="mt-2 text-left bg-gray-900 p-3 rounded-md overflow-x-auto whitespace-pre-wrap text-gray-400">
                        {licenseText.trim()}
                    </pre>
                </details>
            </div>
        </footer>
    );
};

export default Footer;