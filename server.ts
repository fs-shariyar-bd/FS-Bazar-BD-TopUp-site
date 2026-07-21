import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { Game, Order, User, SiteConfig, Transaction, TopupOption } from "./src/types";

// Database file path
const DB_FILE = path.join(process.cwd(), "db.json");

// Helper to read database
function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = getInitialData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database file, resetting to initial state", err);
    const initialData = getInitialData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
}

// Helper to write database
function writeDB(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing database file", err);
  }
}

// Initial default seed data
function getInitialData() {
  const defaultGames: Game[] = [
    {
      id: "freefire-id",
      name: "Free Fire (ID Code)",
      logo: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400", // Placeholder but high quality
      category: "mobile",
      description: "Direct top-up via your Free Fire Player ID. Super fast delivery in 1-5 minutes.",
      inputsRequired: ["playerId"],
      isPopular: true,
      topupOptions: [
        { id: "ff-115", name: "115 Diamonds", price: 85, stock: 999 },
        { id: "ff-240", name: "240 Diamonds", price: 170, stock: 999 },
        { id: "ff-505", name: "505 Diamonds", price: 350, stock: 999 },
        { id: "ff-1010", name: "1010 Diamonds", price: 690, stock: 999 },
        { id: "ff-weekly", name: "Weekly Membership", price: 160, stock: 500 },
        { id: "ff-monthly", name: "Monthly Membership", price: 750, stock: 200 }
      ]
    },
    {
      id: "pubg-uc",
      name: "PUBG Mobile (UC)",
      logo: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=400",
      category: "mobile",
      description: "Buy PUBG Mobile Unknown Cash (UC). Instantly delivered using Player ID & Name.",
      inputsRequired: ["playerId", "characterName"],
      isPopular: true,
      topupOptions: [
        { id: "pubg-60", name: "60 UC", price: 90, stock: 999 },
        { id: "pubg-325", name: "325 UC", price: 420, stock: 999 },
        { id: "pubg-660", name: "660 UC", price: 840, stock: 999 },
        { id: "pubg-1800", name: "1800 UC", price: 2100, stock: 500 }
      ]
    },
    {
      id: "coc-gems",
      name: "Clash of Clans (Gems)",
      logo: "https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?auto=format&fit=crop&q=80&w=400",
      category: "mobile",
      description: "Buy COC Gold Pass or Gems bundle with swift order processing.",
      inputsRequired: ["playerId", "characterName"],
      isPopular: true,
      topupOptions: [
        { id: "coc-goldpass", name: "Gold Pass", price: 650, stock: 100 },
        { id: "coc-500", name: "500 Gems", price: 450, stock: 999 },
        { id: "coc-1200", name: "1200 Gems", price: 950, stock: 999 }
      ]
    },
    {
      id: "cod-cp",
      name: "Call of Duty Mobile (CP)",
      logo: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=400",
      category: "mobile",
      description: "Fastest COD Mobile CP delivery to your account.",
      inputsRequired: ["playerId"],
      isPopular: false,
      topupOptions: [
        { id: "cod-80", name: "80 CP", price: 95, stock: 999 },
        { id: "cod-420", name: "420 CP", price: 460, stock: 999 },
        { id: "cod-880", name: "880 CP", price: 920, stock: 999 }
      ]
    },
    {
      id: "unipin-voucher",
      name: "UniPin Voucher",
      logo: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=400",
      category: "vouchers",
      description: "UniPin Gift Cards sent instantly to your email. Load and spend anywhere.",
      inputsRequired: ["email"],
      isPopular: false,
      topupOptions: [
        { id: "uni-100", name: "BDT 100 UniPin", price: 110, stock: 50 },
        { id: "uni-500", name: "BDT 500 UniPin", price: 540, stock: 20 }
      ]
    },
    {
      id: "chatgpt-plus",
      name: "ChatGPT Plus (Premium)",
      logo: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=400",
      category: "subscriptions",
      description: "100% Genuine Private/Shared ChatGPT Plus Accounts.",
      inputsRequired: ["email", "password"],
      isPopular: false,
      topupOptions: [
        { id: "gpt-shared", name: "Shared 1-Month Account", price: 650, stock: 15 },
        { id: "gpt-private", name: "Private 1-Month (Own Mail)", price: 2350, stock: 5 }
      ]
    }
  ];

  const defaultUsers = [
    {
      id: "admin-id",
      email: "admin@bazar.com",
      password: "admin", // Plaintext for mock demonstration
      name: "Store Administrator",
      role: "admin",
      walletBalance: 15000,
      number: "01787375523"
    },
    {
      id: "customer-id",
      email: "customer@bazar.com",
      password: "user",
      name: "Ferdous Shariyar",
      role: "customer",
      walletBalance: 1250,
      number: "01999999999"
    }
  ];

  const defaultBanners = [
    {
      id: "banner-1",
      imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200",
      title: "কিভাবে ১ সেকেন্ডে PUBG UC ও FF Diamond কিনবেন?",
      subtitle: "bKash / Nagad Instant Auto-Payment System"
    },
    {
      id: "banner-2",
      imageUrl: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=1200",
      title: "Clash of Clans Gold Pass Discount!",
      subtitle: "Get COC Gold Pass and Gems at the cheapest rate in BD."
    }
  ];

  const defaultSiteConfig: SiteConfig = {
    activeHeaderTemplate: "classic",
    activeCardTemplate: "grid",
    themeColor: "emerald",
    activeWebsiteTemplate: "classic",
    siteName: "Pipo RRR Bazar",
    siteSlogan: "Secure & Instant Game Top-Up",
    supportPhone: "+8801787375523",
    supportWhatsApp: "+8801787375523",
    announcementText: "Welcome to Pipo RRR Bazar! We offer instant automatic bKash & Nagad Top-up with 24/7 client support.",
    banners: defaultBanners,
    showLiveActivity: true,
    showStatsCounter: true,
    showNoticeBanner: true,
    sectionHomeTitle: "FS Bazar Store",
    supportEmail: "pipobazarofficial@gmail.com",
    footerCopyright: "© 2026 Pipo Bazar BD. All Rights Reserved."
  };

  return {
    users: defaultUsers,
    games: defaultGames,
    orders: [],
    transactions: [],
    config: defaultSiteConfig
  };
}

