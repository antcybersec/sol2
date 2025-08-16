const { Connection, Keypair, LAMPORTS_PER_SOL } = require('@solana/web3.js');

// Platform wallet private key (same as in utils/solana.ts)
const PLATFORM_WALLET_PRIVATE_KEY = [
  174, 47, 154, 16, 202, 193, 206, 113, 199, 190, 53, 133, 169, 175, 31, 56,
  222, 53, 138, 189, 224, 216, 117, 173, 10, 149, 53, 45, 73, 251, 237, 246,
  15, 185, 186, 82, 177, 240, 148, 69, 241, 227, 167, 80, 141, 89, 240, 121,
  121, 35, 172, 247, 68, 251, 226, 218, 48, 63, 176, 109, 168, 89, 238, 135
];

async function fundPlatformWallet() {
  try {
    console.log('🔧 Funding platform wallet...');
    
    // Create platform wallet
    const platformWallet = Keypair.fromSecretKey(new Uint8Array(PLATFORM_WALLET_PRIVATE_KEY));
    console.log('Platform wallet address:', platformWallet.publicKey.toString());
    
    // Connect to Devnet
    const connection = new Connection('https://api.devnet.solana.com');
    
    // Check current balance
    const currentBalance = await connection.getBalance(platformWallet.publicKey);
    console.log('Current platform wallet balance:', currentBalance / LAMPORTS_PER_SOL, 'SOL');
    
    if (currentBalance < 2 * LAMPORTS_PER_SOL) {
      // Request airdrop
      console.log('Requesting 2 SOL airdrop...');
      const signature = await connection.requestAirdrop(platformWallet.publicKey, 2 * LAMPORTS_PER_SOL);
      await connection.confirmTransaction(signature, 'confirmed');
      
      console.log('✅ Platform wallet funded successfully!');
      console.log('Transaction signature:', signature);
      
      // Check new balance
      const newBalance = await connection.getBalance(platformWallet.publicKey);
      console.log('New platform wallet balance:', newBalance / LAMPORTS_PER_SOL, 'SOL');
    } else {
      console.log('✅ Platform wallet already has sufficient funds');
    }
    
  } catch (error) {
    console.error('❌ Error funding platform wallet:', error);
  }
}

// Run the funding script
fundPlatformWallet(); 