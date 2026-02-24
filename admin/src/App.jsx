import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Hero from './pages/Hero'
import { useUser } from "@clerk/clerk-react";
import Home from './pages/Home';
import Add from './pages/Add';
import List from './pages/List'
import Appointment from './pages/Appointment';
import SerDashboard from './pages/SerDashboard';
import AddSer from './pages/AddSer';
import ListService from './pages/ListService'
import ServiceAppointments from './pages/ServiceAppointments'

function RequireAuth({ children }) {

  const { isLoaded, isSignedIn } = useUser()

  if (!isLoaded) return null;
  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center font-serif bg-linear-to-br from-emerald-50 via-white to-emerald-100 px-4">

        <div className="max-w-md w-full bg-white/80 backdrop-blur-md border border-emerald-200 shadow-xl rounded-3xl p-8 text-center">

          <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-3">
            Access Restricted
          </h2>

          <p className="text-emerald-800 text-sm sm:text-base mb-6">
            Please sign in to access the admin dashboard.
          </p>

          <Link
            to="/"
            className="inline-flex items-center justify-center bg-linear-to-r 
        from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700
        px-6 py-2.5 rounded-full text-white font-semibold
        shadow-md hover:shadow-lg transition-all duration-300"
          >
            Go to Home
          </Link>

        </div>

      </div>
    );
  }
  return children;
}

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Hero />} />

      <Route path='/h' element={<RequireAuth><Home/>
      </RequireAuth>} />

      <Route path='/add' element={
      <RequireAuth>
        <Add/>
      </RequireAuth>
      }>
      </Route>

      <Route path='/list' element={
      <RequireAuth>
       <List/>
      </RequireAuth>
      }>
      </Route>

      <Route path='/appointments' element={
      <RequireAuth>
       <Appointment/>
      </RequireAuth>
      }>
      </Route>

      <Route path='/service-dashboard' element={
      <RequireAuth>
       <SerDashboard/>
      </RequireAuth>
      }>
      </Route>

      <Route path='/add-service' element={
      <RequireAuth>
       <AddSer/>
      </RequireAuth>
      }>
      </Route>

      <Route path='/list-service' element={
      <RequireAuth>
       <ListService/>
      </RequireAuth>
      }>
      </Route>

      <Route path='/service-appointments' element={
      <RequireAuth>
       <ServiceAppointments/>
      </RequireAuth>
      }>
      </Route>

    </Routes>
  )
}

export default App