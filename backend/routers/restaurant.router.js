import { Router } from 'express';
import Restaurant from '../models/Restaurant.js';
import authentication from '../middlewares/authentication.js';

const router = Router();

// GET tutti i ristoranti
router.get('/', async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find();
    res.send(restaurants);
  } catch (error) {
    next(error);
  }
});

// GET singolo ristorante per id
router.get('/:id', async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).send({ message: 'Ristorante non trovato' });
    res.send(restaurant);
  } catch (error) {
    next(error);
  }
});

// POST nuovo ristorante (serve login)
router.post('/', authentication, async (req, res, next) => {
  try {
    const newRestaurant = new Restaurant({ ...req.body, createdBy: req.authUser.userId });
    const savedRestaurant = await newRestaurant.save();
    res.status(201).send(savedRestaurant);
  } catch (error) {
    next(error);
  }
});

// PUT modifica ristorante (serve login)
router.put('/:id', authentication, async (req, res, next) => {
  try {
    const updated = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).send({ message: 'Ristorante non trovato' });
    res.send(updated);
  } catch (error) {
    next(error);
  }
});

// DELETE ristorante (serve login)
router.delete('/:id', authentication, async (req, res, next) => {
  try {
    const deleted = await Restaurant.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send({ message: 'Ristorante non trovato' });
    res.send({ message: 'Ristorante eliminato' });
  } catch (error) {
    next(error);
  }
});

export default router;
