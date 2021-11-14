const apiTemplate = `export async function @@API_FUNCTION_NAME@@({
    @@IDENTIFIERS_AND_PARAMETERS@@
  }) {
    const res = await fetch("@@BASE_URL@@@@URL_PATH@@", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        @@IDENTIFIERS_AND_PARAMETERS@@
      }),
    });
    if (!res.ok) {
      throw new Error(\`Http request return code is not OK: \${res.ok}\`);
    }
    const body = await res.json();
    return body;
  }
  `;

module.exports = { apiTemplate };
