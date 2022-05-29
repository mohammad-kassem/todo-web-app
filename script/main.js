$todos_array = [];

$("#add-todo-button").click(function () {
  if ($(".create")) {
    $(".create").remove();
  }
  $create_todo_template = `<div class="todo create">
  <div class="todo-container">
      <div>
          <input type="checkbox" name="todo-done" disabled>
      </div>
      <div class="todo-content">
          <i id="cancel" class="fa-solid fa-xmark"></i>
          <textarea id="title" class="title" placeholder="Title..."></textarea>
          <textarea id="description" class="description" placeholder="Description..."></textarea>
          <div>
              <input type="radio" id="1" name="points" value="1">
              <input type="radio" id="2" name="points" value="2">
              <input type="radio" id="3" name="points" value="3">
              <input type="radio" id="4" name="points" value="4">
              <input type="radio" id="5" name="points" value="5">
          </div>
          <button id="save-todo" class="btn"> Save Todo </button>
      </div>
  </div>
</div>`;
  $("#add-todo-container").append($create_todo_template);
  $("#cancel").click(function () {
    $(".create").remove();
  });
  $("#save-todo").click(saveTodo);
});

function saveTodo() {
  let title = $("#title").val();
  let description = $("#description").val();
  let points = $('input[name="points"]:checked').val();
  let id = Math.ceil(Math.random() * 10);
  let date = new Date();
  let date_created =
    String(date.getDate()) +
    "/" +
    String(date.getMonth()) +
    "/" +
    String(date.getFullYear());
  let new_todo = [id, title, description, points, date_created, false];
  $todos_array.push(new_todo);
  $(".create").remove();
  displayTodos();
}

function displayTodos() {
  $todos_array.forEach((element) => {
    $todo_item = `<div class="todo">
    <div class="todo-container">
        <div class="todo-content">
            <div class="id-delete-container">
                <p> ${element[0]} </p>
                <i id="delete" class="fa-solid fa-trash"></i>
            </div>
            <textarea class="title" placeholder="Title..."> ${element[1]}</textarea>
            <textarea class="description" placeholder="Description...">  ${element[2]} </textarea>
            <div>
                <input type="radio" name="points" value="1">
                <input type="radio" name="points" value="2">
                <input type="radio" name="points" value="3">
                <input type="radio" name="points" value="4">
                <input type="radio" name="points" value="5">
            </div>
            <p> ${element[4]}</p>
        </div>
    </div>
  </div>`;
    $("#active").append($todo_item);
    $(`input[name=points][value=${element[3]}]`).prop("checked", true);
  });
}

displayTodos();
