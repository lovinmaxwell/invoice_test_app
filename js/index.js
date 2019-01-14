var $TABLE = $('#table');
var $BTN = $('#export-btn');
var $EXPORT = $('#export');

$('.table-add').click(function () {
  var $clone = $TABLE.find('tr.hide').clone(true).removeClass('hide table-line').addClass("edit-table");
  $TABLE.find('table').append($clone);
});

$('.table-remove').click(function () {
  $(this).parents('tr').detach();
  calculateTotalSum();
});

$('.table-up').click(function () {
  var $row = $(this).parents('tr');
  if ($row.index() === 1) return; // Don't go above the header
  $row.prev().before($row.get(0));
});

$('.table-down').click(function () {
  var $row = $(this).parents('tr');
  $row.next().after($row.get(0));
});

// A few jQuery helpers for exporting only
jQuery.fn.pop = [].pop;
jQuery.fn.shift = [].shift;

$BTN.click(function () {
  var $rows = $TABLE.find('tr:not(:hidden)');
  var headers = [];
  var data = [];
  
  // Get the headers (add special header logic here)
  $($rows.shift()).find('th:not(:empty)').each(function () {
    headers.push($(this).text().toLowerCase());
  });
  
  // Turn all existing rows into a loopable array
  $rows.each(function () {
    var $td = $(this).find('td');
    var h = {};
    
    // Use the headers from earlier to name our hash keys
    headers.forEach(function (header, i) {
      h[header] = $td.eq(i).text();   
    });
    
    data.push(h);
  });
  
  // Output the result
  $EXPORT.text(JSON.stringify(data));
});

// function calculateTotalSum() {
//   var sum = 0;
//   //iterate through each textboxes and add the values
//   $(".total").each(function () {
//       var dd = this.value;
//       //add only if the value is number
//       if (!isNaN(this.value) && this.value.length != 0) {
//           sum += parseFloat(this.value);
//       }

//   });
//   //.toFixed() method will roundoff the final sum to 2 decimal places
//   $("#sum").html(sum.toFixed(2));
// }

// $("table").on("keyup", ".total", function () {
//   calculateTotalSum();
// });

// // function calculateLineTotalSum() {
// //   var qty = 0;
// //   //iterate through each text boxes and add the values
// //   $(this).parents.value
// //       if (!isNaN(this.value) && this.value.length != 0) {
// //           sum += parseFloat(this.value);
// //       }
// //   //.toFixed() method will roundoff the final sum to 2 decimal places
// //   $("#sum").html(sum.toFixed(2));
// // }

// $("table").on("keyup", ".qty", function () {
//   var qty = this.value;
//   var unit_price =($(this).closest('tr').find('.unit'))["0"].value;
//   var vat =($(this).closest('tr').find('.vat'))["0"].value;
//   var total = (qty*unit_price)+((qty*unit_price)*(vat/100));
//   ($(this).closest('tr').find('.total'))["0"].value = total.toFixed(2);
//   calculateTotalSum();
// });

// $("table").on("keyup", ".unit", function () {
//   var unit_price = this.value;
//   var qty =($(this).closest('tr').find('.qty'))["0"].value;
//   var vat =($(this).closest('tr').find('.vat'))["0"].value;
//   var total = (qty*unit_price)+((qty*unit_price)*(vat/100));
//   ($(this).closest('tr').find('.total'))["0"].value = total.toFixed(2);
//   calculateTotalSum();
// });

// $("table").on("keyup", ".vat", function () {
//   var vat = this.value;
//   var qty =($(this).closest('tr').find('.qty'))["0"].value;
//   var unit_price =($(this).closest('tr').find('.unit'))["0"].value;
//   var total = (qty*unit_price)+((qty*unit_price)*(vat/100));
//   ($(this).closest('tr').find('.total'))["0"].value = total.toFixed(2);
//   calculateTotalSum();
// });

