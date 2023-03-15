const mongodb = require("mongodb");
const getDb = require("../util/mongodb").getDb;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(username, email, card, id) {
    this.name = username;
    this.email = email;
    this.card = card;
    this._id = id;
  }

  save() {
    const db = getDb();
    db.collection("user").insertOne(this);
  }

  addToCard(product) {
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
        productId: new ObjectId(product._id),
        quantity: 1,
      });
    }

    const updatedCard = {
      items: updatedCardItems,
    };

    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { card: updatedCard } }
      );
  }

  getCard() {
    const db = getDb();
    const productIds = this.card.items.map((i) => {
      return i.productId;
    });
    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((p) => {
          return {
            ...p,
            quantity: this.card.items.find((i) => {
              return i.productId.toString() === p._id.toString();
            }).quantity,
          };
        });
      });
  }

  deleteCardItem(productId) {
    const db = getDb();
    const updatedCardItems = this.card.items.filter((item) => {
      return item.productId.toString() !== productId.toString();
    });
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { card: { items: updatedCardItems } } }
      );
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
