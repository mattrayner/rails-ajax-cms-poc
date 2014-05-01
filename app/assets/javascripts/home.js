// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/

$(document).ready(function(){
  // Process show form buttons
  showFormButtonClicked = function(e){ 
    e.preventDefault();

    // Hide check for showable things
    id = $(this).prop("id");
    
    id = "#"+id.substring( id.indexOf("_")+1 )+"-form";

    if ($(id).size() > 0) {
      $(id).removeClass( "hide");
      $(this).addClass( "hide");
    }
  }

  hideFormButtonClicked = function(e){
    e.preventDefault();

    console.log("hide");

    id = $(this).prop("id");
    id = "#show_"+id.substring( id.indexOf("_")+1 );

    //Get the target button we want to show
    target = $(id);
    well = $(this).closest(".well");
    
    if ($(target).size() > 0) {
      $(target).removeClass("hide");
      $(well).addClass("hide");
    }
  }

  // Process form button clicks
  formButtonClicked = function (e) {
    e.preventDefault();

    console.log("here");

    id = $(this).prop("id");
    id = id.substring( id.indexOf("_")+1 );

    submitForm(id, true);
  }

  // Do some AJAX magic
  submitForm = function (type, new_item, id) {
    if (new_item == null)
      new_item = false;

    if (id == null)
      id = 0;

    data = null;

    // Get the CSRF token
    tokenParam = $('meta[name=csrf-param]').attr("content");
    token = $('meta[name=csrf-token]').attr("content");

    console.log("got here");

    if (type == "category") {
      data = {tokenParam: token, category:{name: $("#category-form #name").val(), description: $("#category-form #description").val()}};
    }
    else if (type == "business") {
      data = {tokenParam: token, business:{name: $("#business-form #name").val()}, tasks: $("#business-form #tasks").val()};
    }
    else if (type == "task") {
      data = {tokenParam: token, task:{title: $("#task-form #title").val(), description: $("#task-form #description").val(), duration: $("#task-form #duration").val(), priority: $("#task-form #priority").val(), category_id:  $("#task-form #category_id").val()}};
    }

    if (data == null) {
      alert ("There was an error submitting your form");
      return;
    }else{

      if (type == "category") {
        api_target = "categories";
      }
      else if (type == "business") {
        api_target = "businesses";
      }
      else if (type == "task") {
        api_target = "tasks";
      }

      if (!new_item) {
        api_target += "/"+id ;
      }

      console.log(api_target);
      console.log(data);

      // Do the AJAX
      request = $.ajax({
        type: "POST",
        url: "http://0.0.0.0:3000/api/v1/"+api_target,
        data: data
      });

      request.done(function(msg){
        if(type=="category"){
          refreshCategories();
        }
        else if(type=="business"){
          refreshBusinesses();
        }
        else if(type=="task"){
          refreshTasks();
        }

        console.log(msg);
      });

      request.error(function(msg){
        console.log("Error: " + msg);
      });
    }
  }

  chooseABusiness = function(e) {
    e.preventDefault();

    //Get the selected business
    business = $("#business_select").val();

    //Ajax out to it
    // Do the AJAX
    request = $.ajax({
      url: "http://0.0.0.0:3000/api/v1/businesses/"+business+".json"
    });

    request.done(function(data){
      $("#business_tasks").html(generateBusinessTasks(data));
    });

    request.error(function(msg){
      alert("Error retriving businesses");
    });
  }

  generateBusinessTasks = function(data){
    string = '<table class="table"><thead><tr><th>#</th><th>Name</th></tr></thead><tbody>';

    tasks = data["tasks"];

    for(i = 0; i<tasks.length; i++){
      task = tasks[i];

      string += '<tr><td>'+task[0]+"</td><td>"+task[1]+"</td></tr>";
    }

    string += "</tbody></table>";

    return string;
  }

  // Click the show buttons
  $('#show_category').on( "click", showFormButtonClicked);
  $('#show_business').on( "click", showFormButtonClicked);
  $('#show_task').on( "click", showFormButtonClicked);
  $('#cancel_category').on( "click", hideFormButtonClicked);
  $('#cancel_business').on( "click", hideFormButtonClicked);
  $('#cancel_task').on( "click", hideFormButtonClicked);

  // Click the submit buttons
  $('#submit_category').on( "click", formButtonClicked);
  $('#submit_business').on( "click", formButtonClicked);
  $('#submit_task').on( "click", formButtonClicked);

  $("#select_business").on("click", chooseABusiness);

  //Show the different elements
  refreshCategories();
  refreshBusinesses();
  refreshTasks();
});

//Refresh functions
refreshCategories = function(){
  //Get all categories
  // Do the AJAX
  request = $.ajax({
    url: "http://0.0.0.0:3000/api/v1/categories.json"
  });

  request.done(function(data){
    $("#category_container").html(generateCategoryTable(data));
    $("#task-form #category_id").html(generateCategorySelect(data));
    console.log(data);

    //Add the click listener to the new buttons
    $('a.cat-delete').on("click", deleteCat);
    //$('a.cat-edit').on("click", editCat);
  });

  request.error(function(msg){
    alert("Error retriving categories");
  });
}

