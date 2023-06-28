import { api } from "@/utils/api";
import { Box, Image, Input } from "@chakra-ui/react";
import { type Venue } from "@prisma/client";
import router from "next/router";
import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";

const MyMasonryLayout = ({ items, facility }: { items: Venue[], facility: string }) => {
    const breakpointColumnsObj = {
        default: 3,
        1100: 2,
        700: 1
    };

    const [hoveredIndex, setHoveredIndex] = useState<null | number>(null);
    const [venues, setVenues] = useState<Venue[]>(items);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const venuesPictures = api.aws.getAllFacilityVenuesPicturesSignedUrls.useQuery({ facilityId: facility });

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = items.filter((item) => {
            return item.name.toLowerCase().includes(query);
        });

        setVenues(filtered);
    };
    useEffect(() => {
        setVenues(items);
    }, [items]);

    return (
        <div
            style={{
                minWidth: "1000px",
                minHeight: "600px",
                maxWidth: "1000px",
                margin: "0 auto",
                paddingLeft: "20px",
                paddingRight: "20px",
                marginBottom: "20px",
                maxHeight: "calc(100vh - 200px)",
                overflowY: "auto",
                background: "transparent",
                transition: "all 0.3s ease"
            }}
        >
            <div
                style={{
                    marginBottom: "10px",
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                    background: "white",
                    padding: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Input
                    placeholder="Search"
                    size="sm"
                    width="50%"
                    marginTop={0}
                    style={{ borderRadius: "27px", textAlign: "center", transition: "inherit" }}
                    onChange={handleSearch}
                    value={searchQuery}
                />
            </div>
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
                style={{
                    backdropFilter: "blur(8px)"
                }}
            >
                {venues?.map((item, index) => (
                    <Box
                        key={index}
                        p={1}
                        width={"100%"}
                        maxWidth="600px"
                        position="relative"
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onClick={() => {
                            void router.push(`/facilities/${facility}/venues/${item.id}`);
                        }}
                    >
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
                            {item?.name}
                        </Box>
                        <Image
                            src={venuesPictures?.data?.find((pic) => pic.venueId === item.id)?.url ?? "https://via.placeholder.com/300x200.png?text=No+Image+Available"}
                            alt=""
                            objectFit="cover"
                            height="200px"
                        />
                        {hoveredIndex === index && (
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
                                <span>Capacity: {item.maxPlayersCapacity}</span>
                                <span>Address: {item.address}</span>
                                <span>{item.type}</span>
                            </Box>
                        )}
                    </Box>
                ))}
            </Masonry>
        </div>
    );
};

export default MyMasonryLayout;
