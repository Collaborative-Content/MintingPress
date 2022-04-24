import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import {  } from "../utils/Contracts";

export default function Admin() {

  function handleStartContributionPeriod() {

  }

  function handleStartVotingPeriod() {

  }

  function handleEndRound() {

  }

  return (
    <>
      <Container>
        <Button
          variant="primary"
          type="submit"
          className="btn-block"
          onClick={handleStartContributionPeriod}
        >
          Start Contribution Period
        </Button>
      </Container>
      <Container>
        <Button
          variant="primary"
          type="submit"
          className="btn-block"
          onClick={handleStartVotingPeriod}
        >
          Start Voting Period
        </Button>
      </Container>
      <Container>
        <Button
          variant="primary"
          type="submit"
          className="btn-block"
          onClick={handleEndRound}
        >
          End Round
        </Button>
      </Container>
    </>
  );
}
