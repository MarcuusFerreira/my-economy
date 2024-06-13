import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function AddExpenseScreen() {
  return (
    <View style={styles.container}>
      <Text>Add Expense Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddExpenseScreen;
