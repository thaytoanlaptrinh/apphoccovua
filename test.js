function convertToUnsigned(str) {
  const diacriticMap = [
    { base: 'A', diacritics: /[\u00C0-\u00C5\u00E0-\u00E5]/g },
    { base: 'A', diacritics: /[\u0100-\u0105]/g },
    { base: 'AE', diacritics: /[\u00C6\u00E6]/g },
    { base: 'C', diacritics: /[\u00C7\u00E7]/g },
    { base: 'E', diacritics: /[\u00C8-\u00CB\u00E8-\u00EB]/g },
    { base: 'I', diacritics: /[\u00CC-\u00CF\u00EC-\u00EF]/g },
    { base: 'D', diacritics: /[\u010E\u0110\u0111]/g },
    { base: 'N', diacritics: /[\u00D1\u00F1]/g },
    { base: 'O', diacritics: /[\u00D2-\u00D6\u00F2-\u00F6]/g },
    { base: 'OE', diacritics: /[\u0152\u0153]/g },
    { base: 'U', diacritics: /[\u00D9-\u00DC\u00F9-\u00FC]/g },
    { base: 'Y', diacritics: /[\u00DD\u00FD\u00FF]/g },
    { base: 'a', diacritics: /[\u00E0-\u00E5]/g },
    { base: 'a', diacritics: /[\u0100-\u0105]/g },
    { base: 'ae', diacritics: /[\u00E6]/g },
    { base: 'c', diacritics: /[\u00E7]/g },
    { base: 'e', diacritics: /[\u00E8-\u00EB]/g },
    { base: 'i', diacritics: /[\u00EC-\u00EF]/g },
    { base: 'd', diacritics: /[\u0111]/g },
    { base: 'n', diacritics: /[\u00F1]/g },
    { base: 'o', diacritics: /[\u00F2-\u00F6]/g },
    { base: 'oe', diacritics: /[\u0153]/g },
    { base: 'u', diacritics: /[\u00F9-\u00FC]/g },
    { base: 'y', diacritics: /[\u00FD\u00FF]/g },
    // Thêm các ký tự còn lại tương tự
  ];

  const removeDiacritics = (str) => {
    for (let i = 0; i < diacriticMap.length; i++) {
      str = str.replace(diacriticMap[i].diacritics, diacriticMap[i].base);
    }
    return str;
  };

  const unsignedName = removeDiacritics(str);
  return unsignedName;
}

// Ví dụ sử dụng
const nameWithDiacritics =
  'Chiều 10-7, tại cuộc họp báo tình hình kinh tế- xã hội do UBND tỉnh Đắk Lắk tổ chức, đại diện Công an tỉnh đã cung cấp một số thông tin liên quan vụ tai nạn giao thông trên đại lộ Đông - Tây TP Buôn Ma Thuột làm hai người chết. Trong đó có con trai Giám đốc Sở Xây dựng, mới 16 tuổi, điều khiển mô tô phân khối lớn.';
const unsignedName = convert_vi_to_en(nameWithDiacritics);
console.log(unsignedName); // Nguyen Van An


function convertViToEn(str, toUpperCase = true) {
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư

  return toUpperCase ? str.toUpperCase() : str;
}

function convert_vi_to_en(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
  str = str.replace(/  +/g, ' ');
  return str;
}