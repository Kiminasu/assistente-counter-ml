import React from 'react';

interface FeaturesPageProps {
  onGoBack: () => void;
  onLaunchApp: () => void;
  onSeePlans: () => void;
}

const FeatureDetail: React.FC<{
  title: string;
  description: string;
  benefits: string[];
  imageUrl: string;
  reverse?: boolean;
}> = ({ title, description, benefits, imageUrl, reverse = false }) => {
  const textContent = (
    <div className="lg:w-1/2 flex flex-col justify-center text-center lg:text-left animated-entry">
      <h3 className="text-3xl font-bold text-amber-300">{title}</h3>
      <p className="mt-4 text-slate-300">{description}</p>
      <ul className="mt-6 space-y-3">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-300 flex items-center justify-center mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-slate-300">{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const imageContent = (
    <div className="lg:w-1/2 animated-entry">
      <div className="bg-white/5 backdrop-blur-md p-3 rounded-3xl border border-white/10 shadow-2xl transform transition-transform duration-500 hover:scale-105">
        <img src={imageUrl} alt={title} className="w-full rounded-2xl" loading="eager" fetchpriority="high" />
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col lg:flex-row gap-12 lg:gap-16 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}>
      {textContent}
      {imageContent}
    </div>
  );
};


const FeaturesPage: React.FC<FeaturesPageProps> = ({ onGoBack, onLaunchApp, onSeePlans }) => {
  return (
    <div className="w-full animated-entry">
      <header className="sticky top-0 z-30 bg-black/50 backdrop-blur-md border-b border-slate-700/50">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                  <button 
                      onClick={onGoBack} 
                      className="text-slate-300 hover:text-white font-semibold transition-colors text-lg p-2 rounded-lg flex items-center gap-2"
                      aria-label="Voltar"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      <span className="hidden sm:block">Voltar</span>
                  </button>
                  <div className="flex items-center gap-4">
                       <button onClick={onSeePlans} className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Planos</button>
                       <button onClick={onLaunchApp} className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold py-2 px-5 rounded-lg text-sm hover:from-sky-600 hover:to-cyan-600 transition-all duration-300">
                          Acessar App
                      </button>
                  </div>
              </div>
          </div>
      </header>

      <main className="flex flex-col items-center text-white space-y-28 pt-20 pb-20 overflow-x-hidden">
        
        {/* Hero Section */}
        <section className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
                O Arsenal <span className="font-black text-amber-300" style={{ fontFamily: "'Inter', sans-serif" }}>Estratégico</span> Definitivo
            </h1>
            <p className="text-md sm:text-xl text-slate-300 mt-4">
                Explore as ferramentas que transformarão sua visão de jogo e o levarão à vitória. Cada funcionalidade foi desenhada com precisão para lhe dar a vantagem que você precisa.
            </p>
        </section>

        {/* Features Details */}
        <section className="w-full max-w-6xl mx-auto px-4 space-y-24">
            <FeatureDetail
                title="Análise de Confronto 1v1"
                description="Domine sua lane antes mesmo da partida começar. Nossa IA analisa qualquer confronto 1v1 e revela a estratégia exata para vencer, desde a escolha de itens até a movimentação."
                benefits={[
                    "Receba sugestões de 3 a 5 heróis de counter para qualquer oponente.",
                    "Build de itens e feitiços otimizados para o confronto específico.",
                    "Análise tática detalhada sobre como explorar as fraquezas do inimigo."
                ]}
                imageUrl="https://i.postimg.cc/fb5rY3Yn/Captura-de-tela-2025-10-18-234245.png"
            />
            <FeatureDetail
                title="Estrategista de Draft 5v5 (Premium)"
                description="Vença a partida na tela de seleção. Analise sinergias, identifique pontos fracos e receba sugestões de picks e bans em tempo real para montar uma composição imbatível."
                benefits={[
                    "Barra de vantagem que mostra qual time está mais forte no draft.",
                    "Sugestão inteligente do próximo pick para fortalecer sua equipe.",
                    "Recomendações de bans táticos para desestabilizar a estratégia inimiga."
                ]}
                imageUrl="https://i.postimg.cc/qRR4SZnW/Captura-de-tela-2025-10-19-001014.png"
                reverse
            />
            <FeatureDetail
                title="Inteligência de Herói"
                description="Mergulhe fundo em qualquer herói do jogo. Obtenha um dossiê completo com builds, estilo de jogo, picos de poder, sinergias e, o mais importante, os counters perfeitos para cada lane."
                benefits={[
                    "Builds de itens essenciais e situacionais com explicações.",
                    "Estratégia detalhada de como se comportar em cada fase do jogo.",
                    "Lista de counters perfeitos para EXP, Selva, Meio, Ouro e Rotação."
                ]}
                imageUrl="https://i.postimg.cc/dtdk5LJm/Captura-de-tela-2025-10-18-234245.png"
            />
        </section>

        {/* Other Features Section */}
        <section className="w-full max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold">E explore ainda mais...</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glassmorphism p-6 rounded-2xl text-center border border-slate-700">
                    <h4 className="text-xl font-bold text-sky-300">Enciclopédia de Heróis</h4>
                    <p className="mt-2 text-sm text-slate-400">Navegue por todos os heróis, veja suas habilidades, estatísticas detalhadas e combos táticos.</p>
                </div>
                <div className="glassmorphism p-6 rounded-2xl text-center border border-slate-700">
                    <h4 className="text-xl font-bold text-sky-300">Banco de Dados de Itens</h4>
                    <p className="mt-2 text-sm text-slate-400">Consulte todos os itens do jogo, seus atributos, habilidades passivas, custos e otimize suas builds.</p>
                </div>
                <div className="glassmorphism p-6 rounded-2xl text-center border border-slate-700">
                    <h4 className="text-xl font-bold text-sky-300">Ranking do Meta</h4>
                    <p className="mt-2 text-sm text-slate-400">Descubra os heróis mais fortes com filtros por elo, período e taxa de vitória, escolha ou banimento.</p>
                </div>
            </div>
        </section>


        {/* Final CTA */}
        <section className="text-center w-full max-w-4xl mx-auto px-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-white">Sua Jornada para o Mítico Começa Agora</h2>
            <p className="mt-4 text-lg text-slate-300">Pare de depender da sorte. Comece a vencer com estratégia. Experimente nossas ferramentas e sinta a diferença na sua próxima ranqueada.</p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                    onClick={onLaunchApp} 
                    className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold py-4 px-8 rounded-xl text-lg hover:from-sky-400 hover:to-cyan-400 transition-all duration-300 shadow-lg shadow-sky-500/40 transform hover:scale-105"
                >
                    Analisar Agora (Grátis)
                </button>
                <button 
                    onClick={onSeePlans} 
                    className="w-full sm:w-auto bg-transparent border-2 border-slate-600 text-slate-300 font-bold py-4 px-8 rounded-xl text-lg hover:bg-slate-800 hover:text-white transition-colors duration-300"
                >
                    Desbloquear Premium
                </button>
            </div>
        </section>

      </main>
    </div>
  );
};

export default FeaturesPage;