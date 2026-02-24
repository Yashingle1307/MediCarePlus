import React from 'react'
import { bannerStyles as b } from '../assets/dummyStyles'
import { Calendar, Clock, Phone, Ribbon, ShieldUser, Star, Stethoscope, User, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import banner from '../assets/BannerImg.png';

const Banner = () => {

    const navigate = useNavigate();

    return (
        <div className={b.bannerContainer}>
            <div className={b.mainContainer}>
                <div className={b.borderOutline}>
                    <div className={b.outerAnimatedBand}>

                    </div>
                    <div className={b.innerWhiteBorder}>

                    </div>
                </div>
                <div className={b.contentContainer}>
                    <div className={b.flexContainer}>
                        <div className={b.leftContent}>
                            <div className={b.headerBadgeContainer}>
                                <div className={b.stethoscopeContainer}>
                                    <div className={b.stethoscopeInner}>
                                        <Stethoscope className={b.stethoscopeIcon} />
                                    </div>
                                </div>

                                <div className={b.titleContainer}>
                                    <h1 className={b.title}>
                                        Medi
                                        <span className={b.titleGradient}>
                                            Care+
                                        </span>
                                    </h1>

                                    {/* {stars */}
                                    <div className={b.starsContainer}>
                                        <div className={b.starsInner}>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star className={b.starIcon} key={star} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* {tagline} */}

                            <p className={b.tagline}>
                                Premium HealthCare
                                <span className={`block ${b.taglineHighlight}`}>
                                    At your Fingertips
                                </span>
                            </p>

                            <div className={b.featuresGrid}>
                                <div className={`${b.featureItem} ${b.featureBorderGreen}`}>
                                    <Ribbon className={b.featureIcon} />
                                    <span className={b.featureText}>
                                        Certified Solutions
                                    </span>
                                </div>

                                <div className={`${b.featureItem} ${b.featureBorderGreen}`}>
                                    <Clock className={b.featureIcon} />
                                    <span className={b.featureText}>
                                        24/7 Availability
                                    </span>
                                </div>

                                <div className={`${b.featureItem} ${b.featureBorderEmerald}`}>
                                    <ShieldUser className={b.featureIcon} />
                                    <span className={b.featureText}>
                                        Safe &amp; Secure
                                    </span>
                                </div>

                                <div className={`${b.featureItem} ${b.featureBorderPurple}`}>
                                    <Users className={b.featureIcon} />
                                    <span className={b.featureText}>
                                        500+ Doctors
                                    </span>
                                </div>
                            </div>
                            <div className={b.ctaButtonsContainer}>
                                <button onClick={() => navigate("/doctors")}
                                    className={b.bookButton}>

                                    <div className={b.bookButtonOverlay}></div>
                                    <div className={b.bookButtonContent}>
                                        <Calendar className={b.bookButtonContent} />
                                        <span>Book Appointment Now</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => window.location.href = "tel:7875546484"}
                                    className={b.emergencyButton}>
                                    <div className={b.emergencyButtonContent}>
                                        <Phone className={b.emergencyButtonIcon} />
                                        <span>Emergency Call</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                        <div className={b.rightImageSection}>
                            <div className={b.imageContainer}>
                                <div className={b.imageFrame}>
                                    <img src={banner}
                                        alt="banner"
                                        className={b.image} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Banner