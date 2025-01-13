import { LocateItSlide, Participant } from '@/models/Quiz';
import { CalculateScore } from './CalculateScore';

const getRandomNearbyCoordinate = (
  center: google.maps.LatLngLiteral,
  radiusMeters: number
) => {
  const randomDistance = Math.random() * radiusMeters; 
  const randomAngle = Math.random() * 2 * Math.PI; 
  const earthRadius = 6378137; 

  const offsetLat = randomDistance * Math.cos(randomAngle) / earthRadius;
  const offsetLng =
    randomDistance * Math.sin(randomAngle) / 
    (earthRadius * Math.cos((center.lat * Math.PI) / 180));

  return {
    lat: center.lat + offsetLat * (180 / Math.PI),
    lng: center.lng + offsetLng * (180 / Math.PI),
  };
};

export const generateMockParticipants = (
  slide: LocateItSlide,
  count: number
): Participant[] => {
  const participants = Array.from({ length: count }, (_, index) => {
    const randomLocation = getRandomNearbyCoordinate(slide.location, slide.radius);

    return {
      participantId: `participant-${index + 1}`,
      name: `Participant ${index + 1}`,
      avatar: `avatar-${index + 1}`,
      answers: [
        {
          answer: [randomLocation.lat.toFixed(6), randomLocation.lng.toFixed(6)],
          slideNumber: 0,
          time: new Date().toISOString(),
        },
      ],
      score: [0], 
      tempAnswer: { tempAnswer: 'placeholder', time: '0' },
      hasAnswered: true,
      collectionName: 'botttsNeutral',
    };
  });

  const scores = CalculateScore({ slide, participants });

  participants.forEach((participant, index) => {
    participant.score = [scores[index]];
  });

  return participants;
};
