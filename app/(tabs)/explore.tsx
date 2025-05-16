import { View, Text, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function explore() {
  const [form, setForm] = useState({
    name:'',
    age:'',
    employee_id:'',
    subject:'',
  });
  const [teacher, setTeacher] = useState([]);
  const handleChange = (field: string, value: string) => {
    setForm({...form, [field]: value });
  };

  const getTeachers = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8000/api/guru');
      const data = await response.json();
      console.log(data);
      setTeacher(data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  useEffect(() => {
    getTeachers();
  }, []);


  return (
    <SafeAreaView>

    <View style={tw`mx-2 bg-neutral-900`}>
      <TextInput style={tw`border mb-2 p-2 rounded bg-neutral-400`} value={form.name} onChangeText={(value) => handleChange('name', value)}/>
      <TextInput style={tw`border mb-2 p-2 rounded bg-neutral-400`} value={form.name} onChangeText={(value) => handleChange('age', value)}/>
      <TextInput style={tw`border mb-2 p-2 rounded bg-neutral-400`} value={form.name} onChangeText={(value) => handleChange('employee_id', value)}/>
      <TextInput style={tw`border mb-2 p-2 rounded bg-neutral-400`} value={form.name} onChangeText={(value) => handleChange('subject', value)}/>
      <Text>ini data guru</Text>
      {teacher.map((item: any) => (
        <View key={item.id}>
          <Text>{item.name}</Text>
          <Text>{item.age}</Text>
          <Text>{item.employee_id}</Text>
          <Text>{item.subject}</Text>
        </View>
      ))}
    </View>
    </SafeAreaView>

  )
}