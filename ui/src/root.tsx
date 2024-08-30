import { useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import store, { persistor } from "./config/store";

export default function Root() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Provider store={store}>
      <PersistGate
        loading={<div>Loading...</div>}
        persistor={persistor}
        onBeforeLift={() => setIsLoaded(true)}
      >
        {isLoaded ? <App /> : <div>Loading...</div>}
      </PersistGate>
    </Provider>
  );
}
