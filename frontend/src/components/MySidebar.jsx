import { Accordion, Nav } from 'react-bootstrap';

const Sidebar = () => {
  return (
    <div className="p-3 border rounded" style={{ maxWidth: '280px' }}>
      <Accordion defaultActiveKey="0" flush>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Ristoranti</Accordion.Header>
          <Accordion.Body>
            <Accordion flush>
              <Accordion.Item eventKey="0-0">
                <Accordion.Header style={{ paddingLeft: '1rem' }}>Piemonte</Accordion.Header>
                <Accordion.Body style={{ paddingLeft: '2rem' }}>
                  <Nav className="flex-column">
                    <Nav.Link href="/restaurants/torino">Torino</Nav.Link>
                    <Nav.Link href="/restaurants/asti">Asti</Nav.Link>
                  </Nav>
                </Accordion.Body>
              </Accordion.Item>
              {/* Puoi aggiungere altre regioni qui */}
            </Accordion>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>Contatti</Accordion.Header>
          <Accordion.Body>
            <Nav.Link href="/contacts">Contattaci</Nav.Link>
          </Accordion.Body>
        </Accordion.Item>

        {/* Aggiungi altre voci se vuoi */}
      </Accordion>
    </div>
  );
};

export default Sidebar;
