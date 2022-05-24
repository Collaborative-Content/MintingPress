import { Container, Card, Stack, Button } from "react-bootstrap";

export default function Landing() {

  return (
    <>
		<Container
			style={{height: '80vh'}}
			className='p-2'
		>
				<Card style={{height: '60vh'}} className='darkCard mx-auto my-auto shadow-lg'>
					<Card.Body>
						<Stack direction='vertical' align='center'>
							<h1 className='mt-4'>
								Fostering collaboration,
								and empowering authors.
							</h1>

							<h4 className='mt-4 mb-4'>
								MintingPress uses the power of NFTs to augment the creative process and get authors paid.
							</h4>
						</Stack>					
					</Card.Body>

					<Card.Footer align='center'>
						<Button variant="primary" size="lg" href='/mint'>Mint a Story</Button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<Button variant="primary" size="lg" href='/list'>View Stories</Button>
					</Card.Footer>
				</Card>
      </Container>
    </>
  );
}