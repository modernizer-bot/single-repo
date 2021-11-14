const putBy = `static async @@SERVICE_METHOD_NAME@@(@@ARGUMENTS@@ = {}, entity = {}) {
  const queryString = \`?@@QUERY_STRING@@\`;
  const result = await fetch(
    \`\${Helper.serviceUrl}/api/@@BASE_URL@@/@@URL@@\${queryString}\`,
    {
      method: "PUT",
      headers: Helper.getHeaders(),
      body: JSON.stringify(entity),
      credentials: "include",
    }
  );
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

module.exports = putBy;
