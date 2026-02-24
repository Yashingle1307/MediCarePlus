import React from 'react'
import Navbar from '../components/Navbar'
import { heroStyles as hs } from '../assets/dummyStyles'
import logoImg from '../assets/logo.png'

const Hero = (role = "admin", userName = "Doctor") => {
  const isDoctor = role === "doctor";
  return (
    <div className={hs.container}>
      <Navbar />
      <main className={hs.mainContainer}>
        <section className={hs.section}>
          <div className={hs.decorativeBg.container}>
            <div className={hs.decorativeBg.blurBackground}>
              <div className={hs.decorativeBg.blurShape}>
              </div>
            </div>

            <div className={hs.contentBox}>
              <div className={hs.logoContainer}>
                <img src={logoImg} alt="Logo" className={hs.logo} />
              </div>

              <h1 className={hs.heading}>
                {isDoctor ? `Welcome Dr. ${userName}!` : "Welcome to MediCarePlus Admin Dashboard!"}
              </h1>

              <p className={hs.description}>
                {isDoctor ? "Securely access your medical records, manage appointments, and review reports anytime from your personal dashboard." : "Oversee hospital operations, manage doctors and staff, monitor patient records, and control system settings from one centralized dashboard."}
              </p>

              {/* {info card} */}

              <div className={hs.infoCards.container}>
                <div className={hs.infoCards.card}>
                  <h3 className={hs.infoCards.cardTitle}>
                    Secure Access
                  </h3>

                  <p className={hs.infoCards.cardText}>
                    Role-based authentication ensuring safe and protected medical information.
                  </p>
                </div>

                <div className={hs.infoCards.card}>
                  <h3 className={hs.infoCards.cardTitle}>
                    Smart Appointments
                  </h3>

                  <p className={hs.infoCards.cardText}>
                    Easily schedule, manage, and track appointments with real-time updates.
                  </p>
                </div>

                <div className={hs.infoCards.card}>
                  <h3 className={hs.infoCards.cardTitle}>
                    Centralized Management
                  </h3>

                  <p className={hs.infoCards.cardText}>
                    Manage doctors, services data efficiently from one dashboard.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </section>
      </main>
    </div>
  )
}

export default Hero