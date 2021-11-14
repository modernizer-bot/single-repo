const putBy = `export async function @@API_FUNCTION_NAME@@({@@ARGUMENTS@@}, entity = {}) {
  const queryString = \`?@@QUERY_STRING@@\`;
  const result = await fetch(
    \`\${url}/api/@@BASE_URL@@/@@URL_PATH@@\${queryString}\`,
    {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(entity),
    }
  );
  const body = await result.json();
  if (result.ok) {
    return body;
  }
  throw new Error(body.message);
}
`;

module.exports = { putBy };
