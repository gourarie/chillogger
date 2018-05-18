const _colors = {
    "WHITE": "\u001b[1;40;37m",
    "RESET": "\u001b[0m",
    "DEFAULT": "\u001b[0m\u001b[1m",
    "GRAY": "\u001b[0;40;37m",
    "DARK_GRAY": "\u001b[1;40;30m",
    "RED":      "\u001b[1;40;31m",
    "DARK_RED": "\u001b[0;40;31m",
    "GREEN": "\u001b[1;40;32m",
    "DARK_GREEN": "\u001b[0;40;32m",
    "BLUE": "\u001b[1;40;34m",
    "PURPLE": "\u001b[1;40;35m",
    "TURQUOISE": "\u001b[1;40;36m",
    "DARK_TURQUOISE": "\u001b[0;40;36m",
    "YELLOW": "\u001b[1;40;33m",
    "DARK_YELLOW": "\u001b[0;40;33m",
    //RED background
    "WHITE_ON_RED": "\u001b[1;41;37m",
    "TURQUOISE_ON_RED": "\u001b[1;41;36m",
    "YELLOW_ON_RED": "\u001b[1;41;33m",
    "GREEN_ON_RED": "\u001b[1;41;32m",
    //GREEN background
    "YELLOW_ON_GREEN": "\u001b[1;42;33m",
    "WHITE_ON_GREEN": "\u001b[1;42;37m",
    //YELLOW background
    "YELLOW_ON_YELLOW": "\u001b[1;43;33m",
    "GREEN_ON_YELLOW": "\u001b[1;43;32m",
    "BLUE_ON_YELLOW": "\u001b[1;43;34m",
    //BLUE background
    "WHITE_ON_BLUE": "\u001b[1;44;37m",
    "GRAY_ON_BLUE": "\u001b[1;44;30m",
    "RED_ON_BLUE": "\u001b[1;44;31m",
    "GREEN_ON_BLUE": "\u001b[1;44;32m",
    "YELLOW_ON_BLUE": "\u001b[1;44;33m",
    "PURPLE_ON_BLUE": "\u001b[1;44;35m",
    //PURPLE background
    "WHITE_ON_PURPLE": "\u001b[1;45;37m",
    "YELLOW_ON_PURPLE": "\u001b[1;45;33m",
    "GREEN_ON_PURPLE": "\u001b[1;45;32m",
    "TURQUOISE_ON_PURPLE": "\u001b[1;45;36m",
    //TURQUOISE backgound
    "BLACK_ON_TURQUOISE": "\u001b[0;46;30m",
    "GREEN_ON_TURQUOISE": "\u001b[1;46;32m",
    "YELLOW_ON_TURQUOISE": "\u001b[1;46;33m",
    "GRAY_ON_TURQUOISE": "\u001b[0;46;37m",
    "WHITE_ON_TURQUOISE": "\u001b[1;46;37m",
    "BLACK_ON_GRAY": "\u001b[0;47;30m",   
    //GRAY background
    "RED_ON_GRAY": "\u001b[1;47;31m",
    "DARK_RED_ON_GRAY": "\u001b[0;47;31m",
    "DARK_GREEN_ON_GRAY": "\u001b[0;47;32m",
    "YELLOW_ON_GRAY": "\u001b[1;47;33m",
    "BLUE_ON_GRAY": "\u001b[1;47;34m",
    "DARK_BLUE_ON_GRAY": "\u001b[0;47;34m",
    "PURPLE_ON_GRAY": "\u001b[1;47;35m",
    "DARK_PURPLE_ON_GRAY": "\u001b[0;47;35m",
    "DARK_TURQUOISE_ON_GRAY": "\u001b[0;47;36m",
}

const color = function (input, _color) {
    _color = _color || "DEFAULT";
    return `${_colors[_color.toUpperCase()]}${input}${_colors.RESET}`;
};

module.exports = color;