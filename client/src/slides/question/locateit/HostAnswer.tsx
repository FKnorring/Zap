import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import React, { useEffect, useState } from 'react';
import { LocateItSlide, Participant } from '@/models/Quiz';
import { Circle } from './_circle';
import Avatar, { genConfig } from 'react-nice-avatar';
import { Polyline } from './_polyline';
import NextSlide from '@/slides/_components/NextSlide';

const mockData: Participant[] = [
  {
    participantId: 'DsMCalNtbSK8vCnEpnT59',
    name: 'Nisse',
    avatar: 'EROHNv5Xbi',
    answers: [
      {
        answer: ['0', '0'],
        slideNumber: 0,
        time: '2024-12-02T17:28:30.902Z',
      },
    ],
    tempAnswer: { tempAnswer: 'hej', time: '0' },
    score: [0],
    hasAnswered: true,
  },
  {
    participantId: 'LKFJJSD',
    name: 'LångtNamnYaoo',
    avatar: 'LKFJJSDEROHNv5Xbi',
    answers: [
      {
        answer: ['1', '1'],
        slideNumber: 2,
        time: '2024-12-02T17:30:00.000Z',
      },
    ],
    score: [2000],
    tempAnswer: { tempAnswer: 'hej', time: '0' },
    hasAnswered: false,
  },
];

export function HostAnswer({
  slide,
  onNextSlide,
  participants = mockData,
}: {
  slide: LocateItSlide;
  onNextSlide: () => void;
  participants: Participant[];
}) {
  const APIKEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>(
    slide.location
  );
  const [circleRadius, setCircleRadius] = useState<number>(slide.radius);
  const [zoom, setZoom] = useState(6);

  const latestAnswers = participants.map((participant) => {
    const latestAnswer =
      participant.answers.length > 0
        ? participant.answers[participant.answers.length - 1].answer
        : ['??', '??'];
    const latestScore =
      participant.score.length > 0
        ? participant.score[participant.score.length - 1]
        : 0;
    return {
      name: participant.name,
      avatar: participant.avatar,
      id: participant.participantId,
      lat: Number(latestAnswer[0]),
      lng: Number(latestAnswer[1]),
      score: latestScore,
    };
  });

  useEffect(() => {
    setMapCenter(slide.location);
    setCircleRadius(slide.radius);
  }, [slide.location, slide.radius]);

  return (
    <div className="h-dvh w-full relative p-10 ">
      <APIProvider apiKey={APIKEY}>
        <Map
          mapId={slide.id}
          onCenterChanged={(e) => setMapCenter(e.detail.center)}
          onZoomChanged={(e) => setZoom(e.detail.zoom)}
          gestureHandling="greedy"
          disableDefaultUI={true}
          zoomControl={false}
          streetViewControl={false}
          zoom={zoom}
          center={mapCenter}
        >
          <AdvancedMarker position={slide.location}>
            <Pin scale={1.5} />
          </AdvancedMarker>

          {slide.awardPointsLocation !== 'CLOSEST' && (
            <Circle
              center={slide.location}
              radius={circleRadius}
              strokeColor="#008000"
              strokeOpacity={1}
              strokeWeight={2}
              fillColor="#00FF00"
              fillOpacity={0.08}
            />
          )}

          {latestAnswers.map((participant) => {
            const [markerRef, marker] = useAdvancedMarkerRef();

            return (
              <React.Fragment key={participant.id}>
                <AdvancedMarker
                  ref={markerRef}
                  position={{ lat: participant.lat, lng: participant.lng }}
                  style={{
                    border: '2px solid #000000',
                    borderRadius: '50%',
                    touchAction: 'none',
                  }}
                >
                  <InfoWindow
                    anchor={marker}
                    disableAutoPan
                    headerDisabled
                    shouldFocus={true}
                    className="touch-action-none will-change-transform select-none"
                  >
                    <div className="text-lg flex flex-col items-center font-display text-black">
                      <p>
                        {participant.name}
                        {slide.awardPointsLocation === 'DISTANCE' &&
                          ' :' + participant.score}
                      </p>
                    </div>
                  </InfoWindow>
                  <Avatar
                    style={{ width: '3rem', height: '3rem' }}
                    {...genConfig(participant.avatar)}
                  />
                </AdvancedMarker>
                <Polyline
                  path={[
                    slide.location,
                    { lat: participant.lat, lng: participant.lng },
                  ]}
                  strokeColor={participant.score > 0 ? '#008000' : '#FF0000'}
                />
              </React.Fragment>
            );
          })}
        </Map>
      </APIProvider>
      <NextSlide onClick={onNextSlide} />
    </div>
  );
}
