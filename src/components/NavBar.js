import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Container, Nav } from "react-bootstrap";
import Toggle from "./Toggler";

export default function Navigate(props) {
  return (
    <Navbar
      bg="dark"
      expand="lg"
      variant="dark"
      style={{ marginBottom: "25px" }}
    >
      <Container>
        <Navbar.Brand href="/">MintingPress</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/mint">Mint Story</Nav.Link>
            <Nav.Link href="/list">Stories</Nav.Link>
            <Nav.Link href="/admin">Admin Controls</Nav.Link>
          </Nav>
          <Toggle theme={props.theme} toggleTheme={props.themeToggler} />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
