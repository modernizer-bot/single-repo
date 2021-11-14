const execute = `export async function @@API_FUNCTION_NAME@@({@@ARGUMENTS@@}) {
  const result = await fetch(\`\${url}/api/@@BASE_URL@@\`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({@@ARGUMENTS@@}),
  });
  const body = await result.json();
  if (result.ok) {
    return body;
  }
  throw new Error(body.message);
}
`;

module.exports = { execute };
