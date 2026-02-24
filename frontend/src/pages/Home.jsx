import React from 'react'
import Navbar from '../components/Navbar'
import Banner from '../components/Banner'
import Certications from '../components/Certications'
import HomeDoctors from '../components/HomeDoctors'
import Testimonial from '../components/Testimonial'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
        <Navbar/>
        <Banner/>
        <Certications/>
        <HomeDoctors/>
        <Testimonial/>
        <Footer/>
    </div>
  )
}

export default Home