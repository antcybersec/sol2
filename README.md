# Solana Task Rewards Platform

A modern web application that allows users to complete tasks, earn SOL rewards, and redeem them for popular subscription services and gift cards.

## 🚀 Features

### Core Functionality
- **Wallet Integration**: Connect Phantom, Solflare, and other Solana wallets
- **Task Management**: Browse and complete various types of tasks
- **Reward System**: Earn SOL for completing tasks
- **Gift Card Redemption**: Redeem earnings for subscription services
- **User Profiles**: Track activity, earnings, and redemption history

### Task Types
- **Surveys**: Complete surveys about Solana ecosystem
- **Social Media**: Share content and engage with community
- **Testing**: Test new features and provide feedback
- **Content Creation**: Write blog posts and create content
- **Community**: Join Discord, participate in discussions

### Available Rewards
- **Streaming**: Netflix, YouTube Premium
- **Music**: Spotify Premium
- **Productivity**: ChatGPT Plus, GitHub Pro
- **Gaming**: Discord Nitro
- **Development**: Various developer tools

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern component library
- **Lucide React**: Beautiful icons

### Blockchain
- **Solana Web3.js**: Solana blockchain integration
- **@solana/wallet-adapter**: Wallet connection and management
- **Phantom & Solflare**: Supported wallet providers

### Styling
- **Custom Solana Theme**: Purple and green gradient design
- **Responsive Design**: Mobile-first approach
- **Dark Mode Support**: Built-in theme switching

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sol2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your configuration:
   ```env
   NEXT_PUBLIC_SOLANA_NETWORK=devnet
   NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### For Users

1. **Connect Wallet**
   - Click "Connect Wallet" in the navigation
   - Choose Phantom, Solflare, or other supported wallets
   - Approve the connection

2. **Browse Tasks**
   - Navigate to the Tasks page
   - Filter by category (Survey, Social, Testing, etc.)
   - View task details, rewards, and estimated time

3. **Complete Tasks**
   - Click "Submit Proof" or "Complete Task"
   - Follow the task instructions
   - Submit required proof (screenshots, links, etc.)

4. **Earn Rewards**
   - Tasks are reviewed manually (MVP)
   - Approved tasks award SOL to your wallet
   - Check your balance in the Profile page

5. **Redeem Gift Cards**
   - Navigate to the Rewards page
   - Browse available subscription services
   - Redeem SOL for gift cards
   - Receive codes via email

### For Developers

#### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── tasks/             # Tasks page
│   ├── rewards/           # Rewards page
│   └── profile/           # Profile page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   └── providers/        # Context providers
└── lib/                  # Utility functions
```

#### Key Components

- **WalletProvider**: Manages Solana wallet connections
- **Navigation**: Main navigation with wallet integration
- **Task Cards**: Display task information and actions
- **Reward Cards**: Show available gift cards and costs
- **Profile Dashboard**: User stats and activity history

## 🔧 Configuration

### Solana Network
The app is configured for Solana Devnet by default. To switch to mainnet:

1. Update the network in `WalletProvider.tsx`:
   ```typescript
   const network = WalletAdapterNetwork.Mainnet;
   ```

2. Update environment variables:
   ```env
   NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
   NEXT_PUBLIC_RPC_ENDPOINT=https://api.mainnet-beta.solana.com
   ```

### Customization

#### Adding New Tasks
1. Update the `mockTasks` array in `src/app/tasks/page.tsx`
2. Add new task categories as needed
3. Implement task-specific logic

#### Adding New Rewards
1. Update the `mockRewards` array in `src/app/rewards/page.tsx`
2. Add new reward categories
3. Integrate with gift card APIs

#### Styling
- Modify `src/app/globals.css` for theme changes
- Update Solana gradient colors in CSS variables
- Customize component styles in individual files

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy automatically

### Other Platforms
1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## 🔒 Security Considerations

### MVP Phase
- Manual task verification
- Centralized reward distribution
- Basic wallet validation

### Production Considerations
- Implement smart contracts for automated payouts
- Add task verification algorithms
- Implement rate limiting and anti-spam measures
- Add multi-signature wallets for fund management

## 📈 Future Enhancements

### Phase 2 Features
- **Smart Contracts**: Automated task verification and payouts
- **DAO Governance**: Community-driven task creation
- **Advanced Analytics**: Detailed user and platform metrics
- **Mobile App**: Native iOS and Android applications

### Phase 3 Features
- **AI Integration**: Automated task verification
- **Cross-chain Support**: Ethereum, Polygon integration
- **NFT Rewards**: Unique collectibles for achievements
- **Social Features**: User profiles, leaderboards, referrals

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and code comments
- **Issues**: Create GitHub issues for bugs or feature requests
- **Discord**: Join our community for discussions

## 🙏 Acknowledgments

- Solana Foundation for the blockchain infrastructure
- shadcn/ui for the beautiful component library
- Lucide for the amazing icons
- Next.js team for the excellent framework

---

**Built with ❤️ for the Solana community**
