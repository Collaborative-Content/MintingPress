import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { startContributionPeriod, startVotingPeriod, endRound } from "../utils/Contracts";

export default function Admin() {

  return (
    <>
      <div className="d-grid gap-2">
      <Container>
        <Button
          variant="primary"
          type="submit"
          size="lg"
          className="btn-block"
          onClick={startContributionPeriod}
        >
          Start Contribution Period
        </Button> 
      </Container>
      <Container>
        <Button
          variant="primary"
          type="submit"
          size="lg"
          className="btn-block"
          onClick={startVotingPeriod}
        >
          Start Voting Period
        </Button>
      </Container>
      <Container>
        <Button
          variant="primary"
          type="submit"
          size="lg"
          className="btn-block"
          onClick={endRound}
        >
          End Round
        </Button>
      </Container>
      </div>
    </>
  );
}
