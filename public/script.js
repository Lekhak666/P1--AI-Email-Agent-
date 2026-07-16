const prompt = document.getElementById("prompt");

const generateBtn = document.getElementById("generateBtn");

const approveBtn = document.getElementById("approveBtn");

const rejectBtn = document.getElementById("rejectBtn");

const emailOutput = document.getElementById("emailOutput");

const emailSection = document.getElementById("emailSection");

const status = document.getElementById("status");

generateBtn.onclick = async () => {

    const response = await fetch("/chat", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            message: prompt.value

        })

    });

    const data = await response.json();

    emailSection.classList.remove("hidden");

    emailOutput.textContent = data.email;

    status.innerHTML = data.message;

};

approveBtn.onclick = async () => {

    const response = await fetch("/chat", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            message: "yes"

        })

    });

    const data = await response.json();

    status.innerHTML =
        "✅ Email Approved.<br>Returned to Main Agent.";

};

rejectBtn.onclick = async () => {

    const response = await fetch("/chat", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            message: "no"

        })

    });

    const data = await response.json();

    status.innerHTML =
        "❌ Email Rejected.";

};