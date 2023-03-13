const fs = require("fs");
const path = require("path");
const p = path.join(path.dirname(require.main.filename), "data", "card.json");

module.exports = class Card {
  static addProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      let card = { products: [], totalPrice: 0 };
      if (!err) {
        card = JSON.parse(fileContent);
      }
      const existingProductIndex = card.products.findIndex(
        (prod) => prod.id === id
      );
      const existingProduct = card.products[existingProductIndex];
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        card.products = [...card.products];
        card.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        card.products = [...card.products, updatedProduct];
      }
      card.totalPrice = card.totalPrice + +productPrice;
      fs.writeFile(p, JSON.stringify(card), (err) => {
        console.log(err);
      });
    });
    fs.writeFile;
  }
  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      const updatedCard = { ...JSON.parse(fileContent) };
      const product = updatedCard.products.find((prod) => prod.id === id);
      if (!product) {
        return;
      }
      console.log(product);
      const productQty = product.qty;
      updatedCard.products = updatedCard.products.filter(
        (prod) => prod.id !== id
      );
      updatedCard.totalPrice =
        updatedCard.totalPrice - productPrice * productQty;
      fs.writeFile(p, JSON.stringify(updatedCard), (err) => {
        console.log(err);
      });
    });
  }
  static getCard(callback) {
    fs.readFile(p, (err, fileContent) => {
      const card = JSON.parse(fileContent);
      if (err) {
        callback(null);
      } else {
        callback(card);
      }
    });
  }
};
