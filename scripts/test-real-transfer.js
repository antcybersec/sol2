const { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } = require('@solana/web3.js');

// Platform wallet private key
const PLATFORM_WALLET_PRIVATE_KEY = [
  65, 125, 30, 245, 185, 134, 100, 84, 95, 78, 167, 129, 104, 50, 55, 186, 
  29, 136, 227, 239, 159, 227, 96, 32, 182, 222, 3, 234, 91, 237, 33, 253, 
  100, 245, 226, 148, 125, 110, 246, 179, 228, 228, 252, 168, 124, 190, 253, 114, 
  167, 96, 221, 173, 223, 250, 57, 137, 31, 24, 58, 40, 130, 106, 202, 29
];

async function testRealTransfer() {
  try {
    console.log('🧪 Testing real SOL transfer from platform wallet...');
    
    // Create platform wallet
    const platformWallet = Keypair.fromSecretKey(new Uint8Array(PLATFORM_WALLET_PRIVATE_KEY));
    console.log('🏦 Platform wallet address:', platformWallet.publicKey.toString());
    
    // Create test recipient wallet
    const testRecipient = Keypair.generate();
    console.log('👤 Test recipient address:', testRecipient.publicKey.toString());
    
    // Connect to Devnet
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    
    // Check platform wallet balance
    const platformBalance = await connection.getBalance(platformWallet.publicKey);
    const platformBalanceSOL = platformBalance / LAMPORTS_PER_SOL;
    console.log('💰 Platform wallet balance:', platformBalanceSOL.toFixed(4), 'SOL');
    
    // Check recipient balance (should be 0)
    const recipientBalance = await connection.getBalance(testRecipient.publicKey);
    const recipientBalanceSOL = recipientBalance / LAMPORTS_PER_SOL;
    console.log('💰 Recipient balance before transfer:', recipientBalanceSOL.toFixed(4), 'SOL');
    
    if (platformBalanceSOL < 0.1) {
      console.log('❌ Platform wallet has insufficient funds');
      return;
    }
    
    // Create and send transaction
    console.log('\n🚀 Creating transaction...');
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: platformWallet.publicKey,
        toPubkey: testRecipient.publicKey,
        lamports: 0.02 * LAMPORTS_PER_SOL, // 0.02 SOL
      })
    );
    
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = platformWallet.publicKey;
    transaction.sign(platformWallet);
    
    console.log('📡 Sending transaction...');
    const signature = await connection.sendTransaction(transaction, [platformWallet]);
    console.log('📋 Transaction signature:', signature);
    
    console.log('⏳ Waiting for confirmation...');
    await connection.confirmTransaction(signature, 'confirmed');
    console.log('✅ Transaction confirmed!');
    
    // Check recipient balance after transfer
    await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
    const newRecipientBalance = await connection.getBalance(testRecipient.publicKey);
    const newRecipientBalanceSOL = newRecipientBalance / LAMPORTS_PER_SOL;
    console.log('💰 Recipient balance after transfer:', newRecipientBalanceSOL.toFixed(4), 'SOL');
    
    // Check platform wallet balance after transfer
    const newPlatformBalance = await connection.getBalance(platformWallet.publicKey);
    const newPlatformBalanceSOL = newPlatformBalance / LAMPORTS_PER_SOL;
    console.log('💰 Platform wallet balance after transfer:', newPlatformBalanceSOL.toFixed(4), 'SOL');
    
    if (newRecipientBalanceSOL > recipientBalanceSOL) {
      console.log('✅ SUCCESS: SOL transfer worked!');
      console.log(`💸 Transferred: ${(newRecipientBalanceSOL - recipientBalanceSOL).toFixed(4)} SOL`);
    } else {
      console.log('❌ FAILED: Recipient balance did not increase');
    }
    
  } catch (error) {
    console.error('❌ Error in test transfer:', error);
  }
}

// Run the test
testRealTransfer(); 