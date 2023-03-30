import { Dialogs } from '@nativescript/core';
import { RouteProp } from '@react-navigation/core';
import * as React from 'react';
import { StyleSheet } from 'react-nativescript';
import { FrameNavigationProp } from 'react-nativescript-navigation';

import { MainStackParamList } from '../NavigationParamList';

type ScreenOneProps = {
  route: RouteProp<MainStackParamList, 'One'>;
  navigation: FrameNavigationProp<MainStackParamList, 'One'>;
};

export function ScreenOne({ navigation }: ScreenOneProps) {
    
    const [todos, setTodos] = React.useState([]);
    const todoRef = firebase.firestore().collection('todos');
    const [addData, setAddData] = useState('');
    const navigation = useNavigation();

    // fetch or read the data from firestore
    React.useEffect(() => {
        todoRef
        .orderBy('createdAt', 'desc')
        .onSnapshot( 
            querySnapshot => {
            const todos = []
            querySnapshot.forEach((doc) => {
                const {heading} = doc.data()
                todos.push({
                    id: doc.id,
                    heading,
                })
            })
            setTodos(todos)
            //console.log(users)
        })
    }, [])

    // delete a todo from firestore db
    const deleteTodo = (todos) => {
        todoRef
            .doc(todos.id)
            .delete()
            .then(() => {
                // show a successful alert
                alert("Deleted successfully");
            })
            .catch(error => {
                // show an error alert
                alert(error);
            })
    }

    // add a todo
    const addTodo = () => {
        // check if we have a todo.
        if (addData && addData.length > 0) {
            // get the timestamp
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            const data = {
                heading: addData,
                createdAt: timestamp
            };
            todoRef
                .add(data)
                .then(() => {
                    // release todo state
                    setAddData('');
                    // release keyboard
                    Keyboard.dismiss();
                })
                .catch((error) => {
                    // show an alert in case of error
                    alert(error);
                })
        }
    }
  return (
    <flexboxLayout style={styles.container}>
      <label className="text-2xl mb-4 font-bold text-center">Halloo</label>
      <button style={styles.button} onTap={() => Dialogs.alert('Tapped!')}>
        Tap me for an alert
      </button>
      <button
        style={styles.button}
        onTap={() => navigation.navigate('Two', { message: 'Hello, world!' })}
      >
        Go to next screen
      </button>
    



    </flexboxLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  button: {
    fontSize: 24,
    color: '#2e6ddf',
  },
});
