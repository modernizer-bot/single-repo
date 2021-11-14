const deleteBy = `export async function @@API_FUNCTION_NAME@@({@@ARGUMENTS@@}) {
  const queryString = \`?@@QUERY_STRING@@\`;
  const result = await fetch(
    \`\${url}/api/@@BASE_URL@@/@@URL_PATH@@\${queryString}\`,
    {
      method: "DELETE",
      headers: getHeaders(),
    }
  );
  const body = await result.json();
  if (result.ok) {
    return body;
  }
  throw new Error(body.message);
}
`;

module.exports = {  deleteBy };
