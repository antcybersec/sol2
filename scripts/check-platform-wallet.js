const { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } = require('@solana/web3.js');

// New platform wallet private key
const PLATFORM_WALLET_PRIVATE_KEY = [
  65, 125, 30, 245, 185, 134, 100, 84, 95, 78, 167, 129, 104, 50, 55, 186, 
  29, 136, 227, 239, 159, 227, 96, 32, 182, 222, 3, 234, 91, 237, 33, 253, 
  100, 245, 226, 148, 125, 110, 246, 179, 228, 228, 252, 168, 124, 190, 253, 114, 
  167, 96, 221, 173, 223, 250, 57, 137, 31, 24, 58, 40, 130, 106, 202, 29
];

async function checkPlatformWallet() {
  try {
    console.log('🔍 Checking new platform wallet...');
    
    // Create platform wallet
    const platformWallet = Keypair.fromSecretKey(new Uint8Array(PLATFORM_WALLET_PRIVATE_KEY));
    console.log('🏦 Platform wallet address:', platformWallet.publicKey.toString());
    
    // Connect to Devnet
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    
    // Check balance
    const balance = await connection.getBalance(platformWallet.publicKey);
    const balanceSOL = balance / LAMPORTS_PER_SOL;
    console.log('💰 Platform wallet balance:', balanceSOL.toFixed(4), 'SOL');
    
    if (balanceSOL < 0.1) {
      console.log('❌ Platform wallet needs funding!');
      console.log('💡 Please visit https://faucet.solana.com and send SOL to:', platformWallet.publicKey.toString());
      console.log('💡 Or use Solana CLI: solana airdrop 2', platformWallet.publicKey.toString(), '--url devnet');
      return;
    }
    
    console.log('✅ Platform wallet has sufficient funds!');
    
    // Test transaction creation
    console.log('\n🧪 Testing transaction creation...');
    
    const testRecipient = Keypair.generate();
    console.log('👤 Test recipient:', testRecipient.publicKey.toString());
    
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: platformWallet.publicKey,
        toPubkey: testRecipient.publicKey,
        lamports: 0.01 * LAMPORTS_PER_SOL,
      })
    );
    
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = platformWallet.publicKey;
    transaction.sign(platformWallet);
    
    console.log('✅ Transaction created successfully!');
    console.log('📋 Ready to send 0.01 SOL to test recipient');
    
  } catch (error) {
    console.error('❌ Error checking platform wallet:', error);
  }
}

// Run the check
checkPlatformWallet(); 