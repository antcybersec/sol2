const { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } = require('@solana/web3.js');

// Platform wallet private key (new wallet that needs funding)
const PLATFORM_WALLET_PRIVATE_KEY = [
  65, 125, 30, 245, 185, 134, 100, 84, 95, 78, 167, 129, 104, 50, 55, 186, 
  29, 136, 227, 239, 159, 227, 96, 32, 182, 222, 3, 234, 91, 237, 33, 253, 
  100, 245, 226, 148, 125, 110, 246, 179, 228, 228, 252, 168, 124, 190, 253, 114, 
  167, 96, 221, 173, 223, 250, 57, 137, 31, 24, 58, 40, 130, 106, 202, 29
];

async function fundFromUserWallet() {
  try {
    console.log('💰 Funding platform wallet from your Devnet wallet...');
    
    // Platform wallet that needs funding
    const platformWallet = Keypair.fromSecretKey(new Uint8Array(PLATFORM_WALLET_PRIVATE_KEY));
    console.log('🏦 Platform wallet address:', platformWallet.publicKey.toString());
    
    // Connect to Devnet
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    
    // Check platform wallet balance
    const platformBalance = await connection.getBalance(platformWallet.publicKey);
    const platformBalanceSOL = platformBalance / LAMPORTS_PER_SOL;
    console.log('💰 Platform wallet current balance:', platformBalanceSOL.toFixed(4), 'SOL');
    
    if (platformBalanceSOL >= 1) {
      console.log('✅ Platform wallet already has sufficient funds!');
      return;
    }
    
    console.log('\n📋 To fund the platform wallet:');
    console.log('1. Open your Phantom wallet');
    console.log('2. Switch to Devnet');
    console.log('3. Send 1.5 SOL to this address:', platformWallet.publicKey.toString());
    console.log('4. Wait for confirmation');
    console.log('5. Run this script again to verify');
    
    console.log('\n💡 Or use Solana CLI:');
    console.log(`solana transfer ${platformWallet.publicKey.toString()} 1.5 --url devnet`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the script
fundFromUserWallet(); 