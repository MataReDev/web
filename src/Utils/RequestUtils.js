import secureLocalStorage from "react-secure-storage";
import react, { useContext } from "react";
import { toast } from "react-toastify";

async function makeRequest(
  path,
  method = "GET",
  headers = {},
  body = null,
  options = { mode: "cors" },
  xsrfToken = false,
  onUploadProgress = null
) {
  let toastOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  };

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
          toast.error(
            "Une erreur s'est produite ! merci de ressayer dans quelques instants ou de contacter un Administrateur",
            toastOptions
          );
          reject(new Error(`Request failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = function () {
        toast.error(
          "Une erreur s'est produite ! merci de ressayer dans quelques instants ou de contacter un Administrateur",
          toastOptions
        );
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
    try {
      const response = await fetch(url, requestOptions);
      const contentType = response.headers.get("content-type");

      if (response.ok) {
        if (contentType && contentType.includes("application/json")) {
          return response.json();
        } else {
          return response.text();
        }
      } else if (response.status === 403 || response.status === 401) {
        const data = await response.json();
        let message = data.error;
        const toastOptionsWithRedirect = {
          ...toastOptions,
          onClose: () => {
            secureLocalStorage.removeItem("user");
            if (window.location.pathname !== "/login")
                window.location.replace("/");
          },
        };

        if (message.includes("You're banned")) {
          toast.error(message, toastOptionsWithRedirect);
          return null;
        } else {
          const specificErrors = [
            { error: "refresh_token" },
            { error: "Bad xsrf token" },
            { error: "Missing XSRF token in headers",},
            {error: "Missing token in cookie"}, 
            { error: "Refresh token is not valid !"}
          ];

          const matchedError = specificErrors.find((specificError) =>
            data.error.includes(specificError.error)
          );
          if (matchedError) {
            message = "An error occured please reconnect :(";
          }

          toast.error(message, toastOptionsWithRedirect);
          return null;
        }
      } else if (response.status === 404) {
        const data = await response.json();
        const message = data.error;
        toast.info(message, toastOptions);
        return null;
      } else if (response.status === 400) {
        const data = await response.json();
        const message = data.error;
        toast.error(message, toastOptions);
        return null;
      } else {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (e) {
      toast.error(
        "Une erreur s'est produite ! merci de ressayer dans quelques instants ou de contacter un Administrateur",
        toastOptions
      );
      throw e;
    }
  }
}

export default makeRequest;
