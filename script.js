function getUnsplashImages() {
   const clientId = '0pfAt6LFbYIG-4Jbp-3B2R_J-IAhhgVdEP_j0QaweFg';
    let url = `https://api.unsplash.com/photos/random?client_id=${clientId}&count=12`;

    $.ajax({
        url: url,
        method: "GET",
        success: function(data) {
            $('#loading').hide(); 
            data.forEach((image, index) => {
                let categoryClass = 'kategori' + (index % 3 + 1); 

                let imageUrl = image.urls.small;
                let imageAuthor = image.user.name;
                let imageDescription = image.description || image.alt_description || 'Unsplash Photo';
                let shortDescription = imageDescription.length > 100 ? imageDescription.substring(0, 100) + '...' : imageDescription;

                let imageElement = `
                <div class="col-md-4 col-sm-6 mb-3 filter ${categoryClass}">
                    <div class="card">
                        <img src="${imageUrl}" class="card-img-top" alt="${imageDescription}" data-toggle="modal" data-target="#imageModal-${index}">
                        <div class="card-body">
                            <h5 class="card-title">${shortDescription}</h5>
                            <p class="card-text">Fotoğraf: ${imageAuthor}</p>
                        </div>
                    </div>
                </div>
                <!-- Modal -->
                <div class="modal fade" id="imageModal-${index}" tabindex="-1" role="dialog" aria-labelledby="imageModalLabel-${index}" aria-hidden="true">
                    <div class="modal-dialog modal-lg" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="imageModalLabel-${index}">${imageDescription}</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <img src="${image.urls.regular}" class="img-fluid" alt="${imageDescription}">
                            </div>
                            <div class="modal-footer">
                                <p>Fotoğraf: ${imageAuthor}</p>
                            </div>
                        </div>
                    </div>
                </div>
                `;
                $("#gallery").append(imageElement);
            });
        },
        error: function(error) {
            $('#loading').hide(); 
            $('#error-message').text("Resimler yüklenirken bir hata oluştu: " + error.statusText).show(); 
        }
    });
}

$(document).ready(function() {
    getUnsplashImages();
    $(".filter-button").click(function() {
        var value = $(this).attr('data-filter');
        
        if(value == "all") {
            $('.filter').show('1000');
        } else {
            $(".filter").hide('3000');
            $('.filter').filter('.' + value).show('3000');
        }
    });
});
