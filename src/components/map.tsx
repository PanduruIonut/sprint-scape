import React, { useEffect, useRef } from "react";



export function Map({
    center,
    zoom,
}: {
    center: google.maps.LatLngLiteral;
    zoom: number;
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!window) return
        if (!ref.current) return
        new window.google.maps.Map(ref.current, {
            center,
            zoom,
        });
    });

    return <div ref={ref} id="map" style={{ width: "650px", height: "650px" }} />;
}