generateCategoryTable = function(data){
  string = '<table class="table"><thead><tr><th>#</th><th>Title</th><th>Description</th><th>Controls</th></tr></thead><tbody>';

  console.log(data);

  for (i = 0; i < data.length; i++){
    cat = data[i];

    string += '<tr>';
    string += '<td>'+cat['id']+'</td>';
    string += '<td>'+cat['name']+'</td>';
    string += '<td>'+cat['description']+'</td>';
    string += '<td><a class="btn btn-default btn-sm cat-delete" href="#" data-id="'+cat['id']+'">DEL</a></td>';
    string += '</tr>'
  }

  string += '</tbody></table>';

  return string;
}

generateCategorySelect = function(data){
  string = ""

  for (i = 0; i < data.length; i++){
    cat = data[i];

    string += '<option value="'+cat['id']+'">'+cat['name']+'</option>';
  }

  return string;
}

deleteCat = function(e){
  e.preventDefault();

  container = $(this).closest("tr");
  id = $(this).data("id");

  request = $.ajax({
    url: "http://0.0.0.0:3000/api/v1/categories/"+id+".json",
    type: "DELETE"
  });

  request.done(function(data){
    console.log(data);
    $(container).remove();
  });

  request.error(function(msg){
    alert("Error removing category");
  });
}

//Refresh functions
refreshBusinesses = function(){
  //Get all categories
  // Do the AJAX
  request = $.ajax({
    url: "http://0.0.0.0:3000/api/v1/businesses.json"
  });

  request.done(function(data){
    $("#business_container").html(generateBusinessTable(data));
    $("#business_select").html(generateBusinessSelect(data));
    console.log(data);

    //Add the click listener to the new buttons
    $('a.bus-delete').on("click", deleteBus);
    //$('a.cat-edit').on("click", editCat);
  });

  request.error(function(msg){
    alert("Error retriving businesses");
  });
}

generateBusinessTable = function(data){
  string = '<table class="table"><thead><tr><th>#</th><th>Title</th><th>Tasks</th><th>Controls</th></tr></thead><tbody>';

  console.log(data);

  for (i = 0; i < data.length; i++){
    bus = data[i];

    string += '<tr>';
    string += '<td>'+bus['id']+'</td>';
    string += '<td>'+bus['name']+'</td>';
    string += '<td>'+bus['tasks']+'</td>';
    string += '<td><a class="btn btn-default btn-sm bus-delete" href="#" data-id="'+bus['id']+'">DEL</a></td>';
    string += '</tr>'
  }

  string += '</tbody></table>';

  return string;
}

generateBusinessSelect = function(data){
  string = "";

  for (i = 0; i < data.length; i++){
    bus = data[i];

    string += '<option value="'+bus['id']+'">'+bus['name']+'</option>';
  }

  return string;
}

deleteBus = function(e){
  e.preventDefault();

  container = $(this).closest("tr");
  id = $(this).data("id");

  request = $.ajax({
    url: "http://0.0.0.0:3000/api/v1/businesses/"+id+".json",
    type: "DELETE"
  });

  request.done(function(data){
    console.log(data);
    $(container).remove();
  });

  request.error(function(msg){
    alert("Error removing task");
  });
}

//Refresh functions
refreshTasks = function(){
  //Get all categories
  // Do the AJAX
  request = $.ajax({
    url: "http://0.0.0.0:3000/api/v1/tasks.json"
  });

  request.done(function(data){
    $("#task_container").html(generateTasksTable(data));
    $("#business-form #tasks").html(generateTasksSelect(data));
    console.log(data);

    //Add the click listener to the new buttons
    $('a.task-delete').on("click", deleteTask);
    //$('a.cat-edit').on("click", editCat);
  });

  request.error(function(msg){
    alert("Error retriving tasks");
  });
}

generateTasksTable = function(data){
  string = '<table class="table"><thead><tr><th>#</th><th>Title</th><th>Description</th><th>Duration</th><th>Priority</th><th>Category</th><th>Controls</th></tr></thead><tbody>';

  console.log(data);

  for (i = 0; i < data.length; i++){
    task = data[i];

    string += '<tr>';
    string += '<td>'+task['id']+'</td>';
    string += '<td>'+task['title']+'</td>';
    string += '<td>'+task['description']+'</td>';
    string += '<td>'+task['duration']+'</td>';
    string += '<td>'+task['priority']+'</td>';
    string += '<td>'+task['category_id']+'</td>';
    string += '<td><a class="btn btn-default btn-sm task-delete" href="#" data-id="'+task['id']+'">DEL</a></td>';
    string += '</tr>'
  }

  string += '</tbody></table>';

  return string;
}

generateTasksSelect = function(data){
  string = ""

  for (i = 0; i < data.length; i++){
    task = data[i];

    string += '<option value="'+task['id']+'">'+task['title']+'</option>';
  }

  return string;
}

deleteTask = function(e){
  e.preventDefault();

  container = $(this).closest("tr");
  id = $(this).data("id");

  request = $.ajax({
    url: "http://0.0.0.0:3000/api/v1/tasks/"+id+".json",
    type: "DELETE"
  });

  request.done(function(data){
    console.log(data);
    $(container).remove();

    refreshBusinesses();
  });

  request.error(function(msg){
    alert("Error removing business");
  });
}