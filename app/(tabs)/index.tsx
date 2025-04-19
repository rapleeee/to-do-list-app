import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import tw from 'twrnc';
import PrimaryButton from '@/components/PrimaryButton';
import InputField from '@/components/InputField';
import AsyncStorage from '@react-native-async-storage/async-storage';

type TaskItem = {
  id: string;
  task: string;
  subject: string;
};

export default function HomeScreen() {
  const [task, setTask] = useState('');
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState(Date());
  const [list, setList] = useState<TaskItem[]>([]);

  useEffect(() => {
    saveTask();
  },[list])


  const saveTask = async () => {
    try{
      await AsyncStorage.setItem('task', JSON.stringify([]));
      console.log('data masuk ke lokal')
    }catch(error){
      console.log('yah data gamasuk')
    }
  }

  const addTask = () => {
    if (task.trim() === "" && subject.trim() === "") return;

    const newTask = {
      id: Date.now().toString(),
      task: task.trim(),
      subject: subject.trim()
    }

    setList([...list, newTask]);
    setTask('');
    setSubject('');
  }
  return (
    <SafeAreaView>
      <View style={tw`mx-4 gap-2`}>
        <View style={tw`flex-row items-center gap-2`}>
          <Ionicons name='clipboard-outline' size={24} />
          <Text style={tw`text-2xl font-bold`}>nGopoyo</Text>
        </View>
        <InputField
          value={task}
          onChangeText={setTask}
          placeholder="Ada tugas apa hari ini?"
        />

        <InputField
          value={subject}
          onChangeText={setSubject}
          placeholder="Mapelnya apa tu?"
        />
        <View style={tw`flex-row gap-2 items-center`}>
          <View style={tw`flex-1`}>
            <InputField
              placeholder="Tanggal deadline (17 April 2025)"
            />
          </View>
          <TouchableOpacity
            onPress={addTask}
            style={tw`p-4 rounded-lg bg-[#032A4E] border border-neutral-400`}
          >
            <Ionicons name='push' size={24} color={'white'} />
          </TouchableOpacity>
        </View>
        <PrimaryButton titleBtn={'add Task'} handle={addTask} />
      </View>
    </SafeAreaView>
  )
}