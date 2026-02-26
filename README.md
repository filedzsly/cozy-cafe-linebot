# ☕ Cozy Cafe LINE Bot

A simple cozy cafe themed LINE chatbot for browsing drink menus and viewing product details.
Built with Node.js and LINE Messaging API.

This bot allows users to type a menu name or keyword and instantly receive product info with image and price.

---

## ✨ Features

* 📖 View full cafe menu in chat
* 🔍 Search menu by name or product key
* 🖼️ Send drink image automatically
* 💬 Auto reply chatbot system
* 🛡️ Anti-spam protection
* 🔌 LINE Messaging API integration
* 🌐 English-only menu system

---

## 📂 Project Structure

```
cozy-cafe-linebot/
│
├── index.js              # main bot server
├── products.json         # product database
├── resources/            # images (optional local assets)
├── .env.example          # environment template
├── package.json
├── package-lock.json
├── README.md
└── LICENSE
```

---

## ⚙️ Installation

### 1. Clone repository

```
git clone https://github.com/YOUR_GITHUB_USERNAME/cozy-cafe-linebot.git
cd cozy-cafe-linebot
```

### 2. Install dependencies

```
npm install
```

### 3. Setup environment

Create `.env` file in root folder:

```
LINE_TOKEN=your_line_channel_access_token
LINE_SECRET=your_line_channel_secret
```

---

## 🚀 Run locally

Start bot server:

```
node index.js
```

Server will run on:

```
http://localhost:3000
```

---

## 🌐 Connect LINE Webhook (for real testing)

### 1. Start ngrok

```
ngrok http 3000
```

Copy HTTPS URL (example):

```
https://xxxx.ngrok-free.app/webhook
```

### 2. Set in LINE Developer Console

Go to:
LINE Developers → Messaging API → Webhook URL

Paste:

```
https://your-ngrok-url/webhook
```

Enable:

* Use webhook = ON

Press:

* Verify

---

## 💬 How to use bot in LINE

Type in chat:

```
menu
```

Show full cafe menu

```
espresso
matcha latte
```

Show product detail + image

---

## 🧪 Test product data (console mode)

Run:

```
node index.js --test
```

Displays all product data from `products.json` in terminal.

---

## 🔐 Security Notes

Do NOT upload `.env` to public repository.

Ensure `.gitignore` contains:

```
node_modules
.env
```

Use `.env.example` for public template instead.

---

## 📄 License

MIT License
