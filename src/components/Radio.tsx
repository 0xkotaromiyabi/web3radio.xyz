import React, { useState, useEffect, useRef } from 'react';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { Volume2, Volume1, VolumeX, Power } from 'lucide-react';

const Radio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [cryptoPrices, setCryptoPrices] = useState<string[]>([]);
  const { connect } = useConnect();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    const audio = new Audio('https://web3radio.cloud/stream');
    audioRef.current = audio;
    audio.volume = volume / 100;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Simulate crypto price updates
  useEffect(() => {
    const mockPrices = [
      "BTC $50,000",
      "ETH $3,000",
      "BNB $400",
      "ADA $2",
      "DOT $30",
    ];
    setCryptoPrices(mockPrices);
    
    const interval = setInterval(() => {
      const newPrices = mockPrices.map(price => {
        const value = parseFloat(price.split('$')[1].replace(',', ''));
        const change = (Math.random() - 0.5) * 100;
        return `${price.split(' ')[0]} $${(value + change).toFixed(2)}`;
      });
      setCryptoPrices(newPrices);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const VolumeIcon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-wood rounded-xl shadow-2xl p-8 relative overflow-hidden border-8 border-wood-dark">
        {/* Radio Body */}
        <div className="bg-[#2a1810] rounded-lg p-6 space-y-6 shadow-inner">
          {/* Speaker Grills */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="h-20 bg-black/80 rounded-lg grid grid-cols-6 gap-1 p-2">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="bg-black rounded-full" />
              ))}
            </div>
            <div className="h-20 bg-black/80 rounded-lg grid grid-cols-6 gap-1 p-2">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="bg-black rounded-full" />
              ))}
            </div>
          </div>

          {/* Display Panel */}
          <div className="bg-black rounded-lg p-4 relative overflow-hidden">
            <div className="h-12 bg-black/80 rounded flex items-center overflow-hidden">
              <div className="animate-marquee whitespace-nowrap">
                {cryptoPrices.map((price, index) => (
                  <span key={index} className="text-display mx-4 font-mono animate-led-glow">
                    {price}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-3 gap-6 mt-6">
            {/* Power Button */}
            <button
              onClick={togglePlay}
              className={`p-4 rounded-full ${
                isPlaying ? 'bg-red-500 shadow-lg' : 'bg-gray-700'
              } transition-all duration-300 flex items-center justify-center transform hover:scale-105`}
            >
              <Power className="w-6 h-6 text-white" />
            </button>

            {/* Volume Knob */}
            <div className="flex flex-col items-center">
              <VolumeIcon className="w-6 h-6 text-metal-dark mb-2" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-full appearance-none h-2 rounded-full bg-metal-dark"
              />
            </div>

            {/* Tuning Decoration */}
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-metal-dark shadow-inner flex items-center justify-center">
                <div className="w-2 h-8 bg-metal absolute transform -translate-y-1/2 rotate-45" />
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Connection */}
        <div className="mt-6 text-center">
          {address ? (
            <div className="space-y-2">
              <p className="text-sm text-metal-dark font-mono">
                Connected: {address.slice(0, 6)}...{address.slice(-4)}
              </p>
              <button
                onClick={() => disconnect()}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Disconnect Wallet
              </button>
            </div>
          ) : (
            <button
              onClick={() => connect({ connector: injected() })}
              className="px-4 py-2 bg-metal text-black rounded-lg hover:bg-metal-light transition-colors"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Radio;