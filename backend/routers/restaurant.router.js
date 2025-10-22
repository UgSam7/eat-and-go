import { Router } from 'express';
import Restaurant from '../models/Restaurant.js';
import authentication from '../middlewares/authentication.js';
import { uploadCloudinary } from '../middlewares/uploadCloudinary.js';

const router = Router();

function isAdmin(user) {
  if (!user) return false;

  const superAdmin = process.env.SUPER_ADMIN_EMAIL?.toLowerCase();
  const admins = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || [];

  const userEmail = user.email?.toLowerCase();

  if (user.role === 'superadmin') return true;
  if (user.role === 'admin') return true;
  if (superAdmin && userEmail === superAdmin) return true;
  if (admins.includes(userEmail)) return true;

  return false;
}

router.get("/", async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find({ approved: true }).sort({ createdAt: -1 });
    res.send(restaurants);
  } catch (error) {
    next(error);
  }
});

// 🟡 Get pending restaurants (admin/superadmin only)
router.get("/pending", authentication, async (req, res, next) => {
  try {
    const user = req.user; // ✅ Ora coerente con il middleware

    console.log("Utente autenticato nel router:", user?.email, user?.role);

    if (!isAdmin(user)) {
      return res.status(403).json({ message: "Accesso negato: non sei admin" });
    }

    const pending = await Restaurant.find({ approved: false }).sort({ createdAt: 1 });
    res.send(pending);
  } catch (error) {
    next(error);
  }
});

// 🟢 Approva un ristorante
router.put("/approve/:id", authentication, async (req, res, next) => {
  try {
    const user = req.user;
    if (!isAdmin(user)) {
      return res.status(403).json({ message: "Accesso negato: non sei admin" });
    }

    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).send({ message: "Ristorante non trovato" });

    restaurant.approved = true;
    await restaurant.save();

    res.send({ message: "Ristorante approvato", restaurant });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authentication, async (req, res, next) => {
  try {
    if (!isAdmin(req.authUser)) {
      return res.status(403).send({ message: 'Accesso negato: solo gli admin possono eliminare i ristoranti' });
    }

    const deleted = await Restaurant.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send({ message: 'Ristorante non trovato' });

    res.send({ message: 'Ristorante eliminato', restaurant: deleted });
  } catch (error) {
    next(error);
  }
});

export default router;