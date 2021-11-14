const post = `export async function @@API_FUNCTION_NAME@@(entity = {}) {
  const result = await fetch(\`\${url}/api/@@BASE_URL@@\`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(entity),
  });
  const body = await result.json();
  if (result.ok) {
    return body;
  }
  throw new Error(body.message);
}
`;

module.exports = { post };
