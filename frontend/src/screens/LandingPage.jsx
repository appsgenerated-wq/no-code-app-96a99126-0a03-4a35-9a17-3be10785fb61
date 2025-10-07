import React, { useState } from 'react';
import config from '../constants.js';
import { CalendarDaysIcon, TicketIcon, MapPinIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const LandingPage = ({ onLogin, onSignup }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('attendee');

  const handleAuthAction = (e) => {
    e.preventDefault();
    if (isLogin) {
      onLogin(email, password);
    } else {
      onSignup(name, email, password, role);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">EventPlanner</h1>
          <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-600 hover:text-blue-500 transition-colors">
            Admin Panel
          </a>
        </div>
      </header>

      <main>
        <div className="relative">
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1/2 bg-gray-50" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="pt-16 pb-24 sm:pt-24 sm:pb-32">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="text-center lg:text-left">
                  <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block">Plan Your Next</span>
                    <span className="block text-blue-600">Unforgettable Event</span>
                  </h1>
                  <p className="mt-6 max-w-md mx-auto text-lg text-gray-500 sm:text-xl md:mt-8 md:max-w-3xl lg:mx-0">
                    The all-in-one platform for organizers to create, manage, and promote events, and for attendees to discover and register.
                  </p>
                  <div className="mt-10 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <button onClick={() => document.getElementById('auth-form').scrollIntoView({ behavior: 'smooth' })} className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                        Get started
                      </button>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-2xl" id="auth-form">
                  <div className="mb-6 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                      <button onClick={() => setIsLogin(true)} className={`${isLogin ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Login</button>
                      <button onClick={() => setIsLogin(false)} className={`${!isLogin ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Sign Up</button>
                    </nav>
                  </div>
                  <form onSubmit={handleAuthAction} className="space-y-6">
                    {!isLogin && (
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                      </div>
                    )}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                      <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                      <input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                    {!isLogin && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">I am an</label>
                        <div className="mt-2 grid grid-cols-2 gap-3">
                          <button type="button" onClick={() => setRole('attendee')} className={`py-2 px-4 rounded-md text-sm font-medium ${role === 'attendee' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}>Attendee</button>
                          <button type="button" onClick={() => setRole('organizer')} className={`py-2 px-4 rounded-md text-sm font-medium ${role === 'organizer' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}>Organizer</button>
                        </div>
                      </div>
                    )}
                    <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">{isLogin ? 'Login' : 'Create Account'}</button>
                  </form>
                  <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with a demo user</span>
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <div><button onClick={() => onLogin('organizer@demo.com', 'password')} className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">Organizer</button></div>
                        <div><button onClick={() => onLogin('attendee@demo.com', 'password')} className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">Attendee</button></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">Everything you need to run successful events</p>
            </div>
            <div className="mt-10">
              <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white"><CalendarDaysIcon className="h-6 w-6" aria-hidden="true" /></div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Event Management</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">Create and customize your event page with details, schedules, and beautiful image galleries.</dd>
                </div>
                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white"><TicketIcon className="h-6 w-6" aria-hidden="true" /></div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Flexible Ticketing</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">Set up multiple ticket tiers like 'VIP' or 'Early Bird' with different prices and quantities.</dd>
                </div>
                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white"><MapPinIcon className="h-6 w-6" aria-hidden="true" /></div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Venue Selection</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">Browse and select from a curated list of venues, from conference centers to outdoor parks.</dd>
                </div>
                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white"><UserGroupIcon className="h-6 w-6" aria-hidden="true" /></div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Attendee CRM</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">Manage registrations and keep track of your attendees all in one place.</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
