const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://pranjal:pranjal@cluster0.qofpv.mongodb.net/usermernstack?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  ) 
  .then(() => {
    console.log("Mongo db is connected properly");
  })
  .catch((err) => {
    console.log(err);
  });
