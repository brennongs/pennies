import { useState, Dispatch } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

interface Option {
  label: string;
  value: string;
}
interface Props {
  options: Option[]
  value?: Option;
  placeholder?: string;
  onChange: Dispatch<Option>
}
export function Dropdown({
  options,
  onChange,
  value,
  placeholder
}: Props) {
  const [open, setOpen] = useState(false)

  return (
    <View>
      <TouchableOpacity onPress={() => setOpen(!open)}>
        <Text>
          {value && value.label || placeholder || 'Select an option'}
        </Text>
      </TouchableOpacity>

      {open && (
        <View>
          <FlatList
            data={options}
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