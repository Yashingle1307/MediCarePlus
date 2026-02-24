import React, { useState, useRef, useCallback, useLayoutEffect, useEffect } from "react";
import { navbarStyles as ns } from '../assets/dummyStyles'
import logoImg from '../assets/logo.png'
import {
    Link,
    NavLink,
    useLocation,
    useNavigate,
} from "react-router-dom";
import {
    Home,
    UserPlus,
    Users,
    Calendar,
    Grid,
    PlusSquare,
    List,
    X,
    Menu
} from "lucide-react";

import { useAuth, useClerk, useUser } from "@clerk/clerk-react";

const Navbar = () => {

    const [open, setOpen] = useState(false);
    const navInnerRef = useRef(null);
    const indicatorRef = useRef(null);
    const Location = useLocation();
    const navigate = useNavigate();

    const clerk = useClerk?.();
    const { getToken, isLoaded: authLoaded } = useAuth();
    const { isSignedIn, user, isLoaded: userLoaded } = useUser();


    // sliding active indicator logic
    const moveIndicator = useCallback(() => {
        const container = navInnerRef.current;
        const ind = indicatorRef.current;
        if (!container || !ind) return;

        const active = container.querySelector(".nav-item.active");
        if (!active) {
            ind.style.opacity = "0";
            return;
        }

        const containerRect = container.getBoundingClientRect();
        const activeRect = active.getBoundingClientRect();

        const left = activeRect.left - containerRect.left + container.scrollLeft;
        const width = activeRect.width;

        ind.style.transform = `translateX(${left}px)`;
        ind.style.width = `${width}px`;
        ind.style.opacity = "1";
    }, []);

    // move indicator on route change
    useLayoutEffect(() => {
        moveIndicator();
        const t = setTimeout(() => {
            moveIndicator();
        }, 120);
        return () => clearTimeout(t);
    }, [location.pathname, moveIndicator]);

    // help in scrolling the active item into view on load and window resize
    useEffect(() => {
        const container = navInnerRef.current;
        if (!container) return;

        const onScroll = () => {
            moveIndicator();
        };
        container.addEventListener("scroll", onScroll, { passive: true });

        const ro = new ResizeObserver(() => {
            moveIndicator();
        });
        ro.observe(container);
        if (container.parentElement) ro.observe(container.parentElement);

        window.addEventListener("resize", moveIndicator);

        moveIndicator();

        return () => {
            container.removeEventListener("scroll", onScroll);
            ro.disconnect();
            window.removeEventListener("resize", moveIndicator);
        };
    }, [moveIndicator]);

    // close mobile nav on escape key press
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape" && open) setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    // when user signed 

    useEffect(() => {
        let mounted = true;
        const storedToken = async () => {
            if (!authLoaded && !userLoaded) return;

            if (!isSignedIn) {

                try {
                    localStorage.removeItem("token");
                }
                catch (err) {
                    // ignore error
                }
                return;
            }

            try {
                if (getToken) {
                    const token = await getToken();
                    if (!mounted) return;
                    if (token)
                        try {
                            localStorage.setItem("token", token);
                        }
                        catch (e) {
                            console.warn("Failed to store token in localStorage", e);
                        }
                }
            }
            catch (err) {
                console.warn("Failed to get token", err);
            }
        }
        storedToken();
        return () => {
            mounted = false;
        }
    }, [isSignedIn, getToken, authLoaded, userLoaded]);

    const handleOpenSignIn = () => {
        if (!clerk) {
            console.error("Clerk instance not found");
            return;
        }
        clerk.openSignIn();
        navigate("/h");
    };

    const handleSignOut = async () => {
        if (!clerk || !clerk.signOut) {
            console.error("Clerk instance not found");
            return;
        }
        try {
            await clerk.signOut();
            navigate("/h");
        }
        catch (err) {
            console.error("Failed to sign out", err);
        }
        finally {
            try {
                localStorage.removeItem("token");
            }
            catch (e) {
                // ignore error
            }
            navigate("/h");
        }
    };

    return (
        <header className={ns.header}>
            <nav className={ns.navContainer}>
                <div className={ns.flexContainer}>
                    <div className={ns.logoContainer}>
                        <img src={logoImg} alt="logo" className={ns.logoImage} />

                        <Link to='/'>
                            <div className={ns.logoLink}>MediCarePlus</div>
                            <div className={ns.logoSubtext}>Powered by ThynkTech</div>
                        </Link>

                    </div>

                    {/* {center} */}

                    <div className={ns.centerNavContainer}>
                        <div className={ns.glowEffect}>
                            <div className={ns.centerNavInner}>
                                <div ref={navInnerRef} tabIndex={0}
                                    className={ns.centerNavScrollContainer}
                                    style={{
                                        WebkitOverflowScrolling: "touch"
                                    }}>
                                    <CenterNavItem
                                        to="/h"
                                        label="Dashboard"
                                        icon={<Home size={16} />}
                                    />
                                    <CenterNavItem
                                        to="/add"
                                        label="Add Doctor"
                                        icon={<UserPlus size={16} />}
                                    />
                                    <CenterNavItem
                                        to="/list"
                                        label="List Doctors"
                                        icon={<Users size={16} />}
                                    />
                                    <CenterNavItem
                                        to="/appointments"
                                        label="Appointments"
                                        icon={<Calendar size={16} />}
                                    />
                                    <CenterNavItem
                                        to="/service-dashboard"
                                        label="Service Dashboard"
                                        icon={<Grid size={16} />}
                                    />
                                    <CenterNavItem
                                        to="/add-service"
                                        label="Add Service"
                                        icon={<PlusSquare size={16} />}
                                    />
                                    <CenterNavItem
                                        to="/list-service"
                                        label="List Services"
                                        icon={<List size={16} />}
                                    />
                                    <CenterNavItem
                                        to="/service-appointments"
                                        label="Service Appointments"
                                        icon={<Calendar size={16} />}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* {right side} */}
                    <div className={ns.rightContainer}>
                        {isSignedIn ? (
                            <button onClick={handleSignOut} className={ns.signOutButton + " " + ns.cursorPointer}>
                                Sign Out
                            </button>
                        ) : (
                            <div className="hidden lg:flex items-center gap-2">
                                <button onClick={handleOpenSignIn}
                                    className={ns.signInButton + " " + ns.cursorPointer}>
                                    Login
                                </button>
                            </div>
                        )}

                        {/* {mobile view} */}

                        <button
                            onClick={() => setOpen((v) => !v)}
                            className={ns.mobileMenuButton}
                        >
                            {open ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    </div>
                </div>

                {/* {mobile menu} */}
                {open && (
                    <div className={ns.mobileOverlay} onClick={() => setOpen(false)} />
                )}

                {open && (
                    <div className={ns.mobileMenuContainer} id="mobile-menu">
                        <div className={ns.mobileMenuInner}>
                            <MobileItem
                                to="/h"
                                label="Dashboard"
                                icon={<Home size={16} />}
                                onClick={() => setOpen(false)}
                            />

                            <MobileItem
                                to="/add"
                                label="Add Doctor"
                                icon={<UserPlus size={16} />}
                                onClick={() => setOpen(false)}
                            />
                            <MobileItem
                                to="/list"
                                label="List Doctors"
                                icon={<Users size={16} />}
                                onClick={() => setOpen(false)}
                            />
                            <MobileItem
                                to="/appointments"
                                label="Appointments"
                                icon={<Calendar size={16} />}
                                onClick={() => setOpen(false)}
                            />

                            <MobileItem
                                to="/service-dashboard"
                                label="Service Dashboard"
                                icon={<Grid size={16} />}
                                onClick={() => setOpen(false)}
                            />
                            <MobileItem
                                to="/add-service"
                                label="Add Service"
                                icon={<PlusSquare size={16} />}
                                onClick={() => setOpen(false)}
                            />
                            <MobileItem
                                to="/list-service"
                                label="List Services"
                                icon={<List size={16} />}
                                onClick={() => setOpen(false)}
                            />
                            <MobileItem
                                to="/service-appointments"
                                label="Service Appointments"
                                icon={<Calendar size={16} />}
                                onClick={() => setOpen(false)}
                            />

                            <div className={ns.mobileAuthContainer}>
                                (isSignedIn?
                                <button onClick={() => {
                                    handleSignOut();
                                    setOpen(false);
                                }} className={ns.mobileSignOutButton}>
                                    Sign Out
                                </button>):
                                (
                                    <div className="space-y-2">
                                        <button onClick={() => {
                                            handleOpenSignIn();
                                            setOpen(false);
                                        }} className={ns.mobileSignInButton +" "+ns.cursorPointer}>
                                            Login
                                        </button>
                                    </div>
                                )
                            </div>
                        </div>
                    </div> 
                )}     
                </nav>    
        </header>
    )
}

export default Navbar

const CenterNavItem = ({ to, icon, label }) => {
    return (
        <NavLink
            to={to}
            end
            className={({ isActive }) =>
                `nav-item${isActive ? "active" : ""
                }${ns.centerNavItemBase} ${isActive ? ns.centerNavItemActive : ns.centerNavItemInactive
                }`
            }
        >
            <span className={ns.linkIcon}>{icon}</span>
            <span className={ns.linkText}>{label}</span>
        </NavLink>
    );
};

function MobileItem({ to, icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `${ns.mobileItemBase} ${
          isActive ? ns.mobileItemActive : ns.mobileItemInactive
        }`
      }
    >
      <span className={ns.linkIcon}>{icon}</span>
      <span className="font-medium text-sm">{label}</span>
    </NavLink>
  );
}