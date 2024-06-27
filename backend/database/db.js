import { connect } from "mongoose";

const connectToMongo = async () => {
  try {
    await connect("mongodb://localhost:27017",{
        dbName:"paymentGateway"
    });
    console.log("DB connected successfully");
  } catch (error) {
    console.log(error);
  }
};

export default connectToMongo;
