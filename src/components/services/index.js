import axios from "axios";

const URL_TODO = "http://localhost:8000/todos";

export const addTodo = async (value) => {
    const {data} = await axios.post(URL_TODO, value)
    return data
};

export const getTodo = async () => {
  const { data } = await axios.get(URL_TODO);
  return data;
};

export const deleteTodo = async (id) => {
    const {data} = await axios.delete(`${URL_TODO}/${id}`)
    return data
}

export const updateTodo = async ({id, value}) => {
    const {data} = await axios.put(`${URL_TODO}/${id}`, value)
    return data
}
