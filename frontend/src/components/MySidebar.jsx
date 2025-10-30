import { Accordion, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaUtensils, FaPlusCircle, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import "../styles/global.css";

const Sidebar = () => {
  return (
    <aside className="sidebar-container modern-sidebar">
      <Accordion defaultActiveKey="0" flush alwaysOpen>
        
        {/* === RISTORANTI === */}
        <Accordion.Item eventKey="0" className="sidebar-section">
          <Accordion.Header>
            <FaUtensils className="sidebar-icon" /> Ristoranti
          </Accordion.Header>
          <Accordion.Body>
            <Nav className="flex-column sidebar-nav-group">

              {/* Aggiungi ristorante */}
              <Nav.Link
                as={Link}
                to="/add-restaurant"
                className="sidebar-link"
              >
                <FaPlusCircle className="me-2" /> Aggiungi ristorante
              </Nav.Link>

              {/* Tutti i ristoranti */}
              <Nav.Link
                as={Link}
                to="/restaurants"
                className="sidebar-link"
              >
                🍽️ Tutti i ristoranti
              </Nav.Link>

              <div className="sidebar-divider"></div>

              {/* === ESPLORA PER REGIONE === */}
              <Accordion flush>
                <Accordion.Item eventKey="0-0">
                  <Accordion.Header>
                    <FaMapMarkerAlt className="sidebar-icon" /> Esplora per regione
                  </Accordion.Header>
                  <Accordion.Body>

                    {/* Regione: Piemonte */}
                    <Accordion flush>
                      <Accordion.Item eventKey="0-0-0">
                        <Accordion.Header>
                          <span className="sidebar-region">Piemonte</span>
                        </Accordion.Header>
                        <Accordion.Body>
                          <Nav className="flex-column">
                            <Nav.Link
                              as={Link}
                              to="/restaurants?region=Piemonte&city=Torino"
                              className="sidebar-sublink"
                            >
                              Torino
                            </Nav.Link>
                            <Nav.Link
                              as={Link}
                              to="/restaurants?region=Piemonte&city=Asti"
                              className="sidebar-sublink"
                            >
                              Asti
                            </Nav.Link>
                          </Nav>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>

                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Nav>
          </Accordion.Body>
        </Accordion.Item>

        {/* === CONTATTI === */}
        <Accordion.Item eventKey="1" className="sidebar-section">
          <Accordion.Header>
            <FaEnvelope className="sidebar-icon" /> Contatti
          </Accordion.Header>
          <Accordion.Body>
            <Nav.Link as={Link} to="/contact" className="sidebar-link">
              📩 Contattaci
            </Nav.Link>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </aside>
  );
};

export default Sidebar;