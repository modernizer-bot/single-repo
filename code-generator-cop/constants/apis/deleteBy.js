const remove = `static async @@SERVICE_METHOD_NAME@@(@@ARGUMENTS@@ = {}) {
  const queryString = \`?@@QUERY_STRING@@\`;
  const result = await fetch(
    \`\${Helper.serviceUrl}/api/@@BASE_URL@@/@@URL@@\${queryString}\`,
    {
      method: "DELETE",
      headers: Helper.getHeaders(),
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

module.exports = remove;
