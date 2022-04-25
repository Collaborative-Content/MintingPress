import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Container, Nav } from "react-bootstrap";

export default function Navigate() {
  return (
    <Navbar
      bg="dark"
      expand="lg"
      variant="dark"
      style={{ marginBottom: "25px" }}
    >
      <Container>
        <Navbar.Brand href="/mint">MintingPress</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="mint">Mint Your Story</Nav.Link>
            <Nav.Link href="list">Stories List</Nav.Link>
            <Nav.Link href="vote">Vote on Your Stories</Nav.Link>
            <Nav.Link href="submitPR">SubmitPR</Nav.Link>
            <Nav.Link href="admin">Admin Controls</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
