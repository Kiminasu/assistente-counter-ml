import React, { useMemo } from 'react';
import { Hero } from '../types';

interface LandingPageProps {
  onLaunchApp: () => void;
  onSeePlans: () => void;
  onLoginClick: () => void;
  onNavigateToFeatures: () => void;
  onGoBackToLanding: (sectionId?: string) => void;
  heroes: Record<string, Hero>;
}

interface LandingHeaderProps {
  onLaunchApp: () => void;
  onSeePlans: () => void;
  onLoginClick: () => void;
  onNavigateToFeatures: () => void;
  onGoBackToLanding: (sectionId?: string) => void;
}


const LandingHeader: React.FC<LandingHeaderProps> = ({ onLaunchApp, onSeePlans, onLoginClick, onNavigateToFeatures, onGoBackToLanding }) => {
    return (
        <header className="fixed top-0 left-0 right-0 z-30 bg-black/30 backdrop-blur-md border-b border-slate-700/50 animated-entry">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-2">
                        <img src="https://i.postimg.cc/ZK4nFyHG/mitica-logo-Photoroom.png" alt="Logo" className="h-10 w-10" />
                        <span className="font-bold text-lg hidden sm:block text-white relative top-[2px]">Mítica Estratégia MLBB</span>
                    </div>
                    <nav className="hidden md:flex gap-6 items-center">
                        <button onClick={onNavigateToFeatures} className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Funcionalidades</button>
                        <button onClick={() => onGoBackToLanding('testimonials')} className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Depoimentos</button>
                        <button onClick={onSeePlans} className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Planos</button>
                    </nav>
                    <div className="flex items-center gap-4">
                         <button 
                            onClick={onLoginClick} 
                            className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold py-2 px-5 rounded-lg text-sm hover:from-sky-600 hover:to-cyan-600 transition-all duration-300"
                        >
                            Login / Cadastrar
                        </button>
                         <button 
                            onClick={onLaunchApp} 
                            className="bg-slate-800/80 border border-slate-700 text-slate-200 font-bold py-2 px-5 rounded-lg text-sm hover:bg-slate-700/70 hover:border-sky-500 transition-all duration-300 hidden sm:block"
                        >
                            Acessar App
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

const TestimonialCard: React.FC<{ quote: string, author: string, rank: string }> = ({ quote, author, rank }) => (
     <div 
        className="glassmorphism p-6 rounded-2xl border border-slate-700 h-full flex flex-col"
    >
        <p className="text-slate-300 italic flex-grow whitespace-normal">"{quote}"</p>
        <div className="mt-4 text-right">
            <p className="font-bold text-amber-300">{author}</p>
            <p className="text-xs text-slate-400">{rank}</p>
        </div>
    </div>
);

const HeroScrollColumn: React.FC<{ heroes: Hero[], className?: string, style?: React.CSSProperties }> = ({ heroes, className, style }) => {
    // Duplica os heróis para criar um efeito de loop visual
    const displayHeroes = [...heroes, ...heroes];
    return (
        <div className={`flex flex-col gap-4 ${className}`} style={style}>
            {displayHeroes.map((hero, index) => (
                <img
                    key={`${hero.id}-${index}`}
                    src={hero.imageUrl}
                    alt={hero.name}
                    className="w-full aspect-square object-cover rounded-2xl shadow-lg"
                />
            ))}
        </div>
    );
};


const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp, onSeePlans, onLoginClick, onNavigateToFeatures, onGoBackToLanding, heroes }) => {
    const testimonials = [
        {
            quote: "A análise de draft mudou completamente como meu time joga. A IA sugere uns counters que a gente nunca ia pensar, slk.",
            author: "Kausy",
            rank: "Mítico Glória"
        },
        {
            quote: "Finalmente entendi os power spikes do meu main. A IA me deu uma build e um plano de jogo que realmente funcionam. Top d+!",
            author: "Carry_da_Sorte",
            rank: "Mítico Honra"
        },
        {
            quote: "Como tanque, saber as sinergias certas é crucial. Essa ferramenta me mostra os melhores aliados pra cada partida. Subi 200 estrelas com ela, blz?",
            author: "Muralha_Inabalável",
            rank: "Glória Mítica"
        },
        {
            quote: "As sugestões de itens situacionais são incríveis. Vc fica perdido e a IA recomenda exatamente o q vc precisa pra counterar a comp inimiga.",
            author: "Mago_Supremo",
            rank: "Mítico"
        },
        {
            quote: "Isso aqui é praticamente um hack. A análise 1v1 me fez ganhar a lane em 90% das vezes. Recomendo muito!",
            author: "20tepegar",
            rank: "Lenda V"
        },
        {
            quote: "Achei que era só mais um app, mas a profundidade da análise de herói é absurda. Agora sei até os counters pra cada lane.",
            author: "Nawataka",
            rank: "Mítico II"
        },
        {
            quote: "Tava preso no Épico há meses. Comecei a usar as sugestões de ban e a tier list e finalmente cheguei no Lenda. Vlw demais!",
            author: "SaiDoEpico",
            rank: "Lenda IV"
        },
        {
            quote: "O analisador de draft é surreal. Nosso time testou no 5x5 e a vantagem que a gente consegue só na tela de pick é gigante.",
            author: "Capitão_X1",
            rank: "Mítico Glória"
        },
        {
            quote: "Uso todo dia antes de começar a rank. O 'Counter do Dia' é legal pra aquecer a mente. App muito bom.",
            author: "MonoFighter",
            rank: "Mítico 25 Estrelas"
        },
        {
            quote: "Pra quem joga solo, isso aqui é uma mão na roda. Ajuda a entender a comp do time e o que pickar pra encaixar melhor. gg!",
            author: "SoloPlayer4Ever",
            rank: "Lenda I"
        }
    ];

    const allHeroes = useMemo(() => Object.values(heroes).sort(() => 0.5 - Math.random()), [heroes]);
    const columns = useMemo(() => {
        const numColumns = 6;
        const heroesPerColumn = Math.ceil(allHeroes.length / numColumns);
        return Array.from({ length: numColumns }, (_, i) =>
            allHeroes.slice(i * heroesPerColumn, (i + 1) * heroesPerColumn)
        );
    }, [allHeroes]);

    const MarqueeStyles = `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
          will-change: transform;
          transition: filter 1.2s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
          filter: brightness(1.05);
        }
        @keyframes marquee-up {
          0% { transform: translateY(0%); }
          100% { transform: translateY(-50%); }
        }
        @keyframes marquee-down {
          0% { transform: translateY(-50%); }
          100% { translateY(0%); }
        }
        .animate-marquee-up, .animate-marquee-down {
            will-change: transform;
        }
        .animate-marquee-up {
          animation: marquee-up linear infinite;
        }
        .animate-marquee-down {
          animation: marquee-down linear infinite;
        }
    `;

    return (
        <>
            <style>{MarqueeStyles}</style>
            <LandingHeader onLaunchApp={onLaunchApp} onSeePlans={onSeePlans} onLoginClick={onLoginClick} onNavigateToFeatures={onNavigateToFeatures} onGoBackToLanding={onGoBackToLanding} />
            <main className="flex flex-col items-center text-white space-y-24 sm:space-y-32 md:space-y-40 pt-16 pb-20 overflow-x-hidden">

              {/* Hero Section */}
              <section className="relative w-full flex flex-col items-center justify-center text-center px-4 pt-16 sm:pt-20">
                  <div className="relative z-10 flex flex-col items-center animated-entry">
                      <img src="https://i.postimg.cc/ZK4nFyHG/mitica-logo-Photoroom.png" alt="Mítica Estratégia Logo" className="h-44 w-auto object-contain mx-auto -mb-2" />
                      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                          Sua Estratégia, <span className="text-amber-300">Potencializada</span>.
                      </h1>
                      <h2 className="text-md sm:text-xl text-slate-300 mt-4 max-w-2xl mx-auto">
                          Domine cada partida no Mobile Legends: Bang Bang com análises de IA, builds otimizadas e estratégias de counter que realmente funcionam.
                      </h2>
                      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                          <button 
                              onClick={onLaunchApp} 
                              className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold py-3 px-8 rounded-xl text-md hover:from-sky-400 hover:to-cyan-400 transition-all duration-300 shadow-lg shadow-sky-500/40 transform hover:scale-105"
                          >
                              Começar Análise Gratuita
                          </button>
                          <button 
                              onClick={onSeePlans} 
                              className="w-full sm:w-auto bg-transparent border-2 border-slate-600 text-slate-300 font-bold py-3 px-8 rounded-xl text-md hover:bg-slate-800 hover:text-white transition-colors duration-300"
                          >
                              Ver Planos
                          </button>
                      </div>
                  </div>
                
                  {/* Image Showcase Section */}
                  <div className="relative w-full max-w-5xl mx-auto mt-20 h-36 sm:h-48 md:h-52 lg:h-[220px]" aria-hidden="true">
                        {/* Left Image */}
                        <div className="absolute left-[-6rem] sm:-left-24 md:-left-20 lg:-left-28 top-16 sm:top-20 w-[55%] sm:w-[45%] lg:w-[40%] transform -rotate-6 transition-transform duration-500 hover:rotate-[-8deg] hover:scale-105 z-10">
                            <div className="animated-border-glow rounded-2xl sm:rounded-3xl">
                                <div className="bg-slate-900 p-1 rounded-[22px] sm:rounded-[30px] shadow-2xl">
                                    <img 
                                        src="https://i.postimg.cc/fb5rY3Yn/Captura-de-tela-2025-10-18-234245.png" 
                                        alt="Demonstração da interface de análise de herói"
                                        className="w-full rounded-xl sm:rounded-2xl"
                                        loading="eager"
                                        fetchpriority="high"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {/* Center Image (higher and in front) */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[60%] sm:w-[50%] lg:w-[45%] transform transition-transform duration-500 hover:scale-105 z-20">
                           <div className="animated-border-glow rounded-2xl sm:rounded-3xl">
                                <div className="bg-slate-900 p-1 rounded-[22px] sm:rounded-[30px] shadow-2xl">
                                    <img 
                                        src="https://i.postimg.cc/dtdk5LJm/Captura-de-tela-2025-10-18-234245.png" 
                                        alt="Demonstração da interface do aplicativo Mítica Estratégia"
                                        className="w-full rounded-xl sm:rounded-2xl"
                                        loading="eager"
                                        fetchpriority="high"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="absolute right-[-6rem] sm:-right-24 md:-right-20 lg:-right-28 top-16 sm:top-20 w-[55%] sm:w-[45%] lg:w-[40%] transform rotate-6 transition-transform duration-500 hover:rotate-[8deg] hover:scale-105 z-10">
                           <div className="animated-border-glow rounded-2xl sm:rounded-3xl">
                                <div className="bg-slate-900 p-1 rounded-[22px] sm:rounded-[30px] shadow-2xl">
                                    <img 
                                        src="https://i.postimg.cc/qRR4SZnW/Captura-de-tela-2025-10-19-001014.png" 
                                        alt="Demonstração da interface de draft 5v5"
                                        className="w-full rounded-xl sm:rounded-2xl"
                                        loading="eager"
                                        fetchpriority="high"
                                    />
                                </div>
                            </div>
                        </div>
                  </div>
              </section>

              {/* Features Section */}
              <section id="features" className="w-full max-w-6xl mx-auto px-4 animated-entry text-center scroll-mt-20 mt-8">
                  <h2 className="text-3xl sm:text-4xl font-bold">Tudo que você precisa para <span className="font-black text-amber-300" style={{ fontFamily: "'Inter', sans-serif", textShadow: '0 0 10px rgba(245, 158, 11, 0.4)'}}>Dominar</span></h2>
                  <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
                      De análises individuais a estratégias de equipe completas, nossa IA fornece as ferramentas para levar seu jogo no Mobile Legends ao próximo nível.
                  </p>
                  <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Feature Card 1 */}
                      <div className="glassmorphism p-6 rounded-2xl transform transition-transform hover:scale-105 border-2 panel-glow-primary">
                          {/* Icon */}
                          <div className="w-16 h-16 mx-auto bg-sky-500/20 rounded-xl flex items-center justify-center">
                              <span className="font-black text-3xl tracking-tighter text-sky-300">1v1</span>
                          </div>
                          <h3 className="mt-4 text-xl font-bold text-white">Análise de Confronto Direto</h3>
                          <p className="mt-2 text-sm text-slate-400">
                              Selecione seu herói e o do oponente para receber sugestões de counter, builds e a melhor estratégia para vencer a lane.
                          </p>
                      </div>
                      {/* Feature Card 2 */}
                      <div className="glassmorphism p-6 rounded-2xl transform transition-transform hover:scale-105 border-2 panel-glow-secondary">
                           {/* Icon */}
                          <div className="w-16 h-16 mx-auto bg-amber-500/20 rounded-xl flex items-center justify-center">
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-amber-300" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                          </div>
                          <h3 className="mt-4 text-xl font-bold text-white">Inteligência de Herói</h3>
                          <p className="mt-2 text-sm text-slate-400">
                              Análise aprofundada de qualquer herói. Descubra builds, power spikes, sinergias e os counters ideais para cada lane.
                          </p>
                      </div>
                      {/* Feature Card 3 */}
                      <div className="glassmorphism p-6 rounded-2xl transform transition-transform hover:scale-105 border-2 panel-glow-primary relative">
                          {/* Icon */}
                          <div className="w-16 h-16 mx-auto bg-sky-500/20 rounded-xl flex items-center justify-center">
                              <span className="font-black text-3xl tracking-tighter text-sky-300">5v5</span>
                          </div>
                          <h3 className="mt-4 text-xl font-bold text-white">Analisador de Draft</h3>
                          <p className="mt-2 text-sm text-slate-400">
                              Receba sugestões de picks e bans em tempo real para montar a composição perfeita e garantir a vantagem desde o início.
                          </p>
                      </div>
                  </div>
                  <div className="mt-8">
                      <button onClick={onNavigateToFeatures} className="font-semibold text-sky-300 hover:text-white transition-colors">
                          Ver todas as funcionalidades &rarr;
                      </button>
                  </div>
              </section>

              {/* All Heroes Section */}
              <section id="heroes" className="w-full scroll-mt-20 bg-slate-900/70 border-y border-slate-700/50 py-12 lg:py-0">
                <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-4">
                    <div className="animated-entry text-center lg:text-left">
                        <h2 className="text-4xl font-bold">Todos os Heróis Disponíveis</h2>
                        <p className="mt-4 text-slate-400">
                            Nossa IA tem dados sobre cada herói do Mobile Legends, desde os clássicos até os lançamentos mais recentes. Não importa quem você enfrente no seu próximo jogo, a Mítica Estratégia tem a resposta.
                        </p>
                    </div>
                    <div className="h-[400px] grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 overflow-hidden" style={{ maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }} aria-hidden="true">
                        <HeroScrollColumn heroes={columns[0] || []} className="animate-marquee-up" style={{ animationDuration: '40s' }} />
                        <HeroScrollColumn heroes={columns[1] || []} className="animate-marquee-down" style={{ animationDuration: '40s' }} />
                        <HeroScrollColumn heroes={columns[2] || []} className="animate-marquee-up" style={{ animationDuration: '40s' }} />
                        <HeroScrollColumn heroes={columns[3] || []} className="animate-marquee-down" style={{ animationDuration: '40s' }} />
                        <HeroScrollColumn heroes={columns[4] || []} className="animate-marquee-up" style={{ animationDuration: '40s' }} />
                        <HeroScrollColumn heroes={columns[5] || []} className="animate-marquee-down" style={{ animationDuration: '40s' }} />
                    </div>
                </div>
              </section>

               {/* Testimonials Section */}
              <section id="testimonials" className="w-full animated-entry group scroll-mt-20">
                  <div className="text-center w-full max-w-4xl mx-auto px-4">
                      <h2 className="text-4xl font-bold">O que os jogadores dizem</h2>
                      <p className="mt-4 text-slate-400 max-w-2xl mx-auto">A estratégia que faz a diferença entre a Lenda e o Mítico.</p>
                  </div>
                  <div className="mt-10 flex overflow-hidden">
                      <div className="flex animate-marquee whitespace-nowrap">
                          {[...testimonials, ...testimonials].map((testimonial, index) => (
                              <div key={index} className="flex-shrink-0 w-80 sm:w-96 mx-4" style={{ transform: 'translateZ(0)' }}>
                                  <TestimonialCard 
                                      quote={testimonial.quote}
                                      author={testimonial.author}
                                      rank={testimonial.rank}
                                  />
                              </div>
                          ))}
                      </div>
                  </div>
              </section>

              {/* Final CTA */}
              <section id="cta" className="text-center w-full max-w-4xl mx-auto animated-entry px-4 scroll-mt-20">
                <h2 className="text-4xl sm:text-5xl font-bold text-white">Pronto para Subir de Elo?</h2>
                <p className="mt-4 text-lg text-slate-300">Sua jornada para o Mítico Glória no Mobile Legends começa com a estratégia certa. Comece a analisar agora.</p>
                <div className="mt-8">
                    <button 
                        onClick={onLaunchApp} 
                        className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold py-4 px-8 rounded-xl text-lg hover:from-sky-400 hover:to-cyan-400 transition-all duration-300 shadow-lg shadow-sky-500/40 transform hover:scale-105"
                    >
                        Começar a Usar de Graça
                    </button>
                </div>
              </section>

            </main>
        </>
    );
};

export default LandingPage;
