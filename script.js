function getUnsplashImages() {
    const clientId = '0pfAt6LFbYIG-4Jbp-3B2R_J-IAhhgVdEP_j0QaweFg';
    let url = `https://api.unsplash.com/photos/random?client_id=${clientId}&count=21`;

    $.ajax({
        url: url,
        method: "GET",
        beforeSend: () => $('#loading').html('<div class="spinner-border text-primary" role="status"><span class="sr-only">Yükleniyor...</span></div>').show(),
        complete: () => $('#loading').hide(),
        success: (data) => {
            displayImages(data);
        },
        error: (error) => $('#error-message').text("Resimler yüklenirken bir hata oluştu: " + error.statusText).show()
    });
}

function searchUnsplashImages(searchTerm) {
    const clientId = '0pfAt6LFbYIG-4Jbp-3B2R_J-IAhhgVdEP_j0QaweFg'; // Burada kendi Unsplash API anahtarını kullan
    let url = `https://api.unsplash.com/search/photos?query=${searchTerm}&client_id=${clientId}`;

    $.ajax({
        url: url,
        method: "GET",
        beforeSend: () => $('#loading').show(),
        complete: () => $('#loading').hide(),
        success: (data) => {
            displayImages(data.results); // Arama sonuçlarını göster
        },
        error: (error) => $('#error-message').text("Arama sırasında bir hata oluştu: " + error.statusText).show()
    });
}

function searchImagesByCategory(category) {
    const clientId = '0pfAt6LFbYIG-4Jbp-3B2R_J-IAhhgVdEP_j0QaweFg'; // Unsplash API anahtarınız
    let url = category ?
        `https://api.unsplash.com/search/photos?query=${category}&client_id=${clientId}` :
        `https://api.unsplash.com/photos/random?client_id=${clientId}&count=21`;

    $.ajax({
        url: url,
        method: "GET",
        beforeSend: () => $('#loading').show(),
        complete: () => $('#loading').hide(),
        success: (data) => {
            let images = category ? data.results : data;
            displayImages(images);
        },
        error: (error) => $('#error-message').text("Resimler yüklenirken bir hata oluştu: " + error.statusText).show()
    });
}

function displayImages(images) {
    $('#gallery').empty(); // Galeriyi temizle
    images.forEach((image, index) => {
        let imageElement = `
            <div class="col-md-4 col-sm-6 mb-3">
                <div class="card">
                    <img src="${image.urls.small}" class="card-img-top" alt="${image.description || image.alt_description || 'Unsplash Photo'}" data-toggle="modal" data-target="#imageModal-${index}">
                    <div class="card-body">
                        <h5 class="card-title">${(image.description || image.alt_description || 'Unsplash Photo').substring(0, 100)}${image.description && image.description.length > 100 ? '...' : ''}</h5>
                        <p class="card-text">Fotoğraf: ${image.user.name}</p>
                        <button type="button" class="btn btn-primary btn-sm like-btn" data-liked="false" data-index="${index}"><i class="fas fa-heart"></i> Beğen</button>
                        <button type="button" class="btn btn-danger btn-sm dislike-btn" data-disliked="false" data-index="${index}"><i class="fas fa-thumbs-down"></i> Beğenme</button>
                    </div>
                </div>
            </div>
            <div class="modal fade" id="imageModal-${index}" tabindex="-1" role="dialog" aria-labelledby="imageModalLabel-${index}" aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="imageModalLabel-${index}">${image.description || image.alt_description || 'Unsplash Photo'}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        </div>
                        <div class="modal-body"><img src="${image.urls.regular}" class="img-fluid" alt="${image.description || image.alt_description || 'Unsplash Photo'}"></div>
                        <div class="modal-footer"><p>Fotoğraf: ${image.user.name}</p></div>
                    </div>
                </div>
            </div>`;
        $("#gallery").append(imageElement);
    });
}

$(document).ready(() => {
    getUnsplashImages();

    $('#searchButton').click(() => {
        let searchTerm = $('#searchInput').val();
        searchUnsplashImages(searchTerm);
    });

    $('#searchInput').keypress((e) => {
        if (e.which == 13) { // Enter tuşu
            $('#searchButton').click();
        }
    });

    $('#categorySelect').change(() => {
        let selectedCategory = $('#categorySelect').val();
        searchImagesByCategory(selectedCategory);
    });

    $(document).on('click', '.like-btn, .dislike-btn', function () {
        let isLiked = $(this).hasClass('like-btn');
        $(this).html(`<i class="fas fa-${isLiked ? 'heart' : 'thumbs-down'}"></i> ${isLiked ? 'Beğen' : 'Beğenme'}`);
        $(this).toggleClass('btn-primary btn-danger');
    });
});
