const body = document.body
const burgerButton = document.querySelector(".burger-icon")
const modalWindow = document.querySelector(".modal-window")
const closeModalBtn = document.getElementById("modal-close")
const modalContainer = document.querySelector(".modal-item-container")
const navList = document.querySelector(".navigate-list")
const menuLinks = document.querySelectorAll(".nav-item-container")
const arrowLeft = document.getElementById("left")
const arrowRight = document.getElementById("right")
const slider = document.querySelector(".slider-row")
const line1 = document.getElementById("control1")
const line2 = document.getElementById("control2")
const line3 = document.getElementById("control3")
const sliderItem = document.querySelector(".slider-item")
const coffeModeBtn = document.getElementById("coffee")
const menuSection = document.querySelector(".menu")
const shopContainer = document.querySelector(".shop-items")
const menuChoisebtns = document.querySelectorAll(".offer-menu-tabs .tab-item")
const shopItemContainers = document.querySelectorAll(".shop-item-container")
const refreshBtn = document.getElementById("refresh")
const sliderSection = document.querySelector("favorite-coffe")
const smallTab = document.getElementById("small-tab")
const midTab = document.getElementById("middle-tab")
const largeTab = document.getElementById("large-tab")

//-------------------------Логика бургер меню ------------

// кнопка
function burgerBtnToggle() {
  burgerButton.classList.toggle("active")
  navList.classList.toggle("visible")

  if (navList.classList.contains("visible")) {
    disableScroll()
  } else {
    enableScroll()
  }
}
// вкл выкл вертик прокрутку
function disableScroll() {
  body.style.overflowY = "hidden"
}
function enableScroll() {
  body.style.overflowY = "auto"
}

burgerButton.addEventListener("click", burgerBtnToggle)

// Закрываем меню при клике на ссылки
menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navList.classList.remove("visible")
    burgerButton.classList.remove("active")
    body.style.overflowY = "auto"
  })
})

// ------------------------------------ Логика слайдера---------------------

if (sliderItem) {
  let slideIndex = 0
  let animationFrameId
  function showSlides(index) {
    if (index < 0) {
      slideIndex = slider.children.length - 1
    } else if (index >= slider.children.length) {
      slideIndex = 0
    } else {
      slideIndex = index
    }
    const translateValue = -slideIndex * 100 + "%"
    const cleanTranslateValue = -slideIndex * 100
    slider.style.transform = "translateX(" + translateValue + ")"

    const lines = [line1, line2, line3]

    for (let i = 0; i < lines.length; i++) {
      if (cleanTranslateValue === -i * 100) {
        // Остановка анимации на других элементах
        for (let j = 0; j < lines.length; j++) {
          if (j !== i) {
            lines[j].style.width = "0%"
          }
        }
        //отмена анимации на двух элементах
        cancelAnimationFrame(animationFrameId)
        // Запуск анимации на текущем элементе
        animateLine(lines[i])
      }
    }
  }

  // анимация
  function animateLine(element) {
    let startTime
    const duration = 6500
    const startWidth = 0
    const endWidth = 100

    function updateWidth(timestamp) {
      if (!startTime) {
        startTime = timestamp
      }

      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      const newWidth = startWidth + (endWidth - startWidth) * progress
      element.style.width = newWidth + "%"

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateWidth)
      }
    }

    animationFrameId = requestAnimationFrame(updateWidth)
  }

  //запуск при загрузке
  document.addEventListener("DOMContentLoaded", function () {
    nextSlide();
  });

  // переключение кнопками
  function nextSlide() {
    cancelAnimationFrame(animationFrameId)
    showSlides(slideIndex + 1)
  }
  function prevSlide() {
    cancelAnimationFrame(animationFrameId)
    showSlides(slideIndex - 1)
  }
  if (arrowLeft) {
    arrowLeft.addEventListener("click", prevSlide)
  }
  if (arrowRight) {
    arrowRight.addEventListener("click", nextSlide)
  }

  // Автоматическая прокрутка слайдов каждые 7 секунд
  setInterval(nextSlide, 7000)
}

// --------------------   JSON в консоль для удобства

let myJsonObject

document.addEventListener("DOMContentLoaded", function () {
  // Используем Fetch API для чтения JSON из файла
  fetch("./products.json")
    .then((response) => response.json())
    .then((data) => {
      myJsonObject = data
    })
    .catch((error) => console.error("Ошибка при загрузке файла JSON:", error))
})

// ---------------- Логика меню из json файла ----------------- создание shop items

