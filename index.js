// const express = require("express");
// const cors = require("cors");
// require("./db/config");
// const User = require("./db/User");
// const Product = require("./db/Product");

// const app = express();
// app.use(express.json());
// app.use(cors());
// app.post("/register", async (req, res) => {
//   let user = new User(req.body);
//   let result = await user.save();
//   result = result.toObject();
//   delete result.password;
//   res.send(result);
// });

// app.post("/login", async (req, res) => {
//   if (req.body.email && req.body.password) {
//     let user = await User.findOne(req.body).select("-password");
//     if (user) {
//       res.send(user);
//     } else {
//       res.send({ result: "User not found" });
//     }
//   } else {
//     res.send({ result: "Please enter email and password" });
//   }
// });

// app.post("/addproduct", async (req, res) => {
//     let product = new Product(req.body);
//     let result = await product.save();
//     res.send(result);
// });

// app.get("/getproducts", async (req, res) => {
//     let products = await Product.find();
//     if(products.length>0){
//         res.send(products);
//     }else{
//         res.send({result:"No products found"});
//     }
// });

// app.delete("/deleteproduct/:id", async (req, res) => {
//   const result = await Product.deleteOne({_id:req.params.id});
//   res.send(result);
// });

// app.get("/getproduct/:id", async (req, res) => {
//   let result = await Product.findOne({_id:req.params.id});
//   if(result){
//     res.send(result);
//   }else{
//     res.send({result:"No product found"});
//   }
// });

// app.put("/updateproduct/:id", async (req, res) => {
//   let result = await Product.updateOne({_id:req.params.id},{
//     $set: req.body
//   });
//   if(result){
//     res.send(result);
//   }else{
//     res.send({result:"No product found"});
//   }
// });

// app.get("/searchproduct/:key", async (req, res) => {
//   let result= await Product.find({
//     $or: [
//       { name: { $regex: req.params.key } },
//       { company: { $regex: req.params.key } },
//       { category: { $regex: req.params.key } },
//       { price: { $regex: req.params.key } },
//     ]
//   });
//   res.send(result);
// });

// app.listen(5000);

// with jwt token

const express = require("express");
const cors = require("cors");
require("./db/config");
const User = require("./db/User");
const Product = require("./db/Product");

const Jwt = require("jsonwebtoken");
const jwtkey = "e-comm";

const app = express();
app.use(express.json());
app.use(cors());
app.post("/register", async (req, res) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  Jwt.sign({ result }, jwtkey, { expiresIn: "1h" }, (err, token) => {
    if (err) {
      res.send({ result: "Error in token generation" });
    } else {
      res.send({ result, auth: token });
    }
  });
});

app.post("/login", async (req, res) => {
  if (req.body.email && req.body.password) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      Jwt.sign({ user }, jwtkey, { expiresIn: "1h" }, (err, token) => {
        if (err) {
          res.send({ result: "Error in token generation" });
        }
        res.send({ user, auth: token });
      });
    } else {
      res.send({ result: "User not found" });
    }
  } else {
    res.send({ result: "Please enter email and password" });
  }
});

app.post("/addproduct", verifyToken, async (req, res) => {
  let product = new Product(req.body);
  let result = await product.save();
  res.send(result);
});

app.get("/getproducts", verifyToken, async (req, res) => {
  let products = await Product.find();
  if (products.length > 0) {
    res.send(products);
  } else {
    res.send({ result: "No products found" });
  }
});

app.delete("/deleteproduct/:id", verifyToken, async (req, res) => {
  const result = await Product.deleteOne({ _id: req.params.id });
  res.send(result);
});

app.get("/getproduct/:id", verifyToken, async (req, res) => {
  let result = await Product.findOne({ _id: req.params.id });
  if (result) {
    res.send(result);
  } else {
    res.send({ result: "No product found" });
  }
});

app.put("/updateproduct/:id", verifyToken, async (req, res) => {
  let result = await Product.updateOne(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  );
  if (result) {
    res.send(result);
  } else {
    res.send({ result: "No product found" });
  }
});

app.get("/searchproduct/:key", verifyToken, async (req, res) => {
  let result = await Product.find({
    $or: [
      { name: { $regex: req.params.key } },
      { company: { $regex: req.params.key } },
      { category: { $regex: req.params.key } },
      { price: { $regex: req.params.key } },
    ],
  });
  res.send(result);
});

function verifyToken(req, res, next) {
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];
    console.log("middleware called if", token);
    Jwt.verify(token, jwtkey, (err, result) => {
      if (err) {
        res.status(401).send({ result: "Invalid token" });
      } else {
        next();
      }
    });
  } else {
    res.status(403).send({ result: "No token found" });
  }
}

app.listen(5000);
