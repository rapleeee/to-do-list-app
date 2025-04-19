import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import tw from 'twrnc'

const PrimaryButton = ({titleBtn, handle}:any) => {
  return (
    <TouchableOpacity style={tw`p-4 rounded-lg bg-[#032A4E] items-center border border-neutral-400`} onPress={handle}>
          <Text style={tw`text-neutral-300 font-semibold text-base`}>{titleBtn}</Text>
    </TouchableOpacity>
  )
}

export default PrimaryButton