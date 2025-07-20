document.addEventListener('DOMContentLoaded', () => {
  const imageGrid = document.getElementById('imageGrid');
  const filterButtons = document.querySelectorAll('.filter-button');
  const paginationContainer = document.querySelector('.pagination');
  const prevPageButton = document.getElementById('prevPage');
  const nextPageButton = document.getElementById('nextPage');

  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxClose = document.getElementById('lightboxClose');

  const profileButton = document.getElementById('profileButton');
  const profileModal = document.getElementById('profileModal');

  // Image data with categories
  const allImages = [
    { src: "https://5.imimg.com/data5/SELLER/Default/2021/1/NJ/GN/AS/75393646/3d-waterfall-nature-wallpaper.jpg", category: "Nature" },
    { src: "https://cdn.secta.ai/assets/web/hero-generated-1.jpeg", category: "Portraits" },
    { src: "https://alphauniverseglobal.media.zestyio.com/Image-2.jpg", category: "Cityscapes" },
    { src: "https://images.unsplash.com/photo-1420593248178-d88870618ca0?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z3JlZW4lMjBuYXR1cmV8ZW58MHx8MHx8fDA%3D", category: "Nature" },
    { src: "https://images.unsplash.com/photo-1616790876844-97c0c6057364?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cG9ydHJhaXQlMjBnaXJsfGVufDB8fDB8fHww", category: "Portraits" },
    { src: "https://images.adsttc.com/media/images/5390/7af6/c07a/805c/ea00/032c/large_jpg/trashhand.skillshare-7.jpg?1401977550", category: "Cityscapes" },
    { src: "https://images.unsplash.com/photo-1695326891058-048c65138f3b?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bmF0dXJlJTIwZm9yZXN0fGVufDB8fDB8fHww", category: "Nature" },
    { src: "https://i0.wp.com/picjumbo.com/wp-content/uploads/chilled-young-black-male-model-in-studio-portrait-free-image.jpeg?w=2210&quality=70", category: "Portraits" },
    { src: "https://media.istockphoto.com/id/1253875335/photo/connaught-place-with-national-flag.jpg?s=612x612&w=0&k=20&c=0GIhabuSKcFTkaAFDjPRuX-R4g-uvl5bCilclowkwZA=", category: "Cityscapes" },
    { src: "https://images.unsplash.com/photo-1695326171460-0bf905edc795?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", category: "Nature" },
    { src: "https://img.freepik.com/free-photo/portrait-african-american-woman_52683-87225.jpg?semt=ais_hybrid&w=740", category: "Portraits" },
    { src: "https://image12.photobiz.com/7681/21_20200817025151_6644967_large.jpg", category: "Cityscapes" },
    { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYjJ4EM0ltouNHN6HagEEgzog_bMqAEacyLg&s", category: "Nature" },
    { src: "https://assets.vogue.in/photos/67ce902f46c728b63d8eb6c7/3:4/w_2560%2Cc_limit/KeerthanaKunnath.jpg", category: "Portraits" },
    { src: "https://media.istockphoto.com/id/1301579230/photo/spanish-cities-the-sacred-barcelona-family.jpg?s=612x612&w=0&k=20&c=SoKAwh7wqsRSfhQIcRdzdiLF30DkdSrqSoFbZg4n7o8=", category: "Cityscapes" },
  ];

  let currentFilteredImages = [];
  let currentLightboxIndex = 0;
  const imagesPerPage = 9; // Number of images to display per page
  let currentPage = 1;

  // --- Image Loading and Filtering ---

  // Function to render images into the grid
  function renderImages(imagesToDisplay) {
    imageGrid.innerHTML = ''; // Clear existing images
    imagesToDisplay.forEach((imageData, index) => {
      const imageItem = document.createElement('div');
      imageItem.classList.add('image-item');

      const imagePlaceholder = document.createElement('div');
      imagePlaceholder.classList.add('image-placeholder');
      imagePlaceholder.style.backgroundImage = `url("${imageData.src}")`;
      imagePlaceholder.dataset.index = allImages.indexOf(imageData); // Store original index for lightbox

      imageItem.appendChild(imagePlaceholder);
      imageGrid.appendChild(imageItem);

      // Add click listener to open lightbox
      imagePlaceholder.addEventListener('click', () => openLightbox(parseInt(imagePlaceholder.dataset.index)));
    });
  }

  // Function to filter images based on category
  function filterAndPaginateImages(category) {
    if (category === 'All') {
      currentFilteredImages = [...allImages]; // Create a copy
    } else {
      currentFilteredImages = allImages.filter(img => img.category === category);
    }
    currentPage = 1; // Reset to first page when filter changes
    updateGallery();
  }

  // Function to update the gallery display based on current page and filters
  function updateGallery() {
    const startIndex = (currentPage - 1) * imagesPerPage;
    const endIndex = startIndex + imagesPerPage;
    const paginatedImages = currentFilteredImages.slice(startIndex, endIndex);
    renderImages(paginatedImages);
    updatePagination();
  }

  // --- Pagination ---

  // Function to update pagination links
  function updatePagination() {
    const totalPages = Math.ceil(currentFilteredImages.length / imagesPerPage);
    const paginationLinksContainer = paginationContainer; // Use the existing container
    // Clear previous page numbers, but keep arrows
    const existingLinks = paginationLinksContainer.querySelectorAll('.pagination-link');
    existingLinks.forEach(link => link.remove());

    for (let i = 1; i <= totalPages; i++) {
      const link = document.createElement('a');
      link.href = '#';
      link.classList.add('pagination-link');
      if (i === currentPage) {
        link.classList.add('active');
      }
      link.textContent = i;
      link.addEventListener('click', (event) => {
        event.preventDefault();
        currentPage = i;
        updateGallery();
      });
      // Insert link before the nextPageButton
      paginationContainer.insertBefore(link, nextPageButton);
    }

    // Enable/disable prev/next buttons
    prevPageButton.classList.toggle('disabled', currentPage === 1);
    nextPageButton.classList.toggle('disabled', currentPage === totalPages || totalPages === 0);
  }

  // Event listeners for pagination arrows
  prevPageButton.addEventListener('click', (event) => {
    event.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      updateGallery();
    }
  });

  nextPageButton.addEventListener('click', (event) => {
    event.preventDefault();
    const totalPages = Math.ceil(currentFilteredImages.length / imagesPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      updateGallery();
    }
  });

  // --- Filter Button Event Listeners ---
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove 'active' class from all filter buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add 'active' class to the clicked button
      button.classList.add('active');
      const category = button.dataset.category;
      filterAndPaginateImages(category);
    });
  });

  // --- Lightbox Functionality ---

  function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightboxImage();
    lightboxOverlay.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
  }

  function updateLightboxImage() {
    // Ensure index is within bounds
    if (currentLightboxIndex < 0) {
      currentLightboxIndex = allImages.length - 1;
    } else if (currentLightboxIndex >= allImages.length) {
      currentLightboxIndex = 0;
    }
    lightboxImage.src = allImages[currentLightboxIndex].src;
  }

  function closeLightbox() {
    lightboxOverlay.classList.remove('show');
    document.body.style.overflow = ''; // Restore scrolling
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => {
    currentLightboxIndex--;
    updateLightboxImage();
  });
  lightboxNext.addEventListener('click', () => {
    currentLightboxIndex++;
    updateLightboxImage();
  });

  // Close lightbox when clicking outside the image
  lightboxOverlay.addEventListener('click', (event) => {
    if (event.target === lightboxOverlay) {
      closeLightbox();
    }
  });

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (event) => {
    if (lightboxOverlay.classList.contains('show')) {
      if (event.key === 'ArrowLeft') {
        currentLightboxIndex--;
        updateLightboxImage();
      } else if (event.key === 'ArrowRight') {
        currentLightboxIndex++;
        updateLightboxImage();
      } else if (event.key === 'Escape') {
        closeLightbox();
      }
    }
  });

  // --- Profile Button Functionality ---

  profileButton.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent click from immediately closing the modal
    profileModal.classList.toggle('show');
  });

  // Close profile modal when clicking outside
  document.addEventListener('click', (event) => {
    if (!profileModal.contains(event.target) && !profileButton.contains(event.target)) {
      profileModal.classList.remove('show');
    }
  });


  // Initial load of images (show 'All' category by default)
  filterAndPaginateImages('All');
});