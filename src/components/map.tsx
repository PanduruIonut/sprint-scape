import { api } from "@/utils/api";
import { type Facility, Prisma } from "@prisma/client";
import React, { type FC, useCallback, useState, useEffect, useMemo, useRef } from "react";
import FacilityPreview from "./facility/preview";

export const Map: FC<{ center: google.maps.LatLngLiteral; zoom: number }> = ({
    center,
    zoom,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const { data: facilities } = api.facility.getAll.useQuery();
    const [selectedFacility, setSelectedFacility] = useState<Facility>();
    const [map, setMap] = useState<google.maps.Map>();

    const markers = useMemo(() => {
        if (!facilities) return [];
        return facilities.map((facility) => {
            return new google.maps.LatLng({
                lat: new Prisma.Decimal(facility.latitude).toNumber(),
                lng: new Prisma.Decimal(facility.longitude).toNumber()
            });
        })
    }, [facilities]);

    const handleMarkerClick = useCallback(
        (infoWindow: google.maps.InfoWindow, marker: google.maps.Marker) => {
            infoWindow.close();
            infoWindow.setContent("You clicked on the marker!");
            infoWindow.open(marker.getMap(), marker);

            const clickedLatLng = marker.getPosition() as google.maps.LatLng;
            const clickedFacility = facilities?.find((facility) => {
                const facilityLatLng = new google.maps.LatLng({
                    lat: new Prisma.Decimal(facility.latitude).toNumber(),
                    lng: new Prisma.Decimal(facility.longitude).toNumber()
                });
                return facilityLatLng.equals(clickedLatLng);
            });

            setSelectedFacility(clickedFacility);
        },
        [facilities]
    );


    useEffect(() => {
        if (!window || !ref.current) return
        const currentMap = new window.google.maps.Map(ref.current, {
            center,
            zoom,
        });
        setMap(currentMap);
    }, [center, zoom]);

    useEffect(() => {
        if (!map) return;
        const infoWindow = new google.maps.InfoWindow();
        markers.forEach((marker) => {
            const newMarker = new google.maps.Marker({
                position: marker,
                map,
            });
            newMarker.addListener("click", () => {
                handleMarkerClick(infoWindow, newMarker);
            });
        })

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
    }, [handleMarkerClick, map, markers]);

    return (
        <>
            <FacilityPreview facility={selectedFacility} />
            <div ref={ref} id="map" style={{ width: "1250px", height: "550px" }} />
        </>
    );
}
function handleLocationError(_arg0: boolean, _infoWindow: google.maps.InfoWindow) {
    console.warn("Error: The Geolocation service failed.");
}