if (menuSection) {
  // получаем id нажатой кнопки
  menuChoisebtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      shopContainer.innerHTML = ""
      menuChoisebtns.forEach((otherBtn) => {
        otherBtn.classList.remove("active")
      })
      this.classList.add("active")
      const idtext = this.id
      console.log(myJsonObject)

      myJsonObject.forEach((item, index) => {
        // Если idtext совпадает с полем category
        if (idtext === item.category) {
          // Создаем элемент и добавляем его в DOM
          const shopItem = createShopItem(item, index)
          shopContainer.appendChild(shopItem)
          // Вызываем функцию для скрытия элементов при загрузке страницы
          hideExtraShopItems()
        }
      })
    })
  })

  // Создаем функцию для создания блока Item магазина

  function createShopItem(data, index) {
    const photoName = `${data.category}-${index + 1}.svg`

    const shopItemContainer = document.createElement("div")
    shopItemContainer.classList.add("shop-item-container")
    shopItemContainer.id = `item-${index}`

    const imgBox = document.createElement("div")
    imgBox.classList.add("img-box")
    const img = document.createElement("img")
    img.src = `./assets/menu-assets/${photoName}`
    img.alt = photoName
    imgBox.appendChild(img)

    const descriptionBox = document.createElement("div")
    descriptionBox.classList.add("description-box")

    const descriptionBoxTitle = document.createElement("div")
    descriptionBoxTitle.classList.add("description-box-title")
    const nameParagraph = document.createElement("p")
    nameParagraph.classList.add("bold")
    nameParagraph.innerText = data.name
    const descriptionParagraph = document.createElement("p")
    descriptionParagraph.innerText = data.description
    descriptionBoxTitle.appendChild(nameParagraph)
    descriptionBoxTitle.appendChild(descriptionParagraph)

    const descriptionBoxPrice = document.createElement("div")
    descriptionBoxPrice.classList.add("description-box-price")
    const priceParagraph = document.createElement("p")
    priceParagraph.classList.add("bold")
    priceParagraph.innerText = `$${(parseFloat(data.price) + 0).toFixed(2)}`
    descriptionBoxPrice.appendChild(priceParagraph)

    descriptionBox.appendChild(descriptionBoxTitle)
    descriptionBox.appendChild(descriptionBoxPrice)
    shopItemContainer.appendChild(imgBox)
    shopItemContainer.appendChild(descriptionBox)

    return shopItemContainer
  }

  // по умолчанию отображаем вкладку coffee - функция автоклик кнопки
  function setDefaultTab() {
    setTimeout(function () {
      coffeModeBtn.click()
    }, 200)
  }
  setDefaultTab()

  // Функция для скрытия всех элементов, кроме первых четырех

  function hideExtraShopItems() {
    const shopItems = document.querySelectorAll(".shop-item-container")

    const screenWidth = window.innerWidth

    if (screenWidth > 860) {
      // Если ширина экрана больше 1440px, отображаем все элементы и скрываем кнопку
      shopItems.forEach((item) => {
        item.style.display = "flex"
      })
      refreshBtn.style.display = "none"
    } else {
      // Иначе, применяем ваш логику для показа/скрытия элементов и кнопки
      if (shopItems.length <= 4) {
        // Если количество элементов меньше или равно 4, скрываем кнопку
        refreshBtn.style.display = "none"
      } else {
        // Иначе скрываем лишние элементы и показываем кнопку
        shopItems.forEach((item, index) => {
          if (index >= 4) {
            item.style.display = "none"
          } else {
            item.style.display = "flex"
          }
        })
        refreshBtn.style.display = "flex"
      }
    }
  }

  // Вызываем функцию при загрузке страницы и изменении размера экрана
  window.addEventListener("resize", hideExtraShopItems)
  hideExtraShopItems()

  if (refreshBtn) {
    refreshBtn.addEventListener("click", function () {
      // Восстанавливаем видимость всех элементов при нажатии кнопки
      const shopItems = document.querySelectorAll(".shop-item-container")
      shopItems.forEach((item) => {
        item.style.display = "flex"
      })
      refreshBtn.style.display = "none"
    })
  }
}

//-------------------- Логика модального окна ----------------------------------------

