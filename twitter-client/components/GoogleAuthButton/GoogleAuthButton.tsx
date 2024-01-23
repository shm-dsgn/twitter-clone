"use client";

import React, { useCallback } from "react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";

interface VerifyGoogleTokenResult {
  verifyGoogleToken: string;
}

const GoogleAuthButton: React.FC = () => {
  const handleLoginWithGoogle = useCallback(
    async (credentialResponse: CredentialResponse) => {
      const googleToken = credentialResponse.credential;
      if (!googleToken) return toast.error("Google Token not found");

      const { verifyGoogleToken } =
        await graphqlClient.request<VerifyGoogleTokenResult>(
          verifyUserGoogleTokenQuery,
          { token: googleToken }
        );

      toast.success("Verification Successful");
      console.log(verifyGoogleToken);

      if (verifyGoogleToken)
        window.localStorage.setItem("__twitter_token", verifyGoogleToken);
    },
    []
  );

  return (
    <div className="pt-8 pl-8">
      <h1 className="mt-4 text-lg font-normal">New here?</h1>
      <h4 className="mb-4 text-sm font-normal">Sign In with Google</h4>
      <GoogleLogin
        onSuccess={handleLoginWithGoogle}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </div>
  );
};

export default GoogleAuthButton;
