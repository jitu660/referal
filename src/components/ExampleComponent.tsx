import React from "react";
import { useBackend } from "../api/useBackend";

// Component that demonstrates data fetching with our custom hook.
const ExampleComponent = () => {
  const { data, error } = useBackend("/api/example");

  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>Example Data</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default ExampleComponent;
