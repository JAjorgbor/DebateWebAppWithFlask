/*Utility functions*/
const serializeFormData = (form) => {
  formArray = form.serializeArray();
  const formData = {};
  formArray.forEach(({ name, value }) => {
    formData[name] = value;
  });
  return JSON.stringify(formData);
};
// Function to delete a cookie
function deleteCookie(name, path = "/") {
  // Set the expiration date to a time in the past
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
}

// Function to get a cookie value by name
function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null; // Return cookie value or null if not found
}

function setCookie(name, value, days = 7, path = "/") {
  // Create a date object to set expiration date
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Convert days to milliseconds
  const expires = "expires=" + date.toUTCString(); // Convert the expiration date to UTC string

  // Set the cookie with name, value, expiration, and path
  document.cookie = `${name}=${value}; ${expires}; path=${path}`;
}
let isLoggedIn = Boolean(getCookie("isLoggedIn"));

// root executable code
$(document).ready(function () {
  // show or hide logout and login buttons depending on user session
  if (isLoggedIn) {
    $("#login-btn").hide();
    $("#logout-btn").show();
  } else {
    $("#login-btn").show();
    $("#logout-btn").hide();
  }

  $("#logout-btn").on("click", () => {
    deleteCookie("isLoggedIn");
    window.location = window.location;
  });

  $(".modal-trigger").click(function () {
    $(".modal").fadeOut();
    const modalId = $(this).data("modal-id");

    $(`.modal[data-modal-id='${modalId}']`).fadeIn();
  });

  $(".modal-overlay").click(function () {
    const modalId = $(this).data("modal-id");
    $(`.modal[data-modal-id='${modalId}']`).fadeOut();
  });

  $(".modal .title .close-btn").click(function () {
    const modalId = $(this).data("modal-id");
    $(`.modal[data-modal-id='${modalId}']`).fadeOut();
  });

  // handle create account form submit
  $("#create-account-form").on("submit", function (e) {
    e.preventDefault();
    const thisForm = $(this);
    const data = serializeFormData(thisForm);
    console.log("Serialized data:", data);
    $.post({
      url: "/create_user",
      data: data, // Send the JSON string as data
      success: function (data, textStatus, jqXHR) {
        thisForm[0].reset();
        setCookie("isLoggedIn", true);
        alert("Account Created Successfully");
      },
      error: function (jqXHR) {
        alert(jqXHR.responseJSON.error || "Something went wrong.");
      },
      contentType: "application/json", // Specify content type as JSON
      dataType: "json", // Specify expected response data type
    });
  });
  // handle login form submit
  $("#login-form").on("submit", function (e) {
    e.preventDefault();
    const thisForm = $(this);
    const data = serializeFormData(thisForm);
    console.log("Serialized data:", data);
    $.post({
      url: "/login",
      data: data, // Send the JSON string as data
      success: function (data, textStatus, jqXHR) {
        setCookie("isLoggedIn", true);
        window.location = window.location;
        thisForm[0].reset();
        alert("Log in Successfull");
      },
      error: function (jqXHR) {
        alert(jqXHR.responseJSON.error || "Something went wrong.");
      },
      contentType: "application/json", // Specify content type as JSON
      dataType: "json", // Specify expected response data type
    });
  });
});
