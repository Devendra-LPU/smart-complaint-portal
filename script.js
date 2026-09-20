/* =====================================================
   SMART COMMUNITY COMPLAINT PORTAL
   COMPLETE JAVASCRIPT - PHASE 6
   ===================================================== */


/* ================= GET ELEMENTS ================= */

const complaintForm =
    document.getElementById("complaintForm");

const successMessage =
    document.getElementById("successMessage");

const generatedComplaintId =
    document.getElementById("generatedComplaintId");

const trackForm =
    document.getElementById("trackForm");

const trackingResult =
    document.getElementById("trackingResult");

const complaintsList =
    document.getElementById("complaintsList");

const statusFilter =
    document.getElementById("statusFilter");

const categoryFilter =
    document.getElementById("categoryFilter");

const adminComplaintsList =
    document.getElementById("adminComplaintsList");


/* ================= LOAD DATA ================= */

let complaints =
    JSON.parse(
        localStorage.getItem("complaints")
    ) || [];


/* ================= SAVE DATA ================= */

function saveComplaints() {

    localStorage.setItem(
        "complaints",
        JSON.stringify(complaints)
    );

}


/* ================= GENERATE ID ================= */

function generateComplaintId() {

    const year =
        new Date().getFullYear();

    const number =
        String(complaints.length + 1)
        .padStart(3, "0");

    return `CMP-${year}-${number}`;

}


/* ================= UI MESSAGE ================= */

function showMessage(message, type) {

    const messageBox =
        document.createElement("div");


    messageBox.textContent =
        message;


    messageBox.style.padding =
        "12px";


    messageBox.style.margin =
        "15px auto";


    messageBox.style.maxWidth =
        "600px";


    messageBox.style.borderRadius =
        "8px";


    messageBox.style.textAlign =
        "center";


    if (type === "error") {

        messageBox.style.background =
            "#fee2e2";

        messageBox.style.color =
            "#991b1b";

    }


    complaintForm.prepend(
        messageBox
    );


    setTimeout(
        function() {

            messageBox.remove();

        },
        3000
    );

}


/* ================= SUBMIT COMPLAINT ================= */

complaintForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        /* Get form values */

        const name =
            document.getElementById("name")
            .value
            .trim();


        const phone =
            document.getElementById("phone")
            .value
            .trim();


        const email =
            document.getElementById("email")
            .value
            .trim();


        const category =
            document.getElementById("category")
            .value;


        const location =
            document.getElementById("location")
            .value
            .trim();


        const description =
            document.getElementById("description")
            .value
            .trim();


        const evidence =
            document.getElementById("evidence");


        /* ================= VALIDATION ================= */

        if (
            !name ||
            !phone ||
            !email ||
            !category ||
            !location ||
            !description
        ) {

            showMessage(
                "Please fill all required fields.",
                "error"
            );

            return;

        }


        /* Phone validation */

        const phonePattern =
            /^[0-9]{10}$/;


        if (
            !phonePattern.test(phone)
        ) {

            showMessage(
                "Please enter a valid 10-digit contact number.",
                "error"
            );

            return;

        }


        /* ================= EVIDENCE ================= */

        let evidenceName =
            "No evidence uploaded";


        if (
            evidence.files &&
            evidence.files.length > 0
        ) {

            evidenceName =
                evidence.files[0].name;

        }


        /* ================= CREATE COMPLAINT ================= */

        const complaint = {

            id:
                generateComplaintId(),

            name:
                name,

            phone:
                phone,

            email:
                email,

            category:
                category,

            location:
                location,

            description:
                description,

            evidence:
                evidenceName,

            status:
                "Submitted",

            date:
                new Date()
                .toLocaleDateString()

        };


        /* Add */

        complaints.push(
            complaint
        );


        /* Save */

        saveComplaints();


        /* ================= SUCCESS ================= */

        generatedComplaintId.textContent =
            complaint.id;


        successMessage.hidden =
            false;


        /* Reset */

        complaintForm.reset();


        /* Refresh UI */

        displayComplaints();

        updateStatistics();

        displayAdminComplaints();


        /* Scroll */

        successMessage.scrollIntoView({
            behavior: "smooth"
        });

    }
);


/* ================= DISPLAY COMPLAINTS ================= */