//клик на item в магазине
function handleContainerClick(data, index) {
  const photoName = `${data.category}-${index + 1}.svg`
  const modalItemContainer = document.querySelector(".modal-item-container")
  const imgElement = modalItemContainer.querySelector("img")
  const boldParagraph = document.querySelector(
    ".modal-item-container .description-box-title .bold"
  )
  const descriptionP = document.getElementById("modalDescrText")
  const smallProduct = document.getElementById("small")
  const middleProduct = document.getElementById("middle")
  const largeProduct = document.getElementById("large")
  const modalProductPrice = document.getElementById("modal-price")
  const modalAdditive1 = document.getElementById('additive1')
  const modalAdditive2 = document.getElementById('additive2')
  const modalAdditive3 = document.getElementById('additive3')


  imgElement.src = `./assets/menu-assets/${photoName}`
  imgElement.alt = photoName
  boldParagraph.innerText = data.name
  descriptionP.innerText = data.description
  smallProduct.innerText = data.sizes.s.size
  middleProduct.innerText = data.sizes.m.size
  largeProduct.innerText = data.sizes.l.size
  modalAdditive1.innerText = data.additives[0].name
  modalAdditive2.innerText = data.additives[1].name
  modalAdditive3.innerText = data.additives[2].name

  modalProductPrice.innerText = `$${(parseFloat(data.price) + 0).toFixed(2)}`

  setStartSettingsBtn()
  modalWindow.classList.add("active")
  disableScroll()

  // функция установки первоначального состояния кнопок
  function setStartSettingsBtn() {
    smallTab.classList.add("active")
    midTab.classList.remove("active")
    largeTab.classList.remove("active")
    const modalAdditiveChoisebtns = document.querySelectorAll(
      ".modal-buttons.additives .tab-item"
    )
    modalAdditiveChoisebtns.forEach((btn) => {
      btn.classList.remove("active")
    })
  }

  // --------  логика изменения цен по Size

  const modalSizeChoisebtns = document.querySelectorAll(
    ".modal-buttons.size .tab-item"
  )
  modalSizeChoisebtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      modalSizeChoisebtns.forEach((otherBtn) => {
        otherBtn.classList.remove("active")
      })
      this.classList.add("active")
      if (this.id === "small-tab") {
        modalProductPrice.innerText = `$${(parseFloat(data.price) + 0).toFixed(
          2
        )}`
      } else if (this.id === "middle-tab") {
        modalProductPrice.innerText = `$${(
          parseFloat(data.price) + 0.5
        ).toFixed(2)}`
      } else {
        modalProductPrice.innerText = `$${(parseFloat(data.price) + 1).toFixed(
          2
        )}`
      }
    })
  })
  // --------  логика изменения цен по Additive
  const modalAdditiveChoisebtns = document.querySelectorAll(
    ".modal-buttons.additives .tab-item"
  )
  let totalPrice = parseFloat(data.price)

  modalAdditiveChoisebtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Используем toggle для добавления/удаления класса active
      this.classList.toggle("active")
      if (this.classList.contains("active")) {
        totalPrice += 0.5
      } else {
        totalPrice -= 0.5
      }
      modalProductPrice.innerText = `$${totalPrice.toFixed(2)}`
    })
  })
}

if (menuSection) {
  // активация модала с нужным контентом
  shopContainer.addEventListener("click", function (event) {
    const clickedItem = event.target.closest(".shop-item-container")
    if (clickedItem) {
      const clickedID = Number(clickedItem.id.slice(5))
      handleContainerClick(myJsonObject[clickedID], clickedID)
    }
  })

  // закрытие кнопкой close
  function handleModalCloseBtn() {
    modalWindow.classList.remove("active")
    enableScroll()
  }
  closeModalBtn.addEventListener("click", handleModalCloseBtn)

  // закрытие при нажатии вне поля модала
  modalContainer.addEventListener("click", (event) => {
    event.isClickInsideModal = true
  })
  modalWindow.addEventListener("click", (event) => {
    if (event.isClickInsideModal) {
      return
    } else {
      modalWindow.classList.remove("active")
      enableScroll()
    }
  })
}

// ------------------------------------- SWIPE -----------------------------------

if (slider) {
  let touchStartX = 0
  let touchEndX = 0

  slider.addEventListener("touchstart", function (e) {
    touchStartX = e.changedTouches[0].screenX
  })

  slider.addEventListener("touchend", function (e) {
    touchEndX = e.changedTouches[0].screenX

    // Определение направления свайпа
    if (touchEndX < touchStartX) {
      // Действия при свайпе влево
      nextSlide()
    } else if (touchEndX > touchStartX) {
      // Действия при свайпе вправо
      prevSlide()
    }
  })

  // Опционально: предотвращаем скроллинг при свайпе
  slider.addEventListener("touchmove", function (e) {
    e.preventDefault()
  })
}
