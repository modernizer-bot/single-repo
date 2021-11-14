const post = `static async post(entity = {}) {
  const result = await fetch(\`\${Helper.serviceUrl}/api/@@BASE_URL@@\`, {
    method: "POST",
    headers: Helper.getHeaders(),
    body: JSON.stringify(entity),
    credentials: "include",
  });
  const body = await result.json();
  const isOk = body && body.data && body.data.code ? body.data.code == "1" : true;
  if (result.ok && isOk) {
    return body;
  }
  if(body.data.code =="999"){
   return Helper.shouldRedirect(); 
  }
  throw new Error(body.data.message);
}
`;

module.exports = post;