function displayComplaints() {

    if (
        complaints.length === 0
    ) {

        complaintsList.innerHTML = `
            <p class="empty-message">
                No complaints have been submitted yet.
            </p>
        `;

        return;

    }


    complaintsList.innerHTML =
        "";


    const reversedComplaints =
        [...complaints].reverse();


    reversedComplaints.forEach(
        function(complaint) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "complaint-card";


            const title =
                document.createElement(
                    "h3"
                );


            title.textContent =
                complaint.id;


            const category =
                document.createElement(
                    "p"
                );


            category.textContent =
                `Category: ${complaint.category}`;


            const location =
                document.createElement(
                    "p"
                );


            location.textContent =
                `Location: ${complaint.location}`;


            const status =
                document.createElement(
                    "p"
                );


            status.textContent =
                `Status: ${complaint.status}`;


            const date =
                document.createElement(
                    "p"
                );


            date.textContent =
                `Date: ${complaint.date}`;


            card.appendChild(
                title
            );


            card.appendChild(
                category
            );


            card.appendChild(
                location
            );


            card.appendChild(
                status
            );


            card.appendChild(
                date
            );


            complaintsList.appendChild(
                card
            );

        }
    );

}


/* ================= TRACK FORM ================= */

trackForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const trackId =
            document.getElementById(
                "trackId"
            )
            .value
            .trim()
            .toUpperCase();


        const complaint =
            complaints.find(
                function(item) {

                    return (
                        item.id === trackId
                    );

                }
            );


        trackingResult.hidden =
            false;


        if (!complaint) {

            trackingResult.innerHTML = `
                <h3>
                    ❌ Complaint Not Found
                </h3>

                <p>
                    No complaint was found with ID:
                    <strong>
                        ${escapeHTML(trackId)}
                    </strong>
                </p>
            `;

            return;

        }


        displayTrackingResult(
            complaint
        );

    }
);


/* ================= TRACKING RESULT ================= */

function displayTrackingResult(
    complaint
) {

    trackingResult.innerHTML =
        "";


    const title =
        document.createElement(
            "h3"
        );


    title.textContent =
        "Complaint Found ✅";


    trackingResult.appendChild(
        title
    );


    const details =
        document.createElement(
            "div"
        );


    details.innerHTML = `

        <p>
            <strong>
                Complaint ID:
            </strong>

            ${escapeHTML(
                complaint.id
            )}
        </p>

        <p>
            <strong>
                Category:
            </strong>

            ${escapeHTML(
                complaint.category
            )}
        </p>

        <p>
            <strong>
                Location:
            </strong>

            ${escapeHTML(
                complaint.location
            )}
        </p>

        <p>
            <strong>
                Status:
            </strong>

            ${escapeHTML(
                complaint.status
            )}
        </p>

        <p>
            <strong>
                Submitted:
            </strong>

            ${escapeHTML(
                complaint.date
            )}
        </p>

    `;


    trackingResult.appendChild(
        details
    );


    const timeline =
        createTimeline(
            complaint.status
        );


    trackingResult.appendChild(
        timeline
    );


    trackingResult.scrollIntoView({
        behavior: "smooth"
    });

}


/* ================= TIMELINE ================= */

function createTimeline(
    currentStatus
) {

    const container =
        document.createElement(
            "div"
        );


    container.className =
        "status-timeline";


    const statuses = [

        "Submitted",

        "Verified",

        "In Progress",

        "Resolved"

    ];


    const currentIndex =
        statuses.indexOf(
            currentStatus
        );


    statuses.forEach(
        function(status, index) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "timeline-item";


            if (
                index <= currentIndex
            ) {

                item.classList.add(
                    "active"
                );


                item.textContent =
                    `● ${status}`;

            } else {

                item.textContent =
                    `○ ${status}`;

            }


            container.appendChild(
                item
            );

        }
    );


    return container;

}


/* ================= ADMIN DISPLAY ================= */

