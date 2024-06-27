import express from "express";
import Razorpay from 'razorpay';
import 'dotenv/config.js';
import crypto from "crypto"
import Payment from "../models/payment.js";
const router= express.Router();

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});
router.get("/get-payment", (req,res)=>{
    res.json("payment details");

})


// create order api
router.post('/order',(req,res)=>{
    const {amount}=req.body;
  
    try {
      const options={
        amount: Number(amount*100),
        currency: "INR",
        receipt:crypto.randomBytes(10).toString("hex"),
        notes: {
          company: "Kairaa Blockchain Academy",
        }
      }
      const myPayment = razorpayInstance.orders.create(options,(error, order)=>{
       if(error){
        console.log(`error ${error}`);
        return res.status(500).json({message:"something went wrong"});
       }
       res.status(201).json({
        success: true,
        // order_id: myPayment.id,
        data:order
      });
    });
   
} catch (error) {
    console.log(error)
  return res.status(500).json({message:"internal server error"})
 
}
})

router.post('/verify',async(req,res)=>{
    const {razorpay_order_id, razorpay_payment_id, razorpay_signature}=req.body;
console.log(`req.body`, req.body);

try{

    // create sign
    const sign= razorpay_order_id+"|"+razorpay_payment_id;
    
    // create expectedsign
    const expectedSign=crypto.createHmac("sha256", process.env.RAZORPAY_SECRET).update(sign.toString()).digest('hex');
    console.log(razorpay_signature===expectedSign)

    const isAuthenticated=expectedSign===razorpay_signature;

if(isAuthenticated){
    const payment= new Payment({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    });

    await payment.save();

    res.json({
        message:"Payment successful"
    })
}
}catch(error){
console.log(error);
res.status(500).json({message: "Internal server error"});
}

})

export default router;