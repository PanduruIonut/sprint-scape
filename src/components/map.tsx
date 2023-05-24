import React, { useEffect, useRef } from "react";



export function Map({
    center,
    zoom,
    markers
}: {
    center: google.maps.LatLngLiteral;
    zoom: number;
        markers: (void | google.maps.LatLngLiteral)[];
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!window) return
        if (!ref.current) return
        const map = new window.google.maps.Map(ref.current, {
            center,
            zoom,
        });
        const infoWindow = new google.maps.InfoWindow();
        markers?.forEach((marker) => {
            if (!marker) return console.log("No marker")
            new google.maps.Marker({
                position: marker,
                map,
            });
        });
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position: GeolocationPosition) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    infoWindow.setPosition(pos);
                    map.setCenter(pos);
                    map.setZoom(13);
                    new google.maps.Marker({
                        position: pos,
                        map,
                        label: { text: "You're here!", color: "black", fontSize: "16px" }
                    });
                },
                () => {
                    handleLocationError(true, infoWindow);
                }
            );
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow);
        }
    });

    return <div ref={ref} id="map" style={{ width: "1250px", height: "550px" }} />;
}
function handleLocationError(_arg0: boolean, _infoWindow: google.maps.InfoWindow) {
    throw new Error("Function not implemented.");
}

