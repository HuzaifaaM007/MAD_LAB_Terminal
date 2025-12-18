import { Text, TouchableOpacity, StyleSheet } from "react-native";

const CustomButton = ({ title, onPress, customStyle = {} }) => (
  <TouchableOpacity onPress={onPress} style={[styles.button, customStyle]}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: 'center',
    backgroundColor: "#38bdf8", 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#020617', 
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CustomButton;
