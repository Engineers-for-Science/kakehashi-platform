import { NextResponse } from "next/server";

const fetchAccessToken = async (authorizationCode: string) => {
  const tokenEndpoint = "https://www.linkedin.com/oauth/v2/accessToken";
  const clientId = "86h4m01yn21lk0";
  const clientSecret = "JXM7YpkvbqOAmKV0";
  const redirectUri =
    "https://kakehashi-platform.vercel.app/api/sessionLoginLinkedIn";

  const requestBody = new URLSearchParams();
  requestBody.append("grant_type", "authorization_code");
  requestBody.append("code", authorizationCode);
  requestBody.append("redirect_uri", redirectUri);
  requestBody.append("client_id", clientId);
  requestBody.append("client_secret", clientSecret);

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: requestBody.toString(),
  });

  const credential = await response.json();

  if (response.ok) {
    return credential;
  } else {
    throw new Error(
      credential.error_description || "Unable to fetch access token"
    );
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code")!;

  const credential = await fetchAccessToken(code);

  return NextResponse.json({
    status: "201",
    message: "Session created.",
    credential: credential,
  });
}
