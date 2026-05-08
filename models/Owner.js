const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// ==================== OWNER SCHEMA ====================
const ownerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters']
    },
    
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Don't return password by default when querying
    },
    
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    
    fullName: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt automatically
  }
);

// ==================== HASH PASSWORD BEFORE SAVING ====================
ownerSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ==================== METHOD TO COMPARE PASSWORDS ====================
ownerSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ==================== CREATE & EXPORT MODEL ====================
module.exports = mongoose.model('Owner', ownerSchema);