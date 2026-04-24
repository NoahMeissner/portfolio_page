import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup
} from "react-simple-maps";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Using a lightweight topojson for the world
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export const MapBackground = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Calculate mouse position relative to center of screen, normalized from -1 to 1
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = (e.clientY / window.innerHeight) * 2 - 1;
            setMousePosition({ x, y });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <motion.div
            className="absolute inset-0 pointer-events-auto -z-10 flex items-center justify-center overflow-hidden opacity-60 select-none"
            style={{
                // Mask fades out the edges smoothly
                maskImage: 'radial-gradient(circle at center, black 20%, transparent 70%)',
                WebkitMaskImage: 'radial-gradient(circle at center, black 20%, transparent 70%)',
            }}
            animate={{
                // Move map slightly in opposite direction of mouse
                x: mousePosition.x * -20,
                y: mousePosition.y * -20,
            }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
        >
            <ComposableMap
                projection="geoAzimuthalEqualArea"
                projectionConfig={{
                    rotate: [-12.09, -49.01, 0], // Center exactly on Regensburg
                    center: [0, 0],
                    scale: 1200 // Zoomed in on Central Europe
                }}
                style={{ width: "100%", height: "100%", outline: "none" }}
            >
                <ZoomableGroup zoom={1} center={[0, 0]} filterZoomEvent={(e) => false}>
                    <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map((geo) => (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill="hsl(var(--primary) / 0.05)"
                                    stroke="hsl(var(--primary) / 0.3)"
                                    strokeWidth={0.5}
                                    style={{
                                        default: { outline: "none" },
                                        hover: { outline: "none", fill: "hsl(var(--primary) / 0.15)", transition: "all 0.3s ease" },
                                        pressed: { outline: "none" },
                                    }}
                                />
                            ))
                        }
                    </Geographies>
                </ZoomableGroup>
            </ComposableMap>
        </motion.div>
    );
};
