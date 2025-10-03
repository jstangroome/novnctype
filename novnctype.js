// List the mapping for all printable ASCII characters (32-126)
const asciiToKeyEvent = {
    // Space and digits
    " ": { code: "Space", shift: false },
    "0": { code: "Digit0", shift: false },
    "1": { code: "Digit1", shift: false },
    "2": { code: "Digit2", shift: false },
    "3": { code: "Digit3", shift: false },
    "4": { code: "Digit4", shift: false },
    "5": { code: "Digit5", shift: false },
    "6": { code: "Digit6", shift: false },
    "7": { code: "Digit7", shift: false },
    "8": { code: "Digit8", shift: false },
    "9": { code: "Digit9", shift: false },

    // Lowercase letters
    "a": { code: "KeyA", shift: false },
    "b": { code: "KeyB", shift: false },
    "c": { code: "KeyC", shift: false },
    "d": { code: "KeyD", shift: false },
    "e": { code: "KeyE", shift: false },
    "f": { code: "KeyF", shift: false },
    "g": { code: "KeyG", shift: false },
    "h": { code: "KeyH", shift: false },
    "i": { code: "KeyI", shift: false },
    "j": { code: "KeyJ", shift: false },
    "k": { code: "KeyK", shift: false },
    "l": { code: "KeyL", shift: false },
    "m": { code: "KeyM", shift: false },
    "n": { code: "KeyN", shift: false },
    "o": { code: "KeyO", shift: false },
    "p": { code: "KeyP", shift: false },
    "q": { code: "KeyQ", shift: false },
    "r": { code: "KeyR", shift: false },
    "s": { code: "KeyS", shift: false },
    "t": { code: "KeyT", shift: false },
    "u": { code: "KeyU", shift: false },
    "v": { code: "KeyV", shift: false },
    "w": { code: "KeyW", shift: false },
    "x": { code: "KeyX", shift: false },
    "y": { code: "KeyY", shift: false },
    "z": { code: "KeyZ", shift: false },

    // Uppercase letters (require Shift)
    "A": { code: "KeyA", shift: true },
    "B": { code: "KeyB", shift: true },
    "C": { code: "KeyC", shift: true },
    "D": { code: "KeyD", shift: true },
    "E": { code: "KeyE", shift: true },
    "F": { code: "KeyF", shift: true },
    "G": { code: "KeyG", shift: true },
    "H": { code: "KeyH", shift: true },
    "I": { code: "KeyI", shift: true },
    "J": { code: "KeyJ", shift: true },
    "K": { code: "KeyK", shift: true },
    "L": { code: "KeyL", shift: true },
    "M": { code: "KeyM", shift: true },
    "N": { code: "KeyN", shift: true },
    "O": { code: "KeyO", shift: true },
    "P": { code: "KeyP", shift: true },
    "Q": { code: "KeyQ", shift: true },
    "R": { code: "KeyR", shift: true },
    "S": { code: "KeyS", shift: true },
    "T": { code: "KeyT", shift: true },
    "U": { code: "KeyU", shift: true },
    "V": { code: "KeyV", shift: true },
    "W": { code: "KeyW", shift: true },
    "X": { code: "KeyX", shift: true },
    "Y": { code: "KeyY", shift: true },
    "Z": { code: "KeyZ", shift: true },

    // Symbols on digit row
    "!": { code: "Digit1", shift: true },
    "@": { code: "Digit2", shift: true },
    "#": { code: "Digit3", shift: true },
    "$": { code: "Digit4", shift: true },
    "%": { code: "Digit5", shift: true },
    "^": { code: "Digit6", shift: true },
    "&": { code: "Digit7", shift: true },
    "*": { code: "Digit8", shift: true },
    "(": { code: "Digit9", shift: true },
    ")": { code: "Digit0", shift: true },

    // Symbols on other keys
    "-": { code: "Minus", shift: false },
    "_": { code: "Minus", shift: true },
    "=": { code: "Equal", shift: false },
    "+": { code: "Equal", shift: true },
    "[": { code: "BracketLeft", shift: false },
    "{": { code: "BracketLeft", shift: true },
    "]": { code: "BracketRight", shift: false },
    "}": { code: "BracketRight", shift: true },
    "\\": { code: "Backslash", shift: false },
    "|": { code: "Backslash", shift: true },
    ";": { code: "Semicolon", shift: false },
    ":": { code: "Semicolon", shift: true },
    "'": { code: "Quote", shift: false },
    "\"": { code: "Quote", shift: true },
    ",": { code: "Comma", shift: false },
    "<": { code: "Comma", shift: true },
    ".": { code: "Period", shift: false },
    ">": { code: "Period", shift: true },
    "/": { code: "Slash", shift: false },
    "?": { code: "Slash", shift: true },
    "`": { code: "Backquote", shift: false },
    "~": { code: "Backquote", shift: true },

    // Translate LF to Enter key
    "\n": { code: "Enter", shift: false },
};

// Generate the full mapping for ASCII 32-126, including unmapped as undefined
const asciiMap = {};
for (let i = 32; i <= 126; i++) {
    const ch = String.fromCharCode(i);
    asciiMap[ch] = asciiToKeyEvent[ch] || undefined;
}

// US Keyboard shift key code
const SHIFT_CODE = "ShiftLeft";

/**
 * Sends the given string using sendKeyFn(0, code) where sendKeyFn defaults to
 * window.VNCUI.rfb.sendKey if available.
 * If a character requires Shift, depresses Shift key, sends the char,
 * then releases Shift, combining consecutive Shift uses.
 * @param {string} str
 * @param {function} sendKeyFn function of the form (keysym, code, down) as per
 *   https://github.com/novnc/noVNC/blob/v1.6.0/docs/API.md#rfbsendkey
 */
function novncType(str, sendKeyFn) {
    if (typeof sendKeyFn !== "function"
        && window.VNCUI
        && window.VNCUI.rfb
        && typeof window.VNCUI.rfb.sendKey === "function"
    ) {
        sendKeyFn = window.VNCUI.rfb.sendKey.bind(window.VNCUI.rfb);
    }
    if (typeof sendKeyFn !== "function") {
        throw new Error("sendKeyFn required and could not be guessed from context");
    }

    sendKeyFn(0, SHIFT_CODE, false);
    let lastShift = false;
    for (const cc of str) {
        const mapping = asciiMap[cc];
        if (!mapping) continue;

        if (mapping.shift !== lastShift) {
            sendKeyFn(0, SHIFT_CODE, mapping.shift);
            lastShift = mapping.shift;
        }
        sendKeyFn(0, mapping.code);
    }
    if (lastShift) {
        sendKeyFn(0, SHIFT_CODE, false);
    }
}

export { novncType };
