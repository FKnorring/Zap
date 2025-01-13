import { useMemo, useState, useEffect } from 'react';

export enum BackgroundStyle {
  Waves = 'waves',
  Blob = 'blob',
  BlobInverted = 'blobInverted',
  Circle = 'circle',
  Solid = 'solid',
}

interface QuizBackgroundProps {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  className?: string;
  style?: BackgroundStyle;
  isDynamic?: boolean; // New prop to trigger dynamic resizing
}

export function QuizBackground({
  primaryColor = '#006a67',
  secondaryColor = '#498e77',
  backgroundColor = '#000B58',
  className,
  style = BackgroundStyle.BlobInverted,
  isDynamic = false, // Default to false
}: QuizBackgroundProps) {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Update dimensions on window resize if isDynamic is true
  useEffect(() => {
    if (isDynamic) {
      const handleResize = () => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      };
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isDynamic]);

  const svgContent = useMemo(() => {
    const getWavesSvg = () => {
      const colors = [
        backgroundColor,
        primaryColor,
        interpolateColor(primaryColor, secondaryColor, 0.33),
        interpolateColor(primaryColor, secondaryColor, 0.66),
        secondaryColor,
      ];

      return `
                  <svg id="visual" viewBox="0 0 960 540" xmlns="http://www.w3.org/2000/svg" version="1.1">
                      <rect x="0" y="0" width="960" height="540" fill="${colors[0]}"></rect>
                      <path d="M0 333L22.8 337.5C45.7 342 91.3 351 137 356.8C182.7 362.7 228.3 365.3 274 369C319.7 372.7 365.3 377.3 411.2 373C457 368.7 503 355.3 548.8 345.3C594.7 335.3 640.3 328.7 686 327.2C731.7 325.7 777.3 329.3 823 339.7C868.7 350 914.3 367 937.2 375.5L960 384L960 541L937.2 541C914.3 541 868.7 541 823 541C777.3 541 731.7 541 686 541C640.3 541 594.7 541 548.8 541C503 541 457 541 411.2 541C365.3 541 319.7 541 274 541C228.3 541 182.7 541 137 541C91.3 541 45.7 541 22.8 541L0 541Z" fill="${colors[1]}"></path>
                      <path d="M0 427L22.8 418.7C45.7 410.3 91.3 393.7 137 385.7C182.7 377.7 228.3 378.3 274 386.2C319.7 394 365.3 409 411.2 405.3C457 401.7 503 379.3 548.8 379C594.7 378.7 640.3 400.3 686 410.8C731.7 421.3 777.3 420.7 823 417.5C868.7 414.3 914.3 408.7 937.2 405.8L960 403L960 541L937.2 541C914.3 541 868.7 541 823 541C777.3 541 731.7 541 686 541C640.3 541 594.7 541 548.8 541C503 541 457 541 411.2 541C365.3 541 319.7 541 274 541C228.3 541 182.7 541 137 541C91.3 541 45.7 541 22.8 541L0 541Z" fill="${colors[2]}"></path>
                      <path d="M0 445L22.8 440.2C45.7 435.3 91.3 425.7 137 420.7C182.7 415.7 228.3 415.3 274 420.2C319.7 425 365.3 435 411.2 436.5C457 438 503 431 548.8 428.5C594.7 426 640.3 428 686 429.2C731.7 430.3 777.3 430.7 823 433.3C868.7 436 914.3 441 937.2 443.5L960 446L960 541L937.2 541C914.3 541 868.7 541 823 541C777.3 541 731.7 541 686 541C640.3 541 594.7 541 548.8 541C503 541 457 541 411.2 541C365.3 541 319.7 541 274 541C228.3 541 182.7 541 137 541C91.3 541 45.7 541 22.8 541L0 541Z" fill="${colors[3]}"></path>
                      <path d="M0 500L22.8 498.3C45.7 496.7 91.3 493.3 137 494C182.7 494.7 228.3 499.3 274 502.2C319.7 505 365.3 506 411.2 504.2C457 502.3 503 497.7 548.8 497.3C594.7 497 640.3 501 686 503.8C731.7 506.7 777.3 508.3 823 508.7C868.7 509 914.3 508 937.2 507.5L960 507L960 541L937.2 541C914.3 541 868.7 541 823 541C777.3 541 731.7 541 686 541C640.3 541 594.7 541 548.8 541C503 541 457 541 411.2 541C365.3 541 319.7 541 274 541C228.3 541 182.7 541 137 541C91.3 541 45.7 541 22.8 541L0 541Z" fill="${colors[4]}"></path>
                  </svg>
              `;
    };

    // Adjust for dynamic size based on device width and height
    const width = isDynamic ? dimensions.width * 2 : 1920;
    const height = isDynamic ? dimensions.height * 2 : 1080;

    switch (style) {
      case 'waves':
        return getWavesSvg();
      case 'blob':
        return `
              <svg id="visual" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" version="1.1">
                <rect x="0" y="0" width="${width}" height="${height}" fill="${backgroundColor}"></rect>
                <g transform="translate(${width / 2} ${height / 2})">
                  <path d="M186.2 -104.8C216.5 -55 199.2 25 160.2 86.3C121.2 147.7 60.6 190.3 -5.9 193.8C-72.5 197.2 -144.9 161.3 -164.4 111.2C-183.9 61.2 -150.4 -3.2 -114.2 -56.4C-77.9 -109.7 -39 -151.8 19.5 -163.1C77.9 -174.3 155.9 -154.7 186.2 -104.8" fill="${primaryColor}"></path>
                </g>
              </svg>
            `;
      case 'blobInverted':
        return `
          <svg id="visual" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" version="1.1">
            <rect x="0" y="0" width="${width}" height="${height}" fill="${backgroundColor}"></rect>
            <g transform="translate(${width}, 0)">
              <path d="M0 378C-66.4 368.3 -132.7 358.5 -189 327.4C-245.3 296.2 -291.5 243.6 -321.3 185.5C-351.1 127.4 -364.6 63.7 -378 0L0 0Z" fill="${primaryColor}"></path>
            </g>
            <g transform="translate(0, ${height})">
              <path d="M0 -378C33 -311.4 66 -244.9 128 -221.7C190 -198.5 280.9 -218.7 327.4 -189C373.8 -159.3 375.9 -79.6 378 0L0 0Z" fill="${primaryColor}"></path>
            </g>
          </svg>
        `;
      case 'circle':
        return `
                        <svg id="visual" viewBox="0 0 960 540" xmlns="http://www.w3.org/2000/svg" version="1.1">
                            <rect x="0" y="0" width="960" height="540" fill="${backgroundColor}"></rect>
                            <g fill="${primaryColor}">
                                <circle r="145" cx="165" cy="298"></circle>
                                <circle r="64" cx="478" cy="501"></circle>
                                <circle r="127" cx="684" cy="7"></circle>
                                <circle r="127" cx="799" cy="314"></circle>
                                <circle r="73" cx="295" cy="39"></circle>
                            </g>
                        </svg>
                    `;
      default:
        return '';
    }
  }, [
    primaryColor,
    secondaryColor,
    backgroundColor,
    style,
    isDynamic,
    dimensions,
  ]);

  const dataUrl = useMemo(() => {
    return `data:image/svg+xml;base64,${btoa(svgContent || '')}`;
  }, [svgContent]);

  return (
    <div
      className={className}
      style={{
        backgroundImage: `url("${dataUrl}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100%',
      }}
    />
  );
}

// Helper functions (unchanged)
function interpolateColor(color1: string, color2: string, factor: number) {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  const r = Math.round(c1.r + (c2.r - c1.r) * factor);
  const g = Math.round(c1.g + (c2.g - c1.g) * factor);
  const b = Math.round(c1.b + (c2.b - c1.b) * factor);

  return rgbToHex(r, g, b);
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
