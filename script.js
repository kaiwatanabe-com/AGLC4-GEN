document.addEventListener("DOMContentLoaded", () => {
  // Initialize particles.js
  // Check if particlesJS is defined before using it
  if (typeof particlesJS !== "undefined") {
    particlesJS("particles-js", {
      particles: {
        number: {
          value: 40,
          density: { enable: true, value_area: 800 },
        },
        color: {
          value: ["#f5f5f7", "#a1a1a6", "#d2d2d7"],
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000",
          },
        },
        opacity: {
          value: 0.3,
          random: true,
          anim: {
            enable: true,
            speed: 0.3,
            opacity_min: 0.1,
            sync: false,
          },
        },
        size: {
          value: 2,
          random: true,
          anim: {
            enable: true,
            speed: 0.5,
            size_min: 0.1,
            sync: false,
          },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#a1a1a6",
          opacity: 0.2,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "grab",
          },
          onclick: {
            enable: true,
            mode: "push",
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 140,
            line_linked: {
              opacity: 0.4,
            },
          },
          push: {
            particles_nb: 2,
          },
        },
      },
      retina_detect: true,
    })
  } else {
    console.error("particlesJS is not defined. Make sure the particles.js library is included.")
  }

  // Initialize Flatpickr for date inputs with animation
  // Check if flatpickr is defined before using it
  if (typeof flatpickr !== "undefined") {
    flatpickr("#website-access-date, #newspaper-date, #conference-date", {
      dateFormat: "d/m/Y",
      animate: true,
      disableMobile: false,
    })
  } else {
    console.error("flatpickr is not defined. Make sure the Flatpickr library is included.")
  }

  // Hide all citation fields initially with smooth animation
  function hideAllFields() {
    document.querySelectorAll(".citation-fields").forEach((field) => {
      field.style.opacity = "0"
      setTimeout(() => {
        field.style.display = "none"
      }, 300)
    })
  }
  hideAllFields()

  // Show only the relevant fields based on the selected source type with animation
  function showRelevantFields(sourceType) {
    hideAllFields()
    const selectedFields = document.getElementById(sourceType + "-fields")
    if (selectedFields) {
      setTimeout(() => {
        selectedFields.style.display = "block"
        // Force reflow
        selectedFields.offsetHeight
        selectedFields.style.opacity = "1"
      }, 300)
    }
  }

  document.getElementById("source-type").addEventListener("change", function () {
    showRelevantFields(this.value)
  })

  // Toggle display of pinpoint fields with smooth animation
  function togglePinpoint(checkboxId, pinpointFieldsId) {
    const checkbox = document.getElementById(checkboxId)
    const pinpointFields = document.getElementById(pinpointFieldsId)

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        pinpointFields.style.display = "block"
        // Force reflow
        pinpointFields.offsetHeight
        pinpointFields.style.opacity = "1"
      } else {
        pinpointFields.style.opacity = "0"
        setTimeout(() => {
          pinpointFields.style.display = "none"
        }, 300)
      }
    })
  }

  togglePinpoint("case-domestic-pinpoint-toggle", "case-domestic-pinpoint-fields")
  togglePinpoint("case-international-pinpoint-toggle", "case-international-pinpoint-fields")
  togglePinpoint("book-pinpoint-toggle", "book-pinpoint-fields")
  togglePinpoint("journal-pinpoint-toggle", "journal-pinpoint-fields")
  togglePinpoint("legislation-pinpoint-toggle", "legislation-pinpoint-fields")

  // Function to generate the citation from input fields with animation
  window.generateCitation = () => {
    const sourceType = document.getElementById("source-type").value
    let citation = ""

    if (sourceType === "case-domestic") {
      const caseName = document.getElementById("case-domestic-name").value.trim()
      const reportSeries = document.getElementById("case-domestic-report").value.trim()
      const year = document.getElementById("case-domestic-year").value.trim()
      const volume = document.getElementById("case-domestic-volume").value.trim()
      const startingPage = document.getElementById("case-domestic-page").value.trim()
      const court = document.getElementById("case-domestic-court").value.trim()
      const pinpointPage = document.getElementById("case-domestic-pinpoint-page").value.trim()
      const pinpointParagraph = document.getElementById("case-domestic-pinpoint-paragraph").value.trim()

      if (caseName && reportSeries && year && volume && startingPage && court) {
        citation = `<i>${caseName}</i> (${year}) ${volume} <b>${reportSeries}</b> ${startingPage} (${court})`
        if (document.getElementById("case-domestic-pinpoint-toggle").checked) {
          if (pinpointPage) citation += `, ${pinpointPage}`
          if (pinpointParagraph) citation += ` [${pinpointParagraph}]`
        }
        citation += "."
      }
    } else if (sourceType === "case-international") {
      const caseName = document.getElementById("case-international-name").value.trim()
      const reportSeries = document.getElementById("case-international-report").value.trim()
      const year = document.getElementById("case-international-year").value.trim()
      const volume = document.getElementById("case-international-volume").value.trim()
      const startingPage = document.getElementById("case-international-page").value.trim()
      const court = document.getElementById("case-international-court").value.trim()
      const pinpointPage = document.getElementById("case-international-pinpoint-page").value.trim()
      const pinpointParagraph = document.getElementById("case-international-pinpoint-paragraph").value.trim()

      if (caseName && reportSeries && year && court) {
        citation = `<i>${caseName}</i> (${year})`
        if (volume) citation += ` ${volume}`
        if (reportSeries) citation += ` <b>${reportSeries}</b>`
        if (startingPage) citation += ` ${startingPage}`
        citation += ` (${court})`
        if (document.getElementById("case-international-pinpoint-toggle").checked) {
          if (pinpointPage) citation += `, ${pinpointPage}`
          if (pinpointParagraph) citation += ` [${pinpointParagraph}]`
        }
        citation += "."
      }
    } else if (sourceType === "book") {
      const author = document.getElementById("book-author").value.trim()
      const title = document.getElementById("book-title").value.trim()
      const edition = document.getElementById("book-edition").value.trim()
      const year = document.getElementById("book-year").value.trim()
      const publisher = document.getElementById("book-publisher").value.trim()
      const pinpointPage = document.getElementById("book-pinpoint-page").value.trim()

      if (author && title && year && publisher) {
        citation = `${author}, <i>${title}</i> (${edition ? edition + " ed, " : ""}${publisher}, ${year})`
        if (document.getElementById("book-pinpoint-toggle").checked && pinpointPage) {
          citation += ` ${pinpointPage}`
        }
        citation += "."
      }
    } else if (sourceType === "journal") {
      const author = document.getElementById("journal-author").value.trim()
      const title = document.getElementById("journal-title").value.trim()
      const journalName = document.getElementById("journal-name").value.trim()
      const volume = document.getElementById("journal-volume").value.trim()
      const year = document.getElementById("journal-year").value.trim()
      const startingPage = document.getElementById("journal-page").value.trim()
      const pinpointPage = document.getElementById("journal-pinpoint-page").value.trim()

      if (author && title && journalName && volume && year && startingPage) {
        citation = `${author}, '${title}' (${year}) ${volume} <i>${journalName}</i> ${startingPage}`
        if (document.getElementById("journal-pinpoint-toggle").checked && pinpointPage) {
          citation += `, ${pinpointPage}`
        }
        citation += "."
      }
    } else if (sourceType === "legislation") {
      const title = document.getElementById("legislation-title").value.trim()
      const year = document.getElementById("legislation-year").value.trim()
      const jurisdiction = document.getElementById("legislation-jurisdiction").value.trim()
      const pinpointSection = document.getElementById("legislation-pinpoint-section").value.trim()
      const pinpointSubsection = document.getElementById("legislation-pinpoint-subsection").value.trim()

      if (title && year && jurisdiction) {
        citation = `${title} ${year} (${jurisdiction})`
        if (document.getElementById("legislation-pinpoint-toggle").checked) {
          if (pinpointSection) citation += ` s ${pinpointSection}`
          if (pinpointSubsection) citation += `(${pinpointSubsection})`
        }
        citation += "."
      }
    } else if (sourceType === "website") {
      const author = document.getElementById("website-author").value.trim()
      const title = document.getElementById("website-title").value.trim()
      const websiteName = document.getElementById("website-name").value.trim()
      const url = document.getElementById("website-url").value.trim()
      const accessDate = document.getElementById("website-access-date").value.trim()

      if (title && websiteName && url && accessDate) {
        citation = `${author ? author + ", " : ""}'${title}', <i>${websiteName}</i> (${accessDate}) <${url}>.`
      }
    } else if (sourceType === "newspaper") {
      const author = document.getElementById("newspaper-author").value.trim()
      const title = document.getElementById("newspaper-title").value.trim()
      const newspaperName = document.getElementById("newspaper-name").value.trim()
      const date = document.getElementById("newspaper-date").value.trim()
      const page = document.getElementById("newspaper-page").value.trim()

      if (title && newspaperName && date) {
        citation = `${author ? author + ", " : ""}'${title}', <i>${newspaperName}</i> (${date})${page ? ", " + page : ""}.`
      }
    } else if (sourceType === "conference-paper") {
      const author = document.getElementById("conference-author").value.trim()
      const title = document.getElementById("conference-title").value.trim()
      const conferenceName = document.getElementById("conference-name").value.trim()
      const location = document.getElementById("conference-location").value.trim()
      const date = document.getElementById("conference-date").value.trim()
      const pages = document.getElementById("conference-pages").value.trim()

      if (author && title && conferenceName && date) {
        citation = `${author}, '${title}' in <i>${conferenceName}</i> (${location ? location + ", " : ""}${date})${pages ? ", " + pages : ""}.`
      }
    } else if (sourceType === "thesis") {
      const author = document.getElementById("thesis-author").value.trim()
      const title = document.getElementById("thesis-title").value.trim()
      const type = document.getElementById("thesis-type").value.trim()
      const university = document.getElementById("thesis-university").value.trim()
      const year = document.getElementById("thesis-year").value.trim()

      if (author && title && type && university && year) {
        citation = `${author}, <i>${title}</i> (${type}, ${university}, ${year}).`
      }
    } else if (sourceType === "report") {
      const author = document.getElementById("report-author").value.trim()
      const title = document.getElementById("report-title").value.trim()
      const organization = document.getElementById("report-organization").value.trim()
      const year = document.getElementById("report-year").value.trim()
      const url = document.getElementById("report-url").value.trim()

      if (title && organization && year) {
        citation = `${author ? author + ", " : ""}<i>${title}</i> (${organization}, ${year})${url ? ", " + url : ""}.`
      }
    } else if (sourceType === "encyclopedia") {
      const title = document.getElementById("encyclopedia-title").value.trim()
      const name = document.getElementById("encyclopedia-name").value.trim()
      const edition = document.getElementById("encyclopedia-edition").value.trim()
      const year = document.getElementById("encyclopedia-year").value.trim()

      if (title && name && year) {
        citation = `${title}, <i>${name}</i> (${edition ? edition + " ed, " : ""}${year}).`
      }
    }

    // Animate the citation result
    const citationResult = document.getElementById("citation-result")
    citationResult.style.opacity = "0"
    citationResult.style.transform = "translateY(10px)"

    setTimeout(() => {
      document.getElementById("generated-citation").innerHTML = citation
      citationResult.style.opacity = "1"
      citationResult.style.transform = "translateY(0)"
    }, 300)
  }

  // Save the generated citation with animation
  window.saveCitation = () => {
    const citation = document.getElementById("generated-citation").innerHTML
    if (citation && citation.trim() !== "") {
      const citations = JSON.parse(localStorage.getItem("citations")) || []
      citations.push(citation)
      localStorage.setItem("citations", JSON.stringify(citations))
      displaySavedCitations()
      clearForm()
    } else {
      showNotification("Cannot save an empty citation.")
    }
  }

  // Show notification
  function showNotification(message) {
    const notification = document.createElement("div")
    notification.className = "notification"
    notification.textContent = message
    notification.style.position = "fixed"
    notification.style.bottom = "20px"
    notification.style.right = "20px"
    notification.style.backgroundColor = "#dc3545"
    notification.style.color = "white"
    notification.style.padding = "10px 20px"
    notification.style.borderRadius = "4px"
    notification.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)"
    notification.style.zIndex = "1000"
    notification.style.opacity = "0"
    notification.style.transform = "translateY(20px)"
    notification.style.transition = "all 0.3s ease"

    document.body.appendChild(notification)

    // Force reflow
    notification.offsetHeight

    notification.style.opacity = "1"
    notification.style.transform = "translateY(0)"

    setTimeout(() => {
      notification.style.opacity = "0"
      notification.style.transform = "translateY(20px)"
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 3000)
  }

  // Display saved citations with animation
  function displaySavedCitations() {
    const citations = JSON.parse(localStorage.getItem("citations")) || []
    const citationList = document.getElementById("citation-list")
    citationList.innerHTML = ""

    citations.forEach((citation, index) => {
      const li = document.createElement("li")
      li.style.opacity = "0"
      li.style.transform = "translateX(-20px)"

      const citationText = document.createElement("span")
      citationText.innerHTML = citation

      const deleteButton = document.createElement("button")
      deleteButton.textContent = "Delete"
      deleteButton.className = "delete-button"
      deleteButton.onclick = () => {
        deleteCitation(index)
      }

      li.appendChild(citationText)
      li.appendChild(deleteButton)
      citationList.appendChild(li)

      // Stagger animation
      setTimeout(() => {
        li.style.opacity = "1"
        li.style.transform = "translateX(0)"
      }, index * 100)
    })
  }

  // Clear form with animation
  function clearForm() {
    document.getElementById("citation-form").reset()

    const citationResult = document.getElementById("citation-result")
    citationResult.style.opacity = "0"
    citationResult.style.transform = "translateY(10px)"

    setTimeout(() => {
      document.getElementById("generated-citation").innerHTML = ""
      citationResult.style.opacity = "1"
      citationResult.style.transform = "translateY(0)"
      hideAllFields()
    }, 300)
  }

  // Delete citation with animation
  function deleteCitation(index) {
    const citations = JSON.parse(localStorage.getItem("citations")) || []
    const citationList = document.getElementById("citation-list")
    const li = citationList.children[index]

    li.style.opacity = "0"
    li.style.transform = "translateX(20px)"

    setTimeout(() => {
      citations.splice(index, 1)
      localStorage.setItem("citations", JSON.stringify(citations))
      displaySavedCitations()
    }, 300)
  }

  // Export citations
  window.exportCitations = () => {
    const citations = JSON.parse(localStorage.getItem("citations")) || []
    if (citations.length > 0) {
      const plainTextCitations = citations
        .map((citation) => {
          return citation
            .replace(/<\/?i>/g, "")
            .replace(/<\/?b>/g, "")
            .replace(/<\/?u>/g, "")
        })
        .join("\n\n")

      const blob = new Blob([plainTextCitations], { type: "text/plain" })
      const a = document.createElement("a")
      a.href = URL.createObjectURL(blob)
      a.download = "citations.txt"
      a.click()

      showNotification("Citations exported successfully!")
    } else {
      showNotification("No citations to export.")
    }
  }

  // Clear all citations
  window.clearCitations = () => {
    if (confirm("Are you sure you want to clear all saved citations?")) {
      localStorage.removeItem("citations")

      const citationList = document.getElementById("citation-list")
      Array.from(citationList.children).forEach((li, index) => {
        setTimeout(() => {
          li.style.opacity = "0"
          li.style.transform = "translateX(20px)"
        }, index * 50)
      })

      setTimeout(() => {
        displaySavedCitations()
      }, 300)
    }
  }

  // Modal handling with animations
  function setupModal(linkId, modalId) {
    const link = document.getElementById(linkId)
    const modal = document.getElementById(modalId)
    const closeBtn = modal.querySelector("button")

    link.addEventListener("click", (event) => {
      event.preventDefault()
      modal.style.display = "flex"
      // Force reflow
      modal.offsetHeight
      modal.classList.add("show")
    })

    closeBtn.addEventListener("click", () => {
      modal.classList.remove("show")
      setTimeout(() => {
        modal.style.display = "none"
      }, 300)
    })

    // Close modal when clicking outside
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.classList.remove("show")
        setTimeout(() => {
          modal.style.display = "none"
        }, 300)
      }
    })
  }

  setupModal("privacy-policy-link", "privacy-policy-modal")
  setupModal("equity-statement-link", "equity-statement-modal")

  // Initialize saved citations display
  displaySavedCitations()
})
