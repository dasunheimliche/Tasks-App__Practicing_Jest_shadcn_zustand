import { render, fireEvent } from "@testing-library/react";

import App from "../App";
import moment from "moment";

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe("App cruds", () => {
  test("Add subtask to task form", () => {
    const { getByText, getByPlaceholderText, getAllByTestId } = render(<App />);

    fireEvent.click(getByText("Nueva +"));
    const input = getByPlaceholderText("Tarea");
    fireEvent.change(input, { target: { value: "Nueva Tarea" } });

    fireEvent.click(getByText("+"));
    expect(getAllByTestId("subtask")).toHaveLength(1);
  });

  test("Add task to task list", () => {
    const { getByText, getByPlaceholderText, getByTestId, getAllByTestId } =
      render(<App />);

    fireEvent.click(getByText("Nueva +"));

    const titleInput = getByPlaceholderText("Title");
    fireEvent.change(titleInput, { target: { value: "Titulo" } });

    const subtaskInput = getByPlaceholderText("Tarea");
    fireEvent.change(subtaskInput, { target: { value: "Nueva Tarea" } });
    fireEvent.click(getByText("+"));

    const calendarInput = getByTestId("calendar");
    fireEvent.change(calendarInput, { target: { value: "2024-03-13" } });

    fireEvent.click(getByText("Agregar"));

    expect(getAllByTestId("task-card")).toHaveLength(1);
  });

  test("Delete task from task list", () => {
    const { getByText, getByPlaceholderText, getByTestId, getAllByTestId } =
      render(<App />);

    fireEvent.click(getByText("Nueva +"));

    const titleInput = getByPlaceholderText("Title");
    fireEvent.change(titleInput, { target: { value: "Titulo" } });

    const subtaskInput = getByPlaceholderText("Tarea");
    fireEvent.change(subtaskInput, { target: { value: "Nueva Tarea" } });
    fireEvent.click(getByText("+"));

    const calendarInput = getByTestId("calendar");
    fireEvent.change(calendarInput, { target: { value: "2024-03-13" } });

    fireEvent.click(getByText("Agregar"));

    fireEvent.click(getAllByTestId("task-card")[0]);

    const numTasks = getAllByTestId("task-card").length;

    fireEvent.click(getAllByTestId("delete")[0]);

    fireEvent.click(getByText("Confirmar"));

    expect(getAllByTestId("task-card")).toHaveLength(numTasks - 1);
  });

  test("Edit task title", () => {
    const { getByText, getAllByTestId, getByPlaceholderText } = render(<App />);

    const new_title = "Otro titulo";

    fireEvent.click(getAllByTestId("task-card")[0]);

    fireEvent.click(getAllByTestId("edit")[0]);

    fireEvent.change(getByPlaceholderText("Title"), {
      target: { value: new_title },
    });

    fireEvent.click(getByText("Confirmar"));

    expect(getAllByTestId("task-title")[0].textContent).toBe(new_title);
  });

  test("Edit subtasks list", () => {
    const { getByText, getAllByTestId, getByPlaceholderText } = render(<App />);

    fireEvent.click(getAllByTestId("task-card")[0]);

    fireEvent.click(getAllByTestId("edit")[0]);

    const prevNumSubtasks =
      getAllByTestId("open-task-card")[0].getElementsByClassName(
        "subtask"
      ).length;

    const subtasksInput = getByPlaceholderText("Tarea");
    fireEvent.change(subtasksInput, { target: { value: "tarea 2" } });
    fireEvent.click(getByText("+"));

    fireEvent.click(getByText("Confirmar"));

    const newNumSubtasks =
      getAllByTestId("open-task-card")[0].getElementsByClassName(
        "subtask"
      ).length;

    expect(newNumSubtasks).toBe(prevNumSubtasks + 1);
  });

  test("Edit task deadline", () => {
    const { getByText, getAllByTestId, getByTestId } = render(<App />);

    fireEvent.click(getAllByTestId("task-card")[0]);

    fireEvent.click(getAllByTestId("edit")[0]);

    const new_deadline = "2024-04-01";

    const calendarInput = getByTestId("calendar");

    fireEvent.change(calendarInput, { target: { value: new_deadline } });

    fireEvent.click(getByText("Confirmar"));

    expect(getAllByTestId("deadline")[0].textContent).toBe(
      moment(new_deadline).format("LL")
    );
  });

  test("Mark task as completed", () => {
    const { getByText, getAllByTestId, getByTestId } = render(<App />);

    fireEvent.click(getAllByTestId("task-card")[0]);

    const prevTodoTasks =
      getByTestId("todo").getElementsByClassName("task").length;
    const prevCompletedTasks =
      getByTestId("complete").getElementsByClassName("task").length;

    fireEvent.click(getAllByTestId("done")[0]);
    fireEvent.click(getByText("Confirmar"));

    const currentTodoTasks =
      getByTestId("todo").getElementsByClassName("task").length;
    const currentCompletedTasks =
      getByTestId("complete").getElementsByClassName("task").length;

    expect(currentTodoTasks).toBe(prevTodoTasks - 1);
    expect(currentCompletedTasks).toBe(prevCompletedTasks + 1);
  });
});
