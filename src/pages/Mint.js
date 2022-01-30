import "bootstrap/dist/css/bootstrap.min.css";
import StoryBox from "../components/StoryBox";
import { Container, Button } from "react-bootstrap";
import { toast } from "react-toastify";

import React from "react";
// TODO how do we get the storyRef here, and move handleAddStory here
export default function Mint() {
  const mint = () => {
    setTimeout(() => {
      toast("Your story has been minted!");
    }, 1000);
  };

  return (
    <>
      <Container>
        <div className="text-center">
          <img
            style={{ height: "100px", margin: "20px auto", width: "200px" }}
            src="https://media.istockphoto.com/vectors/printing-money-quantitative-easing-policy-by-countries-central-bank-vector-id1312056466?k=20&m=1312056466&s=612x612&w=0&h=V5Y9lrSoDDR5gWRO-kRuHZTuDzEPnrArvknnl1zEYQc="
          />
        </div>

        <StoryBox story={""} />
      </Container>
      <Container>
        <Button
          variant="primary"
          type="submit"
          className="btn-block"
          onClick={mint}
        >
          Mint Your Story!
        </Button>
      </Container>
    </>
  );
}
