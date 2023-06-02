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

  const defaultUrl = "http://localhost:3001";

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

   return fetch(url, requestOptions).then((response) => {
     if (response.ok) {
       return response.json();
     } else {
       throw new Error(`Request failed with status ${response.status}`);
     }
   });
}

// Exportez la fonction makeRequest 
export default makeRequest;
