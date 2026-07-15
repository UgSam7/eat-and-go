import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: false, default: "" }, // Modificato in false per evitare errori se Google non restituisce il cognome
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      select: false,
      required: function() {
        // Se l'utente si registra con Google (quindi googleId esiste nello schema),
        // la password NON è richiesta. Altrimenti è obbligatoria.
        if (this.googleId) {
          return false; 
        }
        return true; 
      }
    },
    googleId: { type: String, unique: true, sparse: true }, // Definito nello schema: ora Mongoose non lo ignora più
    profile: {
      path: { type: String } // Definito nello schema: permette di salvare l'immagine del profilo Google
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'superadmin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

export default model('User', userSchema);