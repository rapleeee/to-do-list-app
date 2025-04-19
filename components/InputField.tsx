import { TextInput, View, TextInputProps } from 'react-native';
import React from 'react';
import tw from 'twrnc';

export default function InputField(props: TextInputProps) {
  return (
    <View
      style={[
        tw`bg-neutral-300 border border-neutral-400 rounded-lg p-2`,
        {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
      ]}
    >
      <TextInput
        {...props}
        style={tw`p-2 text-black text-base`}
      />
    </View>
  );
}
