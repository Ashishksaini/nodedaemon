const gradient = require("gradient-string");

function logWithGradient(text ,print=true) {
  const gradientText = gradient.atlas.multiline(text);
    if (print) {
        console.log(gradientText);
    }
    return gradientText;
}

module.exports = logWithGradient;
