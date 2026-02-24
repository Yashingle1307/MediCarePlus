import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:4000";

const VerifyServicePaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;

    const verifyServicePayment = async () => {
      const params = new URLSearchParams(location.search || "");
      const sessionId = params.get("session_id");

      // cancel case
      if (location.pathname === "/service-appointments/cancel") {
        if (!cancelled) {
          navigate("/appointments?service_payment=Cancelled", {
            replace: true,
          });
        }
        return;
      }

      // no session id
      if (!sessionId) {
        if (!cancelled) {
          navigate("/appointments?service_payment=Failed", {
            replace: true,
          });
        }
        return;
      }

      try {
        const res = await axios.get(
          `${API_BASE}/api/service-appointments/confirm`,
          {
            params: { session_id: sessionId },
            timeout: 15000,
          }
        );

        if (cancelled) return;

        if (res?.data?.success) {
          navigate("/appointments?service_payment=Paid", {
            replace: true,
          });
        } else {
          navigate("/appointments?service_payment=Failed", {
            replace: true,
          });
        }
      } catch (error) {
        console.error("Service Payment verification failed:", error);
        if (!cancelled) {
          navigate("/appointments?service_payment=Failed", {
            replace: true,
          });
        }
      }
    };

    verifyServicePayment();

    return () => {
      cancelled = true;
    };
  }, [location.search, location.pathname, navigate]);

  return null;
};

export default VerifyServicePaymentPage;