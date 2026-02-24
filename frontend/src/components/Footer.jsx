import React from "react";
import { footerStyles as f } from "../assets/dummyStyles";
import logo from "../assets/logo.png";
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    Stethoscope,
    Phone,
    Mail,
    MapPin,
    ArrowRight,
    Send,
    Activity,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: "Home", href: "/" },
        { name: "Doctors", href: "/doctors" },
        { name: "Services", href: "/services" },
        { name: "Contact", href: "/contact" },
        { name: "Appointments", href: "/appointments" },
    ];

    const services = [
        { name: "Blood Pressure Check", href: "/services" },
        { name: "Blood Sugar Test", href: "/services" },
        { name: "Full Blood Count", href: "/services" },
        { name: "X-Ray Scan", href: "/services" },
        { name: "Blood Sugar Test", href: "/services" },
    ];

    // ✅ Added real redirect links
    const socialLinks = [
        {
            Icon: Facebook,
            color: f.facebookColor,
            name: "Facebook",
            href: "https://facebook.com",
        },
        {
            Icon: Twitter,
            color: f.twitterColor,
            name: "Twitter",
            href: "https://twitter.com",
        },
        {
            Icon: Instagram,
            color: f.instagramColor,
            name: "Instagram",
            href: "https://instagram.com",
        },
        {
            Icon: Linkedin,
            color: f.linkedinColor,
            name: "LinkedIn",
            href: "https://linkedin.com",
        },
        {
            Icon: Youtube,
            color: f.youtubeColor,
            name: "YouTube",
            href: "https://youtube.com",
        },
    ];

    return (
        <footer className={f.footerContainer}>
            <div className={f.floatingIcon1}>
                <Stethoscope className={f.stethoscopeIcon} />
            </div>

            <div className={f.floatingIcon2} style={{ animationDelay: "3s" }}>
                <Activity className={f.activityIcon} />
            </div>

            <div className={f.mainContent}>
                <div className={f.gridContainer}>
                    <div className={f.companySection}>
                        <div className={f.logoContainer}>
                            <div className={f.logoWrapper}>
                                <div className={f.logoImageContainer}>
                                    <img src={logo} alt="logo" className={f.logoImage} />
                                </div>
                            </div>

                            <div>
                                <h2 className={f.companyName}>MediCare</h2>
                                <p className={f.companyTagline}>Healthcare Solutions</p>
                            </div>
                        </div>

                        <p className={f.companyDescription}>
                            Your trusted partner in healthcare innovation. We're committed to
                            providing exceptional medical care with cutting-edge technology
                            and compassionate service.
                        </p>

                        <div className={f.contactContainer}>
                            <div className={f.contactItem}>
                                <div className={f.contactIconWrapper}>
                                    <Phone className={f.contactIcon} />
                                </div>
                                <span className={f.contactText}>+91 7875546484</span>
                            </div>

                            <div className={f.contactItem}>
                                <div className={f.contactIconWrapper}>
                                    <Mail className={f.contactIcon} />
                                </div>
                                <span className={f.contactText}>
                                    yashingle1307@gmail.com
                                </span>
                            </div>

                            <div className={f.contactItem}>
                                <div className={f.contactIconWrapper}>
                                    <MapPin className={f.contactIcon} />
                                </div>
                                <span className={f.contactText}>Pune</span>
                            </div>
                        </div>
                    </div>

                    {/* quick links */}
                    <div className={f.linksSection}>
                        <h3 className={f.sectionTitle}>Quick Links</h3>

                        <ul className={f.linksList}>
                            {quickLinks.map((link, index) => (
                                <li key={link.name} className={f.linkItem}>
                                    <Link
                                        to={link.href}
                                        className={f.quickLink}
                                        style={{ animationDelay: `${index * 60}ms` }}
                                    >
                                        <div className={f.quickLinkIconWrapper}>
                                            <ArrowRight className={f.quickLinkIcon} />
                                        </div>
                                        <span>{link.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={f.linksSection}>
                        <h3 className={f.sectionTitle}>Our Services</h3>

                        <ul className={f.linksList}>
                            {services.map((service, index) => (
                                <li key={`${service.name}-${index}`}>
                                    <Link to={service.href} className={f.serviceLink}>
                                        {service.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={f.newsletterSection}>
                        <h3 className={f.newsletterTitle}>Stay Connected</h3>
                        <p className={f.newsletterDescription}>
                            Subscribe for health tips, medical updates, and wellness insights
                            delivered to your inbox.
                        </p>

                        <div className={f.newsletterForm}>
                            <div className={f.mobileNewsletterContainer}>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className={f.emailInput}
                                />
                                <button className={f.mobileSubscribeButton}>
                                    <Send className={f.mobileButtonIcon} />
                                    Subscribe
                                </button>
                            </div>

                            <div className={f.desktopNewsletterContainer}>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className={f.desktopEmailInput}
                                />
                                <button className={f.desktopSubscribeButton}>
                                    <Send className={f.desktopButtonIcon} />
                                    <span className={f.desktopButtonText}>Subscribe</span>
                                </button>
                            </div>

                            {/* Social icons */}
                            <div className={f.socialContainer}>
                                {socialLinks.map(({ Icon, color, name, href }, index) => (
                                    <a
                                        key={name}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={f.socialLink}
                                        style={{ animationDelay: `${index * 120}ms` }}
                                    >
                                        <div className={f.socialIconBackground} />
                                        <Icon className={`${f.socialIcon} ${color}`} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={f.bottomSection}>
                    <div className={f.copyright}>
                        <span>&copy; {currentYear} MediCarePlus Healthcare.</span>
                    </div>

                    <div className={f.designerText}>
                        <span>
                            Designed with ❤️ by{" "}
                            <a
                                href="https://www.linkedin.com/in/yashingle1307/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={f.designerLink}
                            >
                                Yash Ingle
                            </a>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;