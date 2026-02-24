import React, { useEffect, useState, useMemo } from "react";
import { homeDoctorsStyles as h, iconSize } from "../assets/dummyStyles";
import { Link } from "react-router-dom";
import { ChevronRight, Medal, MousePointer2Off } from "lucide-react";

const HomeDoctors = ({ previewCount = 8 }) => {
  const API_BASE = "http://localhost:4000";

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`${API_BASE}/api/doctors`);
        const json = await res.json().catch(() => null);

        if (!res.ok) {
          const msg =
            (json && json.message) ||
            `Failed to load doctors (${res.status})`;
          if (!mounted) return;
          setError(msg);
          setDoctors([]);
          setLoading(false);
          return;
        }

        const items = (json && (json.data || json)) || [];

        const normalized = (Array.isArray(items) ? items : []).map((d) => {
          const id = d._id || d.id;
          const image =
            d.imageUrl || d.image || d.imageSmall || d.imageSrc || "";

          const available =
            (typeof d.availability === "string"
              ? d.availability.toLowerCase() === "available"
              : typeof d.available === "boolean"
              ? d.available
              : d.availability === true) || d.availability === "Available";

          return {
            id,
            name: d.name || "Unknown",
            specialization: d.specialization || "",
            image,
            experience:
              d.experience || d.experience === 0
                ? String(d.experience)
                : "",
            fee: d.fee ?? d.price ?? 0,
            available,
            raw: d,
          };
        });

        if (!mounted) return;
        setDoctors(normalized);
      } catch (err) {
        if (!mounted) return;
        console.error("load doctors error:", err);
        setError("Network error while loading doctors.");
        setDoctors([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const preview = useMemo(
    () => doctors.slice(0, previewCount),
    [doctors, previewCount]
  );

  return (
    <section className={h.section}>
      <div className={h.container}>
        <div className={h.header}>
          <h1 className={h.title}>
            Our <span className={h.titleSpan}>Medical Team</span>
          </h1>

          <p className={h.subtitle}>
            Book appointments quickly with our verified specialists
          </p>
        </div>

        {/* ERROR UI */}
        {error ? (
          <div className={h.errorContainer}>
            <div className={h.errorText}>{error}</div>
            <button
              onClick={() => window.location.reload()}
              className={h.retryButton}
            >
              Retry
            </button>
          </div>
        ) : null}

        {/* LOADING SKELETON */}
        {loading ? (
          <div className={h.skeletonGrid}>
            {Array.from({ length: previewCount }).map((_, i) => (
              <div key={i} className={h.skeletonCard}>
                <div className={h.skeletonImage}></div>
                <div className={h.skeletonText1}></div>
                <div className={h.skeletonText2}></div>

                <div className="flex gap-2 mt-auto">
                  <div className={h.skeletonButton}></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* DOCTOR GRID */
          <div className={h.doctorsGrid}>
            {preview.map((doctor) => (
              <article
                key={doctor.id || doctor.name}
                className={h.article}
              >
                <Link
                  to={`/doctors/${doctor.id}`}
                  state={{ doctor: doctor.raw || doctor }}
                >
                  <div className={h.imageContainerAvailable}>
                    <img
                      src={doctor.image || "/placeholder-doctor.jpg"}
                      alt={doctor.name}
                      loading="lazy"
                      className={h.image}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "/placeholder-doctor.jpg";
                      }}
                    />

                    {!doctor.available && (
                      <div className={h.unavailableBadge}>
                        Not available
                      </div>
                    )}
                  </div>
                </Link>

                {/* CARD BODY */}
                <div className={h.cardBody}>
                  <h3
                    className={h.doctorName}
                    id={`doctor-${doctor.id}-name`}
                  >
                    {doctor.name}
                  </h3>

                  <p className={h.specialization}>
                    {doctor.specialization}
                  </p>

                  <div className={h.experienceContainer}>
                    <div className={h.experienceBadge}>
                      <Medal className={`${iconSize.small} h-4`} />
                      <span>
                        {doctor.experience} years experience
                      </span>
                    </div>
                  </div>

                  <div className={h.buttonContainer}>
                    <div className="w-full">
                      {doctor.available ? (
                        <Link
                          to={`/doctors/${doctor.id}`}
                          state={{
                            doctor: doctor.raw || doctor,
                          }}
                          className={h.buttonAvailable}
                        >
                          <ChevronRight className="w-5 h-5" />
                          Book Now
                        </Link>
                      ) : (
                        <button
                          disabled
                          className={h.buttonUnavailable}
                        >
                          <MousePointer2Off className="w-5 h-5" />
                          Not Available
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <style>{h.customCSS}</style>
      </div>
    </section>
  );
};

export default HomeDoctors;