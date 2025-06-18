import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    tgId: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
    },
    username: {
      type: String,
    },
    isBot: {
      type: Boolean,
      required: true,
    },
    publicKey: {
      type: String,
      required: true,
    },
    encryptedPrivateKey: {
      type: String,
      required: true,
    },
    iv: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.model("Users", userSchema);
export default Users;
