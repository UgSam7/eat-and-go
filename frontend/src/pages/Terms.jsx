import { Container } from "react-bootstrap";

function Terms() {
  return (
    <Container className="py-5" style={{ maxWidth: "800px" }}>
      <h2 className="text-center mb-4 text-warning fw-bold">Termini e Condizioni</h2>
      <p>
        L'accesso e l'uso di Eat & Go implicano l'accettazione dei seguenti termini
        e condizioni. Il sito è fornito a scopo informativo e di condivisione
        di recensioni e informazioni sui ristoranti.
      </p>
      <p>
        Gli utenti sono responsabili dei contenuti caricati e delle informazioni
        condivise. Eat & Go si riserva il diritto di modificare o rimuovere contenuti
        che violino le regole di buona condotta.
      </p>
      <p>
        L'utilizzo del servizio è soggetto alla legislazione italiana vigente.
        Eventuali modifiche ai presenti termini verranno comunicate tramite il sito.
      </p>
    </Container>
  );
}

export default Terms;