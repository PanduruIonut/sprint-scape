import { Input } from "@chakra-ui/react";
import { type Venue } from "@prisma/client";
import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import VenueCard from "../molecules/venueCard";

const MyMasonryLayout = ({ items, promotedVenues }: { items: Venue[], promotedVenues: Venue[] }) => {
    const breakpointColumnsObj = {
        default: 3,
        1100: 2,
        700: 1
    };

    const [venues, setVenues] = useState<Venue[]>(items);
    const [promoVenues, setPromoVenues] = useState<Venue[]>(promotedVenues);
    const [searchQuery, setSearchQuery] = useState<string>("");


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

    useEffect(() => {
        setPromoVenues(promotedVenues);
    }, [promotedVenues]);

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
                    <VenueCard key={index} venue={item} />
                ))}
                {promoVenues?.map((item, index) => (
                    <VenueCard key={index} venue={item} isPromo />
                ))}
            </Masonry>
        </div>
    );
};

export default MyMasonryLayout;
