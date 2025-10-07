import React, { useState, useEffect, useCallback } from 'react';
import { PlusIcon, PhotoIcon, MapPinIcon, CalendarIcon, TicketIcon, XMarkIcon, BanknotesIcon, UsersIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
import config from '../constants.js';

const DashboardPage = ({ user, onLogout, manifest }) => {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [view, setView] = useState('list'); // 'list', 'create', 'detail'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // New Event Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    eventDate: '',
    venueId: null,
  });
  const [newTicketTiers, setNewTicketTiers] = useState([{ tierName: 'General Admission', price: 0, quantity: 100 }]);
  const [newGalleryImages, setNewGalleryImages] = useState([]); // Array of { file: File, preview: string }

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const eventQuery = user.role === 'organizer' 
        ? { filter: { organizerId: user.id }, include: ['organizer', 'venue'] } 
        : { include: ['organizer', 'venue'] };

      const [eventResponse, venueResponse] = await Promise.all([
        manifest.from('Event').find(eventQuery),
        manifest.from('Venue').find()
      ]);
      setEvents(eventResponse.data);
      setVenues(venueResponse.data);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [manifest, user]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const resetForm = () => {
    setNewEvent({ title: '', description: '', eventDate: '', venueId: null });
    setNewTicketTiers([{ tierName: 'General Admission', price: 0, quantity: 100 }]);
    setNewGalleryImages([]);
  }

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const createdEvent = await manifest.from('Event').create({
        ...newEvent,
        organizerId: user.id,
      });

      // Create ticket tiers
      await Promise.all(newTicketTiers.map(tier => 
        manifest.from('TicketTier').create({ ...tier, eventId: createdEvent.id })
      ));

      // Upload and create gallery images
      await Promise.all(newGalleryImages.map(img => 
        manifest.from('GalleryImage').create({ eventId: createdEvent.id, caption: img.file.name, imageFile: img.file })
      ));
      
      resetForm();
      setView('list');
      await loadInitialData(); // Refresh the list
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  // --- Feature-Aware Component: ImageUploader ---
  const ImageUploader = () => {
    const handleImageUpload = (files) => {
      const imageFiles = Array.from(files).map(file => ({ file, preview: URL.createObjectURL(file) }));
      setNewGalleryImages(prev => [...prev, ...imageFiles]);
    };
    const removeImage = (index) => {
        setNewGalleryImages(prev => prev.filter((_, i) => i !== index));
    }

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">Image Gallery</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                <span>Upload files</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" onChange={(e) => handleImageUpload(e.target.files)} />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
        {newGalleryImages.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {newGalleryImages.map((img, index) => (
                    <div key={index} className="relative">
                        <img src={img.preview} alt="Preview" className="h-24 w-24 object-cover rounded-md" />
                        <button onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5">
                            <XMarkIcon className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        )}
      </div>
    );
  };

  // --- Feature-Aware Component: RelationshipPicker (Venue) ---
  const VenuePicker = () => {
    return (
        <div>
            <label htmlFor="venue" className="block text-sm font-medium text-gray-700">Venue</label>
            <select 
                id="venue" 
                value={newEvent.venueId || ''} 
                onChange={e => setNewEvent({...newEvent, venueId: e.target.value})}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
                <option value="" disabled>Select a venue</option>
                {venues.map(venue => (
                    <option key={venue.id} value={venue.id}>{venue.name} ({venue.category})</option>
                ))}
            </select>
        </div>
    )
  }

  // --- Feature-Aware Component: Money Input & Tier Management ---
  const TicketTierManager = () => {
    const addTier = () => setNewTicketTiers([...newTicketTiers, { tierName: '', price: 0, quantity: 50 }]);
    const updateTier = (index, field, value) => {
        const updatedTiers = [...newTicketTiers];
        updatedTiers[index][field] = value;
        setNewTicketTiers(updatedTiers);
    };
    const removeTier = (index) => setNewTicketTiers(newTicketTiers.filter((_, i) => i !== index));

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Ticket Tiers</label>
            {newTicketTiers.map((tier, index) => (
                <div key={index} className="grid grid-cols-12 gap-x-4 items-end p-3 bg-gray-50 rounded-md border">
                    <div className="col-span-4"><label className="text-xs text-gray-500">Tier Name</label><input type="text" value={tier.tierName} onChange={(e) => updateTier(index, 'tierName', e.target.value)} className="w-full p-2 border rounded-md" /></div>
                    <div className="col-span-3"><label className="text-xs text-gray-500">Price (USD)</label><input type="number" value={tier.price} step="0.01" min="0" onChange={(e) => updateTier(index, 'price', parseFloat(e.target.value))} className="w-full p-2 border rounded-md" /></div>
                    <div className="col-span-3"><label className="text-xs text-gray-500">Quantity</label><input type="number" value={tier.quantity} min="0" onChange={(e) => updateTier(index, 'quantity', parseInt(e.target.value))} className="w-full p-2 border rounded-md" /></div>
                    <div className="col-span-2"><button type="button" onClick={() => removeTier(index)} className="text-red-500 hover:text-red-700 p-2"><XMarkIcon className="h-5 w-5"/></button></div>
                </div>
            ))}
            <button type="button" onClick={addTier} className="text-sm text-blue-600 hover:text-blue-800 font-medium">+ Add another tier</button>
        </div>
    );
  }

  const EventForm = () => (
    <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Create New Event</h2>
            <button onClick={() => { setView('list'); resetForm(); }} className="text-gray-500 hover:text-gray-800"><XMarkIcon className="h-6 w-6"/></button>
        </div>
        <form onSubmit={handleCreateEvent} className="space-y-6">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title</label>
                <input type="text" id="title" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea id="description" rows="4" value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">Date and Time</label>
                    <input type="datetime-local" id="eventDate" value={newEvent.eventDate} onChange={e => setNewEvent({...newEvent, eventDate: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <VenuePicker />
            </div>
            <TicketTierManager />
            <ImageUploader />
            <div className="flex justify-end pt-4">
                <button type="button" onClick={() => { setView('list'); resetForm(); }} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">Create Event</button>
            </div>
        </form>
    </div>
  );

  const EventCard = ({ eventItem }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="p-6">
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{eventItem.title}</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">{eventItem.venue?.category}</span>
            </div>
            <div className="flex items-center text-gray-500 text-sm mt-2">
                <CalendarIcon className="h-4 w-4 mr-2"/>
                <span>{new Date(eventItem.eventDate).toLocaleString()}</span>
            </div>
            <div className="flex items-center text-gray-500 text-sm mt-2">
                <MapPinIcon className="h-4 w-4 mr-2"/>
                <span>{eventItem.venue?.name}</span>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                <p className="text-sm text-gray-600">By {eventItem.organizer.name}</p>
                {user.role === 'attendee' && <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">Register Now</button>}
            </div>
        </div>
    </div>
  );

  const EventsList = () => (
    <div>
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{user.role === 'organizer' ? 'My Events' : 'Upcoming Events'}</h1>
                <p className="text-gray-600 mt-1">{user.role === 'organizer' ? 'Manage your created events or create a new one.' : 'Browse and register for events.'}</p>
            </div>
            {user.role === 'organizer' && (
                <button onClick={() => setView('create')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                    Create Event
                </button>
            )}
        </div>
        {isLoading ? (
            <p>Loading events...</p>
        ) : events.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
                <p className="mt-1 text-sm text-gray-500">{user.role === 'organizer' ? 'Get started by creating a new event.' : 'Check back later for new events.'}</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(eventData => <EventCard key={eventData.id} eventItem={eventData} />)}
            </div>
        )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
             <h1 className="text-2xl font-bold text-blue-600">EventPlanner</h1>
             <p className="text-sm text-gray-500">Welcome, {user.name} ({user.role})</p>
          </div>
          <div>
             <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-600 hover:text-blue-500 transition-colors mr-4">
                Admin Panel
             </a>
             <button onClick={onLogout} className="text-sm font-medium text-red-600 hover:text-red-800">Logout</button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {view === 'list' && <EventsList />}
        {view === 'create' && user.role === 'organizer' && <EventForm />}
      </main>
    </div>
  );
};

export default DashboardPage;
