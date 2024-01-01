import React, { useState } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import "bootstrap/dist/css/bootstrap.min.css";

const containerStyle = {
  width: "100%",
  maxHeight: "400px",
  aspectRatio: "1/1",
};

const default_center = {
  lat: 52.519325,
  lng: 13.392709,
};

const MyMap = ({ data }) => {
  const [mapZoom, setMapZoom] = useState(4);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyB7WfKSlSG-TNxR_lpiUgPefrMTNh5IPKI",
  });

  const [map, setMap] = React.useState(null);
  const [selectedPin, setSelectedPin] = useState(null);

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handleMarkerClick = (pin) => {
    setSelectedPin(pin);
  };

  const handleInfoWindowClose = () => {
    setSelectedPin(null);
  };

return isLoaded ? (
    <div className="col-12">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={default_center}
        zoom={mapZoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {(data ?? []).map((pin) => (
          <Marker
            key={pin.ip}
            title={pin.ip}
            name={pin.ip}
            icon={"/blue_pin.png"}
            position={{ lat: pin.lat, lng: pin.lon }}
            onClick={() => handleMarkerClick(pin)}
          />
        ))}

        {selectedPin && (
          <InfoWindow
            position={{ lat: selectedPin.lat, lng: selectedPin.lon }}
            onCloseClick={handleInfoWindowClose}
          >
            <div className="text-dark">
              <h5>{selectedPin.country}</h5>
              <p>IP: {selectedPin.ip}</p>
              <p>Last Online Date: {selectedPin.last_registered_date}</p>
              <p>Access Count: {selectedPin.access_count}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  ) : (
    <></>
  );
}

export default MyMap;