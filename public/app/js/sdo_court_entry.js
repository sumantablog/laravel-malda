
    $(document).ready(function () {
        $('#nxt_hearing_date').datepicker({
            format: 'dd/mm/yyyy',
            autoclose: true,
            // endDate: "today",
            todayHighlight: true,
        }).on('change', function(e) {
            // Revalidate the date field
            $('#sdocourt_entry').bootstrapValidator('revalidateField', 'nxt_hearing_date');
        });
       
        $('#sdocourt_entry').bootstrapValidator({
            message: 'This value is not valid',
            fields: {
                case_number: {
                    validators: {
                        notEmpty: {
                            message: 'Case Number is Required'
                        },
                        regexp: {
                            regexp: /^[A-Za-z0-9./\-_\s]+$/i,
                            message: 'Only Alphanumeric Space and (./-_) allowed here'
                        },
                        stringLength: {
                            min: 1,
                            max: 40,
                            message: 'Case Number Must be between 1 to 40 Character'
                        }
                    }
                },

                nxt_hearing_date: {
                    validators: {
                        notEmpty: {
                            message:  'Next hearing date is required'
                        },
                        date: {
                            format: 'DD/MM/YYYY',
                            message: 'Next Hearing Date Should be DD/MM/YYYY Format'
                        }

                    }
                },
                description: {
                    validators: {
                        notEmpty: {
                            message: 'Description is Required'
                        },
                        regexp: {
                            regexp: /^[A-Za-z0-9./\-_\s]+$/i,
                            message: 'Only Alphanumeric Space and (./-_) allowed here'
                        },
                        stringLength: {
                            min: 1,
                            max: 100,
                            message: 'Description Must be between 1 to 100 Character'
                        }
                    }
                }


            }
        }).on('success.form.bv', function (e) {
            e.preventDefault();
            caseEntry();
        });

// <?php if (isset($case_details)) { ?>
//             $('#login').val('Update');

//             $("#edit_code").val("<?php echo $case_details->code ?>");
//             $("#description").val("<?php echo $case_details->description ?>");
//             $("#nxt_hearing_date").val("<?php echo $case_details->nxt_hearing_date ?>");
//             $("#case_number").val("<?php echo $case_details->case_no ?>");
// <?php } ?>

        function caseEntry() {
            var case_number = $('#case_number').val();
            var nxt_hearing_date = $('#nxt_hearing_date').val();
            var description = $('#description').val();
            var edit_code = $('#edit_code').val();



            var fd = new FormData();
            fd.append('case_number', case_number);
            fd.append('nxt_hearing_date', nxt_hearing_date);
            fd.append('description', description);
            fd.append('edit_code', edit_code);
            fd.append('_token', $('input[name="_token"]').val());


            $.ajax({
                type: 'POST',
                url: "save_case",
                data: fd,
                processData: false,
                contentType: false,
                dataType: "json",
                success: function (data) {
if(data.logout_error==true){
                  logout_error();
                }
                    if (data.status == 1) {

                        $.confirm({
                            title: 'Success!!',
                            type: 'green',
                            icon: 'fa fa-success',
                            content: "Case details Added Successfully",
                            buttons: {
                                Ok: function () {
                                    $('#sdocourt_entry').get(0).reset();
                                    $('#sdocourt_entry').bootstrapValidator('resetForm', true);
                                }
                            }
                        });


                    } else if (data.status == 2) {

                        $.confirm({
                            title: 'Success!!',
                            type: 'green',
                            icon: 'fa fa-success',
                            content: "Case details Updated Successfully",
                            buttons: {
                                Ok: function () {
                                    window.location.href = "case_list";
                                }
                            }
                        });
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $(".se-pre-con").fadeOut("slow");
                    var msg = "";
                    if (jqXHR.status !== 422 && jqXHR.status !== 400) {
                        msg += "<strong>" + jqXHR.status + ": " + errorThrown + "</strong>";
                    } else {
                        if (jqXHR.responseJSON.hasOwnProperty('exception')) {
                            msg += "Server Error";
                        } else {
                            msg += "Error(s):<strong><ul>";
                            $.each(jqXHR.responseJSON['errors'], function (key, value) {
                                msg += "<li>" + value + "</li>";
                            });
                            msg += "</ul></strong>";
                        }
                    }
                    $.alert({
                        title: 'Error!!',
                        type: 'red',
                        icon: 'fa fa-warning',
                        content: msg,
                    });
                    //$("#save_app").attr('disabled',false);
                }
            });
        }
    });
    function isNumberKey(evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;
        return true;
    }
