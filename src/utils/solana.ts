import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';

// Multiple RPC endpoints for fallback
const RPC_ENDPOINTS = [
  'https://api.devnet.solana.com',
  'https://rpc.ankr.com/solana_devnet',
  'https://solana-devnet.rpc.extrnode.com',
  'https://devnet.genesysgo.net',
];

let currentRpcIndex = 0;

// Get next RPC endpoint in rotation
const getNextRpcEndpoint = () => {
  const endpoint = RPC_ENDPOINTS[currentRpcIndex];
  currentRpcIndex = (currentRpcIndex + 1) % RPC_ENDPOINTS.length;
  return endpoint;
};

// Create connection with fallback
export const getConnection = (): Connection => {
  const endpoint = getNextRpcEndpoint();
  console.log(`🔗 Using RPC endpoint: ${endpoint}`);
  return new Connection(endpoint, 'confirmed');
};

// Get connection with specific endpoint
export const getConnectionWithEndpoint = (endpoint: string): Connection => {
  return new Connection(endpoint, 'confirmed');
};

// Platform wallet configuration
// For demo purposes - in production this would be securely managed
const PLATFORM_WALLET_PRIVATE_KEY = [
  65, 125, 30, 245, 185, 134, 100, 84, 95, 78, 167, 129, 104, 50, 55, 186, 
  29, 136, 227, 239, 159, 227, 96, 32, 182, 222, 3, 234, 91, 237, 33, 253, 
  100, 245, 226, 148, 125, 110, 246, 179, 228, 228, 252, 168, 124, 190, 253, 114, 
  167, 96, 221, 173, 223, 250, 57, 137, 31, 24, 58, 40, 130, 106, 202, 29
];

// Create platform wallet from private key
export const getPlatformWallet = (): Keypair => {
  const platformWallet = Keypair.fromSecretKey(new Uint8Array(PLATFORM_WALLET_PRIVATE_KEY));
  console.log('🏦 Platform wallet address:', platformWallet.publicKey.toString());
  return platformWallet;
};

// Check platform wallet balance
export const checkPlatformWalletBalance = async (): Promise<{ balance: number; canSend: boolean; warning?: string }> => {
  try {
    // Use a stable endpoint for balance checking
    const connection = getConnectionWithEndpoint('https://api.devnet.solana.com');
    const platformWallet = getPlatformWallet();
    
    const balance = await connection.getBalance(platformWallet.publicKey);
    const balanceSOL = balance / LAMPORTS_PER_SOL;
    
    console.log(`💰 Platform wallet balance: ${balanceSOL.toFixed(4)} SOL`);
    
    // Check if we can send rewards
    const minRequired = 0.1; // Minimum SOL for fees
    const canSend = balanceSOL > minRequired;
    
    let warning = undefined;
    if (balanceSOL < 0.5) {
      warning = '⚠️ Platform wallet balance is low! Consider refilling soon.';
    } else if (balanceSOL < 1) {
      warning = '📉 Platform wallet balance is getting low.';
    }
    
    return { balance: balanceSOL, canSend, warning };
  } catch (error) {
    console.error('Error checking platform wallet balance:', error);
    return { balance: 0, canSend: false, warning: '❌ Cannot check platform wallet balance' };
  }
};

// Send SOL reward from platform wallet to user
export const sendReward = async (
  recipientAddress: string, 
  amountSOL: number
): Promise<{ success: boolean; signature?: string; error?: string }> => {
  console.log(`🚀 Starting SOL transfer process...`);
  console.log(`📤 Sending ${amountSOL} SOL to ${recipientAddress}`);
  
  // First check platform wallet balance
  const balanceCheck = await checkPlatformWalletBalance();
  if (!balanceCheck.canSend) {
    const error = `Platform wallet has insufficient funds. Balance: ${balanceCheck.balance.toFixed(4)} SOL, Required: ${amountSOL} SOL`;
    console.log('❌', error);
    return { success: false, error };
  }
  
  if (balanceCheck.warning) {
    console.log('⚠️', balanceCheck.warning);
  }
  
  // Try all RPC endpoints
  for (let endpointIndex = 0; endpointIndex < RPC_ENDPOINTS.length; endpointIndex++) {
    try {
      const endpoint = RPC_ENDPOINTS[endpointIndex];
      console.log(`\n🔄 Attempt ${endpointIndex + 1}: Using ${endpoint}`);
      
      const connection = new Connection(endpoint, 'confirmed');
      const platformWallet = getPlatformWallet();
      
      // Double-check platform wallet balance
      const platformBalance = await connection.getBalance(platformWallet.publicKey);
      const platformBalanceSOL = platformBalance / LAMPORTS_PER_SOL;
      
      console.log(`🏦 Platform wallet balance: ${platformBalanceSOL.toFixed(4)} SOL`);
      
      if (platformBalanceSOL < amountSOL) {
        console.log(`❌ Insufficient funds: Need ${amountSOL} SOL, have ${platformBalanceSOL.toFixed(4)} SOL`);
        return { 
          success: false, 
          error: `Platform wallet has insufficient funds. Required: ${amountSOL} SOL, Available: ${platformBalanceSOL.toFixed(4)} SOL` 
        };
      }
      
      // Create transfer transaction
      console.log(`📝 Creating transaction...`);
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: platformWallet.publicKey,
          toPubkey: new PublicKey(recipientAddress),
          lamports: amountSOL * LAMPORTS_PER_SOL,
        })
      );
      
      // Get recent blockhash
      console.log(`🔍 Getting recent blockhash...`);
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = platformWallet.publicKey;
      
      // Sign transaction with platform wallet
      console.log(`✍️ Signing transaction...`);
      transaction.sign(platformWallet);
      
      // Send transaction
      console.log(`📡 Sending transaction...`);
      const signature = await connection.sendTransaction(transaction, [platformWallet]);
      
      console.log(`⏳ Waiting for confirmation...`);
      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');
      
      console.log('✅ SOL reward sent successfully!');
      console.log('📋 Transaction signature:', signature);
      console.log(`💸 Sent ${amountSOL} SOL from platform wallet to ${recipientAddress}`);
      
      return { success: true, signature };
      
    } catch (error) {
      console.error(`❌ Attempt ${endpointIndex + 1} failed:`, error);
      
      // If this was the last endpoint, return error
      if (endpointIndex === RPC_ENDPOINTS.length - 1) {
        console.log('❌ All RPC endpoints failed');
        return { 
          success: false, 
          error: `Failed to send reward after trying all endpoints: ${error instanceof Error ? error.message : String(error)}` 
        };
      }
      
      console.log(`🔄 Trying next endpoint...`);
    }
  }
  
  return { 
    success: false, 
    error: 'Failed to send reward: Unknown error' 
  };
};

// Get real wallet balance with fallback
export const getWalletBalance = async (publicKey: PublicKey): Promise<number> => {
  // Try stable endpoint first
  try {
    const connection = getConnectionWithEndpoint('https://api.devnet.solana.com');
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.log('Failed to get balance from primary endpoint:', error);
  }
  
  // Try fallback endpoints
  for (let i = 0; i < RPC_ENDPOINTS.length; i++) {
    try {
      const endpoint = RPC_ENDPOINTS[i];
      const connection = getConnectionWithEndpoint(endpoint);
      const balance = await connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.log(`Failed to get balance from endpoint ${i + 1}:`, error);
      continue;
    }
  }
  
  throw new Error('Failed to get balance from all endpoints');
}; 