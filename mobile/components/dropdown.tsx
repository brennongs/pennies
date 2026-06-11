import { useState, Dispatch } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

interface Option {
  label: string;
  value: string;
}
interface Props {
  options: Option[]
  value?: Option;
  onChange: Dispatch<Option>
}
export function Dropdown({ options, onChange, value }: Props) {
  const [open, setOpen] = useState(false)
  console.log(options)

  return (
    <View>
      <TouchableOpacity onPress={() => setOpen(!open)}>
        <Text>{(
          value && value.label || 'Select an option'
        )}</Text>
      </TouchableOpacity>

      {open && (
        <View>
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={(item) => (
              <TouchableOpacity
                onPress={() => {
                  onChange(item.item)
                  setOpen(!open)
                }}
              >
                <Text>{item.item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  )
}