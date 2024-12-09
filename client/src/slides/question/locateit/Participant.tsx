import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { LocateItSlide } from "@/models/Quiz";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import type { MapMouseEvent } from "@vis.gl/react-google-maps";
import { NONE, MEDIUM, HIGH } from "./MapStyle";

type location = {
  lat: number;
  lng: number;
};

interface LocateItProps {
  slide: LocateItSlide;
  answerQuestion: (answer: string[]) => void;
}

export function Participant({ slide, answerQuestion }: LocateItProps) {
  const [markerPosition, setMarkerPosition] = useState<location>({
    lat: 0,
    lng: 0,
  });
  const [mapCenter, setMapCenter] = useState<location>({
    lat: 0,
    lng: 0,
  });
  const [zoom, setZoom] = useState<number>(3);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const APIKEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
  const [mapDetails, setMapDetails] = useState<google.maps.MapTypeStyle[]>();

  const handleDragEnd = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newLat = event.latLng.lat();
      const newLng = event.latLng.lng();
      const updatedPosition = { lat: newLat, lng: newLng };
      setMarkerPosition(updatedPosition);
      setMapCenter(updatedPosition);
    }
  };

  const handleMapClick = (event: MapMouseEvent) => {
    if (event?.detail?.latLng) {
      clickTimeoutRef.current = setTimeout(() => {
        const newLat = event.detail.latLng!.lat;
        const newLng = event.detail.latLng!.lng;
        setMarkerPosition({ lat: newLat, lng: newLng });
        setMapCenter({ lat: newLat, lng: newLng });
      }, 10);
    }
  };

  const handleDragStart = () => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    if (slide.mapDetails === "NONE") {
      setMapDetails(NONE);
    } else if (slide.mapDetails === "MEDIUM") {
      setMapDetails(MEDIUM);
    } else if (slide.mapDetails === "HIGH") {
      setMapDetails(HIGH);
    }
  }, [slide.mapDetails]);

  return (
    <div className="w-full h-full relative">
      <APIProvider apiKey={APIKEY}>
        <Map
          center={mapCenter}
          onCenterChanged={(e) => setMapCenter(e.detail.center)}
          zoom={zoom}
          onZoomChanged={(e) => setZoom(e.detail.zoom)}
          styles={mapDetails}
          disableDefaultUI={true}
          mapTypeControl={false}
          streetViewControl={false}
          zoomControl={true}
          gestureHandling="greedy"
          onClick={handleMapClick}
          onDragstart={handleDragStart}
        >
          <Marker
            position={markerPosition}
            draggable
            onDragEnd={handleDragEnd}
          />

          <div className="absolute flex bottom-20 w-full justify-center">
            <Button
              onClick={() =>
                answerQuestion([
                  markerPosition.lat.toString(),
                  markerPosition.lng.toString(),
                ])
              }
              className="w-fit text-xl"
            >
              Svara
            </Button>
          </div>
        </Map>
      </APIProvider>
    </div>
  );
}
