function toasterMessage(type, message) {
    if(type == 'success') {
        var title = '';
        var icon = BASE_URL+"assets/images/alert-icons/alert-checked.svg";
    }
    if(type == 'info') {
        // var title = 'Info';
        var title = '';
        var icon = BASE_URL+"assets/images/alert-icons/alert-checked.svg";
    }
    if(type == 'warning') {
        var title = '';
        var icon = BASE_URL+"assets/images/alert-icons/alert-danger.svg";
    }
    if(type == 'error') {
        var title = '';
        var icon = BASE_URL+"assets/images/alert-icons/alert-disabled.svg";
    }
    if(type == 'error')
        type = "danger";
    $.notify({
        icon: icon,
        title: "<strong>"+title+"</strong> ",
        message: message            
    },{
        icon_type: 'image',
        type: type,
        allow_duplicates: false
    });
}
$( function() {
    $( ".datepicker" ).datepicker({
        changeMonth: true,
        changeYear: true,
    });
} );
$(".date-mask").inputmask("mm/dd/yyyy",{ 'placeholder': 'MM/DD/YYYY', "onincomplete": function(){
    // alert('inputmask complete');
    $(this).val('');
} });
// localStorage.removeItem("tasks");
var oldTask = localStorage.getItem("tasks");    //Get previous task added list
if(oldTask) {
    jsonObj = JSON.parse(oldTask);
}
else {
    jsonObj = [];
}
$( "#taskForm" ).submit(function( event ) {
    if($(this).parsley().isValid()){
        item = {}
        item ["name"] = $("#taskForm input[name=task_name]").val();
        item ["date"] = $("#taskForm input[name=task_date]").val();
        item ["description"] = $("#taskForm textarea[name=task_description]").val();
        jsonObj.push(item);
        var myString = JSON.stringify(jsonObj);
        localStorage.setItem("tasks", myString);
        getData();
        toasterMessage('success', 'Task added successfully.')
        $("form")[0].reset();
        setTimeout(function(){           
         $("form").parsley().reset();
        }, 0);
     }
    event.preventDefault();
});

function getData() {
    var tasks = localStorage.getItem("tasks");
    tasks = JSON.parse(tasks);
    if(tasks){
        tasks = tasks.reverse();        //Reverse task array to get latest task first
        $("#taskList").html('');
        $.each(tasks, function( index, value ) {
            var task_name = value.name.charAt(0).toUpperCase() + value.name.slice(1);
            var task_description = value.description.charAt(0).toUpperCase() + value.description.slice(1);
            var task_date = value.date;
            $("#taskList").append('<li class="text-tile"> <div class="text-sub-tile"> <a href="javascript:void(0);" class="delete_task" data-id="'+index+'"><img src="'+BASE_URL+'assets/images/close.svg" /></a><div class="text-heading">'+task_name+'</div><div class="date-wrap"><b>Date</b>: '+task_date+'</div> <p class="text-content">'+task_description+'</p> </div> </li>');
        });
    }
    return false;
}
$("body").on('click', '.delete_task', function() {
    swal({
        title: "Are you sure?",
        text: "You want to remove this task!",
        icon: "warning",
        // buttons: true,
        buttons: ['Cancel', 'Yes'],
        dangerMode: true,
    })
    .then((willDelete) => {
        if (willDelete) {
            var task_id = $(this).data('id');       //Get task id to remove a particular task
            var tasks = localStorage.getItem("tasks");
            tasks = JSON.parse(tasks);
            tasks = tasks.reverse();
            tasks.splice(task_id, 1);
            tasks = tasks.reverse();

            jsonObj = tasks;

            var myString = JSON.stringify(tasks);
            localStorage.setItem("tasks", myString);
            getData();
            toasterMessage('success', 'Task deleted successfully.')
        }
    });
});
$("body").on('click', '.close.close-btn', function() {
    $(this).parent('.custom-alert-msg-wrap').hide();
    // alert();
});
getData();