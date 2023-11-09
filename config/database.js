//connect to db
import mongoose, { connect } from "mongoose";

const connectDB = async () => {
  try {
    const connected = await mongoose.connect(process.env.CONSTR);
    console.log(connected.connection.name);
  } catch (err) {
    console.log(err);
  }
};

export default connectDB;
