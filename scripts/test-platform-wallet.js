const { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } = require('@solana/web3.js');

// Platform wallet private key (same as in utils/solana.ts)
const PLATFORM_WALLET_PRIVATE_KEY = [
  174, 47, 154, 16, 202, 193, 206, 113, 199, 190, 53, 133, 169, 175, 31, 56,
  222, 53, 138, 189, 224, 216, 117, 173, 10, 149, 53, 45, 73, 251, 237, 246,
  15, 185, 186, 82, 177, 240, 148, 69, 241, 227, 167, 80, 141, 89, 240, 121,
  121, 35, 172, 247, 68, 251, 226, 218, 48, 63, 176, 109, 168, 89, 238, 135
];

async function testPlatformWallet() {
  try {
    console.log('🧪 Testing platform wallet functionality...');
    
    // Create platform wallet
    const platformWallet = Keypair.fromSecretKey(new Uint8Array(PLATFORM_WALLET_PRIVATE_KEY));
    console.log('🏦 Platform wallet address:', platformWallet.publicKey.toString());
    
    // Connect to Devnet
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    
    // Check platform wallet balance
    const platformBalance = await connection.getBalance(platformWallet.publicKey);
    const platformBalanceSOL = platformBalance / LAMPORTS_PER_SOL;
    console.log('💰 Platform wallet balance:', platformBalanceSOL.toFixed(4), 'SOL');
    
    if (platformBalanceSOL < 0.1) {
      console.log('❌ Platform wallet needs funding. Requesting airdrop...');
      
      // Request airdrop
      const airdropSignature = await connection.requestAirdrop(platformWallet.publicKey, 2 * LAMPORTS_PER_SOL);
      await connection.confirmTransaction(airdropSignature, 'confirmed');
      
      console.log('✅ Platform wallet funded!');
      
      // Check new balance
      const newBalance = await connection.getBalance(platformWallet.publicKey);
      console.log('💰 New platform wallet balance:', (newBalance / LAMPORTS_PER_SOL).toFixed(4), 'SOL');
    }
    
    // Test transaction creation (without sending)
    console.log('\n🧪 Testing transaction creation...');
    
    // Create a test recipient (random wallet)
    const testRecipient = Keypair.generate();
    console.log('👤 Test recipient address:', testRecipient.publicKey.toString());
    
    // Create transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: platformWallet.publicKey,
        toPubkey: testRecipient.publicKey,
        lamports: 0.01 * LAMPORTS_PER_SOL, // 0.01 SOL
      })
    );
    
    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = platformWallet.publicKey;
    
    // Sign transaction
    transaction.sign(platformWallet);
    
    console.log('✅ Transaction created and signed successfully!');
    console.log('📋 Transaction details:');
    console.log('  - From:', platformWallet.publicKey.toString());
    console.log('  - To:', testRecipient.publicKey.toString());
    console.log('  - Amount: 0.01 SOL');
    console.log('  - Fee payer:', platformWallet.publicKey.toString());
    
    // Test sending the transaction
    console.log('\n🚀 Testing transaction sending...');
    const signature = await connection.sendTransaction(transaction, [platformWallet]);
    console.log('📡 Transaction sent! Signature:', signature);
    
    // Wait for confirmation
    console.log('⏳ Waiting for confirmation...');
    await connection.confirmTransaction(signature, 'confirmed');
    console.log('✅ Transaction confirmed!');
    
    // Check recipient balance
    const recipientBalance = await connection.getBalance(testRecipient.publicKey);
    console.log('💰 Test recipient balance:', (recipientBalance / LAMPORTS_PER_SOL).toFixed(4), 'SOL');
    
    console.log('\n🎉 Platform wallet test completed successfully!');
    console.log('✅ Platform wallet can send SOL transactions');
    
  } catch (error) {
    console.error('❌ Platform wallet test failed:', error);
    console.log('\n🔍 Error details:', error.toString());
  }
}

// Run the test
testPlatformWallet(); 