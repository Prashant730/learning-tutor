# 🔑 How to Get Your FREE Gemini API Key

Your AI Tutoring Tool chatbot uses Google's Gemini API, which is **completely FREE** with generous usage limits!

## 📋 Quick Setup (2 minutes)

### Step 1: Get Your API Key

1. Visit **[Google AI Studio](https://aistudio.google.com/app/apikey)**
2. Sign in with your Google account (Gmail)
3. Click the **"Create API Key"** button
4. Copy the generated API key (it looks like: `AIzaSy...`)

### Step 2: Add the Key to Your Project

1. Open `chat.html` in your code editor
2. Find line ~597 (search for `GEMINI_API_KEY`)
3. Replace the existing key with your new key:
   ```javascript
   const GEMINI_API_KEY = 'YOUR_NEW_API_KEY_HERE'
   ```
4. Save the file

### Step 3: Test It!

1. Open `chat.html` in your browser
2. Type a message in the chat
3. The AI should respond! 🎉

## 🆓 Is it Really Free?

**YES!** Google Gemini API offers:

- ✅ **Free tier** with generous limits
- ✅ **60 requests per minute**
- ✅ **1,500 requests per day**
- ✅ **1 million tokens per month**
- ✅ No credit card required

Perfect for learning projects and small applications!

## 🔒 Security Tips

⚠️ **Important:** Never share your API key publicly!

- ❌ Don't commit API keys to GitHub
- ❌ Don't share keys in screenshots
- ✅ Keep keys in environment variables for production
- ✅ Regenerate keys if accidentally exposed

## 🐛 Troubleshooting

### "API Key Not Configured" Error

- Make sure you replaced `YOUR_API_KEY_HERE` with your actual key
- Check that there are no extra spaces or quotes

### "Invalid API Key" Error

- Verify you copied the entire key
- Try generating a new key from Google AI Studio

### "Rate Limit Exceeded" Error

- You've hit the free tier limit (60 requests/minute)
- Wait a minute and try again

## 📚 Additional Resources

- [Google AI Studio](https://aistudio.google.com/)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [API Pricing](https://ai.google.dev/pricing)

## 💡 Current API Key Status

Your project currently has an API key configured. If you want to use your own:

1. Follow the steps above to get a new key
2. Replace the existing key in `chat.html`
3. Test the chatbot to ensure it works

---

**Need Help?** The chatbot will show helpful error messages if the API key isn't working correctly.
