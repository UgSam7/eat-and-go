import { useState } from "react";
import axios from "axios";

function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/contact`, formData);
      setStatus("success");
      setFormData({ firstName: "", lastName: "", email: "", message: "" });
    } catch (err) {
      console.error("Errore invio messaggio:", err);
      setStatus("error");
    }
  };

  return (
    <div
      className="container mt-5 p-4 shadow-sm rounded"
      style={{
        maxWidth: "650px",
        background: "linear-gradient(180deg, #fffef9 0%, #fff3e0 100%)",
      }}
    >
      <h2 className="text-center mb-3" style={{ color: "#ff7b00", fontWeight: 700 }}>
        Contattaci
      </h2>
      <p className="text-center text-muted mb-4">
        Hai domande o suggerimenti? Scrivici e ti risponderemo al più presto 🍽️
      </p>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <input
              type="text"
              className="form-control"
              name="firstName"
              placeholder="Nome"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <input
              type="text"
              className="form-control"
              name="lastName"
              placeholder="Cognome"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <textarea
            className="form-control"
            name="message"
            rows="5"
            placeholder="Scrivi qui il tuo messaggio..."
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="btn w-100"
          style={{
            background: "linear-gradient(135deg, #ff7b00, #ffb300)",
            color: "#fff",
            fontWeight: 600,
            border: "none",
            transition: "all 0.3s ease",
          }}
          disabled={status === "sending"}
        >
          {status === "sending" ? "Invio in corso..." : "Invia messaggio"}
        </button>
      </form>

      {status === "success" && (
        <div className="alert alert-success mt-4 text-center">
          ✅ Messaggio inviato con successo!
        </div>
      )}
      {status === "error" && (
        <div className="alert alert-danger mt-4 text-center">
          ❌ Errore durante l'invio. Riprova più tardi.
        </div>
      )}
    </div>
  );
}

export default Contact;