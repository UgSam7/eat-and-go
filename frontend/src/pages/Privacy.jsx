import { Container } from "react-bootstrap";

function Privacy() {
  return (
    <Container className="py-5" style={{ maxWidth: "800px" }}>
      <h2 className="text-center mb-4 text-warning fw-bold">Privacy Policy</h2>
      <p>
        La tua privacy è importante per noi. Eat & Go raccoglie e utilizza i dati
        personali esclusivamente per garantire il corretto funzionamento del sito,
        la gestione degli account utente e la comunicazione con te.
      </p>
      <p>
        I dati non saranno mai condivisi con terze parti senza il tuo consenso esplicito,
        ad eccezione dei servizi strettamente necessari per l’autenticazione e l’hosting.
      </p>
      <p>
        Puoi richiedere la cancellazione dei tuoi dati inviando una mail al nostro
        supporto o eliminando il tuo account dalla sezione profilo.
      </p>
    </Container>
  );
}

export default Privacy;