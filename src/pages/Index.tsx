import Radio from '@/components/Radio';
import { WagmiConfig, createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

const Index = () => {
  return (
    <WagmiConfig config={config}>
      <TonConnectUIProvider manifestUrl="https://ton.org/app-manifest.json">
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12">
          <Radio />
        </div>
      </TonConnectUIProvider>
    </WagmiConfig>
  );
};

export default Index;