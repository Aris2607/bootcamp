// HereMap.jsx
import React, { useEffect, useRef } from "react";

const HereMap = ({ location }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize the platform with your API key
    const platform = new window.H.service.Platform({
      apikey: "VU2xMNT7KaSvOViW64WSotTqYf17YT-AwH6vcL8wAiI", // Replace with your HERE Maps API key
    });

    // Get the default map types from the platform object
    const defaultLayers = platform.createDefaultLayers();

    // Create a map instance
    const map = new window.H.Map(
      mapRef.current,
      defaultLayers.vector.normal.map,
      {
        center: {
          lat: location ? location.latitude : -6.9359012,
          lng: location ? location.longitude : 107.5778538,
        },
        zoom: 17,
        pixelRatio: window.devicePixelRatio || 1,
      }
    );

    const circle = new window.H.map.Circle(
      {
        lat: -6.9359012,
        lng: 107.5778538,
      }, // Lokasi pusat lingkaran
      50, // Radius dalam meter
      {
        style: {
          strokeColor: "rgba(55, 85, 170, 0.6)", // Warna garis tepi
          lineWidth: 2,
          fillColor: "rgba(0, 128, 0, 0.3)", // Warna isi
        },
      }
    );

    map.addObject(circle);

    const icon = new H.map.Icon(
      "https://img.icons8.com/fluency/48/000000/marker.png" // URL gambar ikon
    );

    // Menentukan Lokasi Marker (Koordinat Pengguna)
    const userCoordinates = {
      lat: location ? location.latitude : -6.9359012,
      lng: location ? location.longitude : 107.5778538,
    };

    // Membuat Marker dengan Ikon Kustom
    const userMarker = new window.H.map.Marker(userCoordinates, { icon: icon });

    // Tambahkan Marker ke Peta
    map.addObject(userMarker);

    // Add behavior (zooming, panning) to the map
    const behavior = new window.H.mapevents.Behavior(
      new window.H.mapevents.MapEvents(map)
    );

    // Add default UI components like zoom buttons to the map
    window.H.ui.UI.createDefault(map, defaultLayers);

    // Cleanup function to remove the map when the component is unmounted
    return () => {
      map.dispose();
    };
  }, [location]);

  return <div ref={mapRef} className="w-full h-[500px]" />;
};

export default HereMap;
