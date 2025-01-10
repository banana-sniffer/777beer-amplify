import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { BeerTable } from './BeerTable'

function App() {
  // const { signOut } = useAuthenticator();

  return (
    <BeerTable/>
  );
}

export default App;
