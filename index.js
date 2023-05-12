// 3 schema

// 1. User
// name & email
//post
// /user/

// 1. Product
// title & price
//post
// /product/

// 1. Orders
// product: ObjectId, user: ObjectId
//  /order/buy
//post
// {
//   user: id,
//   product: id
// }

// /order/

//POST - {email : "tirthshah147@gmail.com"}

import express from "express";
import mongoose from "mongoose";

mongoose
  .connect("mongodb://localhost:27017/newton")
  .then(console.log("DB connected"))
  .catch((err) => {
    console.log(err);
  });

const app = express();

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

const User = mongoose.model("User", userSchema);

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
});
const Product = mongoose.model("Product", productSchema);

const orderSchema = new mongoose.Schema({
  product: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});
const Order = mongoose.model("Order", orderSchema);

app.use(express.json());

app.post("/user", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email)
    res.status(400).send({
      message: "Please provide all details",
    });

  const user = await User.create({ name, email });
  res.status(201).send(user);
});

app.post("/product", async (req, res) => {
  const { title, price } = req.body;
  if (!title || !price)
    res.status(400).send({
      message: "Please provide all details",
    });

  const product = await Product.create({ title, price });
  res.status(201).send(product);
});

app.post("/order", async (req, res) => {
  const { email } = req.body;
  if (!email)
    res.status(400).send({
      message: "Please provide all details",
    });

  const user = await User.findOne({ email });
  const orders = await Order.find({ user: user._id })
    .populate("product")
    .populate("user");

  res.send(orders);
});

app.post("/order/buy", async (req, res) => {
  const { user, product } = req.body;
  if (!user || !product)
    res.status(400).send({
      message: "Please provide all details",
    });
    
  const order = await Order.create({ user, product });
  res.status(201).send(order);
});

app.listen(3000, () => {
  console.log("Server started");
});
