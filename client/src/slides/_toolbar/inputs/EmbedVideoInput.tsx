import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Link, MinusIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EmbedVideoInputProps } from "../../info/Toolbar";
import { getYoutubeThumbnailUrl, validateYoutubeUrl } from "../../info/utils";

function EmbedVideoInput({ slide, onSlideUpdate }: EmbedVideoInputProps) {
  const [embedVideoUrl, setEmbedVideoUrl] = React.useState<string>(
    slide.embedVideoUrl || "",
  );
  const [error, setError] = React.useState<string | null>(null);
  const [debouncedValue, setDebouncedValue] = React.useState<string>(
    embedVideoUrl || "",
  );

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(embedVideoUrl);
      if (embedVideoUrl && !validateYoutubeUrl(embedVideoUrl)) {
        setError("Invalid YouTube URL");
      } else {
        setError(null);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [embedVideoUrl]);

  React.useEffect(() => {
    setEmbedVideoUrl(slide.embedVideoUrl || "");
  }, [slide.embedVideoUrl]);

  const handleEmbedVideoUrl = () => {
    if (!debouncedValue || !validateYoutubeUrl(debouncedValue)) return;
    if (debouncedValue === slide.embedVideoUrl) return;
    onSlideUpdate({ ...slide, embedVideoUrl: debouncedValue });
  };

  const handleEmbedVideoUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmbedVideoUrl(e.target.value);
    },
    [],
  );

  const handleRemoveEmbeddedVideo = useCallback(() => {
    onSlideUpdate({ ...slide, embedVideoUrl: "" }); // Remove embedded video
  }, [onSlideUpdate, slide]);

  return (
    <div className="space-y-1 w-full">
      <div className="flex flex-row items-center space-x-1">
        <Link size={16} />
        <Label>Embed YouTube Video</Label>
      </div>
      <div className="flex w-full max-w-sm items-center justify-between">
        {slide.embedVideoUrl && (
          <img
            src={getYoutubeThumbnailUrl(slide.embedVideoUrl)}
            alt="Youtube Thumbnail"
            className="h-12 w-20"
          />
        )}
        {!slide.embedVideoUrl && (
          <Input
            value={embedVideoUrl || ""}
            onChange={handleEmbedVideoUrlChange}
            placeholder="https://www.youtube.com/watch?v=..."
            className={`font-bold ${error ? "border-red-500" : ""}`}
          />
        )}
        <div className="flex items-center ml-2 gap-2 justify-end">
          {!slide.embedVideoUrl && (
            <Button
              variant="outline"
              className="w-auto h-auto"
              onClick={handleEmbedVideoUrl}
              disabled={!debouncedValue || !!error}
            >
              Embed
            </Button>
          )}
          {slide.embedVideoUrl && (
            <Button
              variant="destructive"
              className="w-auto h-auto"
              onClick={handleRemoveEmbeddedVideo}
            >
              <MinusIcon className="" />
              Remove
            </Button>
          )}
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default EmbedVideoInput;
