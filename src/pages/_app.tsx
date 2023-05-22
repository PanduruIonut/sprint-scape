import { type AppType } from "next/app";
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import { useRouter } from "next/router";
import { ChakraProvider } from "@chakra-ui/react";
import { Toaster } from "react-hot-toast";

const publicPages = ["/sign-in/[[...index]]", "/sign-up/[[...index]]"];

const MyApp: AppType = ({ Component, pageProps }) => {

  const { pathname } = useRouter();

  const isPublicPage = publicPages.includes(pathname);
  return (
    <ClerkProvider {...pageProps}>
      <ChakraProvider>
        {isPublicPage ? (
          <Component {...pageProps} />
        ) : (
          <>
            <SignedIn>
              <Component {...pageProps} />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        )}
        <Toaster position="bottom-center" />
      </ChakraProvider>
    </ClerkProvider>
  )
};

export default api.withTRPC(MyApp);
