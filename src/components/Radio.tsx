import React, { useState, useEffect } from 'react';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { Volume2, Volume1, VolumeX, Power } from 'lucide-react';

const Radio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [station, setStation] = useState(98.5);
  const [cryptoPrices, setCryptoPrices] = useState<string[]>([]);
  const { connect } = useConnect();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

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
      // In production, this would fetch from real API
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
      <div className="bg-wood rounded-lg shadow-2xl p-8 relative overflow-hidden">
        {/* Radio Body */}
        <div className="bg-wood-dark rounded-t-lg p-6 space-y-6">
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
            <div className="mt-4 text-display font-mono text-2xl text-center animate-led-glow">
              {station.toFixed(1)} MHz
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-3 gap-6">
            {/* Power Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-4 rounded-full ${
                isPlaying ? 'bg-red-500' : 'bg-gray-700'
              } transition-colors duration-300 flex items-center justify-center`}
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

            {/* Tuning Knob */}
            <div className="flex flex-col items-center">
              <input
                type="range"
                min="87.5"
                max="108.0"
                step="0.1"
                value={station}
                onChange={(e) => setStation(parseFloat(e.target.value))}
                className="w-full appearance-none h-2 rounded-full bg-metal-dark"
              />
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
