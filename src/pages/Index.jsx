import { useState, useEffect } from 'react';
import { Box, Button, Input, Text, VStack, useToast } from '@chakra-ui/react';
import { FaTrash, FaPen, FaPlus } from 'react-icons/fa';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mnwefvnykbgyhbdzpleh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ud2Vmdm55a2JneWhiZHpwbGVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMyNzQ3MzQsImV4cCI6MjAyODg1MDczNH0.tnHysd1LqayzpQ1L-PImcvlkUmkNvocpMS7tS-hYZNg';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Index = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from('notes')
      .select('*');
    if (error) {
      toast({
        title: 'Error fetching notes',
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } else {
      setNotes(data);
    }
  };

  const addNote = async () => {
    const { data, error } = await supabase
      .from('notes')
      .insert([{ note: newNote }]);
    if (error) {
      toast({
        title: 'Error adding note',
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } else {
      setNotes([...notes, data[0]]);
      setNewNote('');
    }
  };

  const deleteNote = async (id) => {
    const { error } = await supabase
      .from('notes')
      .delete()
      .match({ id });
    if (error) {
      toast({
        title: 'Error deleting note',
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } else {
      setNotes(notes.filter(note => note.id !== id));
    }
  };

  return (
    <Box p={5}>
      <VStack spacing={4}>
        <Input
          placeholder="Add a new note"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <Button leftIcon={<FaPlus />} colorScheme="teal" onClick={addNote}>
          Add Note
        </Button>
        {notes.map(note => (
          <Box key={note.id} p={5} shadow="md" borderWidth="1px" flex="1" borderRadius="md">
            <Text mb={2}>{note.note}</Text>
            <Button leftIcon={<FaTrash />} colorScheme="red" onClick={() => deleteNote(note.id)}>
              Delete
            </Button>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default Index;