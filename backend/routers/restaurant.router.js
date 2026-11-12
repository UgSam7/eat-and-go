import { Router } from "express";
import Restaurant from "../models/Restaurant.js";
import authentication from "../middlewares/authentication.js";
import { uploadCloudinary } from "../middlewares/uploadCloudinary.js";
import { isAdmin } from "../middlewares/authorization.js";
import { escapeRegex } from "../helpers/regex.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { city, region } = req.query;
    const filter = { approved: true };

    if (region) filter.region = new RegExp(escapeRegex(region), "i");
    if (city) filter.city = new RegExp(escapeRegex(city), "i");

    const restaurants = await Restaurant.find(filter).sort({ createdAt: -1 });
    res.status(200).json(restaurants);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  authentication,
  uploadCloudinary.single("image"),
  async (req, res, next) => {
    try {
      const { name, description, address, city, region, website, priceRange, cuisineType } = req.body;

      if (!req.user) {
        return res.status(401).json({ message: "Utente non autenticato" });
      }

      const imageData = req.file
        ? {
            url: req.file.path, 
            filename: req.file.filename, 
          }
        : null;

      const restaurant = new Restaurant({
        name,
        description,
        address,
        city,
        region,
        website,
        priceRange,
        cuisineType,
        image: imageData,
        approved: false, 
      });

      await restaurant.save();

      res.status(201).json({
        message: "Ristorante inviato per approvazione!",
        restaurant,
      });
    } catch (error) {
      console.error("❌ Errore creazione ristorante:", error);
      next(error);
    }
  }
);

router.get("/pending", authentication, async (req, res, next) => {
  try {
    const user = req.user;

    if (!isAdmin(user)) {
      return res.status(403).json({ message: "Accesso negato: non sei admin" });
    }

    const pending = await Restaurant.find({ approved: false }).sort({ createdAt: 1 });
    res.status(200).json(pending);
  } catch (error) {
    next(error);
  }
});


router.put("/approve/:id", authentication, async (req, res, next) => {
  try {
    const user = req.user;

    if (!isAdmin(user)) {
      return res.status(403).json({ message: "Accesso negato: non sei admin" });
    }

    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Ristorante non trovato" });
    }

    restaurant.approved = true;
    await restaurant.save();

    res.status(200).json({ message: "Ristorante approvato", restaurant });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", authentication, async (req, res, next) => {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ message: "Accesso negato: solo gli admin possono eliminare i ristoranti" });
    }

    const deleted = await Restaurant.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Ristorante non trovato" });
    }

    res.status(200).json({ message: "Ristorante eliminato", restaurant: deleted });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: "Ristorante non trovato" });
    }

    if (!restaurant.approved) {
      return res.status(403).json({ message: "Ristorante non approvato" });
    }

    res.json(restaurant);
  } catch (error) {
    next(error);
  }
});

export default router;