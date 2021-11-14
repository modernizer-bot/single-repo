// 5b1e7322f4aa4360a8dac74f05da1add
export async function selectUserByUsernameIlike({
    orderByColumn, orderByDirection, usernameIlike, offset, limit
  }) {
    const res = await fetch("http://localhost:4000/api/selectUserByUsernameIlike", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        orderByColumn, orderByDirection, usernameIlike, offset, limit
      }),
    });
    if (!res.ok) {
      throw new Error(`Http request return code is not OK: ${res.ok}`);
    }
    const body = await res.json();
    return body;
  }
  