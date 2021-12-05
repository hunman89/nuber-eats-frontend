import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import { gql, useMutation, useSubscription } from "@apollo/client";
import { FULL_ORDER_FRAGMENT } from "../../fragments";
import { cookedOrders } from "../../__generated__/cookedOrders";
import { Link, useHistory } from "react-router-dom";
import { takeOrder, takeOrderVariables } from "../../__generated__/takeOrder";

const COOKED_ORDER_SUBSCRIPTION = gql`
  subscription cookedOrders {
    cookedOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const TAKE_ORDER_MUTATION = gql`
  mutation takeOrder($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      ok
      error
    }
  }
`;

interface ICoords {
  lat: number;
  lng: number;
}

interface IDriverProps {
  lat: number;
  lng: number;
  $hover?: any;
}

const Driver: React.FC<IDriverProps> = () => <div className="text-lg">🛵</div>;

export const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({ lat: 0, lng: 0 });
  const [map, setMap] = useState<google.maps.Map>();
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
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
      //   const geocoder = new google.maps.Geocoder();
      //   geocoder.geocode(
      //     {
      //       location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
      //     },
      //     (results, status) => {
      //       console.log(results, status);
      //     }
      //   );
    }
  }, [driverCoords.lat, driverCoords.lng]);
  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
    setMap(map);
    setMaps(maps);
  };
  const makeRoute = () => {
    if (map) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        polylineOptions: { strokeColor: "#000", strokeWeight: 3 },
      });
      directionsRenderer.setMap(map);
      directionsService.route(
        {
          origin: {
            location: new google.maps.LatLng(
              driverCoords.lat,
              driverCoords.lng
            ),
          },
          destination: {
            location: new google.maps.LatLng(
              driverCoords.lat + 0.05,
              driverCoords.lng + 0.05
            ),
          },
          travelMode: google.maps.TravelMode.TRANSIT,
        },
        (result, status) => {
          directionsRenderer.setDirections(result);
        }
      );
    }
  };
  const { data: cookedOrdersData } = useSubscription<cookedOrders>(
    COOKED_ORDER_SUBSCRIPTION
  );
  useEffect(() => {
    if (cookedOrdersData?.cookedOrders.id) {
      makeRoute();
    }
  }, [cookedOrdersData]);
  const history = useHistory();
  const onCompleted = (data: takeOrder) => {
    if (data.takeOrder.ok) {
      history.push(`/orders/${cookedOrdersData?.cookedOrders.id}`);
    }
  };
  const [takeOrderMutation] = useMutation<takeOrder, takeOrderVariables>(
    TAKE_ORDER_MUTATION,
    { onCompleted }
  );
  const triggerMutation = (orderId: number) => {
    takeOrderMutation({ variables: { input: { id: orderId } } });
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
          <Driver lat={driverCoords.lat} lng={driverCoords.lng}></Driver>
        </GoogleMapReact>
      </div>

      <div className=" max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5">
        {cookedOrdersData?.cookedOrders.restaurant ? (
          <>
            <h1 className="text-center text-3xl font-medium">
              New Cooked Order
            </h1>
            <h1 className="text-center my-3 text-2xl font-medium">
              @ ${cookedOrdersData.cookedOrders.restaurant?.name}
            </h1>
            <button
              onClick={() => triggerMutation(cookedOrdersData.cookedOrders.id)}
              className="btn w-full block text-center mt-10"
            >
              Accept &rarr;
            </button>
          </>
        ) : (
          <h1 className="text-center text-3xl font-medium">No orders yet...</h1>
        )}
      </div>
    </div>
  );
};
