
(function ($) {
  const defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: null,
    showTags: true,
    tagsPosition: "bottom",
    navigation: true,
  };

  $.fn.mauGallery = function (options) {
    const settings = $.extend({}, defaults, options);
    const tagsCollection = [];

    return this.each(function () {
      methods.createRowWrapper($(this));

      if (settings.lightBox) {
        methods.createLightBox($(this), settings.lightboxId, settings.navigation);
      }

      methods.listeners(settings);

      $(this).children(".gallery-item").each(function () {
        methods.responsiveImageItem($(this));
        methods.moveItemInRowWrapper($(this));
        methods.wrapItemInColumn($(this), settings.columns);

        const theTag = $(this).data("gallery-tag");
        if (settings.showTags && theTag !== undefined && tagsCollection.indexOf(theTag) === -1) {
          tagsCollection.push(theTag);
        }
      });

      if (settings.showTags) {
        methods.showItemTags($(this), settings.tagsPosition, tagsCollection);
      }

      $(this).fadeIn(500);
    });
  };

  const methods = {
    createRowWrapper(element) {
      if (!element.children().first().hasClass("row")) {
        element.append('<div class="gallery-items-row row"></div>');
      }
    },

    wrapItemInColumn(element, columns) {
      let columnClasses = "";

      if (columns.constructor === Number) {
        columnClasses = ` col-${Math.ceil(12 / columns)}`;
      } else if (columns.constructor === Object) {
        if (columns.xs) columnClasses += ` col-${Math.ceil(12 / columns.xs)}`;
        if (columns.sm) columnClasses += ` col-sm-${Math.ceil(12 / columns.sm)}`;
        if (columns.md) columnClasses += ` col-md-${Math.ceil(12 / columns.md)}`;
        if (columns.lg) columnClasses += ` col-lg-${Math.ceil(12 / columns.lg)}`;
        if (columns.xl) columnClasses += ` col-xl-${Math.ceil(12 / columns.xl)}`;
      } else {
        console.error(`Columns should be defined as numbers or objects. ${typeof columns} is not supported.`);
      }

      element.wrap(`<div class='item-column mb-4${columnClasses}'></div>`);
    },

    moveItemInRowWrapper(element) {
      element.appendTo(".gallery-items-row");
    },

    responsiveImageItem(element) {
      if (element.prop("tagName") === "IMG") {
        element.addClass("img-fluid");
      }
    },

    listeners(settings) {
      $(".gallery-item").on("click", function () {
        if (settings.lightBox && $(this).prop("tagName") === "IMG") {
          methods.openLightBox($(this), settings.lightboxId);
        } else {
          return;
        }
      });

      $(".gallery").on("click", ".nav-link", methods.filterByTag);
      $(".gallery").on("click", ".mg-prev", () => methods.prevImage(settings.lightboxId));
      $(".gallery").on("click", ".mg-next", () => methods.nextImage(settings.lightboxId));
    },

    // ... (rest of the methods)
  };
})(jQuery);
