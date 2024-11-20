import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const LiveMatches = () => {
  // Sample matches data
  const matches = [
    {
      id: 1,
      competition: 'RPL | Match - 8',
      homeTeam: {
        name: 'APR FC',
        score: 2,
        logo: '/teams/apr.png'
      },
      awayTeam: {
        name: 'Amagaju',
        score: 4,
        logo: '/teams/amagaju.png'
      },
      time: '33:30',
      venue: 'Amahoro Stadium',
      isLive: true
    },
    {
      id: 2,
      competition: 'RBL Game - 4',
      homeTeam: {
        name: 'REG',
        score: 2,
        logo: '/teams/reg.png'
      },
      awayTeam: {
        name: 'Patriots',
        score: 4,
        logo: '/teams/patriots.png'
      },
      time: '33:30',
      venue: 'BK ARENA',
      isLive: true
    },
    {
      id: 3,
      competition: 'RPL | Match - 8',
      homeTeam: {
        name: 'BUGESERA FC',
        score: 2,
        logo: '/teams/bugesera.png'
      },
      awayTeam: {
        name: 'Amagaju',
        score: 4,
        logo: '/teams/amagaju.png'
      },
      time: '33:30',
      venue: 'Bugesera Stadium',
      isLive: true
    },
    {
      id: 4,
      competition: 'RPL | Match - 8',
      homeTeam: {
        name: 'AS KIGALI',
        score: 2,
        logo: '/teams/askigali.png'
      },
      awayTeam: {
        name: 'Amagaju',
        score: 4,
        logo: '/teams/amagaju.png'
      },
      time: '33:30',
      venue: 'PELE Stadim',
      isLive: true
    }
  ];

  const scrollContainer = (direction) => {
    const container = document.getElementById('matches-container');
    const scrollAmount = 300;
    if (container) {
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative">
      {/* Scroll Buttons */}
      <button 
        onClick={() => scrollContainer('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 -ml-4"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button 
        onClick={() => scrollContainer('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 -mr-4"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Matches Container */}
      <div 
        id="matches-container"
        className="flex overflow-x-auto hide-scrollbar gap-4 px-6 py-4"
      >
        {matches.map((match) => (
          <div 
            key={match.id}
            className="flex-shrink-0 w-[280px] p-4 rounded-lg border border-gray-200 bg-white shadow-sm"
          >
            {/* Match Header */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-900">{match.competition}</span>
              <span className="flex items-center">
                <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
                <span className="text-sm text-red-500">Live</span>
              </span>
            </div>

            {/* Teams */}
            <div className="space-y-4">
              {/* Home Team */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={match.homeTeam.logo} 
                    alt={match.homeTeam.name}
                    className="h-8 w-8 object-contain"
                  />
                  <span className="font-medium text-gray-900">{match.homeTeam.name}</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{match.homeTeam.score}</span>
              </div>

              {/* Away Team */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={match.awayTeam.logo} 
                    alt={match.awayTeam.name}
                    className="h-8 w-8 object-contain"
                  />
                  <span className="font-medium text-gray-900">{match.awayTeam.name}</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{match.awayTeam.score}</span>
              </div>
            </div>

            {/* Match Info */}
            <div className="mt-4 text-sm text-gray-500">
              <div className="text-center font-medium text-red-500">{match.time}</div>
              <div className="text-center mt-1">{match.venue}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveMatches; 