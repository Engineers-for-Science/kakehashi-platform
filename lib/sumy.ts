const createSummaryByURL = async (targetUrl: string) => {
  const apiEndpoint = `https://radiant-bastion-00842-4c8a23b99d07.herokuapp.com/url?url=${targetUrl}&length=10`;
  const headers = {
    Accept: "application/json",
  };
  try {
    const response = await fetch(apiEndpoint, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`fetchReadme ${response.status.toString()}`);
    }

    return await response.text();
  } catch (error) {
    console.log("Error", error);
  }
};

export { createSummaryByURL };
