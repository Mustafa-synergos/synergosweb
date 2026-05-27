"use client";

import { useEffect } from "react";

export default function Sticky3DStackCards() {
  useEffect(() => {
    const cards = document.querySelectorAll(".card");

    const handleScroll = () => {
      cards.forEach((card) => {
        const nextSection =
          card.parentElement?.nextElementSibling;

        let progress = 0;

        if (nextSection) {
          const rect =
            nextSection.getBoundingClientRect();

          // when next card enters viewport
          progress = Math.min(
            Math.max(
              (window.innerHeight - rect.top) /
                window.innerHeight,
              0
            ),
            1
          );
        }

        const rotate = progress * 10;
        const scale = 1 - progress * 0.15;

        (card as HTMLElement).style.transform = `
          perspective(1000px)
          translateY(0px)
          scale(${scale})
          rotateX(${rotate}deg)
          rotateY(${rotate}deg)
          translateZ(${-progress * 200}px)
        `;
        (card as HTMLElement).style.opacity = `${1 - progress * 0.5}`;
      });
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    // initial state
    handleScroll();

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  return (
    <div className="wrapper">
      <section className="section">
        <div className="card card1">
          <div className="card-inner">
            <div className="number">01</div>

            <h1 className="title">
              Card One
            </h1>

            <p className="text">
              Sticky cards stack in
              background with a 3D effect.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="card card2">
          <div className="card-inner">
            <div className="number">02</div>

            <h1 className="title">
              Card Two
            </h1>

            <p className="text">
              Scroll further and watch
              the stacking happen.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="card card3">
          <div className="card-inner">
            <div className="number">03</div>

            <h1 className="title">
              Card Three
            </h1>

            <p className="text">
              Cards shrink and move
              backward creating depth.
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .wrapper {
          width: 100%;
          background: #0f0f0f;
          height:100%
          font-family: Arial, sans-serif;
        }

        .section {
          height: 100vh;
          position: sticky;
          display: flex;
          justify-content: center;
          align-items: center;
          top: 0;
        }

        .card {
          position: sticky;
          top: 100px;

          width: 80%;
          height: 420px;

          border-radius: 30px;
          padding: 50px;

          color: white;

          transform-style: preserve-3d;
          perspective: 1000px;

          box-shadow:
            0 30px 60px rgba(0,0,0,.5);

          transition: transform .4s ease;
        }

         .card:last-child {
         position: relative;
         }

        .card-inner {
          transform-style: preserve-3d;
        }

        .number {
          font-size: 14px;
          opacity: .6;
        }

        .title {
          margin-top: 20px;
          font-size: 60px;
        }

        .text {
          margin-top: 25px;
          font-size: 18px;
          max-width: 450px;
          line-height: 1.5;
        }

        .card1 {
          background: #ef4444;
        }

        .card2 {
          background: #3b82f6;
        }

        .card3 {
          background: #10b981;
        }
      `}</style>
    </div>
  );
}