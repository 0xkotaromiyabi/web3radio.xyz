
import { createThirdwebClient, getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { prepareContractCall, sendTransaction, readContract } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";

// Base Mainnet configuration
const base = defineChain({
  id: 8453,
  name: "Base",
  rpc: "https://mainnet.base.org",
});

const client = createThirdwebClient({
  clientId: "ac0e7bf99e676e48fa3a2d9f4c33089c",
});

// Contract addresses (update these after deployment)
const W3R_TOKEN_ADDRESS = "0xC03a26EeaDb87410a26FdFD1755B052F1Fc7F06B";
const W3R_REWARDS_ADDRESS = "0xC03a26EeaDb87410a26FdFD1755B052F1Fc7F06B"; // Using token address as placeholder

// Validate contract address
const isValidAddress = (address: string): boolean => {
  return address && address !== "0x" && address.length === 42 && address.startsWith("0x");
};

export class W3RSmartContract {
  private tokenContract;
  private rewardsContract;
  private isInitialized: boolean = false;

  constructor() {
    try {
      // Only initialize if addresses are valid
      if (isValidAddress(W3R_TOKEN_ADDRESS)) {
        this.tokenContract = getContract({
          client,
          chain: base,
          address: W3R_TOKEN_ADDRESS,
        });
      }

      if (isValidAddress(W3R_REWARDS_ADDRESS)) {
        this.rewardsContract = getContract({
          client,
          chain: base,
          address: W3R_REWARDS_ADDRESS,
        });
      }

      this.isInitialized = true;
      console.log('W3RSmartContract initialized successfully');
    } catch (error) {
      console.error('Error initializing W3RSmartContract:', error);
      this.isInitialized = false;
    }
  }

  // Get user's W3R token balance
  async getTokenBalance(userAddress: string): Promise<string> {
    if (!this.isInitialized || !this.tokenContract) {
      console.warn('Token contract not initialized');
      return "0.00";
    }

    try {
      const balance = await readContract({
        contract: this.tokenContract,
        method: "function balanceOf(address) view returns (uint256)",
        params: [userAddress],
      });
      
      return (Number(balance) / 10**18).toFixed(2);
    } catch (error) {
      console.error('Error getting token balance:', error);
      return "0.00";
    }
  }

  // Get user's listening time from contract
  async getUserListeningTime(userAddress: string): Promise<number> {
    if (!this.isInitialized || !this.rewardsContract) {
      console.warn('Rewards contract not initialized');
      return 0;
    }

    try {
      const userData = await readContract({
        contract: this.rewardsContract,
        method: "function getUserData(address) view returns (uint256, uint256, uint256, bool)",
        params: [userAddress],
      });
      
      return Number(userData[0]); // totalListeningTime
    } catch (error) {
      console.error('Error getting user listening time:', error);
      return 0;
    }
  }

  // Check if user is eligible for reward
  async isRewardEligible(userAddress: string): Promise<boolean> {
    if (!this.isInitialized || !this.rewardsContract) {
      console.warn('Rewards contract not initialized');
      return false;
    }

    try {
      const eligible = await readContract({
        contract: this.rewardsContract,
        method: "function isRewardEligible(address) view returns (bool)",
        params: [userAddress],
      });
      
      return Boolean(eligible);
    } catch (error) {
      console.error('Error checking reward eligibility:', error);
      return false;
    }
  }

  // Claim reward tokens
  async claimReward(account: any): Promise<boolean> {
    if (!this.isInitialized || !this.rewardsContract) {
      console.warn('Rewards contract not initialized');
      return false;
    }

    try {
      const transaction = prepareContractCall({
        contract: this.rewardsContract,
        method: "function claimReward()",
        params: [],
      });

      const result = await sendTransaction({
        transaction,
        account,
      });

      console.log('Reward claimed successfully:', result);
      return true;
    } catch (error) {
      console.error('Error claiming reward:', error);
      return false;
    }
  }

  // Update listening time (only for authorized updaters)
  async updateListeningTime(userAddress: string, timeToAdd: number, account: any): Promise<boolean> {
    if (!this.isInitialized || !this.rewardsContract) {
      console.warn('Rewards contract not initialized');
      return false;
    }

    try {
      const transaction = prepareContractCall({
        contract: this.rewardsContract,
        method: "function updateListeningTime(address, uint256)",
        params: [userAddress, BigInt(timeToAdd)],
      });

      const result = await sendTransaction({
        transaction,
        account,
      });

      console.log('Listening time updated successfully:', result);
      return true;
    } catch (error) {
      console.error('Error updating listening time:', error);
      return false;
    }
  }

  // Get next reward time
  async getNextRewardTime(userAddress: string): Promise<number> {
    if (!this.isInitialized || !this.rewardsContract) {
      console.warn('Rewards contract not initialized');
      return 0;
    }

    try {
      const nextRewardTime = await readContract({
        contract: this.rewardsContract,
        method: "function getNextRewardTime(address) view returns (uint256)",
        params: [userAddress],
      });
      
      return Number(nextRewardTime);
    } catch (error) {
      console.error('Error getting next reward time:', error);
      return 0;
    }
  }

  // Check if contracts are properly initialized
  isContractsInitialized(): boolean {
    return this.isInitialized;
  }
}

export { client, base };
