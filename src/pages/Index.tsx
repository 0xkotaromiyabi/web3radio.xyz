import Radio from '@/components/Radio';
import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

const Index = () => {
  return (
    <WagmiConfig config={config}>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12">
        <Radio />
      </div>
    </WagmiConfig>
  );
};

export default Index;