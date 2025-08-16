const { Connection, Keypair, LAMPORTS_PER_SOL } = require('@solana/web3.js');

// Platform wallet private key
const PLATFORM_WALLET_PRIVATE_KEY = [
  65, 125, 30, 245, 185, 134, 100, 84, 95, 78, 167, 129, 104, 50, 55, 186, 
  29, 136, 227, 239, 159, 227, 96, 32, 182, 222, 3, 234, 91, 237, 33, 253, 
  100, 245, 226, 148, 125, 110, 246, 179, 228, 228, 252, 168, 124, 190, 253, 114, 
  167, 96, 221, 173, 223, 250, 57, 137, 31, 24, 58, 40, 130, 106, 202, 29
];

// Task rewards configuration
const TASK_REWARDS = [
  { name: 'Survey', reward: 0.1 },
  { name: 'Blog Post', reward: 0.5 },
  { name: 'Feature Test', reward: 0.25 },
  { name: 'Twitter Share', reward: 0.05 },
  { name: 'Discord Join', reward: 0.02 }
];

async function monitorPlatformWallet() {
  try {
    console.log('📊 Platform Wallet Monitor');
    console.log('========================');
    
    // Create platform wallet
    const platformWallet = Keypair.fromSecretKey(new Uint8Array(PLATFORM_WALLET_PRIVATE_KEY));
    console.log('🏦 Platform wallet address:', platformWallet.publicKey.toString());
    
    // Connect to Devnet
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    
    // Check balance
    const balance = await connection.getBalance(platformWallet.publicKey);
    const balanceSOL = balance / LAMPORTS_PER_SOL;
    
    console.log(`💰 Current balance: ${balanceSOL.toFixed(4)} SOL`);
    
    // Calculate available rewards
    const availableForRewards = Math.max(0, balanceSOL - 0.1); // Keep 0.1 SOL for fees
    console.log(`🎁 Available for rewards: ${availableForRewards.toFixed(4)} SOL`);
    
    if (availableForRewards <= 0) {
      console.log('❌ Insufficient funds for rewards!');
      console.log('💡 Please refill the platform wallet.');
      return;
    }
    
    // Calculate possible rewards
    console.log('\n📋 Possible rewards:');
    let totalPossible = 0;
    
    TASK_REWARDS.forEach(task => {
      const possibleCount = Math.floor(availableForRewards / task.reward);
      if (possibleCount > 0) {
        console.log(`  ${task.name} (${task.reward} SOL): ${possibleCount} times`);
        totalPossible += possibleCount * task.reward;
      }
    });
    
    console.log(`\n🎯 Total possible rewards: ${totalPossible.toFixed(4)} SOL`);
    
    // Warning if balance is low
    if (balanceSOL < 0.5) {
      console.log('\n⚠️  WARNING: Platform wallet balance is low!');
      console.log('💡 Consider refilling soon.');
    } else if (balanceSOL < 1) {
      console.log('\n📉 Platform wallet balance is getting low.');
    } else {
      console.log('\n✅ Platform wallet has sufficient funds!');
    }
    
    // Refill instructions
    console.log('\n🔄 To refill platform wallet:');
    console.log('1. Send SOL from your Devnet wallet to:', platformWallet.publicKey.toString());
    console.log('2. Or use Solana CLI: solana transfer', platformWallet.publicKey.toString(), '1.5 --url devnet');
    
  } catch (error) {
    console.error('❌ Error monitoring platform wallet:', error);
  }
}

// Run the monitor
monitorPlatformWallet(); 