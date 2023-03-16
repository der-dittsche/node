const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  card: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCard = function (product) {
  const cardProductIndex = this.card.items.findIndex((callback) => {
    const pId = callback.productId.toString();
    return pId === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCardItems = [...this.card.items];

  if (cardProductIndex >= 0) {
    newQuantity = this.card.items[cardProductIndex].quantity + 1;
    updatedCardItems[cardProductIndex].quantity = newQuantity;
  } else {
    updatedCardItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }

  const updatedCard = {
    items: updatedCardItems,
  };

  this.card = updatedCard;
  return this.save();
};

userSchema.methods.deleteCardItem = function (productId) {
  const updatedCardItems = this.card.items.filter((item) => {
    return item.productId.toString() !== productId.toString();
  });
  this.card.items = updatedCardItems;
  return this.save();
};

userSchema.methods.clearCard = function () {
  this.card = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

/*

  addOrder() {
    const db = getDb();
    return this.getCard()
      .then((products) => {
        const order = {
          items: products,
          user: {
            _id: new ObjectId(this._id),
            name: this.name,
            email: this.email,
          },
        };
        return db.collection("orders").insertOne(order);
      })
      .then((result) => {
        this.card = { items: [] };
        return db
          .collection("users")
          .updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { card: { items: [] } } }
          );
      });
  }

  getOrder() {
    const db = getDb();
    return db
      .collection("orders")
      .find({ "user._id": new ObjectId(this._id) })
      .toArray();
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .find({ _id: new ObjectId(userId) })
      .next();
  }
}

module.exports = User;
 */
