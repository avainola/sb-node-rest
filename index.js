const fs = require("fs");
const express = require("express");
var http = require("http");
var bodyParser = require("body-parser");

require("dotenv").config();

const app = express();

const data = fs.readFileSync("./data.json");
const products = JSON.parse(data);

const randomError = (req, res, next) => {
  const randomNumber = Math.random();
  if (randomNumber > 0.9) {
    return res.sendStatus(500);
  }
  next();
};

app.use("/doc", express.static("doc"));

app.use(randomError);

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendStatus(200);
});

/**
 * @apiDefine InternalServerError
 *
 * @apiError InternalServerError 500 Internal Server Error.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 */

/**
 * @apiDefine NotFoundError
 *
 * @apiError ProductNotFound 404 Product with this id was not found
 *
 * @apiErrorExample Error-Response:
 *    HTTP/1.1 404 Not Found
 *    {
 *      "message": "Product not found!"
 *    }
 */

/**
 * @apiDefine ProductSuccess
 *
 * @apiSuccess {String} id ID of product
 * @apiSuccess {String} categoryId Category ID of product
 * @apiSuccess {Object} category Product Category information
 * @apiSuccess {String} name Long name of product
 * @apiSuccess {String} shortName Short name of product
 * @apiSuccess {String} description Description of product
 * @apiSuccess {String} ibuMin
 * @apiSuccess {String} ibuMax
 * @apiSuccess {String} abvMin
 * @apiSuccess {String} abvMax
 * @apiSuccess {String} srmMin
 * @apiSuccess {String} srmMax
 * @apiSuccess {String} ogMin
 * @apiSuccess {String} fgMin
 * @apiSuccess {String} fgMax
 */

/**
 * @apiDefine ProductSuccessExample
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 67,
 *      "categoryId": 5,
 *      "category": {
 *        "id": 5,
 *        "name": "Belgian And French Origin Ales"
 *      },
 *      "name": "Belgian-Style Gueuze Lambic",
 *      "shortName": "Gueuze",
 *      "description": "Old lambic is blended with newly fermenting young lambic to create this special style of lambic. Gueuze is always referrmented in the bottle. These unflavored blended and secondary fermented lambic beers may be very dry or mildly sweet and are characterized by intense fruity-estery, sour, and acidic aromas and flavors. These pale beers are brewed with unmalted wheat, malted barley, and stale, aged hops. Sweet malt characters are not perceived. They are very low in hop bitterness. Diacetyl should be absent. Characteristic horsey, goaty, leathery and phenolic character evolved from Brettanomyces yeast is often present at moderate levels. Cloudiness is acceptable. These beers are quite dry and light bodied. Vanillin and other wood-derived flavors should not be evident. Versions of this beer made outside of the Brussels area of Belgium cannot be true lambics. These versions are said to be \"lambic-style\" and may be made to resemble many of the beers of true origin. Historically, traditional gueuze lambics are dry and completely attenuated, exhibiting no residual sweetness either from malt, sugar or artificial sweeteners. Some versions often have a degree of sweetness, contributed by sugars or artificial sweeteners. Competition organizers may choose to subcategorize this style into A) Traditional and B) Sweet.  Artificial sweeteners are sometimes used in some brands.",
 *      "ibuMin": "11",
 *      "ibuMax": "23",
 *      "abvMin": "6.8",
 *      "abvMax": "8.6",
 *      "srmMin": "6",
 *      "srmMax": "13",
 *      "ogMin": "1.044",
 *      "fgMin": "1",
 *      "fgMax": "1.01"
 *    }
 */

/**
 * @api {get} /products Get list of all Products
 * @apiName GetProducts
 * @apiGroup Products
 *
 * @apiSuccess {String} id ID of product
 * @apiSuccess {String} categoryId Category ID of product
 * @apiSuccess {String} name Long name of product
 * @apiSuccess {String} shortName Short name of product
 * @apiSuccess {String} details URL to get details of product
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 67,
 *      "categoryId": 5,
 *      "name": "Belgian-Style Gueuze Lambic",
 *      "shortName": "Gueuze",
 *      "details": "/products/67"
 *    }
 *
 * @apiUse InternalServerError
 */
