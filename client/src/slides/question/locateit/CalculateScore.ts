import { LocateItSlide } from "@/models/Quiz";
import { CalculateScoreProps } from "@/slides";


interface CalculateDistanceProps {
    coords1: {lat: number, lng: number};
    coords2: {lat: number, lng: number};
}

function CalculateDistance({ coords1, coords2 }: CalculateDistanceProps) {
  // First calculate the distance using the Haversine formula
  function toRad(x: number) {
    return (x * Math.PI) / 180;
  }

  const lon1 = coords1.lng;
  const lat1 = coords1.lat;

  const lon2 = coords2.lng;
  const lat2 = coords2.lat;

  const R = 6371; // Radius of the Earth in km
  const x1 = lat2 - lat1;
  const dLat = toRad(x1);
  const x2 = lon2 - lon1;
  const dLon = toRad(x2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  const distance = d * 1000; // Distance in meters

  return distance;
}

export function CalculateScore({
  slide,
  participants,
}: CalculateScoreProps<LocateItSlide>): number[] {
  console.log(slide, participants);

  const correctLocation = slide.location;

  const distances = participants.map((participant) => {
    const latestAnswer =
      participant.answers.length > 0
        ? participant.answers[participant.answers.length - 1].answer
        : { 0: 0, 1: 0 };
    console.log(latestAnswer);
    console.log(correctLocation);
    const lat = Number(latestAnswer[0]);
    const lng = Number(latestAnswer[1]);
    const distance = CalculateDistance({
      coords1: { lat, lng },
      coords2: correctLocation,
    });
    return distance;
  });

  console.log(distances);

  if (slide.awardPointsLocation === "DISTANCE") {
    return distances.map(
      (distance) =>
        distance <= slide.radius
          ? Math.floor(slide.points * (1 - distance / slide.radius))
          : 0
    );
  }

  if (slide.awardPointsLocation === "RADIUS") {
    return distances.map((distance) =>
      distance <= slide.radius ? slide.points : 0
    );
  }


  console.log("Closest based points");
  return distances.map(
    (distance) => (distance === Math.min(...distances) ? slide.points : 0)
  );
}
