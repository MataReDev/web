async function makeRequest(
  path,
  method = "GET",
  headers = {},
  body = null,
  options = { mode: "cors" },
  xsrfToken = false,
  onUploadProgress = null
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

  if (body && body instanceof FormData) {
    const xhr = new XMLHttpRequest();
    xhr.open(method.toUpperCase(), url, true);

    Object.keys(mergedHeaders).forEach((key) => {
      xhr.setRequestHeader(key, mergedHeaders[key]);
    });

    xhr.withCredentials = true;

    if (onUploadProgress) {
      xhr.upload.addEventListener("progress", onUploadProgress);
    }

    xhr.send(body);

    return new Promise((resolve, reject) => {
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          const contentType = xhr.getResponseHeader("content-type");
          const response =
            contentType && contentType.includes("application/json")
              ? JSON.parse(xhr.responseText)
              : xhr.responseText;
          resolve(response);
        } else {
          reject(new Error(`Request failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = function () {
        reject(new Error("Request failed"));
      };
    });
  } else {
    const requestOptions = {
      method: method.toUpperCase(),
      headers: new Headers(mergedHeaders),
      credentials: "include",
      ...options,
    };




    if (body) {
      requestOptions.body =
        typeof body === "object" ? JSON.stringify(body) : body;
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
        console.error(response)
        throw new Error(`Request failed with status ${response.status}`);
      }
    });
  }
}

export default makeRequest;
