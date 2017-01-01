braille = {
    '1': '⠁', '2': '⠃', '3': '⠉', '4': '⠙', '5': '⠑', '6': '⠋', '7': '⠛', '8': '⠓', '9': '⠊', '0': '⠚',
    'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑', 'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚',
    'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕', 'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
    'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽', 'z': '⠵',
    'ą': '⠡', 'ć': '⠍', 'ę': '⠱', 'ł': '⠣', 'ń': '⠹', 'ó': '⠬', 'ś': '⠪', 'ż': '⠯', 'ź': '⠮',
    ' ': '⠀', '.': '⠲', ',': '⠂', ';': '⠆', ':': '⠒', '?': '⠢', '!': '⠖', '*': '⠔',
    number: '⠼', capital: '⠨'
};

function swapKeysAndValues(json) {
  var ret = {};
  for(var key in json)
    ret[json[key]] = key;
  return ret;
};

reverseBraille = swapKeysAndValues(braille);
reverseBrailleNumbers = {'⠁': 1, '⠃': 2, '⠉': 3, '⠙': 4, '⠑': 5, '⠋': 6, '⠛': 7, '⠓': 8, '⠊': 9, '⠚': 0};

String.prototype.isDigit = function() {
  return !isNaN(this - parseFloat(this));
};

String.prototype.isUpperCase = function() {
  return /^[A-Z]/.test(this);
};

function translateToBraille(input) {
  var out = [];
  for(var i=0; i<input.length; i++) {
    var lowerChar = input[i].toLowerCase();
    if (!(lowerChar in braille)) out.push('?');
    else {
      if (input[i].isDigit() && (i==0 || !input[i-1].isDigit()) )
        out.push(braille.number);
      else if (input[i].isUpperCase())
        out.push(braille.capital);
      out.push(braille[lowerChar]);
    }
  }
  return out.join('');
}

function translateFromBraille(input) {
  var out = [];
  var number = false;
  for(var i=0; i<input.length; i++) {
    if (!(input[i] in reverseBraille)) out.push('?');
    else {
      if (input[i] == braille.number) number = true;
      else {
        if (input[i] == braille.capital) {
          i++;
          if (i<input.length)
            out.push(reverseBraille[input[i]].toUpperCase());
        } else
          number ? 
          out.push(reverseBrailleNumbers[input[i]]) :
          out.push(reverseBraille[input[i]]);;
      }
    }
  }
  return out.join('');
}

window.onload = function() {
  document.querySelectorAll('[data-translate-to-braille]').forEach( 
    function(elem) {
     elem.innerText = translateToBraille(elem.innerText);
    }
  );
  document.querySelectorAll('[data-translate-from-braille]').forEach( 
    function(elem) {
     elem.innerText = translateFromBraille(elem.innerText);
    }
  );

  $('[data-dynamic-translate]').each(function() {
    var elem = $(this);
    var translated = Array.from(translateFromBraille(elem.text()));
    var parts = $.map(Array.from(elem.text()), function(c) {
      var translate_char = braille[' '];
      if (c == braille[' ']) translated.shift();
      if (c != braille[' '] && c != braille.capital && c != braille.number)
        translate_char = translated.shift();
      return $('<span />', {text: c, 'data-dynamic-translate-char': translate_char});
    })
    elem.empty().append(parts);
  });
  $('[data-dynamic-translate-char]').on('click mouseleave', function(event){
    var elem = $(this);
    if (event.type == 'click' || elem.text().charCodeAt(0) < 10000 || elem.text() == braille[' ']) {
      var replacementChar = elem.data('dynamic-translate-char');
      elem.data('dynamic-translate-char', elem.text());
      elem.text(replacementChar);
    }
  });
}
