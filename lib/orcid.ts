const fetchORCIDAccessToken = async () => {
  const url = "https://sandbox.orcid.org/oauth/token";
  const headers = {
    Accept: "application/json",
  };
  const bodyData = new URLSearchParams({
    client_id: "APP-5A5ZHRGOPGYQE8RL",
    client_secret: "9a79634e-2757-4f4a-8fa2-bb5cbff6e7c9",
    grant_type: "client_credentials",
    scope: "/read-public",
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: bodyData,
    });
    if (!response.ok) {
      throw new Error(`fetchORCIDToken ${response.status.toString()}`);
    }

    const data = await response.json();
    return data.access_token as string;
  } catch (error) {
    console.error("Error", error);
  }
};

const fetchORCRecord = async (orcId: string, accessToken: string) => {
  const url = `https://pub.sandbox.orcid.org/v2.1/${orcId}/record`;
  const headers = {
    "Content-Type": "application/vnd.orcid+json",
    Authorization: `Bearer ${accessToken}`,
  };
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`fetchORCRecord ${response.status.toString()}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error", error);
  }
};

export { fetchORCIDAccessToken, fetchORCRecord };
