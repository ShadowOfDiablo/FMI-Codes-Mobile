import be_endpoint from "../../constants.js";

const registerService = async ({ email, publicKey, pushToken }) => {
  const response = await fetch(be_endpoint + "/Private/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email,
      publicKey: publicKey,
      pushToken: pushToken
    })
  });

  const data = await response.json();
  return data;
};

export default registerService;