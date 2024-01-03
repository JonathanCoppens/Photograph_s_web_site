(function ($) {
  $.fn.mauGallery = function (options) {
    var settings = $.extend({
      columns: 3,
      lightBox: true,
      lightboxId: null,
      showTags: true,
      tagsPosition: "bottom",
      navigation: true
    }, options);

    return this.each(function () {
      var tagsCollection = [];
      var gallery = $(this);

      createRowWrapper(gallery);

      if (settings.lightBox) {
        createLightBox(gallery, settings.lightboxId, settings.navigation);
      }

      listeners(settings);

      gallery.children(".gallery-item").each(function () {
        responsiveImageItem($(this));
        moveItemInRowWrapper($(this));
        wrapItemInColumn($(this), settings.columns);

        var theTag = $(this).data("gallery-tag");
        if (settings.showTags && theTag !== undefined && tagsCollection.indexOf(theTag) === -1) {
          tagsCollection.push(theTag);
        }
      });

      if (settings.showTags) {
        showItemTags(gallery, settings.tagsPosition, tagsCollection);
      }

      gallery.fadeIn(500);
    });
  };

  function createRowWrapper(element) {
    if (!element.children().first().hasClass("row")) {
      element.append('<div class="gallery-items-row row"></div>');
    }
  }

  function wrapItemInColumn(element, columns) {
    var columnClasses = "";
    if (columns.constructor === Number) {
      columnClasses = ` col-${Math.ceil(12 / columns)}`;
    } else if (columns.constructor === Object) {
      for (var breakpoint in columns) {
        if (columns.hasOwnProperty(breakpoint)) {
          columnClasses += ` col-${breakpoint}-${Math.ceil(12 / columns[breakpoint])}`;
        }
      }
    } else {
      console.error(`Columns should be defined as numbers or objects. ${typeof columns} is not supported.`);
      return;
    }

    element.wrap(`<div class='item-column mb-4${columnClasses}'></div>`);
  }

  function moveItemInRowWrapper(element) {
    element.appendTo(".gallery-items-row");
  }

  function responsiveImageItem(element) {
    if (element.prop("tagName") === "IMG") {
      element.addClass("img-fluid");
    }
  }

  function createLightBox(gallery, lightboxId, navigation) {
    gallery.append(`
      <div class="modal fade" id="${lightboxId || "galleryLightbox"}" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-body">
              ${navigation ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>' : '<span style="display:none;" />'}
              <img class="lightboxImage img-fluid" alt="Contenu de l'image affichée dans la modale au clique"/>
              ${navigation ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;}">></div>' : '<span style="display:none;" />'}
            </div>
          </div>
        </div>
      </div>
    `);
  }

  function showItemTags(gallery, position, tags) {
    var tagItems = '<li class="nav-item"><span class="nav-link active active-tag" data-images-toggle="all">Tous</span></li>';
    $.each(tags, function (index, value) {
      tagItems += `<li class="nav-item active">
          <span class="nav-link" data-images-toggle="${value}">${value}</span></li>`;
    });

    var tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;

    if (position === "bottom") {
      gallery.append(tagsRow);
    } else if (position === "top") {
      gallery.prepend(tagsRow);
    } else {
      console.error(`Unknown tags position: ${position}`);
    }
  }

  function listeners(options) {
    $(".gallery-item").on("click", function () {
      if (options.lightBox && $(this).prop("tagName") === "IMG") {
        openLightBox($(this), options.lightboxId);
      }
    });

    $(".gallery").on("click", ".nav-link", filterByTag);
    $(".gallery").on("click", ".mg-prev", () => prevImage(options.lightboxId));
    $(".gallery").on("click", ".mg-next", () => nextImage(options.lightboxId));
  }

  function openLightBox(element, lightboxId) {
    $(`#${lightboxId}`).find(".lightboxImage").attr("src", element.attr("src"));
    $(`#${lightboxId}`).modal("toggle");
  }

  function prevImage(lightboxId) {
    let activeImage = $(".lightboxImage");
    let activeTag = $(".tags-bar span.active-tag").data("images-toggle");
    let imagesCollection = getImagesCollection(activeTag);

    let index = imagesCollection.indexOf(activeImage.attr("src"));
    let prev = imagesCollection[index - 1] || imagesCollection[imagesCollection.length - 1];
    activeImage.attr("src", prev);
  }

  function nextImage(lightboxId) {
    let activeImage = $(".lightboxImage");
    let activeTag = $(".tags-bar span.active-tag").data("images-toggle");
    let imagesCollection = getImagesCollection(activeTag);

    let index = imagesCollection.indexOf(activeImage.attr("src"));
    let next = imagesCollection[index + 1] || imagesCollection[0];
    activeImage.attr("src", next);
  }

  function filterByTag() {
    if ($(this).hasClass("active-tag")) {
      return;
    }

    $(".active-tag").removeClass("active active-tag");
    $(this).addClass("active-tag");

    var tag = $(this).data("images-toggle");

    $(".gallery-item").each(function () {
      $(this).parents(".item-column").hide();
      if (tag === "all" || $(this).data("gallery-tag") === tag) {
        $(this).parents(".item-column").show(300);
      }
    });
  }

  function getImagesCollection(tag) {
    let imagesCollection = [];

    $(".item-column").each(function () {
      if (tag === "all" || $(this).children("img").data("gallery-tag") === tag) {
        imagesCollection.push($(this).children("img").attr("src"));
      }
    });

    return imagesCollection;
  }
})(jQuery);
