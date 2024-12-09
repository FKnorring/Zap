import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LocateItSlide, mapDetails, awardPointsLocation } from "@/models/Quiz";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Map, Trophy } from "lucide-react";

export function LocateItInputs({
  slide,
  onSlideUpdate,
}: {
  slide: LocateItSlide;
  onSlideUpdate: (slide: LocateItSlide) => void;
}) {
  const handleLocationChange = (type: "lat" | "lng", value: string) => {
    const numberValue = Number(value);
    if (isNaN(numberValue)) return; // Ignore invalid number input
    if (type === "lat" && (numberValue < -90 || numberValue > 90)) return; // Latitude range
    if (type === "lng" && (numberValue < -180 || numberValue > 180)) return; // Longitude range

    const updatedSlide = {
      ...slide,
      location: { ...slide.location, [type]: numberValue },
    };
    onSlideUpdate(updatedSlide);
  };

  const handleSelectChange = (type: "map" | "points", value: string) => {
    if (type === "map") {
      const updatedSlide = {
        ...slide,
        mapDetails: value as mapDetails,
      };
      onSlideUpdate(updatedSlide);
    } else {
      const updatedSlide = {
        ...slide,
        awardPointsLocation: value as awardPointsLocation,
      };
      onSlideUpdate(updatedSlide);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="block text-lg font-semibold">LocateIt Settings</Label>
      <div className="flex flex-col space-y-2">
        <div className="space-y-1">
          <div className="flex flex-row items-center space-x-1">
            <Map size={17} />
            <Label>Map Details</Label>
          </div>
          <Select
            value={slide.mapDetails}
            onValueChange={(value) => handleSelectChange("map", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {(() => {
                  switch (slide.mapDetails) {
                    case "NONE":
                      return "None";
                    case "MEDIUM":
                      return "Medium";
                    case "HIGH":
                      return "High";
                    default:
                      return "Select Map Details";
                  }
                })()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NONE">
                <h1 className="font-bold">None</h1>
                <h1>This map shows no details at all.</h1>
              </SelectItem>
              <SelectItem value="MEDIUM">
                <h1 className="font-bold">Medium</h1>
                <h3>This map shows some details, such as land borders.</h3>
              </SelectItem>
              <SelectItem value="HIGH">
                <h1 className="font-bold">High</h1>
                <h3>
                  This map has high details, showing borders and large roads.
                </h3>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <div className="flex flex-row items-center space-x-1">
            <Trophy size={17} />
            <Label>Award Points</Label>
          </div>
          <Select
            value={slide.awardPointsLocation}
            onValueChange={(value) => handleSelectChange("points", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {(() => {
                  switch (slide.awardPointsLocation) {
                    case "RADIUS":
                      return "Inside Radius";
                    case "DISTANCE":
                      return "Distance Based";
                    case "CLOSEST":
                      return "Closest Wins";
                    default:
                      return "Select Award Points";
                  }
                })()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DISTANCE">
                <h1 className="font-bold">Distance Based</h1>
                <h3>
                  Participants will be awarded 0-100% of the points based on
                  their distance from the location.
                </h3>
              </SelectItem>
              <SelectItem value="RADIUS">
                <h1 className="font-bold">Inside Radius</h1>
                <h3>
                  Every participant within the radius will be awarded the
                  selected points.
                </h3>
              </SelectItem>
              <SelectItem value="CLOSEST">
                <h1 className="font-bold">Closest Wins</h1>
                <h3>
                  Only the closest player to the correct location will be
                  awarded points.
                </h3>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {slide.awardPointsLocation !== "CLOSEST" && (
          <div className="flex items-center">
            <Label className="pr-2 ">Radius</Label>
            <Input
              value={slide.radius}
              onChange={(e) => {
                const numberValue = Number(e.target.value);
                const updatedSlide = {
                  ...slide,
                  radius: numberValue, // Update the correctAnswer
                };
                onSlideUpdate(updatedSlide); // Trigger the slide update
              }}
              placeholder="Enter the correct answer..."
            />
          </div>
        )}
        <div className="flex flex-row space-x-3 items-center">
          <Label className="text-sm">Latitude</Label>
          <Input
            type="number"
            value={slide.location.lat}
            onChange={(e) => handleLocationChange("lat", e.target.value)}
            placeholder="Enter latitude (-90 to 90)"
          />
          <Label className="text-sm">Longitude</Label>
          <Input
            type="number"
            value={slide.location.lng}
            onChange={(e) => handleLocationChange("lng", e.target.value)}
            placeholder="Enter longitude (-180 to 180)"
          />
        </div>
      </div>
    </div>
  );
}
