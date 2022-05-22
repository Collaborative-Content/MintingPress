import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Container, Nav } from "react-bootstrap";

export default function Navigate() {
  return (
    <Navbar
      bg="dark"
      expand="lg"
      variant="dark"
      style={{ marginBottom: "25px"}}
    >
      <Container>
        <Navbar.Brand href="/">MintingPress</Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="mint">Mint Story</Nav.Link>
            <Nav.Link href="list">Stories List</Nav.Link>
            <Nav.Link href="vote">Stories Voting</Nav.Link>
            <Nav.Link href="submitPR">Submit PR</Nav.Link>
            <Nav.Link href="admin">Admin Controls</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
