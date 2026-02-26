☕ Cozy Cafe LINE Bot
A cozy cafe themed LINE chatbot designed for menu browsing, ordering, and friendly customer interaction.
Built to simulate a real-world cafe assistant experience on LINE with automated replies and interactive messaging.

✨ Features
- 📖 Browse cafe menu via LINE chat
- ☕ Drink & dessert recommendations
- 🤖 Automated chatbot responses
- 🧾 Order simulation system
- 💬 Friendly cozy cafe interaction
- 🔌 LINE Messaging API integration

📂 Project Structure
cozy-cafe-linebot/
│
├── src/                # bot source code
├── webhook/            # webhook handlers
├── .env.example        # env template
├── package.json
├── README.md
└── LICENSE

⚙️ Installation
1. Clone repo
git clone https://github.com/filedzsly/cozy-cafe-linebot.git
cd cozy-cafe-linebot

2. Install dependencies
npm install

3. Setup environment
LINE_CHANNEL_ACCESS_TOKEN=your_token
LINE_CHANNEL_SECRET=your_secret

🚀 Run locally
npm run dev or node index.js
ngrok http 3000
