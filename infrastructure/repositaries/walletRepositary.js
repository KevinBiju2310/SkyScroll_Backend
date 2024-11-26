const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    transactions: [
      {
        amount: {
          type: Number,
          required: true,
        },
        transactionDate: {
          type: Date,
          default: Date.now,
        },
        transactionType: {
          type: String,
          default: "REFUND",
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Wallet = mongoose.model("Wallet", walletSchema);

const findByUserId = async (id) => {
  return await Wallet.findOne({ userId: id });
};

const createWallet = async (data) => {
  const wallet = new Wallet(data);
  return await wallet.save();
};

const updateWallet = async (id, data) => {
  return await Wallet.findByIdAndUpdate(id, data, { new: true });
};

module.exports = {
  findByUserId,
  createWallet,
  updateWallet
};
