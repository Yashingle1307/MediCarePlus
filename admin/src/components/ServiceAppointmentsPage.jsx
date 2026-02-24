import React, { useState, useEffect, useMemo } from 'react'
import { serviceAppointmentsStyles as ServiceAppointmentsStyles } from '../assets/dummyStyles';
import {
  CheckCircle,
  XCircle,
  Loader2,
  Search,
  SearchIcon,
  X,
  User,
  Phone,
  BadgeIndianRupee,
  Calendar,
  Clock
} from "lucide-react";

const API_BASE = 'http://localhost:4000';

// helpers
function formatTimeDisplay(a) {
  if (!a) return "";
  const hour = String(a.hour ?? 12).padStart(2, "0");
  const minute = String(a.minute ?? 0).padStart(2, "0");
  const ampm = a.ampm || "AM";
  return `${hour}:${minute} ${ampm}`;
}
function formatTwo(n) {
  return String(n).padStart(2, "0");
}
function formatDateNice(dateStr) {
  if (!dateStr) return "";
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function parseTimeToParts(timeStr) {
  if (!timeStr) return { hour: 12, minute: 0, ampm: "AM" };
  const m = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (m) {
    let hh = Number(m[1]);
    const mm = Number(m[2]);
    const ampm = m[3] ? m[3].toUpperCase() : null;
    if (!ampm) {
      const hour12 = hh % 12 === 0 ? 12 : hh % 12;
      return { hour: hour12, minute: mm, ampm: hh >= 12 ? "PM" : "AM" };
    }
    return { hour: hh, minute: mm, ampm };
  }
  return { hour: 12, minute: 0, ampm: "AM" };
}

function StatusBadge({ status }) {
  const classes = ServiceAppointmentsStyles.statusBadge; // ❌ remove ()
  return (
    <span className={classes}>
      {status === "Confirmed" && <CheckCircle className="h-4 w-4" />}
      {status === "Canceled" && <XCircle className="h-4 w-4" />}
      {status}
    </span>
  );
}

function Toast({ toasts, removeToast }) {
  return (
    <div className={ServiceAppointmentsStyles.toastContainer}>
      {toasts.map((t) => (
        <div key={t.id} className={ServiceAppointmentsStyles.toast}>
          <div className={ServiceAppointmentsStyles.toastContent}>
            <Loader2 className={ServiceAppointmentsStyles.toastSpinner} />
            <div className={ServiceAppointmentsStyles.toastText}>
              <div className={ServiceAppointmentsStyles.toastTitle}>{t.title}</div>
              <div className={ServiceAppointmentsStyles.toastMessage}>{t.message}</div>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className={ServiceAppointmentsStyles.toastCloseButton}
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function getTodayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isDateBefore(aDateStr, bDateStr) {
  try {
    const a = new Date(`${aDateStr}T00:00:00`);
    const b = new Date(`${bDateStr}T00:00:00`);
    return a.getTime() < b.getTime();
  } catch {
    return false;
  }
}

function RescheduleButton({ appointment, onReschedule, disabled }) {
  const terminal =
    appointment.status === "Completed" || appointment.status === "Canceled";

  const [editing, setEditing] = useState(false);
  const todayISO = getTodayISO();
  const [date, setDate] = useState(appointment.date || todayISO);
  const [time, setTime] =
    formatTwo(appointment.hour || 0) +
    ":" +
    formatTwo(appointment.minute || 0);

  function save() {
    if (!date || !time) return;
    if (isDateBefore(date, getTodayISO())) {
      alert("Please choose today or a future date.");
      return;
    }
    onReschedule(date, time);
    setEditing(false);
  }

  function cancel() {
    setEditing(false);
  }

  return (
    <div className="w-full">
      {!editing ? (
        <div className="flex justify-end">
          <button
            onClick={() => setEditing(true)}
            disabled={terminal || disabled}
            className={ServiceAppointmentsStyles.rescheduleButton}
          >
            Reschedule
          </button>
        </div>
      ) : (
        <div className={ServiceAppointmentsStyles.rescheduleEditContainer}>
          <input
            type="date"
            value={date}
            min={getTodayISO()}
            onChange={(e) => setDate(e.target.value)}
            className={ServiceAppointmentsStyles.rescheduleDateInput}
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={ServiceAppointmentsStyles.rescheduleTimeInput}
          />
          <div className={ServiceAppointmentsStyles.rescheduleActions}>
            <button
              onClick={save}
              className={ServiceAppointmentsStyles.rescheduleSaveButton}
            >
              Save
            </button>
            <button
              onClick={cancel}
              className={ServiceAppointmentsStyles.rescheduleCancelButton}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default function ServiceAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 220);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  function pushToast(title, message) {
    const toastId = Date.now() + Math.random();
    setToasts((t) => [...t, { id: toastId, title, message }]);
  }
  function removeToast(id) {
    setToasts((t) => t.filter((x) => x.id !== id));
  }

  async function fetchAppointments() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/service-appointments?limit=500`);
      const body = await res.json();
      const list = body.appointments ?? [];

      const normalized = (Array.isArray(list) ? list : []).map((a) => {
        const parsed = parseTimeToParts(a.time || "");
        return {
          id: a._id || a.id,
          patientName: a.patientName || "Unknown",
          serviceName: a.serviceName || "",
          date: a.date || "",
          hour: parsed.hour,
          minute: parsed.minute,
          ampm: parsed.ampm,
          status: a.status || "Pending",
          mobile: a.mobile || "",
          fees: a.fees || 0,
          gender: a.gender || "",
          age: a.age || "",
          raw: a,
        };
      });

      setAppointments(normalized);
    } catch (err) {
      console.error(err);
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }

  async function rescheduleRemote(id, date, time) {
    await fetch(`${API_BASE}/api/service-appointments/${id}/reschedule`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, time }),
    });
    pushToast("Rescheduled", "Appointment updated");
    fetchAppointments();
  }

  async function cancelRemote(id) {
    await fetch(`${API_BASE}/api/service-appointments/${id}/cancel`, {
      method: "PUT",
    });
    pushToast("Canceled", "Appointment canceled");
    fetchAppointments();
  }

  const displayList = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return appointments.filter((a) =>
      q ? (a.patientName || "").toLowerCase().includes(q) : true
    );
  }, [appointments, debouncedSearch]);

  return (
    <div className={ServiceAppointmentsStyles.container}>
      <header className="w-full">
        <div
          className={`${ServiceAppointmentsStyles.headerContainer} max-w-7xl mx-auto px-4 sm:px-6 lg:px-7`}
        >
          <div className={ServiceAppointmentsStyles.headerTitleContainer}>
            <h1 className={ServiceAppointmentsStyles.headerTitle}>
              Appointments
            </h1>
            <p className={ServiceAppointmentsStyles.headerSubtitle}>
              Manage Patient bookings- quick search & status controls
            </p>
          </div>

          <div className={ServiceAppointmentsStyles.searchContainer}>
            <div className={ServiceAppointmentsStyles.searchInputWrapper}>
              <label className={ServiceAppointmentsStyles.searchLabel}>
                <span className="sr-only">Search Appointments</span>

                <div className={ServiceAppointmentsStyles.searchIconContainer}>
                  <Search className={ServiceAppointmentsStyles.searchIcon} />
                </div>

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by patient or service..."
                  className={ServiceAppointmentsStyles.searchInput}
                />

                {search ? (
                  <button
                    type="button"
                    className={ServiceAppointmentsStyles.clearSearchButton}
                    onClick={() => setSearch("")}
                  >
                    <X
                      className={
                        ServiceAppointmentsStyles.clearSearchIcon
                      }
                    />
                  </button>
                ) : null}
              </label>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={ServiceAppointmentsStyles.statusFilterSelect}
              >
                <option value="">All</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Rescheduled">Rescheduled</option>
                <option value="Completed">Completed</option>
                <option value="Canceled">Canceled</option>
              </select>
            </div>

            <div className={ServiceAppointmentsStyles.searchInfo}>
              <div>
                {displayList.length} result
                {displayList.length !== 1 ? "s" : ""}
              </div>

              <button
                onClick={fetchAppointments}
                className={ServiceAppointmentsStyles.refreshButton}
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {loading ? (
        <div className={ServiceAppointmentsStyles.loadingContainer}>
          <Loader2 className="animate-spin" />
          <span>Loading appointments...</span>
        </div>
      ) : error ? (
        <div className={ServiceAppointmentsStyles.errorContainer}>
          {error}
        </div>
      ) : (
        <div className={ServiceAppointmentsStyles.gridContainer}>
          {displayList.length === 0 ? (
            <div className={ServiceAppointmentsStyles.noResultsContainer}>
              <div className={ServiceAppointmentsStyles.noResultsIcon}>
                <SearchIcon />
              </div>

              <div className={ServiceAppointmentsStyles.noResultsText}>
                No Appointments match your search
              </div>
              <div className={ServiceAppointmentsStyles.noResultsSubtext}>
                Try a different patient name or service.
              </div>
            </div>
          ) : (
            displayList.map((a) => {
              const isLocked =
                a.status === "completed" || a.status === "canceled";

              return (
                <article
                  key={a.id}
                  className={ServiceAppointmentsStyles.article}
                >
                  <div className={ServiceAppointmentsStyles.cardInner}>
                    <div>
                      <div
                        className={ServiceAppointmentsStyles.cardHeader}
                      >
                        <div
                          className={
                            ServiceAppointmentsStyles.patientInfoContainer
                          }
                        >
                          <div
                            className={
                              ServiceAppointmentsStyles.patientAvatar
                            }
                          >
                            <User
                              className={
                                ServiceAppointmentsStyles.patientAvatarIcon
                              }
                            />
                          </div>

                          <div>
                            <div
                              className={
                                ServiceAppointmentsStyles.patientName
                              }
                            >
                              {a.patientName}
                            </div>

                            <div
                              className={
                                ServiceAppointmentsStyles.patientDetails
                              }
                            >
                              {a.gender} • {a.age} yrs
                            </div>
                          </div>
                        </div>

                        <div
                          className={
                            ServiceAppointmentsStyles.statusContainer
                          }
                        >
                          <StatusBadge status={a.status} />
                        </div>
                      </div>

                      <div
                        className={
                          ServiceAppointmentsStyles.detailsContainer
                        }
                      >
                        <div
                          className={
                            ServiceAppointmentsStyles.detailItem
                          }
                        >
                          <Phone
                            className={
                              ServiceAppointmentsStyles.detailIcon
                            }
                          />
                          <span
                            className={
                              ServiceAppointmentsStyles.detailText
                            }
                          >
                            {a.mobile}
                          </span>
                        </div>

                        <div
                          className={
                            ServiceAppointmentsStyles.detailItem
                          }
                        >
                          <BadgeIndianRupee
                            className={
                              ServiceAppointmentsStyles.detailIcon
                            }
                          />
                          <span
                            className={
                              ServiceAppointmentsStyles.feesText
                            }
                          >
                            Fees: ₹{a.fees}
                          </span>
                        </div>

                        <div
                          className={
                            ServiceAppointmentsStyles.detailItem
                          }
                        >
                          <Calendar
                            className={
                              ServiceAppointmentsStyles.detailIcon
                            }
                          />
                          <span
                            className={
                              ServiceAppointmentsStyles.detailText
                            }
                          >
                            Date: {formatDateNice(a.date)}
                          </span>
                        </div>

                        <div
                          className={
                            ServiceAppointmentsStyles.detailItem
                          }
                        >
                          <Clock
                            className={
                              ServiceAppointmentsStyles.detailIcon
                            }
                          />
                          <span
                            className={
                              ServiceAppointmentsStyles.detailText
                            }
                          >
                            Time: {formatTimeDisplay(a)}
                          </span>
                        </div>

                        <div
                          className={
                            ServiceAppointmentsStyles.serviceText
                          }
                        >
                          Service:{" "}
                          <span
                            className={
                              ServiceAppointmentsStyles.serviceName
                            }
                          >
                            {a.serviceName}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={
                        ServiceAppointmentsStyles.actionsContainer
                      }
                    >
                      <div
                        className={
                          ServiceAppointmentsStyles.actionsInnerContainer
                        }
                      >
                        <div className="flex-1">
                          <RescheduleButton
                            appointment={a}
                            onReschedule={(d, t) =>
                              rescheduleRemote(a.id, d, t)
                            }
                            disabled={false}
                          />
                        </div>

                        <div className="ml-3">
                          <button
                            onClick={() => cancelRemote(a.id)}
                            disabled={isLocked}
                            className={ServiceAppointmentsStyles.cancelButton(
                              isLocked
                            )}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      )}

      <Toast toasts={toasts} removeToast={removeToast} />

      <div className={ServiceAppointmentsStyles.legendContainer}>
        <div className={ServiceAppointmentsStyles.legendItem}>
          <div
            className={`${ServiceAppointmentsStyles.legendDot} bg-amber-400`}
          />
          <span>Pending</span>
        </div>

        <div className={ServiceAppointmentsStyles.legendItem}>
          <div
            className={`${ServiceAppointmentsStyles.legendDot} bg-emerald-400`}
          />
          <span>Confirmed</span>
        </div>

        <div className={ServiceAppointmentsStyles.legendItem}>
          <div
            className={`${ServiceAppointmentsStyles.legendDot} bg-red-400`}
          />
          <span>Canceled</span>
        </div>

        <div className={ServiceAppointmentsStyles.legendItem}>
          <div
            className={`${ServiceAppointmentsStyles.legendDot} bg-sky-400`}
          />
          <span>Completed</span>
        </div>

        <div className={ServiceAppointmentsStyles.legendItem}>
          <div
            className={`${ServiceAppointmentsStyles.legendDot} bg-indigo-400`}
          />
          <span>Rescheduled</span>
        </div>
      </div>

      <style>{ServiceAppointmentsStyles.animatedBorderStyle}</style>
    </div>
  );
}
