// 模擬器材資料, 若 image 欄位空字串則自動填入預設圖片
const mockData = [
    {
      id: "J2000001",
      name: "動圈式麥克風",
      category: "音響設備",
      spec: "Carol E dur-916S 珍珠白",
      location: "進德",
      image: ""
    },
    {
      id: "J2000002",
      name: "無線麥克風",
      category: "音響設備",
      spec: "Shure SM58 這裡是比較長的規格文字以測試換行效果與overflow處理",
      location: "進德",
      image: ""
    },
    {
      id: "J3000003",
      name: "投影機",
      category: "電腦設備",
      spec: "Epson 1080p",
      location: "寶山",
      image: ""
    },
    {
      id: "J4000004",
      name: "延長線",
      category: "什項用具",
      spec: "5m 白色, 超長延長線, 可拉伸, 測試overflow的長文字",
      location: "寶山",
      image: ""
    }
  ];
  
  // 當 image 欄位是空字串時，填入預設佔位圖片
  function getImageSrc(image) {
    if (!image || image.trim() === "") {
      // 回傳 SVG 佔位圖片
      return (
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(`
          <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg" aria-label="設備圖片" role="img">
            <rect width="100%" height="100%" fill="#eee"></rect>
            <text x="50%" y="50%" fill="#aaa" font-size="20" text-anchor="middle" dominant-baseline="central">
              預設圖片
            </text>
          </svg>
        `)
      );
    }
    // 若有真實圖片路徑或 URL，直接回傳
    return image;
  }
  
  // 根據選擇的校區載入器材列表
  function loadEquipment(place) {
    const equipmentList = document.getElementById("equipmentList");
    equipmentList.innerHTML = ""; // 清空現有列表
  
    const placeMap = {
      jinde: "進德",
      baosan: "寶山"
    };
  
    const targetLocation = placeMap[place];
    const filteredData = mockData.filter((item) => item.location === targetLocation);
  
    filteredData.forEach((item) => {
      const card = createEquipmentCard(item);
      equipmentList.appendChild(card);
    });
  }
  
  // 建立器材卡片
  function createEquipmentCard(item) {
    const col = document.createElement("div");
    col.className = "col";
  
    const imgSrc = getImageSrc(item.image);
  
    // 根據範例卡片的結構，將圖片（或 SVG 佔位）放在最上方，
    // 再來是 .card-body，裡面先有 .form-check，然後才是資訊文字段落。
    // 注意：若要支援「點擊圖片開啟預覽」，可在 <img> 上加上 onclick="previewImage(this.src)"。
    //      若你想用 <svg> 原樣，就把 <img> 的標籤改成一個直接寫好的 <svg>。
    //      這裡示範以 <img> + dataURL 的方式處理。
    col.innerHTML = `
      <div class="card equipment-card">
        <img
          class="card-img-top equipment-img"
          src="${imgSrc}"
          alt="${item.name}"
          style="cursor: pointer"
          onclick="previewImage(this.src)"
        />
        <div class="card-body">
          <div class="form-check mb-2">
            <input class="form-check-input" type="checkbox" name="equipment[]" value="${item.id}">
            <label class="form-check-label fw-bold">${item.name}</label>
          </div>
          <span class="badge bg-primary category-badge mb-2">${item.category}</span>
          <p class="card-text small mb-1">財產編號：${item.id}</p>
          <p class="card-text small mb-1">規格：${item.spec}</p>
        </div>
      </div>
    `;
    return col;
  }
  
  // 圖片預覽功能
  function previewImage(src) {
    document.getElementById("previewImage").src = src;
    new bootstrap.Modal(document.getElementById("imagePreviewModal")).show();
  }
  
  // 搜索功能
  document.getElementById("searchEquipment").addEventListener("input", function (e) {
    const searchTerm = e.target.value.toLowerCase();
    const cards = document.querySelectorAll(".equipment-card");
  
    cards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      const col = card.closest(".col");
      if (text.includes(searchTerm)) {
        col.style.display = "";
      } else {
        col.style.display = "none";
      }
    });
  });
  
  // 分類篩選功能
  document.getElementById("categoryFilter").addEventListener("change", function (e) {
    const category = e.target.value.toLowerCase();
    const cards = document.querySelectorAll(".equipment-card");
  
    cards.forEach((card) => {
      const cardCategory = card.querySelector(".category-badge").textContent.toLowerCase();
      const col = card.closest(".col");
      if (!category || cardCategory.includes(category)) {
        col.style.display = "";
      } else {
        col.style.display = "none";
      }
    });
  });
  
  // 表單驗證
  document.getElementById("borrowForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    if (!this.checkValidity()) {
      e.stopPropagation();
      this.classList.add("was-validated");
      return;
    }
  
    const selectedEquipment = document.querySelectorAll('input[name="equipment[]"]:checked');
    if (selectedEquipment.length === 0) {
      alert("請至少選擇一項器材！");
      return;
    }
  
    const borrowDate = new Date(document.querySelector('input[name="borrow_date"]').value);
    const returnDate = new Date(document.querySelector('input[name="return_date"]').value);
    const twoWeeksLater = new Date(borrowDate);
    twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);
  
    if (returnDate > twoWeeksLater) {
      alert("借用期限不能超過兩週！");
      return;
    }
  
    // TODO: 在這裡處理表單提交 (例如送往後端)
    console.log("表單提交成功！");
  });
  
  // 借用地點選擇處理
  document.querySelectorAll('input[name="borrow_place"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      loadEquipment(this.value);
    });
  });
  
  // 卡片懸停效果 (加點陰影)
  document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".equipment-card");
    cards.forEach((card) => {
      card.addEventListener("mouseenter", function () {
        this.classList.add("shadow-sm");
      });
      card.addEventListener("mouseleave", function () {
        this.classList.remove("shadow-sm");
      });
    });
  });
  
  // 日期欄位限制
  document.addEventListener("DOMContentLoaded", function () {
    const borrowDateInput = document.querySelector('input[name="borrow_date"]');
    const returnDateInput = document.querySelector('input[name="return_date"]');
  
    const today = new Date().toISOString().split("T")[0];
    borrowDateInput.min = today;
    returnDateInput.min = today;
  
    borrowDateInput.addEventListener("change", function () {
      returnDateInput.min = this.value;
      const maxDate = new Date(this.value);
      maxDate.setDate(maxDate.getDate() + 14);
      returnDateInput.max = maxDate.toISOString().split("T")[0];
    });
  });
  
  // 切換顯示模式與圖片顯示
  document.getElementById("toggleLayoutBtn").addEventListener("click", function () {
    const equipmentList = document.getElementById("equipmentList");
    const cards = document.querySelectorAll(".equipment-card");
  
    if (equipmentList.classList.contains("horizontal-view")) {
      // 切換回卡片模式
      equipmentList.classList.remove("horizontal-view");
      cards.forEach((card) => {
        const formCheck = card.querySelector(".form-check");
        const label = card.querySelector(".form-check-label");
        const cardBody = card.querySelector(".card-body");
  
        if (formCheck && formCheck.parentElement === card) {
          // 將 checkbox 和 label 移回原位
          cardBody.insertBefore(formCheck, cardBody.firstChild);
          formCheck.appendChild(label);
        }
      });
    } else {
      // 切換到橫向模式
      equipmentList.classList.add("horizontal-view");
      cards.forEach((card) => {
        const formCheck = card.querySelector(".form-check");
        const label = formCheck.querySelector(".form-check-label");
  
        if (formCheck) {
          // 將 label 移出 form-check
          formCheck.parentElement.insertBefore(label, formCheck.nextSibling);
          // 將 form-check 移到卡片最前面
          card.insertBefore(formCheck, card.firstChild);
        }
      });
    }
  });
  
  document.getElementById("toggleImageBtn").addEventListener("click", function () {
    const equipmentList = document.getElementById("equipmentList");
    if (equipmentList.classList.contains("hide-images")) {
      equipmentList.classList.remove("hide-images");
    } else {
      equipmentList.classList.add("hide-images");
    }
  });
  