// Initial DB Read
let db = readDB();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ROUTES ---

  // Auth: Register
  app.post("/api/auth/register", (req, res) => {
    const { email, password, name, number } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }

    db = readDB();
    const existing = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: "Email is already registered." });
    }

    const newUser = {
      id: "usr-" + Math.random().toString(36).substr(2, 9),
      email: email.toLowerCase(),
      password,
      name,
      number: number || "",
      role: "customer",
      walletBalance: 0
    };

    db.users.push(newUser);
    writeDB(db);

    const { password: _, ...userToSend } = newUser;
    res.json({ message: "Registration successful!", user: userToSend });
  });

  // Auth: Login
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    db = readDB();
    const user = db.users.find(
      (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const { password: _, ...userToSend } = user;
    res.json({ message: "Login successful!", user: userToSend });
  });

  // Auth: Forgot Password
  app.post("/api/auth/forgot-password", (req, res) => {
    const { emailOrPhone } = req.body;
    if (!emailOrPhone) {
      return res.status(400).json({ error: "Email or Phone is required." });
    }
    db = readDB();
    const user = db.users.find(
      (u: any) =>
        u.email.toLowerCase() === emailOrPhone.toLowerCase() ||
        u.number === emailOrPhone
    );

    if (!user) {
      return res.status(404).json({ error: "No account found with this Email or Phone." });
    }

    // Generate a simulated 6-digit OTP
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

    res.json({ 
      message: `Verification code sent to ${emailOrPhone}.`,
      otp: generatedOTP 
    });
  });

  // Auth: Reset Password
  app.post("/api/auth/reset-password", (req, res) => {
    const { emailOrPhone, newPassword } = req.body;
    if (!emailOrPhone || !newPassword) {
      return res.status(400).json({ error: "Email/Phone and New Password are required." });
    }
    db = readDB();
    const user = db.users.find(
      (u: any) =>
        u.email.toLowerCase() === emailOrPhone.toLowerCase() ||
        u.number === emailOrPhone
    );

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    user.password = newPassword;
    writeDB(db);

    res.json({ message: "Password updated successfully!" });
  });

  // Auth: Update User Profile / Edit wallet directly for admin tests
  app.post("/api/auth/update-wallet", (req, res) => {
    const { userId, amount } = req.body;
    db = readDB();
    const user = db.users.find((u: any) => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    user.walletBalance = Number((user.walletBalance + amount).toFixed(2));
    writeDB(db);
    const { password: _, ...userToSend } = user;
    res.json({ message: "Wallet updated!", user: userToSend });
  });

  // Auth: Update User Profile (edit name, phone/number, profile avatar, and password)
  app.post("/api/auth/update-profile", (req, res) => {
    const { userId, name, number, avatar, password, currentPassword } = req.body;
    db = readDB();
    const user = db.users.find((u: any) => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    if (name !== undefined) user.name = name;
    if (number !== undefined) user.number = number;
    if (avatar !== undefined) user.avatar = avatar;
    if (password !== undefined) {
      if (!currentPassword) {
        return res.status(400).json({ error: "Current password is required to set a new password." });
      }
      if (user.password !== currentPassword) {
        return res.status(400).json({ error: "Incorrect current password." });
      }
      user.password = password;
    }
    writeDB(db);
    const { password: _, ...userToSend } = user;
    res.json({ message: "Profile updated successfully!", user: userToSend });
  });

  // Get configuration
  app.get("/api/config", (req, res) => {
    db = readDB();
    res.json(db.config);
  });

  // Update configuration (Admin only)
  app.post("/api/config/update", (req, res) => {
    const { config } = req.body;
    db = readDB();
    db.config = { ...db.config, ...config };
    writeDB(db);
    res.json({ message: "Site configuration updated successfully!", config: db.config });
  });

  // Get all games list
  app.get("/api/games", (req, res) => {
    db = readDB();
    res.json(db.games);
  });

  // Add a new game (Admin)
  app.post("/api/games/add", (req, res) => {
    const { name, logo, category, description, topupOptions, inputsRequired } = req.body;
    db = readDB();
    const newGame: Game = {
      id: "game-" + Math.random().toString(36).substr(2, 9),
      name,
      logo: logo || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400",
      category: category || "mobile",
      description: description || "",
      topupOptions: topupOptions || [],
      inputsRequired: inputsRequired || ["playerId"],
      isPopular: false
    };
    db.games.push(newGame);
    writeDB(db);
    res.json({ message: "Game added successfully!", game: newGame });
  });

  // Update game / items (Admin)
  app.post("/api/games/update", (req, res) => {
    const { gameId, updatedGame } = req.body;
    db = readDB();
    const index = db.games.findIndex((g: any) => g.id === gameId);
    if (index === -1) {
      return res.status(404).json({ error: "Game not found." });
    }
    db.games[index] = { ...db.games[index], ...updatedGame };
    writeDB(db);
    res.json({ message: "Game updated successfully!", game: db.games[index] });
  });

  // Delete a game (Admin)
  app.post("/api/games/delete", (req, res) => {
    const { gameId } = req.body;
    db = readDB();
    db.games = db.games.filter((g: any) => g.id !== gameId);
    writeDB(db);
    res.json({ message: "Game deleted successfully!" });
  });

  // Place a top-up order
  app.post("/api/orders/place", (req, res) => {
    const { userId, gameId, optionId, inputs, paymentMethod, transactionId, senderNumber } = req.body;
    db = readDB();

    const user = db.users.find((u: any) => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const game = db.games.find((g: any) => g.id === gameId);
    if (!game) {
      return res.status(404).json({ error: "Game not found." });
    }

    const option = game.topupOptions.find((o: any) => o.id === optionId);
    if (!option) {
      return res.status(404).json({ error: "Option not found." });
    }

    // Process payment
    if (paymentMethod === "Wallet") {
      if (user.walletBalance < option.price) {
        return res.status(400).json({ error: "Insufficient wallet balance." });
      }
      user.walletBalance = Number((user.walletBalance - option.price).toFixed(2));
    } else if (!transactionId || !senderNumber) {
      return res.status(400).json({ error: "Transaction details are required for gateway payments." });
    }

    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    const newOrder: Order = {
      id: orderId,
      userId: user.id,
      userEmail: user.email,
      gameId: game.id,
      gameName: game.name,
      optionId: option.id,
      optionName: option.name,
      price: option.price,
      inputs: inputs || {},
      paymentMethod: paymentMethod || "bKash",
      transactionId: transactionId || "WALLET",
      senderNumber: senderNumber || user.number || "",
      status: paymentMethod === "Wallet" ? "completed" : "pending",
      createdAt: new Date().toISOString()
    };

    // Save transaction record if wallet was used or order is processed
    const newTransaction: Transaction = {
      id: "TXN-" + Math.floor(100000 + Math.random() * 900000),
      userId: user.id,
      type: "purchase",
      amount: option.price,
      method: paymentMethod,
      transactionId: transactionId || "WALLET_DEBIT",
      status: paymentMethod === "Wallet" ? "completed" : "pending",
      createdAt: new Date().toISOString()
    };

    db.orders.push(newOrder);
    db.transactions.push(newTransaction);

    // Adjust stock
    if (option.stock > 0) {
      option.stock--;
    }

    writeDB(db);

    res.json({
      message: paymentMethod === "Wallet" ? "Order completed instantly!" : "Order submitted! Waiting for manual/API verification.",
      order: newOrder,
      walletBalance: user.walletBalance
    });
  });

  // Get orders (All for Admin, or filtered for individual users)
  app.get("/api/orders", (req, res) => {
    const { userId } = req.query;
    db = readDB();
    if (userId) {
      const userOrders = db.orders.filter((o: any) => o.userId === userId);
      return res.json(userOrders);
    }
    res.json(db.orders);
  });

  // Update order status (Admin)
  app.post("/api/orders/update-status", (req, res) => {
    const { orderId, status } = req.body;
    db = readDB();
    const order = db.orders.find((o: any) => o.id === orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    order.status = status;

    // Update corresponding purchase transaction if status is updated
    const relatedTx = db.transactions.find(
      (t: any) => t.userId === order.userId && t.amount === order.price && t.createdAt.substring(0, 16) === order.createdAt.substring(0, 16)
    );
    if (relatedTx) {
      relatedTx.status = status === "completed" ? "completed" : status === "cancelled" ? "failed" : "pending";
    }

    // Refund if cancelled and paid with wallet
    if (status === "cancelled" && order.paymentMethod === "Wallet") {
      const user = db.users.find((u: any) => u.id === order.userId);
      if (user) {
        user.walletBalance = Number((user.walletBalance + order.price).toFixed(2));
        // Add refund transaction log
        db.transactions.push({
          id: "TXN-" + Math.floor(100000 + Math.random() * 900000),
          userId: user.id,
          type: "refund",
          amount: order.price,
          method: "Wallet",
          transactionId: "REFUND-" + order.id,
          status: "completed",
          createdAt: new Date().toISOString()
        });
      }
    }

    writeDB(db);
    res.json({ message: `Order marked as ${status}!`, order });
  });

  // Get transaction logs (All or User specific)
  app.get("/api/transactions", (req, res) => {
    const { userId } = req.query;
    db = readDB();
    if (userId) {
      const userTxns = db.transactions.filter((t: any) => t.userId === userId);
      return res.json(userTxns);
    }
    res.json(db.transactions);
  });

  // Submit direct wallet deposit request / simulate API gateway payment
  app.post("/api/transactions/deposit", (req, res) => {
    const { userId, amount, paymentMethod, transactionId, senderNumber, isInstantGateway } = req.body;
    if (!userId || !amount || !paymentMethod || !transactionId || !senderNumber) {
      return res.status(400).json({ error: "All details are required for deposit." });
    }

    db = readDB();
    const user = db.users.find((u: any) => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const txId = "TXN-" + Math.floor(100000 + Math.random() * 900000);
    
    // If it's the instant gateway simulation, it automatically completes!
    const isCompleted = isInstantGateway === true;

    const newTransaction: Transaction = {
      id: txId,
      userId: user.id,
      type: "deposit",
      amount: Number(amount),
      method: paymentMethod,
      transactionId,
      status: isCompleted ? "completed" : "pending",
      createdAt: new Date().toISOString()
    };

    if (isCompleted) {
      user.walletBalance = Number((user.walletBalance + Number(amount)).toFixed(2));
    }

    db.transactions.push(newTransaction);
    writeDB(db);

    res.json({
      message: isCompleted ? "Wallet topped up instantly!" : "Deposit request submitted! Waiting for Admin verification.",
      transaction: newTransaction,
      walletBalance: user.walletBalance
    });
  });

  // Verify deposit request (Admin)
  app.post("/api/transactions/verify-deposit", (req, res) => {
    const { txnId, status } = req.body;
    db = readDB();
    const txn = db.transactions.find((t: any) => t.id === txnId);
    if (!txn) {
      return res.status(404).json({ error: "Transaction not found." });
    }

    if (txn.status !== "pending") {
      return res.status(400).json({ error: "Transaction already processed." });
    }

    txn.status = status;

    if (status === "completed") {
      const user = db.users.find((u: any) => u.id === txn.userId);
      if (user) {
        user.walletBalance = Number((user.walletBalance + txn.amount).toFixed(2));
      }
    }

    writeDB(db);
    res.json({ message: `Transaction verified and set to ${status}.`, txn });
  });

  // Delete a transaction log (Admin)
  app.post("/api/transactions/delete", (req, res) => {
    const { txnId } = req.body;
    db = readDB();
    db.transactions = db.transactions.filter((t: any) => t.id !== txnId);
    writeDB(db);
    res.json({ message: "Transaction log cleared!" });
  });

  // Reset Database to Seed values (Convenient for testing)
  app.post("/api/admin/reset-db", (req, res) => {
    const initialData = getInitialData();
    db = initialData;
    writeDB(db);
    res.json({ message: "Database reset to defaults!", db });
  });

  // --- VITE DEV OR PRODUCTION STATIC FILES ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
