require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/auctionApp';

app.use(bodyParser.json());

class Stack {
  constructor() {
    this.items = [];
  }

  push(item) {
    this.items.push(item);
  }

  pop() {
    if (this.items.length === 0) {
      return null;
    }
    return this.items.pop();
  }

  peek() {
    return this.items.length > 0 ? this.items[this.items.length - 1] : null;
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

const bidStack = new Stack();

MongoClient.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    console.log('Connected to Database');
    const db = client.db('auctionApp');
    const usersCollection = db.collection('users');
    const auctionsCollection = db.collection('auctions');
    const bidsCollection = db.collection('bids');

    // User registration
    app.post('/register', async (req, res) => {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      try {
        const result = await usersCollection.insertOne({ username, password: hashedPassword });
        res.json({ success: true, userId: result.insertedId });
      } catch (error) {
        res.json({ success: false, message: error.message });
      }
    });

    // User login
    app.post('/login', async (req, res) => {
      const { username, password } = req.body;
      try {
        const user = await usersCollection.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
          res.json({ success: true, userId: user._id, message: "Login successful" });
        } else {
          res.json({ success: false, message: "Invalid username or password" });
        }
      } catch (error) {
        res.json({ success: false, message: error.message });
      }
    });

    // Create a new auction
    app.post('/auctions', async (req, res) => {
      const { itemName, description } = req.body;
      try {
        const result = await auctionsCollection.insertOne({ itemName, description });
        res.json({ success: true, auctionId: result.insertedId });
      } catch (error) {
        res.json({ success: false, message: error.message });
      }
    });

    // Place a bid
    app.post('/auctions/:auctionId/bid', async (req, res) => {
      const { auctionId } = req.params;
      const { userId, bidAmount } = req.body;
      const bid = { auctionId: ObjectId(auctionId), userId: ObjectId(userId), bidAmount, timestamp: new Date() };
      try {
        bidStack.push(bid);
        const result = await bidsCollection.insertOne(bid);
        res.json({ success: true, message: "Bid placed successfully", bidId: result.insertedId });
      } catch (error) {
        res.json({ success: false, message: error.message });
      }
    });

    // Retract the most recent bid
    app.delete('/auctions/:auctionId/bid/retract', async (req, res) => {
      const { auctionId } = req.params;
      const { userId } = req.body;
      if (!bidStack.isEmpty() && bidStack.peek().userId.toString() === userId && bidStack.peek().auctionId.toString() === auctionId) {
        const bidToRetract = bidStack.pop();
        try {
          await bidsCollection.deleteOne({ _id: ObjectId(bidToRetract._id) });
          res.json({ success: true, message: "Bid retracted successfully" });
        } catch (error) {
          res.json({ success: false, message: error.message });
        }
      } else {
        res.status(404).json({ success: false, message: "No matching bid found on top of the stack to retract." });
      }
    });

  })
  .catch(console.error);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});