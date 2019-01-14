function calculateTotalSum() {
  var sum = 0;
  //iterate through each textboxes and add the values
  $(".total").each(function () {
      var dd = this.value;
      //add only if the value is number
      if (!isNaN(this.value) && this.value.length != 0) {
          sum += parseFloat(this.value);
      }

  });
  //.toFixed() method will roundoff the final sum to 2 decimal places
  $("#sum").html(sum.toFixed(2));
}

$("table").on("keyup", ".total", function () {
  calculateTotalSum();
});

$("table").on("keyup", ".qty", function () {
  var qty = this.value;
  var unit_price = $(this).find(".unit").val();
  var unit_price1 =($(this).closest('tr').find('.unit'))["0"].value;
  var vat =($(this).closest('tr').find('.vat'))["0"].value;
  var total = (qty*unit_price)+((qty*unit_price)*(vat/100));
  ($(this).closest('tr').find('.total'))["0"].value = total.toFixed(2);
  calculateTotalSum();
});

$("table").on("keyup", ".unit", function () {
  var unit_price = this.value;
  var qty =($(this).closest('tr').find('.qty'))["0"].value;
  var vat =($(this).closest('tr').find('.vat'))["0"].value;
  var total = (qty*unit_price)+((qty*unit_price)*(vat/100));
  ($(this).closest('tr').find('.total'))["0"].value = total.toFixed(2);
  calculateTotalSum();
});

$("table").on("keyup", ".vat", function () {
  var vat = this.value;
  var qty =($(this).closest('tr').find('.qty'))["0"].value;
  var unit_price =($(this).closest('tr').find('.unit'))["0"].value;
  var total = (qty*unit_price)+((qty*unit_price)*(vat/100));
  ($(this).closest('tr').find('.total'))["0"].value = total.toFixed(2);
  calculateTotalSum();
});