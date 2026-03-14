import be_endpoint from "../../constants.js"

const sendSignatureService = async ({challengeId, signature}) => {
  const response = await fetch(be_endpoint + "/Private/compareSignature", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "challengeId": challengeId,
      "signature": signature
    })
  });

  const data = await response.json();
  
};

export default sendSignatureService;