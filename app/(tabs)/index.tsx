import { View, Text, TouchableOpacity, Alert, FlatList, TextInput } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PrimaryButton from '@/components/PrimaryButton';
import InputField from '@/components/InputField';

type TaskItem = {
  id: string;
  task: string;
  subject: string;
  date: string;
};

type Props = {
  disabled ?: boolean;
};
export default function HomeScreen() {
  const [task, setTask] = useState('');
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');
  const [list, setList] = useState<TaskItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const subjectRef = useRef<TextInput>(null);
  const taskRef = useRef<TextInput>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [list]);

  const validateDate = (input: string): boolean => {
    const regex = /^\d{1,2}\s\w+\s\d{4}$/; // contoh: 17 April 2025
    return regex.test(input);
  };

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem('task', JSON.stringify(list));
    } catch (error) {
      console.log('Gagal menyimpan tugas');
    }
  };

  const loadTasks = async () => {
    try {
      const stored = await AsyncStorage.getItem('task');
      if (stored) {
        setList(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Gagal memuat tugas');
    }
  };

  const addTask = () => {
    if (!task.trim() || !subject.trim() || !date.trim()) {
      Alert.alert('Oops', 'Semua field harus diisi!');
      return;
    }

    if (task.trim().length < 3) {
      Alert.alert('Huh', 'Tugas terlalu pendek!');
      return;
    }

    if (!validateDate(date.trim())) {
      Alert.alert('Format Salah', 'Gunakan format seperti: 17 April 2025');
      return;
    }

    if (editingId) {
      const updatedList = list.map(item =>
        item.id === editingId ? { ...item, task, subject, date } : item
      );
      setList(updatedList);
      setEditingId(null);
      Alert.alert('Berhasil', 'Tugas berhasil diperbarui!');
    } else {
      const newTask: TaskItem = {
        id: Date.now().toString(),
        task: task.trim(),
        subject: subject.trim(),
        date: date.trim(),
      };
      setList(prev => [...prev, newTask]);
      Alert.alert('Berhasil', 'Tugas berhasil ditambahkan!');
    }

    setTask('');
    setSubject('');
    setDate('');
  };

  const handleEdit = (item: TaskItem) => {
    setTask(item.task);
    setSubject(item.subject);
    setDate(item.date);
    setEditingId(item.id);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Konfirmasi', 'Yakin ingin menghapus tugas ini?', [
      { text: 'Batal' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => {
          setList(prev => prev.filter(item => item.id !== id));
          Alert.alert('Dihapus', 'Tugas berhasil dihapus.');
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: TaskItem }) => (
    <View style={tw`flex-row items-center bg-[#f1f1f1] rounded-xl p-4 mb-3 shadow-sm`}>
      <View style={tw`w-6 h-6 border rounded mr-3`} />

      <View style={tw`flex-1`}>
        <Text style={tw`text-base font-bold text-gray-800`}>{item.task}</Text>
        <Text style={tw`text-sm text-gray-600`}>{item.subject}</Text>
        <Text style={tw`text-sm text-red-700 font-bold`}>{item.date}</Text>
      </View>

      <View style={tw`flex-row gap-2`}>
        <TouchableOpacity
          style={tw`bg-[#032A4E] p-2 rounded`}
          onPress={() => handleEdit(item)}
        >
          <Feather name="edit-2" size={16} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`bg-red-700 p-2 rounded`}
          onPress={() => handleDelete(item.id)}
        >
          <Feather name="trash" size={16} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );


  return (
    <SafeAreaView style={tw`flex-1 bg-neutral-100`}>
      <View style={tw`mx-4 gap-2`}>
        <View style={tw`flex-row items-center gap-2 mt-2`}>
          <Ionicons name='clipboard-outline' size={24} />
          <Text style={tw`text-2xl font-bold text-black`}>nGopoyo</Text>
        </View>

        <InputField
          value={task}
          onChangeText={setTask}
          placeholder="Ada tugas apa hari ini?"
          returnKeyType='next'
          onSubmitEditing={() => taskRef.current?.focus()}
        />

        <InputField
          value={subject}
          onChangeText={setSubject}
          placeholder="Mapelnya apa tu?"
          returnKeyType='next'
          onSubmitEditing={() => subjectRef.current?.focus()}
        />

        <View style={tw`flex-row gap-2 items-center`}>
          <View style={tw`flex-1`}>
            <InputField
              value={date}
              onChangeText={setDate}
              
              placeholder="Tanggal deadline (17 A pril 2025)"
            />
          </View>
          <TouchableOpacity
            onPress={addTask}
            style={tw`p-4 rounded-lg bg-[#032A4E] border border-neutral-400`}
          >
            <Ionicons name='push' size={24} color={'white'} />
          </TouchableOpacity>
        </View>


        <TouchableOpacity onPress={addTask} disabled={task === '' || subject === ''} style={[tw`p-2 rounded-lg items-center border border-neutral-400 bg-[#032A4E]`]}>
          <Text style={tw`text-white font-bold text-base`}>Submit</Text>
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold mt-4 mb-2 text-neutral-500`}>Ada Tugas Ni Kamu!</Text>

        {list.length === 0 ? (
          <Text style={tw`text-center text-gray-500 mt-2`}>Tidak ada tugas</Text>
        ) : (
          <FlatList
            data={list}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            style={tw`mb-10`}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
