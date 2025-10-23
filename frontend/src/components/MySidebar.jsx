import { Accordion, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="p-3 border rounded bg-light shadow-sm" style={{ maxWidth: "280px" }}>
      <Accordion defaultActiveKey="0" flush>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Ristoranti</Accordion.Header>
          <Accordion.Body>
            <Accordion flush>
              <Accordion.Item eventKey="0-0">
                <Accordion.Header style={{ paddingLeft: "1rem" }}>Piemonte</Accordion.Header>
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
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>Contatti</Accordion.Header>
          <Accordion.Body>
            <Nav.Link as={Link} to="/contacts">
              Contattaci
            </Nav.Link>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default Sidebar;