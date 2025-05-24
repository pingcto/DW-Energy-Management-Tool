# ⚡ Dream World - Energy Management Tool

A sleek, dark-themed auto energy refiller for *[Playmage's Dream World](https://kong.playmage.com/dream/)* with a premium cyberpunk interface.
Built as a Tampermonkey userscript.

---

## ✨ Features

- **Auto refill** energy using your available inventory items
- **Stylized UI** with neon aesthetics and animated progress HUD
- **Randomized delay** for natural refill cadence
- **Fail-safe**: error detection with status feedback

---

## 📦 Installation

1. Install **[Tampermonkey](https://www.tampermonkey.net/)** browser extension.
2. Click on **"Create a new script"** in Tampermonkey dashboard.
3. Replace the default code with the content from [`energy-manager.user.js`](./energy-manager.user.js).
4. Save the script and ensure it's enabled.
5. Open [Dream World](https://kong.playmage.com/dream/) and look for the **⚡AUTO REFILL⚡** UI in the top-right corner.

---

## 🛠 Usage

1. **Empty your inventory** before starting (important!).
2. Enter the number of energy refills you want in the input box.
3. Click **"INITIALIZE SEQUENCE"**.
4. Watch the cyberpunk interface as your energy is auto-replenished.

---

## ⚠️ Notes

- The refill logic simulates item usage by hitting `/healer?buy=mp` and `/inventory?use=0`.
- Ensure you are logged into your Playmage account.
- Uses randomized cooldown (2–3.5s) between actions to mimic human-like timing.

---

## 🧠 Author

**Ping**  
🌐 [https://cracked.sh/ping](https://cracked.sh/ping)

---

## 📜 Disclaimer

Use at your own risk. Not affiliated with Playmage or Kongregate.
