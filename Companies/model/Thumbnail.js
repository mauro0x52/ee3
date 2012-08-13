    /** Thumbnail
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : Representação da entidade de Thumbnail
 */

var thumbnailStruct;

thumbnailStruct = {
    original : require('./Image.js').ImageStruct,
    small : require('./Image.js').ImageStruct,
    medium : require('./Image.js').ImageStruct,
    large : require('./Image.js').ImageStruct
};

exports.ThumbnailStruct = thumbnailStruct;