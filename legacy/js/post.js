$(document).ready(function() {
  $('.main-form').submit(function(event) {
    post_registration_data(false);
    event.preventDefault();
  });
});
// Handles post data
function post_registration_data(terms_accepted) {
  $('#first_name, #last_name, #email, #phone, #company_name, #position').removeClass('error');
  $('.help-block').remove();
  // var url_site = 'http://localhost:3000/trial_registrations';
  var url_site = 'http://e-lawsolutions.com/trial_registrations';
  var client_type_post = $("#client_type").val();
  var first_name_post = $("#first_name").val();
  var last_name_post = $("#last_name").val();
  var email_post = $("#email").val();
  var phone_post = $("#phone").val();
  var company_name_post = $("#company_name").val();
  var position_post = $("#position").val();
  var message_post = $("#message").val();
  var formData = {
      'trial_registration[client_type]' : client_type_post,
      'trial_registration[first_name]'  : first_name_post,
      'trial_registration[last_name]'   : last_name_post,
      'trial_registration[email]'       : email_post,
      'trial_registration[phone]'       : phone_post,
      'trial_registration[company_name]': company_name_post,
      'trial_registration[position]'    : position_post,
      'trial_registration[message]'     : message_post,
      'terms_accepted'                  : terms_accepted
  };
  $.ajax({
    type        : 'POST',
    url         : url_site,
    encode      : true,
    data        : formData
  })
 .done(function(data) {
    console.log('done');
    if (data.action == 'open_terms_modal') {
      console.log('open terms modal');
      // Action past it to parent from iFrame
      window.parent.openTerms();
    }
    else if (data.action == 'open_thankyou_modal') {
      console.log('open thankyou modal');
      window.parent.closeTerms();
      window.parent.openThankYouModal();
      $('.main-form-input, .main-form-text-area').val("");
    }
  })
  .fail(function(data) {
    console.log('fail');
    if (data.responseJSON.first_name) {
      $('#first_name').addClass('error');
      $('#first_name_group').append('<div class="help-block"> Required Field </div>');
    }
    if (data.responseJSON.last_name) {
      $('#last_name').addClass('error');
      $('#last_name_group').append('<div class="help-block"> Required Field </div>');
    }
    if (data.responseJSON.email) {
      $('#email').addClass('error');
      $('#email_group').append('<div class="help-block"> Required Field (use a valid email address) </div>');
    }
    if (data.responseJSON.phone) {
      $('#phone').addClass('error');
      $('#phone_group').append('<div class="help-block"> Required Field (use a valid phone/mobile) </div>');
    }
    if (data.responseJSON.company_name) {
      $('#company_name').addClass('error');
      $('#company_name_group').append('<div class="help-block"> Required Field </div>');
    }
    if (data.responseJSON.position) {
      $('#position').addClass('error');
      $('#position_group').append('<div class="help-block"> Required Field </div>');
    }
  });
}