app.get("/products", (req, res) => {
  const productList = products.map(product => ({
    id: product.id,
    categoryId: product.categoryId,
    name: product.name,
    shortName: product.shortName,
    details: `/products/${product.id}`
  }));
  res.json(productList);
});

/**
 * @api {get} /products/:id Get Product details information
 * @apiName GetProduct
 * @apiGroup Products
 *
 * @apiParam {Number} id Products unique ID.
 *
 * @apiUse ProductSuccess
 * @apiUse ProductSuccessExample
 *
 * @apiUse InternalServerError
 * @apiUse NotFoundError
 */
app.get("/products/:id", (req, res) => {
  const product = products.find(product => product.id == req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found!" });
  res.json(product);
});

/**
 * @api {post} /products Add new Product
 * @apiName PostProduct
 * @apiGroup Products
 *
 * @apiUse ProductSuccess
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 201 Created
 *    {
 *      "id": 67,
 *      "categoryId": 5,
 *      "category": {
 *        "id": 5,
 *        "name": "Belgian And French Origin Ales"
 *      },
 *      "name": "Belgian-Style Gueuze Lambic",
 *      "shortName": "Gueuze",
 *      "description": "Old lambic is blended with newly fermenting young lambic to create this special style of lambic. Gueuze is always referrmented in the bottle. These unflavored blended and secondary fermented lambic beers may be very dry or mildly sweet and are characterized by intense fruity-estery, sour, and acidic aromas and flavors. These pale beers are brewed with unmalted wheat, malted barley, and stale, aged hops. Sweet malt characters are not perceived. They are very low in hop bitterness. Diacetyl should be absent. Characteristic horsey, goaty, leathery and phenolic character evolved from Brettanomyces yeast is often present at moderate levels. Cloudiness is acceptable. These beers are quite dry and light bodied. Vanillin and other wood-derived flavors should not be evident. Versions of this beer made outside of the Brussels area of Belgium cannot be true lambics. These versions are said to be \"lambic-style\" and may be made to resemble many of the beers of true origin. Historically, traditional gueuze lambics are dry and completely attenuated, exhibiting no residual sweetness either from malt, sugar or artificial sweeteners. Some versions often have a degree of sweetness, contributed by sugars or artificial sweeteners. Competition organizers may choose to subcategorize this style into A) Traditional and B) Sweet.  Artificial sweeteners are sometimes used in some brands.",
 *      "ibuMin": "11",
 *      "ibuMax": "23",
 *      "abvMin": "6.8",
 *      "abvMax": "8.6",
 *      "srmMin": "6",
 *      "srmMax": "13",
 *      "ogMin": "1.044",
 *      "fgMin": "1",
 *      "fgMax": "1.01"
 *    }
 *
 * @apiUse InternalServerError
 *
 */
app.post("/products", (req, res) => {
  const { name, shortName, category, description } = req.body;
  if (!name || !shortName || !category || !description) {
    return res.status(400).json({
      message: `Missing fields: ${Object.keys({ name, shortName, category })
        .filter(key => req.body[key] === undefined)
        .join(", ")}`
    });
  }

  const id = Math.max.apply(null, products.map(product => product.id)) + 1;
  const newProduct = { ...req.body, id };
  products.push(newProduct);

  res.status(201).json(newProduct);
});

/**
 * @api {put} /products/:id Modify Product information
 * @apiName PutProduct
 * @apiGroup Products
 *
 * @apiParam {Number} id Products unique ID.
 *
 * @apiUse ProductSuccess
 * @apiUse ProductSuccessExample
 *
 * @apiUse InternalServerError
 * @apiUse NotFoundError
 *
 */
app.put("/products/:id", (req, res) => {
  const productToUpdate = products.find(product => product.id == req.params.id);
  if (!productToUpdate) {
    return res.status(404).json({ message: "Product not found!" });
  }
  const updatedFields = Object.keys(req.body)
    .filter(key => req.body[key] !== undefined)
    .reduce((a, c) => ({ ...a, [c]: req.body[c] }), {});
  const updatedProduct = { ...productToUpdate, ...updatedFields };
  const index = products.indexOf(productToUpdate);
  products[index] = updatedProduct;

  res.status(200).json(updatedProduct);
});

http.createServer(app).listen(process.env.PORT, () => {
  console.log("listening on port", process.env.PORT);
});
