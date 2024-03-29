import { type AppType } from "next/app";
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import { useRouter } from "next/router";
import { ChakraProvider } from "@chakra-ui/react";
import { Toaster } from "react-hot-toast";
import { Wrapper } from "@googlemaps/react-wrapper";
import { env } from "@/env.mjs";
import "@fullcalendar/common/main.css";
import Navbar from "@/components/molecules/navbar";
// import "@fullcalendar/daygrid/main.css";
// import "@fullcalendar/timegrid/main.css";

const MyApp: AppType = ({ Component, pageProps }) => {


  return (
    <ClerkProvider>
      <ChakraProvider>
        <Wrapper apiKey={env.NEXT_PUBLIC_GOOGLE_MAPS_API}>
          <Navbar />
          <Component {...pageProps} />
        </Wrapper>
        <Toaster position="bottom-center" />
      </ChakraProvider>
    </ClerkProvider>
  );
};
export default api.withTRPC(MyApp);
