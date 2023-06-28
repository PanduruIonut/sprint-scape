import { Box, Image } from "@chakra-ui/react";
import { type Venue } from "@prisma/client";
import { useState } from "react";
import router from "next/router";
import { api } from "@/utils/api";

type VenueCardProps = {
    venue: Venue;
    isPromo?: boolean;
};

const VenueCard = ({ venue, isPromo = false }: VenueCardProps) => {
    const [hovered, setHovered] = useState(false);
    const venuesPictures = api.aws.getAllFacilityVenuesPicturesSignedUrls.useQuery({ facilityId: venue?.facilityId ?? '' });

    const handleCardClick = () => {
        if (venue?.facilityId && venue?.id)
            void router.push(`/facilities/${venue.facilityId}/venues/${venue.id}`);
    };

    return (
        <Box
            p={1}
            width={"100%"}
            maxWidth="600px"
            position="relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={handleCardClick}
        >
            {isPromo && (
                <Box
                    position="absolute"
                    bottom={4}
                    right={4}
                    background="red"
                    color="white"
                    borderRadius="md"
                    padding="2px 6px"
                    fontSize="12px"
                    fontWeight="bold"
                    textTransform="uppercase"
                >
                    Promo
                </Box>
            )}
            <Box
                position="absolute"
                bottom={0}
                left={0}
                width="100%"
                padding="22px"
                color="white"
                textAlign="left"
                borderRadius="md"
                fontSize={30}
            >
                {venue?.name}
            </Box>
            <Image
                src={venuesPictures?.data?.find((pic) => pic.venueId === venue.id)?.url ?? "https://via.placeholder.com/300x200.png?text=No+Image+Available"}
                alt=""
                objectFit="cover"
                height="200px"
            />
            {hovered && (
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    background="rgba(0, 0, 0, 0.7)"
                    padding="8px"
                    color="white"
                    textAlign="center"
                    borderRadius={12}
                    opacity={0}
                    transition="opacity 0.5s ease"
                    flexDirection="column"
                    _hover={{ opacity: 1 }}
                >
                    <span>Capacity: {venue.maxPlayersCapacity}</span>
                    <span>Address: {venue.address}</span>
                    <span>{venue.type}</span>
                </Box>
            )}
        </Box>
    );
};

export default VenueCard;
