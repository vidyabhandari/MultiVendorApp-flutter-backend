const router = require("express").Router();
const restaurantController = require("../controllers/restaurantController");
const { verifyTokenAndAuthorization } = require("../middleware/verifyToken");

router.post(
  "/",
  verifyTokenAndAuthorization,
  restaurantController.addRestaurant
);

router.get("/:code", restaurantController.getRandomRestaurant);

router.get("/all/:code", restaurantController.getAllNearByRestaurant);

router.get("/byId/:id", restaurantController.getRestaurantById);

module.exports = router;
