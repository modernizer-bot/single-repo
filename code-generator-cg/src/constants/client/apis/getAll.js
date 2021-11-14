const getAll = `export async function @@API_FUNCTION_NAME@@({limit, offset, sort, drt}) {
  const queryString = \`?limit=\${limit}&offset=\${offset}&sort=\${sort}&drt=\${drt}\`;
  const result = await fetch(
    \`\${url}/api/@@BASE_URL@@\${queryString}\`,
    {
      method: "GET",
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

module.exports = { getAll };
