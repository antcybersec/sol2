const { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } = require('@solana/web3.js');

async function createPlatformWallet() {
  try {
    console.log('🔧 Creating new platform wallet...');
    
    // Generate new platform wallet
    const platformWallet = Keypair.generate();
    console.log('🏦 New platform wallet address:', platformWallet.publicKey.toString());
    console.log('🔑 Private key (for utils/solana.ts):', JSON.stringify(Array.from(platformWallet.secretKey)));
    
    // Connect to Devnet
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    
    // Fund the new wallet
    console.log('💰 Funding new platform wallet...');
    const airdropSignature = await connection.requestAirdrop(platformWallet.publicKey, 2 * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(airdropSignature, 'confirmed');
    
    console.log('✅ Platform wallet funded!');
    
    // Check balance
    const balance = await connection.getBalance(platformWallet.publicKey);
    console.log('💰 Platform wallet balance:', (balance / LAMPORTS_PER_SOL).toFixed(4), 'SOL');
    
    // Test transaction
    console.log('\n🧪 Testing transaction...');
    
    // Create test recipient
    const testRecipient = Keypair.generate();
    console.log('👤 Test recipient:', testRecipient.publicKey.toString());
    
    // Create and send transaction
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
    
    const signature = await connection.sendTransaction(transaction, [platformWallet]);
    await connection.confirmTransaction(signature, 'confirmed');
    
    console.log('✅ Test transaction successful!');
    console.log('📋 Transaction signature:', signature);
    
    // Check recipient balance
    const recipientBalance = await connection.getBalance(testRecipient.publicKey);
    console.log('💰 Test recipient balance:', (recipientBalance / LAMPORTS_PER_SOL).toFixed(4), 'SOL');
    
    console.log('\n🎉 Platform wallet created and tested successfully!');
    console.log('\n📝 To use this wallet, update src/utils/solana.ts with the private key above');
    
  } catch (error) {
    console.error('❌ Error creating platform wallet:', error);
  }
}

// Run the script
createPlatformWallet(); 