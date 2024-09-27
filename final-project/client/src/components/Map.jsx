import React, { useEffect, useRef, useState } from "react";

const Map = ({ apiKey }) => {
  const mapContainerRef = useRef(null);
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [map, setMap] = useState(null); // Track map instance

  useEffect(() => {
    if (window.H && mapContainerRef.current) {
      const platform = new window.H.service.Platform({
        apikey: apiKey,
      });

      const defaultLayers = platform.createDefaultLayers();
      const newMap = new window.H.Map(
        mapContainerRef.current,
        defaultLayers.vector.normal.map,
        {
          zoom: 17,
          center: { lat: -6.9359012, lng: 107.5778538 },
        }
      );

      const behavior = new window.H.mapevents.Behavior(
        new window.H.mapevents.MapEvents(newMap)
      );
      const ui = window.H.ui.UI.createDefault(newMap, defaultLayers);

      // Set the map instance
      setMap(newMap);

      // Event listener for map click
      newMap.addEventListener("pointerup", (evt) => {
        const coord = newMap.screenToGeo(
          evt.currentPointer.viewportX,
          evt.currentPointer.viewportY
        );
        setCoordinates({ lat: coord.lat, lng: coord.lng });

        // Remove existing marker if present
        const existingMarker = newMap
          .getObjects()
          .find((obj) => obj instanceof window.H.map.Marker);
        if (existingMarker) {
          newMap.removeObject(existingMarker);
        }

        // Create and add new marker
        const icon = new window.H.map.Icon(
          "https://img.icons8.com/fluency/48/000000/marker.png"
        );
        const newMarker = new window.H.map.Marker(
          { lat: coord.lat, lng: coord.lng },
          { icon: icon }
        );
        newMap.addObject(newMarker);
      });
    }
  }, [apiKey]); // Empty dependency array ensures this runs only once

  return (
    <div>
      <div
        ref={mapContainerRef}
        style={{ width: "100%", height: "500px" }}
      ></div>
      {coordinates.lat && coordinates.lng && (
        <div>
          <h3>Selected Location</h3>
          <p>Latitude: {coordinates.lat}</p>
          <p>Longitude: {coordinates.lng}</p>
        </div>
      )}
    </div>
  );
};

export default Map;
