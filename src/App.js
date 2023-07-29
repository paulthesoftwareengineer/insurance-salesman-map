import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const initialMapCenter = [45.5, -122.5]; // Coordinates for the center of the map

function App() {
  const [clients, setClients] = useState([]);
  const [newClientName, setNewClientName] = useState('');
  const [newClientCity, setNewClientCity] = useState('');
  const [mapCenter, setMapCenter] = useState(initialMapCenter);

  useEffect(() => {
    // Load existing clients from Firebase Firestore
    const unsubscribe = db.collection('clients').onSnapshot((snapshot) => {
      const clientsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClients(clientsData);
    });

    return () => unsubscribe();
  }, []);

  const handleClientAdd = () => {
    // Add a new client to Firebase Firestore
    db.collection('clients').add({
      name: newClientName,
      city: newClientCity,
    });

    // Clear input fields after adding the client
    setNewClientName('');
    setNewClientCity('');
  };

  return (
    <div className="App">
      <div className="map-container">
        <MapContainer center={mapCenter} zoom={6} style={{ height: '500px' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {clients.map((client) => (
            <Marker
              key={client.id}
              position={[client.latitude, client.longitude]}
            >
              <Popup>{`${client.name} - ${client.city}`}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="add-client-container">
        <h2>Add New Client</h2>
        <input
          type="text"
          placeholder="Name"
          value={newClientName}
          onChange={(e) => setNewClientName(e.target.value)}
        />
        <input
          type="text"
          placeholder="City"
          value={newClientCity}
          onChange={(e) => setNewClientCity(e.target.value)}
        />
        <button onClick={handleClientAdd}>Add Client</button>
      </div>
    </div>
  );
}

export default App;

