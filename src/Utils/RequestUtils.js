async function makeRequest(
  path,
  method = "GET",
  headers = {},
  body = null,
  options = { mode: "cors" },
  xsrfToken = false
) {
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const mergedHeaders = {
    ...defaultHeaders,
    ...headers,
  };

  const defaultUrl = "https://iseevision.fr/";

  const url = defaultUrl + path;

  if (xsrfToken) {
    mergedHeaders.append("x-xsrf-token", localStorage.getItem("xsrfToken"));
  }

  const requestOptions = {
    method: method.toUpperCase(),
    headers: new Headers(mergedHeaders),
    credentials: "include",
    ...options,
  };

  if (body) {
    requestOptions.body = JSON.stringify(body);
  }

  return fetch(url, requestOptions)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Erreur lors de la requête :", error);
    });
}

// Exportez la fonction makeRequest 
export default makeRequest;
