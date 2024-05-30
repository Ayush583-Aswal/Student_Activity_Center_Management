const body = document.querySelector("body");
const darkLight = document.querySelector("#darkLight");
const sidebar = document.querySelector(".sidebar");
const submenuItems = document.querySelectorAll(".submenu_item");
const sidebarOpen = document.querySelector("#sidebarOpen");
const sidebarClose = document.querySelector(".collapse_sidebar");
const sidebarExpand = document.querySelector(".expand_sidebar");
sidebarOpen.addEventListener("click", () => sidebar.classList.toggle("close"));

sidebarClose.addEventListener("click", () => {
  sidebar.classList.add("close", "hoverable");
});
sidebarExpand.addEventListener("click", () => {
  sidebar.classList.remove("close", "hoverable");
});

sidebar.addEventListener("mouseenter", () => {
  if (sidebar.classList.contains("hoverable")) {
    sidebar.classList.remove("close");
  }
});
sidebar.addEventListener("mouseleave", () => {
  if (sidebar.classList.contains("hoverable")) {
    sidebar.classList.add("close");
  }
});

darkLight.addEventListener("click", () => {
  body.classList.toggle("dark");
  if (body.classList.contains("dark")) {
    document.setI
    darkLight.classList.replace("bx-sun", "bx-moon");
  } else {
    darkLight.classList.replace("bx-moon", "bx-sun");
  }
});

submenuItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    item.classList.toggle("show_submenu");
    submenuItems.forEach((item2, index2) => {
      if (index !== index2) {
        item2.classList.remove("show_submenu");
      }
    });
  });
});

if (window.innerWidth < 768) {
  sidebar.classList.add("close");
} else {
  sidebar.classList.remove("close");
}
const bookActivityBtn = document.getElementById("bookActivityBtn");
        const bookActivityForm = document.getElementById("bookActivityForm");
        const viewActivitiesBtn = document.getElementById("viewActivitiesBtn");
        const signedUpActivities = document.getElementById("signedUpActivities");
        const activitiesTable = document
          .getElementById("activitiesTable")
          .getElementsByTagName("tbody")[0];
        const scheduleEventTab = document.getElementById("scheduleEventTab");
        const scheduleEventBtn = document.getElementById("scheduleEventBtn");
        const scheduleEventForm = document.getElementById("scheduleEventForm");
  
        const studentId = new URLSearchParams(window.location.search).get(
          "student_id"
        );
  
        const viewAllBookedActivitiesBtn = document.getElementById(
          "viewAllBookedActivitiesBtn"
        );
        const allBookedActivities = document.getElementById(
          "allBookedActivities"
        );
        const allBookedActivitiesTable = document
          .getElementById("allBookedActivitiesTable")
          .getElementsByTagName("tbody")[0];
        const filterBookedActivitiesForm = document.getElementById(
          "filterBookedActivitiesForm"
        );
  
        viewAllBookedActivitiesBtn.addEventListener("click", () => {
          bookActivityForm.style.display = "none";
          signedUpActivities.style.display = "none";
          scheduleEventForm.style.display = "none";
          allBookedActivities.style.display = "block";
          loadAllBookedActivities();
        });
  
        function showScheduleEventTab() {
          scheduleEventTab.style.display = "inline-block";
        }
  
        function hideScheduleEventTab() {
          scheduleEventTab.style.display = "none";
        }
  
        // Show or hide the "Schedule Event" tab based on the student ID
        fetch("/check-allowed-students", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ studentId }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.isAllowed) {
              showScheduleEventTab();
            } else {
              hideScheduleEventTab();
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            hideScheduleEventTab();
          });
  
        scheduleEventBtn.addEventListener("click", () => {
          bookActivityForm.style.display = "none";
          signedUpActivities.style.display = "none";
          scheduleEventForm.style.display = "block";
          allBookedActivities.style.display = "none";
        });
  
        bookActivityBtn.addEventListener("click", () => {
          bookActivityForm.style.display = "block";
          signedUpActivities.style.display = "none";
          allBookedActivities.style.display = "none";
        });
  
        viewActivitiesBtn.addEventListener("click", () => {
          bookActivityForm.style.display = "none";
          signedUpActivities.style.display = "block";
          allBookedActivities.style.display = "none";
          loadSignedUpActivities();
        });
  
        document
          .getElementById("activityForm")
          .addEventListener("submit", (e) => {
            e.preventDefault();
  
            const activityType = document.getElementById("activityType").value;
            const activityDate = document.getElementById("activityDate").value;
            const activityTime = document.getElementById("activityTime").value;
            const studentId = new URLSearchParams(window.location.search).get(
              "student_id"
            );
  
            fetch("/book-activity", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                studentId,
                activityId: activityType,
                activityDate,
                activityTime,
              }),
            })
              .then((response) => {
                if (response.ok) {
                  // Activity booked successfully
                  console.log("Activity booked successfully");
                  alert("Activity booked successfully");
                  // Reload the signed up activities
                  loadSignedUpActivities();
                } else {
                  // Handle booking failure
                  console.error("Error booking activity");
                }
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          });
  
        document.getElementById("eventForm").addEventListener("submit", (e) => {
          e.preventDefault();
  
          const studentId = new URLSearchParams(window.location.search).get(
            "student_id"
          );
          const eventName = document.getElementById("eventName").value;
          const eventDate = document.getElementById("eventDate").value;
          const eventTime = document.getElementById("eventTime").value;
          const eventActivity = document.getElementById("eventActivity").value;
  
          fetch("/schedule-event", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              studentId,
              eventName,
              eventDate,
              eventTime,
              eventActivity,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log(data.message);
              alert(data.message);
              // Reset the form or perform any additional actions
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        });
  
        function loadAllBookedActivities() {
          fetch("/get-all-booked-activities")
            .then((response) => response.json())
            .then((activities) => {
              allBookedActivitiesTable.innerHTML = "";
  
              activities.forEach((activity) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                <td>${activity.student_id}</td>
                <td>${activity.student_name}</td>
                <td>${activity.activity}</td>
                <td>${activity.formatted_date}</td>
                <td>${activity.time}</td>
              `;
                allBookedActivitiesTable.appendChild(row);
              });
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }
  
        filterBookedActivitiesForm.addEventListener("submit", (e) => {
          e.preventDefault();
  
          const startTime = document.getElementById("startTime").value;
          const endTime = document.getElementById("endTime").value;
          const startDate = document.getElementById("startDate").value;
          const endDate = document.getElementById("endDate").value;
  
          fetch("/filter-booked-activities", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ startTime, endTime, startDate, endDate }),
          })
            .then((response) => response.json())
            .then((activities) => {
              allBookedActivitiesTable.innerHTML = "";
  
              activities.forEach((activity) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                <td>${activity.student_id}</td>
                <td>${activity.student_name}</td>
                <td>${activity.activity}</td>
                <td>${activity.formatted_date}</td>
                <td>${activity.time}</td>
              `;
                allBookedActivitiesTable.appendChild(row);
              });
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        });
  
        function loadSignedUpActivities() {
          const studentId = new URLSearchParams(window.location.search).get(
            "student_id"
          );
  
          fetch(`/get-signed-up-activities?student_id=${studentId}`)
            .then((response) => response.json())
            .then((activities) => {
              // Clear the table body
              activitiesTable.innerHTML = "";
  
              // Populate the table with the signed up activities
              activities.forEach((activity) => {
                const row = document.createElement("tr");
                row.innerHTML = `
              <td>${activity.activity}</td>
              <td>${activity.formatted_date}</td>
              <td>${activity.time}</td>
            `;
                activitiesTable.appendChild(row);
              });
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }