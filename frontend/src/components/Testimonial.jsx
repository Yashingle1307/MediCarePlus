import React, { useEffect, useRef, useState } from "react";
import { testimonialStyles as t } from "../assets/dummyStyles";
import { Star } from "lucide-react";

const Testimonial = () => {
  const scrollRefLeft = useRef(null);
  const scrollRefRight = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const testimonials = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      role: "Cardiologist",
      rating: 5,
      text: "The appointment booking system is incredibly efficient. It saves me valuable time and helps me focus on patient care.",
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
      type: "doctor",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Patient",
      rating: 5,
      text: "Scheduling appointments has never been easier. The interface is intuitive and reminders are very helpful!",
      image:
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=400&q=80",
      type: "patient",
    },
    {
      id: 3,
      name: "Dr. Robert Martinez",
      role: "Pediatrician",
      rating: 4,
      text: "This platform has streamlined our clinic operations significantly.",
      image:
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=400&q=80",
      type: "doctor",
    },
    {
      id: 4,
      name: "Emily Williams",
      role: "Patient",
      rating: 5,
      text: "Booking appointments online 24/7 is a game-changer.",
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
      type: "patient",
    },
  ];

  const leftTestimonials = testimonials.filter((x) => x.type === "doctor");
  const rightTestimonials = testimonials.filter((x) => x.type === "patient");

  /* ⭐⭐⭐ FIXED STAR RENDER */
  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < rating ? t.activeStar : t.inactiveStar}
      >
        <Star className={t.star} />
      </span>
    ));

  /* ⭐⭐⭐ FIXED CARD COMPONENT */
  const TestimonialCard = ({ testimonial, direction }) => (
    <div
      className={`${t.testimonialCard} ${
        direction === "left" ? t.leftCardBorder : t.rightCardBorder
      }`}
    >
      <div className={t.cardContent}>
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className={t.avatar}
        />

        <div className={t.textContainer}>
          <div className={t.nameRoleContainer}>
            <div>
              <h4
                className={`${t.name} ${
                  direction === "left" ? t.leftName : t.rightName
                }`}
              >
                {testimonial.name}
              </h4>

              <p className={t.role}>{testimonial.role}</p>
            </div>

            <div className={t.starsContainer}>
              {renderStars(testimonial.rating)}
            </div>
          </div>

          <p className={t.quote}>"{testimonial.text}"</p>

          <div className={t.mobileStarsContainer}>
            {renderStars(testimonial.rating)}
          </div>
        </div>
      </div>
    </div>
  );

  /* ⭐⭐⭐ SCROLL EFFECT */
  useEffect(() => {
    const left = scrollRefLeft.current;
    const right = scrollRefRight.current;
    if (!left || !right) return;

    let raf;
    const speed = 0.5;

    const animate = () => {
      if (!isPaused) {
        left.scrollTop += speed;
        right.scrollTop -= speed;

        if (left.scrollTop >= left.scrollHeight / 2) left.scrollTop = 0;
        if (right.scrollTop <= 0)
          right.scrollTop = right.scrollHeight / 2;
      }
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [isPaused]);

  return (
    <div className={t.container}>
      <div className={t.headerContainer}>
        <h2 className={t.title}>Voices of Trust</h2>
        <p className={t.subtitle}>
          Real stories from doctors and patients sharing their positive
          experiences with our healthcare platform
        </p>
      </div>

      <div
        className={t.grid}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* LEFT COLUMN */}
        <div className={t.columnContainer}>
          <div className={`${t.columnHeader} ${t.leftColumnHeader}`}>
            👩‍⚕️ Medical Professionals
          </div>

          <div
            ref={scrollRefLeft}
            className={t.scrollContainer}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {[...leftTestimonials, ...leftTestimonials].map((x, i) => (
              <TestimonialCard
                key={`L-${i}`}
                testimonial={x}
                direction="left"
              />
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className={`${t.columnContainer} ${t.rightColumnBorder}`}>
          <div className={`${t.columnHeader} ${t.rightColumnHeader}`}>
            🧑‍💼 Patients
          </div>

          <div
            ref={scrollRefRight}
            className={t.scrollContainer}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {[...rightTestimonials, ...rightTestimonials].map((x, i) => (
              <TestimonialCard
                key={`R-${i}`}
                testimonial={x}
                direction="right"
              />
            ))}
          </div>
        </div>
      </div>

      <style>{t.animationStyles}</style>
    </div>
  );
};

export default Testimonial;