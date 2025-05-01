const router = require("express").Router();
const cartController = require("../controllers/cartController");
const { verifyTokenAndAuthorization } = require("../middleware/verifyToken");

router.post("/", verifyTokenAndAuthorization, cartController.addProductToCart);
router.get(
  "/decrement",
  verifyTokenAndAuthorization,
  cartController.decrementProductOty
);

router.delete(
  "/:id",
  verifyTokenAndAuthorization,
  cartController.removeCartItem
);

router.get("/", verifyTokenAndAuthorization, cartController.getCart);

router.get(
  "/counter",
  verifyTokenAndAuthorization,
  cartController.getCartCount
);
module.exports = router;
