import Razorpay from "razorpay";
const razorpay = new Razorpay({
  key_id: 'rzp_test_Tl84bYXe4txARY',
  key_secret: 'nlZVTyEt6CeFcUDmZHiMT68B'
});

async function run() {
  try {
    const razorpayOrder = await razorpay.orders.create({
      amount: 50000,
      currency: 'INR',
      receipt: 'test_receipt'
    });
    console.log("Success:", razorpayOrder);
  } catch (err) {
    console.error("Error:", err);
  }
}
run();
