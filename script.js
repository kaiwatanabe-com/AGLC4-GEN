document.addEventListener("DOMContentLoaded", () => {
  // Constants
  const ANIMATION_DURATION_MS = 300
  const NOTIFICATION_DISPLAY_MS = 3000
  const STAGGER_DELAY_MS = 100

  // --- Security Utilities ---

  function escapeHTML(str) {
    const div = document.createElement("div")
    div.textContent = str
    return div.innerHTML
  }

  function getField(id) {
    const el = document.getElementById(id)
    if (!el) return ""
    return escapeHTML(el.value.trim())
  }

  // --- Particles.js Init ---

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

  // --- Flatpickr Init (AGLC date format: "15 June 2024") ---

  if (typeof flatpickr !== "undefined") {
    flatpickr(
      "#website-access-date, #newspaper-date, #conference-date, " +
      "#speech-date, #press-release-date, #parliamentary-date, " +
      "#submission-date, #interview-date, #social-media-date, " +
      "#correspondence-date, #treaty-opened-date, #treaty-force-date",
      {
        dateFormat: "j F Y",
        animate: true,
        disableMobile: false,
      }
    )
  } else {
    console.error("flatpickr is not defined. Make sure the Flatpickr library is included.")
  }

  // --- Field Visibility ---

  function hideAllFields() {
    document.querySelectorAll(".citation-fields").forEach((field) => {
      field.style.opacity = "0"
      setTimeout(() => {
        field.style.display = "none"
      }, ANIMATION_DURATION_MS)
    })
  }
  hideAllFields()

  function showRelevantFields(sourceType) {
    hideAllFields()
    const selectedFields = document.getElementById(sourceType + "-fields")
    if (selectedFields) {
      setTimeout(() => {
        selectedFields.style.display = "block"
        selectedFields.offsetHeight
        selectedFields.style.opacity = "1"
      }, ANIMATION_DURATION_MS)
    }
  }

  document.getElementById("source-type").addEventListener("change", function () {
    showRelevantFields(this.value)
  })

  // --- Pinpoint Toggles ---

  function togglePinpoint(checkboxId, pinpointFieldsId) {
    const checkbox = document.getElementById(checkboxId)
    const pinpointFields = document.getElementById(pinpointFieldsId)
    if (!checkbox || !pinpointFields) return

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        pinpointFields.style.display = "block"
        pinpointFields.offsetHeight
        pinpointFields.style.opacity = "1"
      } else {
        pinpointFields.style.opacity = "0"
        setTimeout(() => {
          pinpointFields.style.display = "none"
        }, ANIMATION_DURATION_MS)
      }
    })
  }

  // Existing pinpoint toggles
  togglePinpoint("case-domestic-pinpoint-toggle", "case-domestic-pinpoint-fields")
  togglePinpoint("case-international-pinpoint-toggle", "case-international-pinpoint-fields")
  togglePinpoint("book-pinpoint-toggle", "book-pinpoint-fields")
  togglePinpoint("journal-pinpoint-toggle", "journal-pinpoint-fields")
  togglePinpoint("legislation-pinpoint-toggle", "legislation-pinpoint-fields")

  // New pinpoint toggles
  togglePinpoint("speech-pinpoint-toggle", "speech-pinpoint-fields")
  togglePinpoint("press-release-pinpoint-toggle", "press-release-pinpoint-fields")
  togglePinpoint("submission-pinpoint-toggle", "submission-pinpoint-fields")
  togglePinpoint("film-tv-pinpoint-toggle", "film-tv-pinpoint-fields")
  togglePinpoint("correspondence-pinpoint-toggle", "correspondence-pinpoint-fields")
  togglePinpoint("treaty-pinpoint-toggle", "treaty-pinpoint-fields")

  // --- Citation Generators (dispatch map) ---

  const citationGenerators = {
    "case-domestic": () => {
      const caseName = getField("case-domestic-name")
      const reportSeries = getField("case-domestic-report")
      const year = getField("case-domestic-year")
      const volume = getField("case-domestic-volume")
      const startingPage = getField("case-domestic-page")
      const court = getField("case-domestic-court")

      if (!caseName || !reportSeries || !year || !volume || !startingPage || !court) return ""

      let citation = `<i>${caseName}</i> (${year}) ${volume} ${reportSeries} ${startingPage} (${court})`
      if (document.getElementById("case-domestic-pinpoint-toggle").checked) {
        const pinpointPage = getField("case-domestic-pinpoint-page")
        const pinpointParagraph = getField("case-domestic-pinpoint-paragraph")
        if (pinpointPage) citation += `, ${pinpointPage}`
        if (pinpointParagraph) citation += ` [${pinpointParagraph}]`
      }
      citation += "."
      return citation
    },

    "case-international": () => {
      const caseName = getField("case-international-name")
      const reportSeries = getField("case-international-report")
      const year = getField("case-international-year")
      const volume = getField("case-international-volume")
      const startingPage = getField("case-international-page")
      const court = getField("case-international-court")

      if (!caseName || !reportSeries || !year || !court) return ""

      let citation = `<i>${caseName}</i> (${year})`
      if (volume) citation += ` ${volume}`
      if (reportSeries) citation += ` ${reportSeries}`
      if (startingPage) citation += ` ${startingPage}`
      citation += ` (${court})`
      if (document.getElementById("case-international-pinpoint-toggle").checked) {
        const pinpointPage = getField("case-international-pinpoint-page")
        const pinpointParagraph = getField("case-international-pinpoint-paragraph")
        if (pinpointPage) citation += `, ${pinpointPage}`
        if (pinpointParagraph) citation += ` [${pinpointParagraph}]`
      }
      citation += "."
      return citation
    },

    "legislation": () => {
      const title = getField("legislation-title")
      const year = getField("legislation-year")
      const jurisdiction = getField("legislation-jurisdiction")

      if (!title || !year || !jurisdiction) return ""

      let citation = `<i>${title} ${year}</i> (${jurisdiction})`
      if (document.getElementById("legislation-pinpoint-toggle").checked) {
        const pinpointSection = getField("legislation-pinpoint-section")
        const pinpointSubsection = getField("legislation-pinpoint-subsection")
        if (pinpointSection) citation += ` s ${pinpointSection}`
        if (pinpointSubsection) citation += `(${pinpointSubsection})`
      }
      citation += "."
      return citation
    },

    "parliamentary-debates": () => {
      const jurisdiction = getField("parliamentary-jurisdiction")
      const chamber = getField("parliamentary-chamber")
      const date = getField("parliamentary-date")
      const pinpoint = getField("parliamentary-pinpoint")
      const speaker = getField("parliamentary-speaker")

      if (!jurisdiction || !date) return ""

      let citation = `${jurisdiction}, <i>Parliamentary Debates</i>, ${chamber ? chamber + ", " : ""}${date}`
      if (pinpoint) citation += `, ${pinpoint}`
      if (speaker) citation += ` (${speaker})`
      citation += "."
      return citation
    },

    "written-submission": () => {
      const author = getField("submission-author")
      const submissionNo = getField("submission-number")
      const body = getField("submission-body")
      const inquiry = getField("submission-inquiry")
      const date = getField("submission-date")

      if (!author || !body || !inquiry || !date) return ""

      let citation = `${author}, Submission${submissionNo ? " No " + submissionNo : ""} to ${body}, <i>${inquiry}</i> (${date})`
      if (document.getElementById("submission-pinpoint-toggle").checked) {
        const pinpoint = getField("submission-pinpoint")
        if (pinpoint) citation += ` ${pinpoint}`
      }
      citation += "."
      return citation
    },

    "book": () => {
      const author = getField("book-author")
      const title = getField("book-title")
      const edition = getField("book-edition")
      const year = getField("book-year")
      const publisher = getField("book-publisher")

      if (!author || !title || !year || !publisher) return ""

      let citation = `${author}, <i>${title}</i> (${publisher}, ${edition ? edition + " ed, " : ""}${year})`
      if (document.getElementById("book-pinpoint-toggle").checked) {
        const pinpointPage = getField("book-pinpoint-page")
        if (pinpointPage) citation += ` ${pinpointPage}`
      }
      citation += "."
      return citation
    },

    "journal": () => {
      const author = getField("journal-author")
      const title = getField("journal-title")
      const journalName = getField("journal-name")
      const volume = getField("journal-volume")
      const year = getField("journal-year")
      const startingPage = getField("journal-page")

      if (!author || !title || !journalName || !volume || !year || !startingPage) return ""

      let citation = `${author}, '${title}' (${year}) ${volume} <i>${journalName}</i> ${startingPage}`
      if (document.getElementById("journal-pinpoint-toggle").checked) {
        const pinpointPage = getField("journal-pinpoint-page")
        if (pinpointPage) citation += `, ${pinpointPage}`
      }
      citation += "."
      return citation
    },

    "encyclopedia": () => {
      const name = getField("encyclopedia-name")
      const edition = getField("encyclopedia-edition")
      const year = getField("encyclopedia-year")
      const title = getField("encyclopedia-title")
      const defNumber = getField("encyclopedia-def-number")

      if (!name || !year || !title) return ""

      let citation = `<i>${name}</i> (${edition ? edition + " ed, " : ""}${year}) '${title}'`
      if (defNumber) citation += ` (def ${defNumber})`
      citation += "."
      return citation
    },

    "thesis": () => {
      const author = getField("thesis-author")
      const title = getField("thesis-title")
      const type = getField("thesis-type")
      const university = getField("thesis-university")
      const year = getField("thesis-year")

      if (!author || !title || !type || !university || !year) return ""

      return `${author}, '${title}' (${type}, ${university}, ${year}).`
    },

    "report": () => {
      const author = getField("report-author")
      const title = getField("report-title")
      const organization = getField("report-organization")
      const year = getField("report-year")
      const url = getField("report-url")

      if (!title || !organization || !year) return ""

      let citation = `${author ? author + ", " : ""}<i>${title}</i> (${organization}, ${year})`
      if (url) citation += ` &lt;${url}&gt;`
      citation += "."
      return citation
    },

    "newspaper": () => {
      const author = getField("newspaper-author")
      const title = getField("newspaper-title")
      const newspaperName = getField("newspaper-name")
      const place = getField("newspaper-place")
      const date = getField("newspaper-date")
      const page = getField("newspaper-page")

      if (!title || !newspaperName || !date) return ""

      let citation = `${author ? author + ", " : ""}'${title}', <i>${newspaperName}</i> (${place ? place + ", " : ""}${date})`
      if (page) citation += ` ${page}`
      citation += "."
      return citation
    },

    "website": () => {
      const author = getField("website-author")
      const title = getField("website-title")
      const websiteName = getField("website-name")
      const docType = getField("website-doc-type")
      const url = getField("website-url")
      const accessDate = getField("website-access-date")

      if (!title || !websiteName || !url || !accessDate) return ""

      let citation = `${author ? author + ", " : ""}'${title}', <i>${websiteName}</i> (${docType ? docType + ", " : ""}${accessDate}) &lt;${url}&gt;.`
      return citation
    },

    "conference-paper": () => {
      const author = getField("conference-author")
      const title = getField("conference-title")
      const conferenceName = getField("conference-name")
      const location = getField("conference-location")
      const date = getField("conference-date")
      const pages = getField("conference-pages")

      if (!author || !title || !conferenceName || !date) return ""

      let citation = `${author}, '${title}' (Conference Paper, ${conferenceName}, ${location ? location + ", " : ""}${date})`
      if (pages) citation += ` ${pages}`
      citation += "."
      return citation
    },

    "speech": () => {
      const speaker = getField("speech-speaker")
      const title = getField("speech-title")
      const institution = getField("speech-institution")
      const date = getField("speech-date")

      if (!speaker || !title || !institution || !date) return ""

      let citation = `${speaker}, '${title}' (Speech, ${institution}, ${date})`
      if (document.getElementById("speech-pinpoint-toggle").checked) {
        const pinpoint = getField("speech-pinpoint")
        if (pinpoint) citation += ` ${pinpoint}`
      }
      citation += "."
      return citation
    },

    "press-release": () => {
      const author = getField("press-release-author")
      const title = getField("press-release-title")
      const releaseType = getField("press-release-type")
      const docNo = getField("press-release-docno")
      const body = getField("press-release-body")
      const date = getField("press-release-date")

      if (!title || !releaseType || !body || !date) return ""

      let citation = `${author ? author + ", " : ""}'${title}' (${releaseType}${docNo ? " " + docNo : ""}, ${body}, ${date})`
      if (document.getElementById("press-release-pinpoint-toggle").checked) {
        const pinpoint = getField("press-release-pinpoint")
        if (pinpoint) citation += ` ${pinpoint}`
      }
      citation += "."
      return citation
    },

    "interview": () => {
      const interviewee = getField("interview-interviewee")
      const interviewer = getField("interview-interviewer")
      const forum = getField("interview-forum")
      const date = getField("interview-date")

      if (!interviewee || !forum || !date) return ""

      return `Interview with ${interviewee} (${interviewer ? interviewer + ", " : ""}${forum}, ${date}).`
    },

    "film-tv": () => {
      const episodeTitle = getField("film-tv-episode")
      const title = getField("film-tv-title")
      const studio = getField("film-tv-studio")
      const year = getField("film-tv-year")

      if (!title || !studio || !year) return ""

      let citation = `${episodeTitle ? "'" + episodeTitle + "', " : ""}<i>${title}</i> (${studio}, ${year})`
      if (document.getElementById("film-tv-pinpoint-toggle").checked) {
        const pinpoint = getField("film-tv-pinpoint")
        if (pinpoint) citation += ` ${pinpoint}`
      }
      citation += "."
      return citation
    },

    "social-media": () => {
      const username = getField("social-media-username")
      const title = getField("social-media-title")
      const platform = getField("social-media-platform")
      const date = getField("social-media-date")
      const time = getField("social-media-time")
      const url = getField("social-media-url")

      if (!username || !title || !platform || !date || !url) return ""

      return `${username}, '${title}' (${platform}, ${date}${time ? ", " + time : ""}) &lt;${url}&gt;.`
    },

    "correspondence": () => {
      const type = getField("correspondence-type")
      const author = getField("correspondence-author")
      const recipient = getField("correspondence-recipient")
      const date = getField("correspondence-date")

      if (!type || !author || !recipient || !date) return ""

      let citation = `${type} from ${author} to ${recipient}, ${date}`
      if (document.getElementById("correspondence-pinpoint-toggle").checked) {
        const pinpoint = getField("correspondence-pinpoint")
        if (pinpoint) citation += `, ${pinpoint}`
      }
      citation += "."
      return citation
    },

    "treaty": () => {
      const title = getField("treaty-title")
      const openedDate = getField("treaty-opened-date")
      const series = getField("treaty-series")
      const forceDate = getField("treaty-force-date")

      if (!title || !openedDate) return ""

      let citation = `<i>${title}</i>, opened for signature ${openedDate}`
      if (series) citation += `, ${series}`
      if (forceDate) citation += ` (entered into force ${forceDate})`
      if (document.getElementById("treaty-pinpoint-toggle").checked) {
        const pinpoint = getField("treaty-pinpoint")
        if (pinpoint) citation += ` ${pinpoint}`
      }
      citation += "."
      return citation
    },
  }

  // --- Main Generate Function ---

  window.generateCitation = () => {
    const sourceType = document.getElementById("source-type").value

    if (!sourceType) {
      showNotification("Please select a source type.", "error")
      return
    }

    const generator = citationGenerators[sourceType]
    if (!generator) return

    const citation = generator()

    if (!citation) {
      showNotification("Please fill in all required fields.", "error")
      return
    }

    const citationResult = document.getElementById("citation-result")
    citationResult.style.opacity = "0"
    citationResult.style.transform = "translateY(10px)"

    setTimeout(() => {
      document.getElementById("generated-citation").innerHTML = citation
      document.getElementById("copy-citation").style.display = "inline-block"
      citationResult.style.opacity = "1"
      citationResult.style.transform = "translateY(0)"
    }, ANIMATION_DURATION_MS)
  }

  // --- Copy to Clipboard ---

  window.copyCitation = () => {
    const citationEl = document.getElementById("generated-citation")
    const plainText = citationEl.textContent || citationEl.innerText

    if (!plainText || plainText.trim() === "") {
      showNotification("No citation to copy.", "error")
      return
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(plainText).then(() => {
        showNotification("Citation copied to clipboard!", "success")
      }).catch(() => {
        fallbackCopy(plainText)
      })
    } else {
      fallbackCopy(plainText)
    }
  }

  function fallbackCopy(text) {
    const textarea = document.createElement("textarea")
    textarea.value = text
    textarea.style.position = "fixed"
    textarea.style.opacity = "0"
    document.body.appendChild(textarea)
    textarea.select()
    try {
      document.execCommand("copy")
      showNotification("Citation copied to clipboard!", "success")
    } catch (err) {
      showNotification("Failed to copy citation.", "error")
    }
    document.body.removeChild(textarea)
  }

  // --- Notifications (CSS-class based) ---

  function showNotification(message, type = "error") {
    const notification = document.createElement("div")
    notification.className = `notification notification--${type}`
    notification.textContent = message
    document.body.appendChild(notification)

    // Force reflow
    notification.offsetHeight
    notification.classList.add("show")

    setTimeout(() => {
      notification.classList.remove("show")
      setTimeout(() => {
        document.body.removeChild(notification)
      }, ANIMATION_DURATION_MS)
    }, NOTIFICATION_DISPLAY_MS)
  }

  // --- Save Citation ---

  window.saveCitation = () => {
    const citation = document.getElementById("generated-citation").innerHTML
    if (citation && citation.trim() !== "") {
      const citations = JSON.parse(localStorage.getItem("citations")) || []
      citations.push(citation)
      localStorage.setItem("citations", JSON.stringify(citations))
      displaySavedCitations()
      clearForm()
      showNotification("Citation saved!", "success")
    } else {
      showNotification("Cannot save an empty citation.", "error")
    }
  }

  // --- Display Saved Citations ---

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
      deleteButton.setAttribute("aria-label", "Delete citation")
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
      }, index * STAGGER_DELAY_MS)
    })
  }

  // --- Clear Form ---

  function clearForm() {
    document.getElementById("citation-form").reset()

    const citationResult = document.getElementById("citation-result")
    citationResult.style.opacity = "0"
    citationResult.style.transform = "translateY(10px)"

    setTimeout(() => {
      document.getElementById("generated-citation").innerHTML = ""
      document.getElementById("copy-citation").style.display = "none"
      citationResult.style.opacity = "1"
      citationResult.style.transform = "translateY(0)"
      hideAllFields()
    }, ANIMATION_DURATION_MS)
  }

  // --- Delete Citation ---

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
    }, ANIMATION_DURATION_MS)
  }

  // --- Export Citations ---

  window.exportCitations = () => {
    const citations = JSON.parse(localStorage.getItem("citations")) || []
    if (citations.length > 0) {
      const plainTextCitations = citations
        .map((citation) => {
          return citation
            .replace(/<\/?i>/g, "")
            .replace(/<\/?b>/g, "")
            .replace(/<\/?u>/g, "")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&amp;/g, "&")
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'")
        })
        .join("\n\n")

      const blob = new Blob([plainTextCitations], { type: "text/plain" })
      const a = document.createElement("a")
      a.href = URL.createObjectURL(blob)
      a.download = "citations.txt"
      a.click()

      showNotification("Citations exported successfully!", "success")
    } else {
      showNotification("No citations to export.", "error")
    }
  }

  // --- Clear All Citations ---

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
      }, ANIMATION_DURATION_MS)
    }
  }

  // --- Modal Handling ---

  function closeModal(modal) {
    modal.classList.remove("show")
    setTimeout(() => {
      modal.style.display = "none"
    }, ANIMATION_DURATION_MS)
  }

  function openModal(modal) {
    modal.style.display = "flex"
    modal.offsetHeight
    modal.classList.add("show")
  }

  let disclaimerLocked = false

  function setupModalClose(modalId) {
    const modal = document.getElementById(modalId)
    const closeBtn = modal.querySelector("button")

    closeBtn.addEventListener("click", () => closeModal(modal))

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        if (modalId === "disclaimer-modal" && disclaimerLocked) return
        closeModal(modal)
      }
    })
  }

  function bindModalLink(linkId, modalId) {
    const link = document.getElementById(linkId)
    const modal = document.getElementById(modalId)
    if (!link || !modal) return

    link.addEventListener("click", (event) => {
      event.preventDefault()
      openModal(modal)
    })
  }

  setupModalClose("privacy-policy-modal")
  setupModalClose("equity-statement-modal")
  setupModalClose("disclaimer-modal")

  bindModalLink("privacy-policy-link", "privacy-policy-modal")
  bindModalLink("equity-statement-link", "equity-statement-modal")
  bindModalLink("disclaimer-link", "disclaimer-modal")
  bindModalLink("disclaimer-link-top", "disclaimer-modal")

  // Escape key handler for modals
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      document.querySelectorAll(".modal.show").forEach((m) => {
        if (m.id === "disclaimer-modal" && disclaimerLocked) return
        closeModal(m)
      })
    }
  })

  // --- First-Load Disclaimer ---

  if (!localStorage.getItem("disclaimerAccepted")) {
    disclaimerLocked = true
    const disclaimerModal = document.getElementById("disclaimer-modal")
    if (disclaimerModal) {
      openModal(disclaimerModal)
      const closeBtn = disclaimerModal.querySelector("button")
      const originalHandler = () => {
        closeBtn.removeEventListener("click", originalHandler)
      }
      closeBtn.addEventListener("click", originalHandler)
      closeBtn.addEventListener("click", () => {
        localStorage.setItem("disclaimerAccepted", "true")
        disclaimerLocked = false
      })
    }
  }

  // --- Initialize Saved Citations Display ---

  displaySavedCitations()
})
