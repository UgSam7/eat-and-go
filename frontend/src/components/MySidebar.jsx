import { Accordion, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="sidebar-container">
      <Accordion defaultActiveKey="0" flush alwaysOpen>
        {/* --- Sezione Ristoranti --- */}
        <Accordion.Item eventKey="0">
          <Accordion.Header>Ristoranti</Accordion.Header>
          <Accordion.Body>
            <Nav className="flex-column">
              {/* ➕ Link aggiungi ristorante */}
              <Nav.Link
                as={Link}
                to="/add-restaurant"
                className="fw-semibold text-white mb-2"
              >
                ➕ Aggiungi ristorante
              </Nav.Link>

              {/* Divider sottile */}
              <div className="border-top border-light-subtle my-2"></div>

              {/* --- Sottosezione regioni --- */}
              <Accordion flush>
                <Accordion.Item eventKey="0-0">
                  <Accordion.Header style={{ paddingLeft: "1rem" }}>
                    Piemonte
                  </Accordion.Header>
                  <Accordion.Body style={{ paddingLeft: "2rem" }}>
                    <Nav className="flex-column">
                      <Nav.Link
                        as={Link}
                        to="/restaurants?region=Piemonte&city=Torino"
                      >
                        Torino
                      </Nav.Link>
                      <Nav.Link
                        as={Link}
                        to="/restaurants?region=Piemonte&city=Asti"
                      >
                        Asti
                      </Nav.Link>
                    </Nav>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Nav>
          </Accordion.Body>
        </Accordion.Item>

        {/* --- Sezione Contatti --- */}
        <Accordion.Item eventKey="1">
          <Accordion.Header>Contatti</Accordion.Header>
          <Accordion.Body>
            <Nav.Link as={Link} to="/contacts">
              Contattaci
            </Nav.Link>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </aside>
  );
};

export default Sidebar;