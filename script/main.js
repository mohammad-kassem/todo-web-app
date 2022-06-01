keys = Object.keys(localStorage);


$todos_array = [];
for (i of keys) {
  $value = localStorage.getItem(i);
  $value = $value.split(",");
  $value[0] = Number($value[0]);
  $value[3] = Number($value[3]);
  $value[4] = new Date($value[4]);
  $value[5] = $value[5] == "true";
  $todos_array.push($value);
}

console.log($todos_array);

$is_sorted_by_date = true;
$is_sorted_by_points = false;

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
  let id = Math.ceil(Math.random() * 1000);
  let date = new Date();
  console.log(typeof date);
  let new_todo = [id, title, description, points, date, false];
  $todos_array.push(new_todo);
  $(".create").remove();
  displayTodosByDate();
}

function displayActiveTodos(search_term = " ") {
  n = $todos_array.length;
  for (let i = 0; i < n; i++) {
    $(".todo").remove();
  }
  $todos_array.forEach((element) => {
    let date_created =
      String(element[4].getDate()) +
      "/" +
      String(element[4].getMonth() + 1) +
      "/" +
      String(element[4].getFullYear()) +
      " " +
      String(element[4].getHours()) +
      ":" +
      String(element[4].getMinutes());
    $todo_item = `<div id = ${element[0]} class="todo">
    <div class="todo-container">
      <div>
        <input id="checkbox${element[0]}" type="checkbox" name="todo-done">
      </div>
        <div class="todo-content">
            <div class="id-delete-container">
                <p> ${element[0]} </p>
                <i class="fa-solid fa-trash"></i>
            </div>
            <textarea class="title" placeholder="Title..."> ${element[1]}</textarea>
            <textarea class="description" placeholder="Description...">  ${element[2]} </textarea>
            <div>
                <input type="radio" name= "points${element[0]}"  value="1">
                <input type="radio" name="points${element[0]}" value="2">
                <input type="radio" name="points${element[0]}" value="3">
                <input type="radio" name="points${element[0]}" value="4">
                <input type="radio" name="points${element[0]}" value="5">
            </div>
            <p> ${date_created}</p>
        </div>
    </div>
  </div>`;
    if (!element[5]) $("#active").append($todo_item);
    else {
      $("#done").append($todo_item);
      $(`#${element[0]}`).addClass("done");
      $(`#checkbox${element[0]}`).prop("checked", true);
    }

    $(`input[name = points${element[0]}][value=${element[3]}]`).prop(
      "checked",
      true
    );

    $(".fa-trash").click(function () {
      console.log("hello");
      $todo_id = $(this).parent().parent().parent().parent().attr("id");
      $(this).parent().parent().parent().parent().remove();
      for (let i = 0; i < n; i++) {
        if ($todos_array[i][0] == $todo_id) {
          $todos_array.splice(i, 1);
          console.log($todos_array);
          updateLocalStorage();
          break;
        }
      }
    });

    $(`#${element[0]} input[name=todo-done]`).change(function () {
      $todo_edited = $(this).parent().parent().parent();
      console.log($todo_edited);
      $todo_id = $(this).parent().parent().parent().attr("id");
      for (let i = 0; i < n; i++) {
          if ($todos_array[i][0] == $todo_id) {
            if ($(this).prop("checked")){
              $todos_array[i][5] = true;
              $todo_edited.addClass("done");
              $("#done").append($todo_edited);
          }
            else{
              $todos_array[i][5] = false;
              $todo_edited.removeClass("done");
              $("#active").append($todo_edited);
            }
            updateLocalStorage();
            break;
          }
        }
    });

    $(`input[name = points${element[0]}]`).change(function () {
      $todo_id = $(this).parent().parent().parent().parent().attr("id");
      console.log($todo_id);
      for (let i = 0; i < n; i++) {
        if ($todos_array[i][0] == $todo_id) {
          $todos_array[i][3] = $(
            `input[name="points${element[0]}"]:checked`
          ).val();
          console.log($todos_array);
          updateLocalStorage();
          displayTodosByPoints();
          break;
        }
      }
    });

  });
  updateLocalStorage();
}

function compareDates(a, b) {
  return new Date(b[4]).getTime() - new Date(a[4]).getTime();
}

function comparePoints(a, b) {
  return b[3] - a[3];
}

function displayTodosByDate() {
  $todos_array.sort(compareDates);
  displayActiveTodos();
}

function displayTodosByPoints() {
  $todos_array.sort(comparePoints);
  console.log($todos_array);
  displayActiveTodos();
}

$("#date-sort").click(function () {
  if (!$is_sorted_by_date) {
    $is_sorted_by_date = true;
    $is_sorted_by_points = false;
    $("#active").show();
    $("#done").hide();
    displayTodosByDate();
  }
});

$("#points-sort").click(function () {
  if (!$is_sorted_by_points) {
    $is_sorted_by_date = false;
    $is_sorted_by_points = true;
    $("#active").show();
    $("#done").hide();
    displayTodosByPoints();
  }
});

$("#done-button").click(function(){
  $("#active").hide();
  $("#done").show();
  $is_sorted_by_date = false;
  $is_sorted_by_points = false;
})

function updateLocalStorage() {
  n = $todos_array.length;
  $is_empty = true;
  for (let i = 0; i < n; i++) {
    $is_empty = false;
    localStorage.setItem($todos_array[i][0], $todos_array[i]);
  }
  if ($is_empty) {
    localStorage.clear();
  }
}

$("#search-icon").click(function () {
  // $found_divs = [];
  $("#active").show();
  $("#done").show();
  $search_text = $("#search").val();
  console.log($search_text);
  $(".todo").hide();
  $(".todo-content").each(function () {
    $text = $(this).text();
    if ($text.indexOf($search_text) > -1) {
      $is_sorted_by_date = false;
      $is_sorted_by_points = false;
      $found_id = $(this).parent().parent().attr("id");
      $(`#${$found_id}`).show();
      if ($(`#checkbox${$found_id}`).is(":checked")){
        $(`#${$found_id}`).addClass("done");
      }
    }
  });

  // $n = $found_divs.length;
  // console.log($found_divs);
  // for (let i = 0; i < n; i++) {
  //   $(".main-content").append($found_divs[i]);
  // }
});

displayTodosByDate();
