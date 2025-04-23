
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Truck, Home, Package } from 'lucide-react';

type MapTrackerProps = {
  latitude: number;
  longitude: number;
  orderId: string;
  status: 'processing' | 'shipped' | 'outForDelivery' | 'delivered' | 'cancelled';
};

const MapTracker: React.FC<MapTrackerProps> = ({ latitude, longitude, orderId, status }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Initialize map
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZWRldiIsImEiOiJjbHVnMTNocm4wNXRrMmttZDN3OXJ2aGlqIn0.xiGZj2FaiB9-bAKlbcTx8g';
    
    const createMapInstance = () => {
      if (map.current) return;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [longitude, latitude],
        zoom: 12,
        interactive: true,
      });
      
      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );
      
      map.current.on('load', () => {
        createMarker();
      });
    };
    
    const createMarker = () => {
      if (!map.current) return;
      
      // Custom marker element with order status icon
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.style.width = '40px';
      markerElement.style.height = '40px';
      markerElement.style.borderRadius = '50%';
      markerElement.style.display = 'flex';
      markerElement.style.alignItems = 'center';
      markerElement.style.justifyContent = 'center';
      
      if (status === 'processing') {
        markerElement.style.backgroundColor = '#e0f2fe'; // Light blue
        const icon = document.createElement('div');
        icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" y1="22" x2="12" y2="12"></line></svg>';
        markerElement.appendChild(icon);
      } else if (status === 'shipped' || status === 'outForDelivery') {
        markerElement.style.backgroundColor = '#fef3c7'; // Light amber
        const icon = document.createElement('div');
        icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>';
        markerElement.appendChild(icon);
      } else {
        markerElement.style.backgroundColor = '#dcfce7'; // Light green
        const icon = document.createElement('div');
        icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>';
        markerElement.appendChild(icon);
      }
      
      // Add marker to map
      marker.current = new mapboxgl.Marker(markerElement)
        .setLngLat([longitude, latitude])
        .setPopup(new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<p class="font-medium">Order #${orderId}</p><p class="text-sm">Status: ${status.charAt(0).toUpperCase() + status.slice(1)}</p>`))
        .addTo(map.current);
    };
    
    createMapInstance();
    
    return () => {
      if (map.current) map.current.remove();
    };
  }, [latitude, longitude, orderId, status]);
  
  useEffect(() => {
    if (map.current && marker.current) {
      marker.current.setLngLat([longitude, latitude]);
      map.current.flyTo({
        center: [longitude, latitude],
        essential: true
      });
    }
  }, [latitude, longitude]);

  return (
    <div ref={mapContainer} className="w-full h-full rounded-lg" />
  );
};

export default MapTracker;
