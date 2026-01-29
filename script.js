// Element references
const form = document.getElementById("regForm");
const submitBtn = document.getElementById("submitBtn");

const alertBox = document.getElementById("topAlert");
const alertMsg = alertBox.querySelector(".alert-message");
const alertClose = alertBox.querySelector(".alert-close");

const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const email = document.getElementById("email");
const age = document.getElementById("age");
const phone = document.getElementById("phone");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const country = document.getElementById("country");
const state = document.getElementById("state");
const city = document.getElementById("city");
const terms = document.getElementById("terms");
const strength = document.getElementById("strength");

// Country code mapping
const COUNTRY_CODES = {
    India: "+91",
    USA: "+1"
};

// Location data
const locationData = {
    India: {
        Telangana: ["Hyderabad", "Warangal"],
        Karnataka: ["Bangalore", "Mysore"]
    },
    USA: {
        California: ["Los Angeles", "San Francisco"],
        Texas: ["Dallas", "Austin"]
    }
};

// Alert helpers
function showAlert(type, text) {
    alertBox.className = "alert " + (type === "success" ? "alert-success" : "alert-error");
    alertMsg.innerText = text;
    alertBox.style.display = "block";
}

function hideAlert() {
    alertBox.style.display = "none";
}

alertClose.addEventListener("click", hideAlert);

// Dropdown logic
country.addEventListener("change", () => {
    state.innerHTML = '<option value="">Select State</option>';
    city.innerHTML = '<option value="">Select City</option>';

    if (country.value) {
        Object.keys(locationData[country.value]).forEach(s => {
            state.add(new Option(s, s));
        });
    }
    updateButtonState();
});

state.addEventListener("change", () => {
    city.innerHTML = '<option value="">Select City</option>';
    if (country.value && state.value) {
        locationData[country.value][state.value].forEach(c => {
            city.add(new Option(c, c));
        });
    }
});

// Password strength
password.addEventListener("input", () => {
    strength.className = "";
    if (!password.value) {
        strength.innerText = "";
        return;
    }
    if (password.value.length < 4) {
        strength.innerText = "Weak";
        strength.classList.add("weak");
    } else if (password.value.length < 8) {
        strength.innerText = "Medium";
        strength.classList.add("medium");
    } else {
        strength.innerText = "Strong";
        strength.classList.add("strong");
    }
    updateButtonState();
});

// Error helper
function setError(id, msg, show) {
    const field = document.getElementById(id);
    const err = document.getElementById(id + "Error");

    if (show && msg) {
        field.classList.add("input-error");
        err.innerText = msg;
    } else {
        field.classList.remove("input-error");
        err.innerText = "";
    }
}

// Validation
function validateForm(show) {
    let ok = true;

    if (!firstName.value.trim()) ok = setError("firstName", "First name is required", show), false;
    if (!lastName.value.trim()) ok = setError("lastName", "Last name is required", show), false;

    if (!email.value.trim()) ok = setError("email", "Email is required", show), false;

    // Age (optional): if provided, must be integer 1-120
    if (age) {
        const a = age.value.trim();
        if (a) {
            const n = Number(a);
            if (!Number.isInteger(n) || n <= 0 || n > 120) ok = setError("age", "Enter a valid age (1-120)", show), false;
            else setError("age", "", show);
        } else setError("age", "", show);
    }

    if (!phone.value.trim()) ok = setError("phone", "Phone number is required", show), false;
    else if (country.value && !phone.value.startsWith(COUNTRY_CODES[country.value]))
        ok = setError("phone", "Phone must match country code", show), false;

    if (!password.value) ok = setError("password", "Password required", show), false;
    if (password.value !== confirmPassword.value)
        ok = setError("password", "Passwords do not match", show), false;

    if (!document.querySelector('input[name="gender"]:checked')) {
        document.getElementById("genderError").innerText = show ? "Select gender" : "";
        ok = false;
    } else document.getElementById("genderError").innerText = "";

    if (!terms.checked) {
        document.getElementById("termsError").innerText = show ? "Accept terms" : "";
        ok = false;
    } else document.getElementById("termsError").innerText = "";

    return ok;
}

// Button state (visual only)
function updateButtonState() {
    submitBtn.classList.toggle("disabled-btn", !validateForm(false));
}

// Live listeners
[firstName, lastName, email, age, phone].forEach(el =>
    el && el.addEventListener("input", updateButtonState)
);

document.querySelectorAll('input[name="gender"]').forEach(r =>
    r.addEventListener("change", updateButtonState)
);

terms.addEventListener("change", updateButtonState);

// Submit
submitBtn.addEventListener("click", () => {
    hideAlert();
    if (!validateForm(true)) {
        showAlert("error", "Please fix the errors below");
        return;
    }
    showAlert("success", "Registration Successful!");
    form.reset();
    strength.innerText = "";
    updateButtonState();
});

updateButtonState();
