import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import { mapSeries } from "cypress/types/bluebird";

interface ICoords {
  lat: number;
  lng: number;
}

export const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({ lat: 0, lng: 0 });
  const [map, setMap] = useState<any>();
  const [maps, setMaps] = useState<any>();
  const onSucces = ({
    coords: { latitude, longitude },
  }: GeolocationPosition) => {
    setDriverCoords({ lat: latitude, lng: longitude });
  };
  const onError = (error: GeolocationPositionError) => {
    console.log(error);
  };
  useEffect(() => {
    navigator.geolocation.watchPosition(onSucces, onError, {
      enableHighAccuracy: true,
    });
  }, []);
  useEffect(() => {
    if (map && maps) {
      map.panTo(new maps.LatLng(driverCoords.lat, driverCoords.lng));
    }
  }, [driverCoords.lat, driverCoords.lng]);
  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    map.panTo(new maps.LatLng(driverCoords.lat, driverCoords.lng));
    setMap(map);
    setMaps(maps);
  };
  return (
    <div>
      <div
        className="overflow-hidden"
        style={{ width: window.innerWidth, height: "50vh" }}
      >
        <GoogleMapReact
          yesIWantToUseGoogleMapApiInternals
          defaultZoom={16}
          draggable={false}
          defaultCenter={{ lat: 37.48, lng: 127.12 }}
          bootstrapURLKeys={{ key: "AIzaSyBbAcnDyspvgSaWi8-OSe1JTdEg5OhEwmI" }}
          onGoogleApiLoaded={onApiLoaded}
        >
          <div
            // @ts-ignore
            lat={driverCoords.lat}
            lng={driverCoords.lng}
            className="text-lg"
          >
            🛵
          </div>
        </GoogleMapReact>
      </div>
    </div>
  );
};
