// 7788a9dcb03871a8c6a87123e3055126
export async function selectAnyObjectByAnyColumnAndAnyOp({
    object, column, operator, orderByColumn, orderByDirection, columnValue, offset, limit
  }) {
    const res = await fetch("http://localhost:4000/api/selectAnyObjectByAnyColumnAndAnyOp", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        object, column, operator, orderByColumn, orderByDirection, columnValue, offset, limit
      }),
    });
    if (!res.ok) {
      throw new Error(`Http request return code is not OK: ${res.ok}`);
    }
    const body = await res.json();
    return body;
  }
  