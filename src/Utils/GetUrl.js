export function getUrl() {
  let defaultUrl = "https://iseevision.fr/";

  if (process.env.REACT_APP_ENVIRONMENT === "development") {
    defaultUrl = "/";
  } else if (process.env.REACT_APP_ENVIRONMENT === "localhost") {
    defaultUrl = "http://localhost:3001/";
  }

  return defaultUrl;
}
