const mongoose = require('mongoose');

const paymentQRSchema = new mongoose.Schema(
  {
    qrImage: {
      type: String,
      required: [true, 'QR image URL is required'],
      trim: true,
    },
    upiId: {
      type: String,
      required: [true, 'UPI ID is required'],
      trim: true,
      maxlength: 100,
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: [1, 'Amount must be at least ₹1'],
    },
    label: {
      type: String,
      trim: true,
      maxlength: 100,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Enforce single-active constraint: when activating one, deactivate all others
paymentQRSchema.pre('save', async function (next) {
  if (this.isModified('isActive') && this.isActive) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id }, isActive: true },
      { $set: { isActive: false } }
    );
  }
  next();
});

const PaymentQR = mongoose.model('PaymentQR', paymentQRSchema);

module.exports = PaymentQR;
