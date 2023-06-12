async function makeRequest(
  path,
  method = "GET",
  headers = {},
  body = null,
  options = { mode: "cors" },
  xsrfToken = false
) {
  let defaultHeaders = {};

  if (body) {
    if (typeof body === "object" && !(body instanceof FormData)) {
      defaultHeaders["Content-Type"] = "application/json";
    }
  } else {
    defaultHeaders["Content-Type"] = "application/json";
  }

  const mergedHeaders = {
    ...defaultHeaders,
    ...headers,
  };

  console.log(mergedHeaders);

  let defaultUrl = "https://iseevision.fr/";

  if (process.env.REACT_APP_ENVIRONMENT === "development") {
    defaultUrl = "/";
  } else if (process.env.REACT_APP_ENVIRONMENT === "localhost") {
    defaultUrl = "http://localhost:3001/";
  }

  const url = defaultUrl + path;

  if (xsrfToken) {
    mergedHeaders["x-xsrf-token"] = localStorage.getItem("xsrfToken");
  }

  const requestOptions = {
    method: method.toUpperCase(),
    headers: new Headers(mergedHeaders),
    credentials: "include",
    ...options,
  };

  if (body) {
    if (body instanceof FormData) {
      requestOptions.body = body;
    } else if (typeof body === "object") {
      requestOptions.body = JSON.stringify(body);
    }
  }

  return await fetch(url, requestOptions).then((response) => {
    if (response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return response.json();
      } else {
        return response.text();
      }
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  });
}

// Exportez la fonction makeRequest
export default makeRequest;
