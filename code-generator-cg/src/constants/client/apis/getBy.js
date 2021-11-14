const getBy = `export async function @@API_FUNCTION_NAME@@({limit, offset, sort, drt, @@ARGUMENTS@@}) {
  const queryString = \`?limit=\${limit}&offset=\${offset}&sort=\${sort}&drt=\${drt}&@@QUERY_STRING@@\`;
  const result = await fetch(
    \`\${url}/api/@@BASE_URL@@/@@URL_PATH@@\${queryString}\`,
    {
      method: "GET",
    }
  );
  const body = await result.json();
  if (result.ok) {
    return body;
  }
  throw new Error(body.message);
}
`;

module.exports = { getBy };
