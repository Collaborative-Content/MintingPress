import React, { useState } from "react";
import StoryCard from "./StoryCard";
import { Navbar, Container, Nav } from "react-bootstrap";

export default function StoryList() {
  const [stories, setStories] = useState([
    {
      id: 1,
      img: "https://upload.odometer.com/od/uploads/2021/09/shutterstock_735007303-12-1024x576.jpg",
      story:
        "Growing up we had the best dog ever. He was half English Bulldog and just the funniest guy with amazing comedic timing. He didn’t look like an English bully at all though. He looked like a pitbull, at the height of pitbull fear in the 90’s...",
    },
    {
      id: 2,
      img: "https://upload.odometer.com/od/uploads/2021/09/shutterstock_224554576-17-1024x682.jpg",
      story:
        "I work at a daycare center and a few weeks ago I was alone outside with 10 prek and kindergarten kids. There is one kid in the class who is undiagnosed (parental d...",
    },
    {
      id: 3,
      img: "https://upload.odometer.com/od/uploads/2021/09/shutterstock_1923163667-20-1024x682.jpg",
      story:
        " was pretty much a toddler at the time. My parents had bought a brand new inflatable boat for a few hundred dollars. They had fully inflated the boat and were testing it out in the backyard. While they were sitting in it, I went to the kitchen...",
    },
  ]);

  return stories.map((story) => {
    return (
      <div className="container">
        <div className="card" style={{ marginBottom: "20px" }}>
          <img
            src={story.img}
            className="card-img-top"
            alt="..."
            style={{ maxHeight: "350px" }}
          />
          <div className="card-body">
            <h5 className="card-title">Story {story.id}</h5>
            <p className="card-text">{story.story}</p>
            <Nav.Link href="vote">
              <a className="btn btn-primary">Vote</a>
            </Nav.Link>
            <Nav.Link href="submitPR">
              <a className="btn btn-primary">Submit PR</a>
            </Nav.Link>
          </div>
        </div>
      </div>
    );
  });
}
