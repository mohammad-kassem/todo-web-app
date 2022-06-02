keys = Object.keys(localStorage);


$todos_array = [];
for (i of keys) {
  $value = localStorage.getItem(i);
  $value = $value.split(",");
  $value[0] = Number($value[0]);
  $value[3] = Number($value[3]);
  $value[4] = new Date($value[4]);
  $value[5] = $value[5] == "true";
  $value[6] = new Date($value[6]);
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
          <div class = "inside-content-container">
            <textarea id="title" class="title" placeholder="Title..." ></textarea>
            <input type="datetime-local" id="due-date" name="due-date">
          </div>
          <textarea id="description" class="description" placeholder="Description... "></textarea>
          <div>
              <input type="radio" id="1" name="points" value="1">
              <input type="radio" id="2" name="points" value="2">
              <input type="radio" id="3" name="points" value="3">
              <input type="radio" id="4" name="points" value="4">
              <input type="radio" id="5" name="points" value="5">
          </div>
          <button id="save-todo" class="btn">Save</button>
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
  let due_date = new Date($(`#due-date`).val());
  console.log(due_date);
  console.log(typeof date);
  let new_todo = [id, title, description, points, date, false, due_date];
  $todos_array.push(new_todo);
  $(".create").remove();
  if ($is_sorted_by_points) displayTodosByPoints();
  else displayTodosByDate();
}

function displayActiveTodos() {
  n = $todos_array.length;
  for (let i = 0; i < n; i++) {
    $(".todo").remove();
  }
  $todos_array.forEach((element) => {
    let date_created =
      String(element[4].getMonth() + 1) +
      "/" +
      String(element[4].getDate()) +
      "/" +
      String(element[4].getFullYear()) +
      " " +
      String(element[4].getHours()) +
      ":" +
      String(element[4].getMinutes());
    
    let due_date =
      String(element[6].getMonth() + 1) +
      "/" +
      String(element[6].getDate()) +
      "/" +
      String(element[6].getFullYear()) +
      " " +
      String(element[6].getHours()) +
      ":" +
      String(element[6].getMinutes());
    console.log(due_date);
    $todo_item = `<div id = ${element[0]} class="todo">
    <div class="todo-container">
      <div>
        <input id="checkbox${element[0]}" type="checkbox" name="todo-done">
      </div>
        <div class="todo-content">
            <div class="inside-content-container">
                <p>ID: ${element[0]}</p>
                <i class="fa-solid fa-trash"></i>
            </div>
            <div class = "inside-content-container">
              <textarea id="title${element[0]}" class="title" placeholder="Title..." disabled>${element[1]}</textarea>
              <p class="due-date">Due-Date: ${due_date}</p>
            </div>
            <textarea id="desc${element[0]}" class="description" placeholder="Description..." disabled>${element[2]}</textarea>
            <div>
                Points:
                <input type="radio" name= "points${element[0]}"  value="1" disabled>
                <input type="radio" name="points${element[0]}" value="2" disabled>
                <input type="radio" name="points${element[0]}" value="3" disabled>
                <input type="radio" name="points${element[0]}" value="4" disabled>
                <input type="radio" name="points${element[0]}" value="5" disabled>
            </div>
            <div class = "inside-content-container">
              <p>Create Date: ${date_created}</p>
              <button id="btn${element[0]}" class = "btn"> Edit </button>
            </div>
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
    
    $(`#${element[0]} .btn`).click(function(){
      $(".btn").not(`#${element[0]} .btn`).prop("disabled", true);
      $(`#${element[0]} textarea`).prop("disabled", false);
      $(`input[name = points${element[0]}`).prop("disabled", false);
      console.log($(this).text());
      $(this).text("Save");
      $(this).prop("id",`save-changes${element[0]}`);
      $(`#save-changes${element[0]}`).click(function() {
        $(`#${element[0]} textarea`).prop("disabled", false);
        $(`input[name = points${element[0]}`).prop("disabled", false);
        $(this).prop("id",`edit${element[0]}`);
        for (let i = 0; i < n; i++) {
          if ($todos_array[i][0] == element[0]){
            $todos_array[i][1] = $(`#title${element[0]}`).val();
            $todos_array[i][2] = $(`#desc${element[0]}`).val();
            $todos_array[i][3] =  $(`input[name="points${element[0]}"]:checked`
            ).val();
            updateLocalStorage();
            if ($is_sorted_by_points) displayTodosByPoints();
            else displayTodosByDate();
            break;
        }
      }
      });
    });


    $(".fa-trash").click(function () {
      console.log("hello");
      $todo_id = $(this).parent().parent().parent().parent().attr("id");
      $(this).parent().parent().parent().parent().remove();
      for (let i = 0; i < n; i++) {
        if ($todos_array[i][0] == $todo_id) {
          $found_index = i;
          break;
        }
      }
      $todos_array.splice($found_index, 1);
      updateLocalStorage();
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

    // $(`input[name = points${element[0]}]`).change(function () {
    //   $todo_id = $(this).parent().parent().parent().parent().attr("id");
    //   console.log($todo_id);
    //   for (let i = 0; i < n; i++) {
    //     if ($todos_array[i][0] == $todo_id) {
    //       $todos_array[i][3] = $(
    //         `input[name="points${element[0]}"]:checked`
    //       ).val();
    //       console.log($todos_array);
    //       updateLocalStorage();
    //       displayTodosByPoints();
    //       break;
    //     }
    //   }
    // });

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
    $is_sorted_by_date = true;
    $is_sorted_by_points = false;
    $("#active").show();
    $("#done").hide();
    displayTodosByDate();
  
});

$("#points-sort").click(function () {
    $is_sorted_by_date = false;
    $is_sorted_by_points = true;
    $("#active").show();
    $("#done").hide();
    displayTodosByPoints();
  
});

$("#done-button").click(function(){
  $("#active").hide();
  $("#done").show();
  $is_sorted_by_date = false;
  $is_sorted_by_points = false;
})

function updateLocalStorage() {
  localStorage.clear();
  $n = $todos_array.length;
  for (let i = 0; i < $n; i++) {
    localStorage.setItem($todos_array[i][0], $todos_array[i]);
  }
}

$("#search").keyup(function () {
  // $found_divs = [];
  $(".btn").prop("disabled", false);
  $("#active").show();
  $("#done").show();
  $search_text = $("#search").val().toUpperCase();
  console.log($search_text);
  $(".todo").hide();
  $("textarea").each(function () {
    $text = $(this).text().toUpperCase();
    if ($text.indexOf($search_text) > -1) {
      $is_sorted_by_date = false;
      $is_sorted_by_points = false;
      $found_id = $(this).parent().parent().parent().parent().attr("id");
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

function checkDueDate(){
  $current_date = Date.now();
  $(".todo").each(function (){
    $(this).removeClass("due");
    $due_date_element = $(this).find(".due-date");
    $due_date = Date.parse($due_date_element.text());
    $date_diff = ($due_date - $current_date)/60000;
    if ($date_diff < 60){
      if (!$(this).hasClass("done")) $(this).addClass("due");
    }
  })

};

setInterval(checkDueDate, 100);