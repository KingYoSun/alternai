import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  let errorTxt = "";

  if (isRouteErrorResponse(error)) {
    errorTxt = `${error.status}: ${error.statusText}`;
  } else if (error instanceof Error) {
    errorTxt = error.message;
  } else if (typeof error === "string") {
    errorTxt = error;
  } else {
    errorTxt = "Unknown error";
  }

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{errorTxt}</i>
      </p>
    </div>
  );
}