function displayAdminComplaints() {

    const selectedStatus =
        statusFilter.value;


    const selectedCategory =
        categoryFilter.value;


    const filteredComplaints =
        complaints.filter(
            function(complaint) {

                const statusMatch =
                    selectedStatus === "All" ||
                    complaint.status ===
                    selectedStatus;


                const categoryMatch =
                    selectedCategory === "All" ||
                    complaint.category ===
                    selectedCategory;


                return (
                    statusMatch &&
                    categoryMatch
                );

            }
        );


    adminComplaintsList.innerHTML =
        "";


    if (
        filteredComplaints.length === 0
    ) {

        adminComplaintsList.innerHTML = `
            <p class="empty-message">
                No matching complaints found.
            </p>
        `;

        return;

    }


    filteredComplaints
        .slice()
        .reverse()
        .forEach(
            function(complaint) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "admin-complaint-card";


                const title =
                    document.createElement(
                        "h3"
                    );


                title.textContent =
                    complaint.id;


                const category =
                    document.createElement(
                        "p"
                    );


                category.textContent =
                    `Category: ${complaint.category}`;


                const location =
                    document.createElement(
                        "p"
                    );


                location.textContent =
                    `Location: ${complaint.location}`;


                const description =
                    document.createElement(
                        "p"
                    );


                description.textContent =
                    `Description: ${complaint.description}`;


                const evidence =
                    document.createElement(
                        "p"
                    );


                evidence.textContent =
                    `Evidence: ${complaint.evidence}`;


                const label =
                    document.createElement(
                        "label"
                    );


                label.textContent =
                    "Update Status:";


                const select =
                    document.createElement(
                        "select"
                    );


                select.className =
                    "status-select";


                select.dataset.id =
                    complaint.id;


                const statuses = [

                    "Submitted",

                    "Verified",

                    "In Progress",

                    "Resolved"

                ];


                statuses.forEach(
                    function(status) {

                        const option =
                            document.createElement(
                                "option"
                            );


                        option.value =
                            status;


                        option.textContent =
                            status;


                        if (
                            status ===
                            complaint.status
                        ) {

                            option.selected =
                                true;

                        }


                        select.appendChild(
                            option
                        );

                    }
                );


                card.appendChild(
                    title
                );


                card.appendChild(
                    category
                );


                card.appendChild(
                    location
                );


                card.appendChild(
                    description
                );


                card.appendChild(
                    evidence
                );


                card.appendChild(
                    label
                );


                card.appendChild(
                    select
                );


                adminComplaintsList.appendChild(
                    card
                );


                select.addEventListener(
                    "change",
                    function() {

                        updateComplaintStatus(
                            complaint.id,
                            select.value
                        );

                    }
                );

            }
        );

}


/* ================= UPDATE STATUS ================= */

function updateComplaintStatus(
    complaintId,
    newStatus
) {

    const complaint =
        complaints.find(
            function(item) {

                return (
                    item.id ===
                    complaintId
                );

            }
        );


    if (!complaint) {

        return;

    }


    complaint.status =
        newStatus;


    saveComplaints();


    displayComplaints();

    updateStatistics();

    displayAdminComplaints();


    const currentTrackedId =
        document.getElementById(
            "trackId"
        )
        .value
        .trim()
        .toUpperCase();


    if (
        currentTrackedId ===
        complaintId
    ) {

        displayTrackingResult(
            complaint
        );

    }

}


/* ================= STATISTICS ================= */

function updateStatistics() {

    const total =
        complaints.length;


    const submitted =
        complaints.filter(
            function(item) {

                return (
                    item.status ===
                    "Submitted"
                );

            }
        ).length;


    const inProgress =
        complaints.filter(
            function(item) {

                return (
                    item.status ===
                    "In Progress"
                );

            }
        ).length;


    const resolved =
        complaints.filter(
            function(item) {

                return (
                    item.status ===
                    "Resolved"
                );

            }
        ).length;


    document.getElementById(
        "totalComplaints"
    ).textContent =
        total;


    document.getElementById(
        "submittedComplaints"
    ).textContent =
        submitted;


    document.getElementById(
        "progressComplaints"
    ).textContent =
        inProgress;


    document.getElementById(
        "resolvedComplaints"
    ).textContent =
        resolved;

}


/* ================= FILTERS ================= */

statusFilter.addEventListener(
    "change",
    displayAdminComplaints
);


categoryFilter.addEventListener(
    "change",
    displayAdminComplaints
);


/* ================= HTML ESCAPE ================= */

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* ================= INITIALIZE ================= */

displayComplaints();

updateStatistics();

displayAdminComplaints();