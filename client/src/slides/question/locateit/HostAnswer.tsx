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
import Avatar from '@/Avatar';
import { Polyline } from './_polyline';
import NextSlide from '@/slides/_components/NextSlide';
import { generateMockParticipants } from './mockData';

export function HostAnswer({
  slide,
  onNextSlide,
  onPrevSlide,
  endQuiz,
  quizCode,
  participants: providedParticipants,
}: {
  slide: LocateItSlide;
  onNextSlide: () => void;
  onPrevSlide: () => void;
  participants?: Participant[];
  endQuiz: (quizCode: string) => Promise<boolean>;
  quizCode: string;
}) {
  const APIKEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const [participants, setParticipants] = useState<Participant[]>(
    providedParticipants || generateMockParticipants(slide, 5)
  );

  useEffect(() => {
    if (!providedParticipants) {
      setParticipants(generateMockParticipants(slide, 5));
    }
  }, [slide.location, providedParticipants, slide.awardPointsLocation]);

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
      collectionName: participant.collectionName,
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
    <div className="h-dvh w-full relative p-10">
      <APIProvider apiKey={APIKEY}>
        <Map
          mapId={slide.id}
          onCenterChanged={(e) => setMapCenter(e.detail.center)}
          onZoomChanged={(e) => setZoom(e.detail.zoom)}
          gestureHandling="greedy"
          disableDefaultUI
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
                    shouldFocus
                    className="touch-action-none will-change-transform select-none"
                  >
                    <div className="text-lg flex flex-col items-center font-display text-black">
                      <p>
                        {participant.name}
                        {': ' + participant.score}
                      </p>
                    </div>
                  </InfoWindow>
                  <Avatar
                    avatarString={participant.avatar}
                    collectionName={participant.collectionName}
                    height="3rem"
                    width="3rem"
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
      <NextSlide
        quizCode={quizCode}
        endQuiz={() => endQuiz(quizCode)}
        onPrev={onPrevSlide}
        onNext={onNextSlide}
      />
    </div>
  );
}
