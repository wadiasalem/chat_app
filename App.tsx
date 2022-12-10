import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import Navigation from './Navigation';
import initFirebase from './shared/utils/firebase';

export default function App() {

  const database = initFirebase.database("https://tpmobile-7cc09-default-rtdb.europe-west1.firebasedatabase.app");
  const auth = initFirebase.auth();

  useEffect(() => {
    auth.onAuthStateChanged(() => {
      if (auth.currentUser) {
        database.ref("connection/" + auth.currentUser.uid).set(true);
        database.ref("connection/" + auth.currentUser.uid).onDisconnect().set(false);
      }
    })
  }, [auth.currentUser])

  return (
    <NavigationContainer>
      <Navigation />
    </NavigationContainer>
  );
}
