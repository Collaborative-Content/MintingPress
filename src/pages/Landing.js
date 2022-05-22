import { Container, Card, Stack, Button } from "react-bootstrap";

export default function Landing() {

  return (
    <>
		<Container
			style={{height: '80vh'}}
			className='p-2'
		>
				<Card style={{height: '60vh'}} className='mx-auto my-auto'>
					<Card.Body>
						<Stack direction='vertical' align='center'>
							<h1 className='mt-4'>
								Fostering collaboration,
								and compensating authors.
							</h1>

							<h4 className='mt-4 mb-4'>
								MintingPress uses the power of NFT's to preserve and augment the creative process.
							</h4>
						</Stack>					
					</Card.Body>

					<Card.Footer align='center'>
						<Button href='/mint'>Mint a Story</Button>
					</Card.Footer>
				</Card>
      </Container>
    </>
  );
}
