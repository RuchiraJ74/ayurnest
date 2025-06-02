
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
    
    // For now, we'll show a placeholder since the Mapbox token needs to be configured
    // The token 'pk.eyJ1IjoibG92YWJsZWRldiIsImEiOiJjbHVnMTNocm4wNXRrMmttZDN3OXJ2aGlqIn0.xiGZj2FaiB9-bAKlbcTx8g' appears to be invalid
    
    // Create a simple placeholder div instead of initializing Mapbox
    const placeholder = document.createElement('div');
    placeholder.style.width = '100%';
    placeholder.style.height = '100%';
    placeholder.style.backgroundColor = '#f0f0f0';
    placeholder.style.display = 'flex';
    placeholder.style.alignItems = 'center';
    placeholder.style.justifyContent = 'center';
    placeholder.style.borderRadius = '8px';
    placeholder.style.color = '#666';
    placeholder.style.fontSize = '14px';
    placeholder.style.textAlign = 'center';
    placeholder.innerHTML = `
      <div>
        <div style="margin-bottom: 8px;">📍</div>
        <div>Order #${orderId}</div>
        <div style="font-size: 12px; margin-top: 4px;">Status: ${status.charAt(0).toUpperCase() + status.slice(1)}</div>
        <div style="font-size: 10px; margin-top: 4px; color: #999;">Map requires valid Mapbox token</div>
      </div>
    `;
    
    if (mapContainer.current) {
      mapContainer.current.appendChild(placeholder);
    }
    
    return () => {
      // Safe cleanup - only remove if placeholder exists
      if (mapContainer.current && placeholder.parentNode) {
        mapContainer.current.removeChild(placeholder);
      }
      
      // Safe cleanup for map - only call remove if map is properly initialized
      if (map.current && map.current.loaded && map.current.loaded()) {
        try {
          map.current.remove();
        } catch (error) {
          console.warn('Error removing map:', error);
        }
      }
      map.current = null;
      marker.current = null;
    };
  }, [latitude, longitude, orderId, status]);

  return (
    <div ref={mapContainer} className="w-full h-full rounded-lg" />
  );
};

export default MapTracker;
