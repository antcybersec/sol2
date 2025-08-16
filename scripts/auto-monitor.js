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

let lastAlertTime = 0;
const ALERT_COOLDOWN = 5 * 60 * 1000; // 5 minutes

async function checkPlatformWallet() {
  try {
    const platformWallet = Keypair.fromSecretKey(new Uint8Array(PLATFORM_WALLET_PRIVATE_KEY));
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    
    const balance = await connection.getBalance(platformWallet.publicKey);
    const balanceSOL = balance / LAMPORTS_PER_SOL;
    
    const now = Date.now();
    const timeSinceLastAlert = now - lastAlertTime;
    
    console.log(`\n[${new Date().toLocaleTimeString()}] 📊 Platform Wallet Check`);
    console.log(`💰 Balance: ${balanceSOL.toFixed(4)} SOL`);
    
    // Calculate available rewards
    const availableForRewards = Math.max(0, balanceSOL - 0.1);
    
    if (balanceSOL < 0.3 && timeSinceLastAlert > ALERT_COOLDOWN) {
      console.log('🚨 CRITICAL: Platform wallet balance very low!');
      console.log('💡 Immediate refill required to continue rewards.');
      console.log('🏦 Platform wallet address:', platformWallet.publicKey.toString());
      lastAlertTime = now;
    } else if (balanceSOL < 0.5 && timeSinceLastAlert > ALERT_COOLDOWN) {
      console.log('⚠️ WARNING: Platform wallet balance low!');
      console.log('💡 Consider refilling soon to avoid interruptions.');
      console.log('🏦 Platform wallet address:', platformWallet.publicKey.toString());
      lastAlertTime = now;
    } else if (balanceSOL < 1) {
      console.log('📉 Platform wallet balance getting low.');
    } else {
      console.log('✅ Platform wallet has sufficient funds.');
    }
    
    // Show possible rewards
    if (availableForRewards > 0) {
      console.log(`🎁 Available for rewards: ${availableForRewards.toFixed(4)} SOL`);
      
      let totalPossible = 0;
      TASK_REWARDS.forEach(task => {
        const possibleCount = Math.floor(availableForRewards / task.reward);
        if (possibleCount > 0) {
          totalPossible += possibleCount * task.reward;
        }
      });
      
      console.log(`🎯 Total possible rewards: ${totalPossible.toFixed(4)} SOL`);
    }
    
  } catch (error) {
    console.error('❌ Error checking platform wallet:', error);
  }
}

// Run initial check
checkPlatformWallet();

// Set up periodic monitoring (every 2 minutes)
const MONITOR_INTERVAL = 2 * 60 * 1000; // 2 minutes

console.log(`\n🔄 Auto-monitoring started. Checking every ${MONITOR_INTERVAL / 1000} seconds...`);
console.log('💡 Press Ctrl+C to stop monitoring');

setInterval(checkPlatformWallet, MONITOR_INTERVAL); 