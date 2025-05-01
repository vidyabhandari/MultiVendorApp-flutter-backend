const Restaurant = require("../models/Restaurant");

module.exports = {
  addRestaurant: async (req, res) => {
    const { title, time, imageUrl, owner, code, logoUrl, coords } = req.body;

    if (
      !title ||
      !time ||
      !imageUrl ||
      !owner ||
      !code ||
      !logoUrl ||
      !coords ||
      !coords.latitude ||
      !coords.longitude ||
      !coords.address ||
      !coords.title
    ) {
      return res
        .status(400)
        .json({ status: false, message: "You have a missing fields" });
    }

    try {
      const newrestaurant = new Restaurant(req.body);

      await newrestaurant.save();
      res
        .status(201)
        .json({ status: true, message: "Restaurant has been successfully" });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getRestaurantById: async (req, res) => {
    const id = req.params.id;
    try {
      const restaurant = await Restaurant.findById(id);

      res.status(200).json(restaurant);
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getRandomRestaurant: async (req, res) => {
    const code = req.params.code;
    try {
      let randomRestaurant = [];

      if (code) {
        randomRestaurant = await Restaurant.aggregate([
          { $match: { code: code, isAvailable: true } },
          { $sample: { size: 5 } },
          { $project: { __v: 0 } },
        ]);
      }

      if (randomRestaurant.length === 0) {
        randomRestaurant = await Restaurant.aggregate([
          { $match: { isAvailable: true } },
          { $sample: { size: 5 } },
          { $project: { __v: 0 } },
        ]);
      }
      res.status(200).json(randomRestaurant);
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getAllNearByRestaurant: async (req, res) => {
    try {
      let allNearByRestaurants = [];

      if (code) {
        allNearByRestaurants = Restaurant.aggregate([
          { $match: { code: code, isAvailable: true } },
          { $project: { __v: 0 } },
        ]);
      }

      if (allNearByRestaurants.length === 0) {
        allNearByRestaurants = Restaurant.aggregate([
          { $match: { isAvailable: true } },
          { $project: { __v: 0 } },
        ]);
      }
      res.status(200).json(allNearByRestaurants);
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },
};
