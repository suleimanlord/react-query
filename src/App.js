import "./App.css";
import {
  Input,
  InputGroup,
  Checkbox,
  Button,
  InputLeftElement,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addTodo,
  getTodo,
  deleteTodo,
  updateTodo,
} from "./components/services";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";

function App() {
  const [val, setVal] = useState({ title: "", completed: false });
  const [message, setMessage] = useState({ message: "", error: false });

  const client = useQueryClient();

  const { data, isLoading, isSuccess, refetch } = useQuery({
    queryFn: () => getTodo(),
    queryKey: ["todos"],
  });

  const { mutate: add } = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["todos"] });
    },
  });
  const { mutate: deleteDO } = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["todos"] });
    },
  });
  const { mutate: updateDO } = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleDelete = (id) => {
    deleteDO(id);
  };

  const handlePost = async () => {
    if (val.title) {
      add(val);
      setVal({ title: "", completed: false });
      setMessage({ message: "", error: false });
    } else {
      setMessage({ message: "заполните поле", error: true });
    }
  };

  const handleUpdate = ({ id, value }) => {
    updateDO({ id: id, value: value });
  };

  useEffect(() => {
    if(message.message){
      const timer  = setTimeout(() => {
        setMessage({ message: "", error: false })
      }, 3000)

      return () => clearTimeout(timer)
    }
    console.log('message working')
  }, [message])

  return (
    <div className="App">
      <header className="App-header">
        <div className="wrapper">
          {message.message && (
            <p
              style={{
                color: "red",
                position: "fixed",
                top: "5px",
                margin: "auto",
              }}
            >
              {message.message}
            </p>
          )}
          <InputGroup>
            <Input
              value={val.title}
              onChange={(e) => setVal({ ...val, title: e.target.value })}
              placeholder="add todo"
              size="lg"
            />
          </InputGroup>
          <Button
            leftIcon={<FaPlus />}
            colorScheme="pink"
            variant="solid"
            onClick={handlePost}
          >
            Добавить
          </Button>
          {isSuccess &&
            data.map((item, index) => (
              <p
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                key={index}
              >
                <Checkbox
                  isChecked={item.completed}
                  onChange={(e) =>
                    handleUpdate({
                      id: item.id,
                      value: {
                        title: item.title,
                        completed: e.target.checked,
                      },
                    })
                  }
                />
                {item.title}
                <MdDelete color="pink" onClick={() => handleDelete(item.id)} />
              </p>
            ))}
        </div>
      </header>
    </div>
  );
}

export default App;
