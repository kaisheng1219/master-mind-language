class Scanner {
    currentChar;
    currentSpelling;
    currentIndex;
    currentKind;
    tokens;
    isAfterRoot;
    isBeforeNodeListDeclarator;

    constructor() {
        this.currentChar = editor.getValue()[0];
        this.currentSpelling = "";
        this.currentIndex = 0;
        this.tokens = [];
        this.isAfterRoot = false;
        this.isAfterOpenBrace = true;
    }

    takeIt() {
        this.currentSpelling += this.currentChar;
        this.currentIndex++;
        if (this.currentIndex < editor.getValue().length)
            this.currentChar = editor.getValue()[this.currentIndex];
        else 
            this.currentChar = "";
    }

    scan() {
        // skip all whitespace and lines until start of program
        while (this.isSpaceOrLinebreak(editor.getValue()[this.currentIndex]))
            this.takeIt();
        
        while (this.currentIndex < editor.getValue().length) {
            if (this.currentChar === '{') {
                this.isBeforeNodeListDeclarator = false;
                this.pushToken(TOKEN_TYPE.OPEN_BRACE, this.currentChar);
                this.takeIt();
            } else if (this.currentChar === '}') {
                if (this.isAfterRoot)
                    this.isBeforeNodeListDeclarator = true;
                this.pushToken(TOKEN_TYPE.CLOSE_BRACE, this.currentChar);
                this.takeIt();
            } else if (this.currentChar === '(') {
                this.pushToken(TOKEN_TYPE.OPEN_PAREN, this.currentChar);
                this.takeIt();
            } else if (this.currentChar === ')') {
                this.pushToken(TOKEN_TYPE.CLOSE_PAREN, this.currentChar);
                this.takeIt();
            } else if (this.currentChar === ':') {
                this.pushToken(TOKEN_TYPE.COLON, this.currentChar);
                this.takeIt();
            } else if (this.currentChar === ',') {
                this.pushToken(TOKEN_TYPE.COMMA, this.currentChar);
                this.takeIt();
            } else if (this.currentChar === '\n') {
                if (this.isAfterRoot && this.isBeforeNodeListDeclarator)
                    this.validateLinebreak();
                else
                    this.takeIt();
            } else if (this.currentChar === '"') {
                this.validateLiteral();
            } else if (this.isDigit(this.currentChar)) {
                this.validateFloat();
            } else if (this.isLetter(this.currentChar)) {
                this.validateKeywordOrIdentifier();
            } else if (this.isSpace(this.currentChar)) {
                if (this.isAfterRoot && this.isBeforeNodeListDeclarator)
                    this.validateIndent();
                else 
                    this.takeIt();
            } else {
                this.pushToken(TOKEN_TYPE.INVALID, this.currentChar);
                this.takeIt();
            }
        }

        return this.tokens;
    }

    validateLiteral() {
        this.pushToken(TOKEN_TYPE.QUOTE, this.currentChar);
        this.takeIt();
        this.currentSpelling = "";
        while (this.isDigitOrLetter(this.currentChar) || this.isSymbol(this.currentChar))
            this.takeIt();

        this.pushToken(TOKEN_TYPE.LITERAL, this.currentSpelling);

        if (this.currentChar === '"') {
            this.pushToken(TOKEN_TYPE.QUOTE, this.currentChar);
            this.takeIt();
        } else {
            this.pushToken(TOKEN_TYPE.INVALID, this.currentSpelling);
            this.takeIt();
        }
    }

    validateFloat() {
        this.currentSpelling = "";
        this.takeIt();
        if (this.currentChar === '.') {
            this.takeIt();
            if (this.isDigit(this.currentChar)) {
                this.takeIt();
                while (this.isDigit(this.currentChar))
                    this.takeIt();
                this.pushToken(TOKEN_TYPE.FLOAT, this.currentSpelling);
            }
            else 
                this.pushToken(TOKEN_TYPE.INVALID, this.currentSpelling);
        } else {
            this.pushToken(TOKEN_TYPE.INVALID, this.currentSpelling);
            // this.takeIt();
        }
    }

    validateKeywordOrIdentifier() {
        this.currentSpelling = "";
        while (this.isDigitOrLetter(this.currentChar))
            this.takeIt();
        
        if (['root', 'content', 'color', 'shape', 'rgba'].includes(this.currentSpelling)) {
            this.pushToken(TOKEN_TYPE.KEYWORD, this.currentSpelling);
            if (this.currentSpelling === 'root')
                this.isAfterRoot = true;
        }
        else if (['Square', 'RoundedSquare', 'Circle', 'Bang', 'Cloud', 'Hexagon'].includes(this.currentSpelling))
            this.pushToken(TOKEN_TYPE.SHAPE_ID, this.currentSpelling);
        else 
            this.pushToken(TOKEN_TYPE.IDENTIFIER, this.currentSpelling);
    }

    validateLinebreak() {
        this.currentSpelling = "";
        while (this.currentChar === '\n')
            this.takeIt();
        this.pushToken(TOKEN_TYPE.LINE_BREAK, "\\n");
        this.isBeforeNodeListDeclarator = true;
    }

    validateIndent() {
        this.currentSpelling = "";
        while (this.isSpace(this.currentChar))
            this.takeIt();
        this.pushToken(TOKEN_TYPE.INDENT, this.currentSpelling);
    }

    pushToken(tokenType, spelling) {
        this.tokens.push(new Token(tokenType, spelling));
    }

    isDigit(char) {
        return char >= '0' && char <= '9';
    }

    isLetter(char) {
        return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
    }

    isDigitOrLetter(char) {
        return this.isDigit(char) || this.isLetter(char);
    }

    isSymbol(char) {
        return ["+", "-", "*", "/", "!", "@", "#", "$", "%", "^", "&", "(", ")", "=", "_", "[", "]", "|", ":", ";", ",", ".", "<", ">", "?", " "].includes(char);
    }

    isSpace(char) {
        return char === ' ';
    }

    isLinebreak(char) {
        return char === '\n';
    }

    isSpaceOrLinebreak(char) {
        return this.isSpace(char) || this.isLinebreak(char);
    }
}